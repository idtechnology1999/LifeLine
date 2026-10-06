# Lifeline — Total Documentation

A single, top-to-bottom reference for the entire app as it exists today:
every screen, every flow, every role, how data moves (or doesn't), and how
the pieces fit together. Written by reading the actual code — not a spec —
so it reflects real behavior, including the parts that are mocked or
disconnected. Where something should work a certain way going forward
("how it's supposed to flow" in modern, production terms) that's called
out explicitly and cross-referenced into [improvement.md](improvement.md).

This doc is the index-of-indexes: shorter, per-area docs already exist in
this folder ([README.md](README.md), [tech-stack.md](tech-stack.md),
[requester-flow.md](requester-flow.md), [driver-flow.md](driver-flow.md),
[dispatcher-flow.md](dispatcher-flow.md), [shared-screens.md](shared-screens.md),
[services-and-data.md](services-and-data.md), [known-issues.md](known-issues.md))
and remain the detailed reference for their area. This document exists to
give one continuous read of the whole system, and to fold in the
dispatcher build (which shipped after those per-area docs were first
written).

---

## 1. What Lifeline is

Lifeline is an Expo Router (React Native + web, one codebase) app for
emergency medical services in Nigeria, with three distinct user roles
picked from one screen:

1. **Requester** — a patient/family member who needs an ambulance or wants
   medical supplies delivered.
2. **Driver / Provider** — an ambulance service or a medical supplier /
   pharmacy, registering and running that business inside the app.
3. **Dispatcher** — an independent courier (bicycle, bike, tricycle, or
   car) who delivers medical supplies dispatched from a pharmacy to a
   customer.

There is **no backend**. Every "network" interaction — OTP delivery, price
negotiation, driver matching, payment processing, document verification —
is simulated locally with `setTimeout`s and hardcoded mock data. The only
genuinely persisted state is a session token and a verification record for
providers/dispatchers (`services/storage.ts`, `localStorage` on web /
`expo-secure-store` on native). See §9 for the full real-vs-mock
breakdown.

---

## 2. Architecture at a glance

- **Expo SDK ~54, React 19.1, React Native 0.81, react-native-web ~0.21** — one codebase, three targets.
- **expo-router ~6**, file-based routing, `typedRoutes: true`. A file's path under `app/` *is* its route.
- **react-native-reanimated 4** for all motion: press-scale (`AnimatedPressable`), fade/slide-in mounts (`FadeSlideIn`), success pops (`SuccessPop`), the onboarding carousel, the splash screen.
- New Architecture + React Compiler both enabled.
- No state-management library — screens use local `useState` plus a handful of purpose-built React Context providers (`DriverRequestContext`, `StoreContext`, `DispatcherOrderContext`). Registration wizards use route params as their "state" instead of any store.

```
app/          Every screen + route (file-based, expo-router)
  driver/     Provider side: registration wizard, ambulance dashboard, supplier store
  dispatcher/ Courier side: registration wizard, delivery dashboard, earnings flow
  requester/  Requester tab shell (re-exports src/screens/requester/*)
src/
  screens/    Real requester + auth/OTP screen implementations
  theme/      colors.ts — one of three parallel color systems (see §10)
  navigation/ types.ts — dead React Navigation leftover, unused
components/   Shared UI primitives + three Context providers
services/     auth.ts, verification.ts, storage.ts (all real), api.ts (real but unused)
constants/    colors.ts, layout.ts — second parallel color system; layout.ts unused
types/        Role union type
utils/        hapticFeedback() helper
```

Full breakdown: [tech-stack.md](tech-stack.md).

---

## 3. The fork point

`app/main.tsx`, reached after a 2.6s animated splash (`app/index.tsx`) and
a 3-slide onboarding carousel (`app/onboarding.tsx`, replays every cold
start — no "seen it" flag persisted), is the single screen every user sees
before splitting into a role:

| Card | Role key | Routes to |
|---|---|---|
| "I need emergency help" | `requester` | `/auth` (no `redirectTo`) |
| "I provide emergency services" | `driver` | `/auth?redirectTo=/driver` |
| "I Help dispatch Medical Supplies" | `dispatcher` | `/auth?redirectTo=/dispatcher/ride-details` |

All three now funnel through the same `/auth` (Log In / Sign Up tabs) →
`/otp-verification` pair. This is a change from the app's earlier state,
where the dispatcher card bypassed auth entirely and went straight to a
static placeholder screen — that asymmetry is now closed (see §10 for what
still differs between roles).

`OtpVerificationScreen.handleConfirm` is the single branch point deciding
where everyone lands after confirming a code:

```
no redirectTo            -> plain requester path (signup bounces to /auth, login -> /requester)
redirectTo + mode=login   -> straight to a dashboard, no wizard:
                               driver  -> /driver/dashboard or /driver/store (by remembered serviceType, default 'ambulance')
                               dispatcher -> /dispatcher/dashboard (remembered, default 'dispatcher')
redirectTo + mode=signup  -> straight to the registration wizard at redirectTo
```

Any 6 digits are accepted as the OTP — there is no real code to check
against.

---

## 4. Requester flow ("I need emergency help")

Full detail: [requester-flow.md](requester-flow.md). Summary:

**No session is ever persisted for this role.** `services/auth.ts` is
never called on this path; `/requester` has no auth guard
(`app/requester/_layout.tsx` is a bare `Tabs` navigator), so it's reachable
by direct deep link with zero login.

### Tab shell (`app/requester/*`, thin re-exports of `src/screens/requester/*`)

| Tab | Purpose |
|---|---|
| Home | Two CTAs (Request Ambulance / Medical Supplies), subscription banner, emergency contacts (real `tel:` links), recent activity — all hardcoded mocks |
| Request | One hardcoded active-request card; the only way to reach `/ambulance-tracking` |
| Orders | Static, non-pressable mock order list |
| Profile | Links to the 8 shared account screens (§8); "Log Out" is just `router.replace('/')` — no token to clear |

### Ambulance request sub-flow

```
request-ambulance (triage tier, symptoms, BLS/ALS/ERV type, notes)
  -> pickup-destination (real reverse-geocode via expo-location, or search hardcoded hospitals)
    -> confirm-request (read-only summary, price from hardcoded base rates)
      -> dispatch-status (4.2s fake "searching", then 3 hardcoded drivers)
        -> price-negotiation (simulated counter-offer state machine)
          -> secure-payment (Card/Apple Pay/Google Pay picker, 1.2s fake delay)
            -> payment-success -> "View Request" -> /requester/request
```

**This is where the flow disconnects**: `/requester/request` shows an
unrelated static mock, not the driver/price/vehicle just negotiated. See
[known-issues.md](known-issues.md) and §11 of this doc.

### Medical supplies sub-flow

```
medical-supplies (product grid) -> product-details (always the same hardcoded product — no id passed)
  -> cart (hardcoded seed, local-only qty changes) -> order-secure-payment (Card/Bank/USSD)
    -> order-payment-success -> order-delivery-tracking (terminal, fully hardcoded)
```

---

## 5. Driver / Provider flow ("I provide emergency services")

Full detail: [driver-flow.md](driver-flow.md) and the screen-by-screen
[`app/driver/FLOW.md`](../app/driver/FLOW.md). Summary:

Two provider types share one entry point and registration wizard, then
branch into two dashboards:

- **Ambulance Service Provider** → `/driver/dashboard`
- **Medical Supplier / Pharmacy** → `/driver/store`

### Guards

- `app/driver/_layout.tsx` requires a session token for anything under `/driver/*`.
- `components/useWizardGuard.ts` enforces step order — each wizard screen after the picker requires proof the previous step forwarded its data (defaults to redirecting back to `/driver`; now also reusable with a custom fallback, used by the dispatcher wizard — see §6).

### Registration wizard (Sign Up only)

```
/driver (pick Ambulance or Supplier)
  -> business-details (shared fields)
    -> ambulance-details  |  supplier-details   (branch by type)
      -> contact-operations (shared: contact person, hours, backup contact)
        -> review-submit -> "Submit For Verification" (calls setVerified() locally — no real approval step)
          -> verification-in-progress -> "Return to Home" -> dashboard (by service type)
```

No global form state — each screen reads `useLocalSearchParams`, keeps
local state, forwards `{ ...params, ...itsOwnFields }` on Continue.
Uploaded documents/photos round-trip as JSON-encoded name/URI arrays in
route params, not real storage.

### Dashboards

- **Ambulance dashboard** (`app/driver/dashboard/`) — Tabs (Home / Request / Profile) wrapping `DriverRequestProvider`. Home: online toggle, earnings, incoming request Accept/Decline. Request: `detail → negotiate → active` trip states in one screen, driven by context `phase`.
- **Supplier store** (`app/driver/store/`) — Stack wrapping `StoreProvider`, with a nested `(tabs)` group for the 3 real tabs (Home / Inventory / Profile) plus sibling pushed screens (add/edit product, delivery tracking/complete) that need no tab bar.
- Both "Log Out" buttons clear **both** the token and the verification record — a full reset, since there's no real account to log back into.

---

## 6. Dispatcher flow ("I Help dispatch Medical Supplies")

This is the newest, most-recently-built area of the app — as of this
session, it went from a single static placeholder screen to a full
registration wizard, live delivery-tracking dashboard, and earnings/payout
flow, deliberately modeled on the driver flow's established patterns
(same `useWizardGuard`, same `_layout.tsx` session-guard shape, same
Context-provider-wraps-Tabs structure, same Earnings → Withdraw → Payment
Processed screen trio as the ambulance dashboard). [dispatcher-flow.md](dispatcher-flow.md)
is the focused reference; this section gives the full walkthrough.

### Entry & guard

Tapping the dispatcher card on `app/main.tsx` now routes through
`/auth?redirectTo=/dispatcher/ride-details` — the same pattern as the
driver role, closing the auth-bypass gap that existed before. Visiting the
bare `/dispatcher` route (e.g. a direct deep link) redirects to
`/dispatcher/ride-details` (`app/dispatcher/index.tsx`, an `expo-router`
`<Redirect>`).

`app/dispatcher/_layout.tsx` mirrors `app/driver/_layout.tsx` exactly: it
checks `getToken()` on mount, shows a spinner while checking, and bounces
to `/auth?redirectTo=/dispatcher/ride-details` if there's no session.
Nothing under `/dispatcher/*` renders without a token.

### Registration wizard (Sign Up only)

```
/dispatcher/ride-details      (Bicycle / Bike / Tricycle / Car picker)
  -> /dispatcher/document-upload   (Valid ID*, Driver's License*, Ride Papers, Ride Registration Number*)
    -> /dispatcher/availability-hours  (24/7 vs Scheduled Hours + Start/End time, Weekend Availability note)
      -> setVerified('dispatcher') -> /dispatcher/dashboard
```

Same param-forwarding pattern as the driver wizard: each screen reads
incoming params via `useLocalSearchParams`, keeps local state, and
forwards everything plus its own fields on Continue.
`useWizardGuard(stepComplete, fallback)` gates each screen after the
first — its `fallback` parameter (added this session) is what let the
dispatcher wizard reuse the same hook with `/dispatcher/ride-details` as
its redirect target instead of the driver wizard's hardcoded `/driver`.

### Dashboard (`app/dispatcher/dashboard/`)

A `Tabs` layout wrapping `DispatcherOrderProvider`
(`components/DispatcherOrderContext.tsx`), three tabs:

- **Home** (`index.tsx`) — blue gradient header ("Welcome back, \[name]"), Rider Status toggle (open/closed for new orders), Today's Sales card (amount, trend, Orders Today/This Week/This Month), New Orders list with direct Accept/Decline per card (no separate "view details" step, unlike the ambulance dashboard).
- **Order** (`order.tsx`) — phase-driven, one screen:
  - `phase: 'none'` — "Delivery Request" list of all pending orders (same Accept/Decline cards as Home).
  - `phase: 'active'` — live trip tracking, itself split by `deliveryPhase`:
    - `'toPickup'` — heading pill + contact card show the **pharmacy**; button is "I've Arrived at Pickup" → `arrivedAtPickup()` flips `deliveryPhase` to `'toCustomer'` **without** ending the trip.
    - `'toCustomer'` — heading pill + contact card now show the **customer**; button reads "I've Delivered to {first name}" → confirms, then `completeDelivery()` clears the active order and the screen navigates to `/dispatcher/delivery-complete` with the earned amount.
- **Profile** (`profile.tsx`) — rider name/stats, Personal Information, an Earnings link (§ below), Notifications / Rate Us / Help & Support / Terms & Privacy, Log Out (clears token + verification record, same full-reset pattern as the driver dashboards).

This two-phase pickup→delivery model (rather than a single "arrived =
done" tap) is the dispatcher flow's one meaningful behavioral difference
from the ambulance dashboard's trip lifecycle, and was a deliberate
correction mid-build once the intended design (pickup and drop-off are
separate legs, each with their own contact and confirmation) became clear
from the reference screens.

### Post-delivery money flow (`app/dispatcher/*`, siblings of `dashboard/`)

Pushed as plain Stack screens from `dashboard/order.tsx` and
`dashboard/profile.tsx`, so they render full-screen with no tab bar:

```
/dispatcher/delivery-complete   (SuccessPop confirmation, amount just earned, auto-redirects to Order after 2.5s)
/dispatcher/earnings            (static list of past deliveries, "Withdraw Earnings" -> pushes total as a param)
  -> /dispatcher/withdraw-earnings   (Account Name / Bank Name / Account Number form)
    -> /dispatcher/payment-processed  (SuccessPop confirmation, auto-redirects to Profile after 2.5s)
```

This trio is a direct structural copy of the ambulance dashboard's
`earnings.tsx` / `withdraw-earnings.tsx` / `payment-processed.tsx`, with
labels swapped from "patient / trip type" to "pharmacy / items" — kept
deliberately parallel so the two provider-style flows stay easy to
maintain together.

### What's still mock here (same caveat as the rest of the app)

- `DispatcherOrderContext`'s two seed orders and the Home dashboard's
  sales figures are hardcoded, not derived from anything real, and reset
  on reload.
- `earnings.tsx`'s entry list is a **separate, static** mock array — it is
  not populated from orders actually completed via `completeDelivery()`
  in the same session. Completing a real delivery in the Order tab does
  not add a new row to Earnings. (This mirrors the ambulance dashboard's
  existing `earnings.tsx`, which has the identical property — see
  [improvement.md](improvement.md) for the fix.)
- Document/photo uploads in `document-upload.tsx` are local `file://`
  URIs held in component state and forwarded through route params; no
  actual upload happens.

---

## 7. Shared account/settings screens

Eight screens live flat under `app/` and are linked from all three roles'
profile screens: `personal-information`, `saved-addresses`,
`emergency-contacts`, `payment-methods`, `subscription`, `notifications`,
`help-support`, `terms-privacy`. Each is self-contained, seeded with local
mock state, and **nothing here calls a service** — edits don't persist
past leaving the screen. `saved-addresses` and `subscription` are
requester-only by design; the rest are linked from all profile screens.
Full link matrix: [shared-screens.md](shared-screens.md).

Each of the requester, driver-dashboard, driver-store, and now
dispatcher-dashboard profile screens maintains its **own copy** of the
route map and row component for this menu — four near-identical
implementations today (was three before the dispatcher build). See §10.

---

## 8. Auth, verification & persistence model

Two tiny services, both backed by `services/storage.ts` (a
`Platform.OS === 'web' ? localStorage : expo-secure-store` shim, needed
because `expo-secure-store` has no web implementation):

- **`services/auth.ts`** — `getToken` / `setToken` / `removeToken` on key
  `auth_token`. The token itself is a literal string, `'demo-token'` —
  there is no real backend issuing it. Used by the driver and dispatcher
  paths only; the requester path never calls this.
- **`services/verification.ts`** — one record,
  `{ serviceType: 'ambulance' | 'supplier' | 'dispatcher', status: 'verified' }`.
  There is **no backend approval step** — a provider or dispatcher becomes
  "verified" the instant they press the wizard's final submit button (or,
  on a fresh Log In with no prior record, synthetically the moment they
  log in).

These two keys are the **only** state that survives a reload. Everything
else — mock orders, trip state, cart contents, form drafts mid-wizard —
lives in React state/Context and resets on refresh.

`services/api.ts` is a real, generic `fetch` wrapper pointed at
`api.lifeline.app`; nothing in the app calls it. It's scaffolding for a
backend that doesn't exist yet. Full real-vs-mock table:
[services-and-data.md](services-and-data.md).

---

## 9. Cross-role comparison — what's consistent, what isn't

| | Requester | Driver/Provider | Dispatcher |
|---|---|---|---|
| Entry point | `/auth` (no redirect) | `/auth?redirectTo=/driver` | `/auth?redirectTo=/dispatcher/ride-details` |
| Session token persisted? | ❌ never | ✅ `auth_token` | ✅ `auth_token` |
| Route-level auth guard? | ❌ (`/requester` is open) | ✅ `app/driver/_layout.tsx` | ✅ `app/dispatcher/_layout.tsx` |
| Registration wizard? | n/a | ✅ multi-step, param-forwarded | ✅ multi-step, param-forwarded |
| Verification record? | n/a | ✅ `ambulance` \| `supplier` | ✅ `dispatcher` |
| Dashboard shape | 4-tab shell, no Context | 3-tab Tabs (ambulance) / Stack+Tabs (supplier), each with own Context | 3-tab Tabs with own Context |
| "Log Out" behavior | `router.replace('/')`, nothing to clear | clears token + verification | clears token + verification |
| Earnings/payout screens | n/a | ✅ | ✅ (new, structurally copied) |

The requester flow is the one clear outlier — no session, no guard. Given
every other role now has real session gating, this is worth a deliberate
decision (see [improvement.md](improvement.md) §"Auth & Session
Consistency") rather than an accident of build order.

---

## 10. Duplication inventory (three things, not two)

Documented previously as "two parallel color palettes" — there are
actually **three** parallel, undocumented color systems in the codebase,
none of which share values despite several overlapping intents:

| System | Where defined | Who uses it | Example key |
|---|---|---|---|
| `Colors` | `constants/colors.ts` | `onboarding.tsx`, `main.tsx`, `RoleCard.tsx` | `primary: '#0A7AFF'` |
| `colors` | `src/theme/colors.ts` | auth/OTP screens, all requester ambulance/supplies screens | `accentBlue: '#0A7AFF'` |
| *(unnamed)* | Inline hex literals repeated in every `StyleSheet.create` call | **every** file under `app/driver/**` and `app/dispatcher/**` (registration wizards, both dashboards) | `'#0F172A'`, `'#64748B'`, `'#E2E8F0'`, `'#94A3B8'` (a Tailwind-slate-derived set) |

The first two both encode the same brand blue (`#0A7AFF`) under different
key names. The third — used by the largest and newest parts of the app,
including everything built this session — doesn't reference either
palette at all; it's copy-pasted hex literals across dozens of files.
Unifying onto one design-token file is the single highest-leverage
cleanup available (detailed in [improvement.md](improvement.md)).

Similarly, the "account menu" (profile screen's list of settings links)
now has **four** independent implementations
(`ProfileScreen.tsx`, `driver/dashboard/profile.tsx`,
`driver/store/(tabs)/profile.tsx`, `dispatcher/dashboard/profile.tsx`),
each with its own route map and row component, once nearly, now fully,
identical in shape.

---

## 11. Known disconnects & dead ends (pointer)

The full punch list lives in [known-issues.md](known-issues.md) — request
result discarded after payment, missing product IDs, duplicate
payment/success screen pairs, orphaned files (`services/index.ts` barrel,
`constants/layout.ts`, `src/navigation/types.ts`,
`app/driver/progress-saved.tsx`, `app/order-ambulance-tracking.tsx`). All
of it still applies; nothing in the dispatcher build touched those areas.
The dispatcher build adds one new item of the same shape — Earnings not
sourced from actually-completed deliveries (§6) — now folded into
[known-issues.md](known-issues.md)-style tracking via
[improvement.md](improvement.md).

---

## 12. Where to go next

- Building or changing a screen → find its area's doc above, or
  `app/driver/FLOW.md` for the provider wizard specifically.
- Deciding what to fix first → [improvement.md](improvement.md).
- Wondering if something is real or mocked → [services-and-data.md](services-and-data.md).
