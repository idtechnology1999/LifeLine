# Lifeline — Improvement Plan (Total Checkup)

A full audit of the app as it stands, organized by priority, with what
"good" looks like for each item. Companion to
[total-documentation.md](total-documentation.md) — that doc describes what
the app *does*; this one describes what would make it more correct, more
consistent, and closer to a real production app.

**Priority key**

- **P0 — Blocks real use.** Correctness bugs, security gaps, or missing
  integrations that would matter the moment real users or real money touch
  the app.
- **P1 — Should fix soon.** Consistency gaps, duplicated logic, and
  missing safety nets that make the codebase harder to extend correctly.
- **P2 — Polish.** Quality-of-life, performance, and maintainability items
  that don't block anything today but compound over time.

---

## P0 — Correctness & disconnected flows

These are places where the UI *looks* finished but the data it should be
carrying gets dropped on the floor.

1. **Ambulance request result never reaches the tracking screen.**
   `secure-payment.tsx` → `payment-success.tsx`'s "View Request" hardcodes
   its target to `/requester/request`, which shows an unrelated static
   mock, which opens `/ambulance-tracking` with its *own* unrelated
   hardcoded driver. The driver name, price, and vehicle negotiated in
   `price-negotiation.tsx` are computed, shown once, then discarded.
   **Fix shape:** either forward the negotiated params all the way through
   `payment-success` into a tracking screen that reads them, or move this
   state into a small Context (`ActiveRequestContext`, mirroring
   `DriverRequestContext`) that `RequestScreen` and `ambulance-tracking`
   both read from instead of static mocks.
2. **`amount` is dropped between `secure-payment.tsx` and
   `payment-success.tsx`.** Computed, then not forwarded — the success
   screen can't show what was actually charged.
3. **No product ID flows from the supplies grid to product detail.**
   `medical-supplies.tsx` → `product-details.tsx` always shows the same
   hardcoded "Lisinopril" card regardless of which product was tapped.
   **Fix shape:** pass `id` as a route param, look it up from the shared
   `PRODUCTS` array.
4. **Quantity picked on `product-details.tsx` isn't added to the cart.**
   The Add to Cart action doesn't carry the chosen quantity through.
5. **Dispatcher Earnings is a static list, not derived from completed
   deliveries.** Completing a delivery via `completeDelivery()` in
   `dispatcher/dashboard/order.tsx` doesn't add a row to
   `dispatcher/earnings.tsx` — they're two unconnected mock data sources.
   This is the dispatcher-side twin of an identical, pre-existing gap in
   the ambulance dashboard's own `earnings.tsx`. **Fix shape:** track
   completed deliveries/trips in the relevant Context
   (`DispatcherOrderContext`, `DriverRequestContext`) and have the
   earnings screens read from that history instead of a hardcoded array.
6. **`app/order-ambulance-tracking.tsx` is dead code** — a near-duplicate
   of `ambulance-tracking.tsx`, reachable only if `order-secure-payment`'s
   `type` param were ever something other than `'supplies'`, which
   nothing currently sets. Either wire a real path to it or delete it.

---

## P0 — Security & auth

The app is explicitly a UI-only build with no backend, so these aren't
"bugs" today — but they're exactly the things that must change before any
real user data or money is involved, so they belong at the top of the
list for whenever that work starts.

1. **The session token is a literal string.** `setToken('demo-token')` is
   called verbatim in `OtpVerificationScreen.handleConfirm` — there is no
   real authentication issuing it. Any real backend integration needs a
   proper auth flow (issued JWT/session token, refresh handling, expiry).
2. **OTP accepts any 6 digits.** There's no real code generated or
   checked. Before this ships for real, it needs an actual SMS/OTP
   provider (Twilio Verify, Africa's Talking, etc.) and server-side code
   validation — never client-side-only.
3. **No input validation or sanitization anywhere.** Phone numbers,
   emails, registration numbers, and free-text fields (e.g. "Notes" on
   the ambulance request) are accepted as-is. Once there's a backend,
   every one of these becomes an injection/abuse surface if not validated
   both client- and server-side.
4. **Documents/photos travel as bare local URIs through route params.**
   Fine for an in-memory demo; not acceptable once real ID documents,
   licenses, or registration papers are involved — those need to go to
   real, access-controlled file storage (S3/Cloudinary/etc.) with the app
   holding only a reference, not the raw file.
5. **"Verification" has no approval step.** Pressing Submit instantly
   flips a local `verified` flag for both driver and dispatcher
   registration. A real product needs an actual review queue (admin
   dashboard or manual ops process) before someone can accept paid
   emergency/delivery work.

---

## P1 — Real backend & integrations needed

Everything below is currently simulated. Listed here as the concrete
integration list for when a backend is introduced — not because
simulating them was wrong for this stage of the build.

| Area | Currently | Needs |
|---|---|---|
| Data & accounts | Nothing (mock arrays everywhere) | A real API + database; `services/api.ts` is already scaffolded for this and just needs endpoints to call |
| OTP / SMS | Any 6 digits accepted | Twilio Verify / Africa's Talking / similar |
| Payments | `setTimeout` + fake success | Paystack or Flutterwave (both are the standard choice for Nigeria-market apps like this) |
| Driver/dispatcher matching | Hardcoded arrays, instant "match" | A real dispatch service — geo-matching, live availability |
| Live location & tracking | Fully hardcoded map pins and ETAs | Real device location (`expo-location` is already a dependency) streamed over WebSocket or a realtime DB (Firebase RTDB/Supabase Realtime) |
| Push notifications | None | `expo-notifications` for new-order/new-request alerts — especially important for the dispatcher and driver dashboards, which currently rely on the user having the app open and looking at it |
| File uploads (documents, product photos) | Local URIs in route params | Real object storage with signed uploads |

---

## P1 — Consistency & architecture

1. **Unify the three parallel color systems** (see
   [total-documentation.md §10](total-documentation.md#10-duplication-inventory-three-things-not-two)
   for the full inventory: `constants/colors.ts`, `src/theme/colors.ts`,
   and the undocumented inline-hex set used throughout `app/driver/**`
   and `app/dispatcher/**`). Pick one, express it as design tokens
   (ideally with light/dark variants even if dark mode isn't wired up
   yet — see the UX section), and migrate call sites incrementally
   starting with new work. This is the single highest-leverage cleanup:
   it currently costs nothing to introduce a fourth micro-palette by
   accident, because there's no single source of truth to check against.
2. **Extract a shared `AccountMenu` component.** Four screens now
   duplicate the same routes-map + row-component pattern
   (`ProfileScreen.tsx`, `driver/dashboard/profile.tsx`,
   `driver/store/(tabs)/profile.tsx`, `dispatcher/dashboard/profile.tsx`).
   A single `components/AccountMenu.tsx` taking a `{ icon, label, route }[]`
   per role would mean a new settings item is one array edit, not four
   file edits kept in sync by hand.
3. **Decide the requester session story on purpose.** Every other role
   now has real session gating (`_layout.tsx` guard + persisted token);
   the requester flow has neither — `/requester` is reachable by direct
   deep link with zero login, and nothing is ever persisted for it. If
   requesters are meant to have real accounts eventually (order history,
   saved addresses that actually save), this is the gap to close first,
   and it should be a deliberate choice, not just what was built first.
4. **Consolidate the duplicate payment/success screen pairs** —
   `payment-success.tsx` / `order-payment-success.tsx` and
   `secure-payment.tsx` / `order-secure-payment.tsx` are independently
   built near-twins. One parameterized pair (branching on an
   `orderType`/`flowType` param) would remove real duplication and stop
   the two from silently drifting apart, which the payment-method-set
   difference (Card/Apple Pay/Google Pay vs. Card/Bank/USSD) suggests has
   already started happening.
5. **Consider moving wizard state off route params once a wizard grows
   past ~3 screens.** Both the driver and dispatcher registration wizards
   forward `{ ...params, ...newFields }` screen to screen with no central
   store. It works today, but every new field means touching every
   downstream screen's forwarding logic, and it makes a true "save and
   exit" feature (see `progress-saved.tsx`, currently unreachable)
   meaningfully harder to build correctly than it would be with a small
   `WizardContext` holding the in-progress form.
6. **Remove or finish orphaned code** flagged in
   [known-issues.md](known-issues.md): `services/index.ts` barrel (unused —
   every consumer imports services directly), `constants/layout.ts` (no
   importers), `src/navigation/types.ts` (pre-expo-router leftover),
   `app/driver/progress-saved.tsx` (built, unreachable). Dead code that
   nobody's sure is dead is a tax on every future search through the
   codebase.

---

## P1 — Dispatcher-specific follow-ups

Now that the dispatcher role has a full flow (see
[total-documentation.md §6](total-documentation.md#6-dispatcher-flow-i-help-dispatch-medical-supplies)),
it inherits the same category of gaps the driver flow already has, plus a
couple of its own:

1. **Earnings should be sourced from completed deliveries**, not a static
   array (also listed under P0 correctness above — repeated here because
   it's the most visible dispatcher-specific instance).
2. **Only one active order at a time is modelable.**
   `DispatcherOrderContext` has a single `activeOrderId`. Real courier
   apps generally support batched/multi-stop deliveries; worth deciding
   early whether that's in scope, since it changes the context shape
   significantly if added later.
3. **No new-order notification.** A dispatcher has to have the Home or
   Order tab open to see a new delivery request appear. Push
   notifications (see the integrations table above) matter most for this
   role specifically, since courier work is inherently "away from the
   app, on the road."
4. **The map areas (`LinearGradient` placeholders in the active-trip
   view) are visual stand-ins, not a real map.** Fine for this stage;
   flag for `react-native-maps` or an equivalent once live location is
   wired up.
5. **State resets on reload mid-delivery.** If a dispatcher refreshes the
   page while `phase: 'active'`, the active order and its
   `deliveryPhase` are lost (only the auth token and verification record
   survive a reload). Once this app has real users doing real courier
   work, an in-progress delivery needs to survive a refresh/reconnect —
   this argues for server-side trip state, not just a fix inside the
   Context.

---

## P1 — Testing & CI

There are currently **zero automated tests** in this codebase (only
`node_modules`-internal test files match any `*.test.ts` pattern) and
**no CI configuration** (no `.github/workflows`). For an app this close to
handling real payments and real medical logistics, that's the biggest
process gap, independent of any individual code issue above.

Suggested starting point, roughly in order of ROI:

1. **Unit tests for `services/`** (`storage.ts`, `auth.ts`,
   `verification.ts`) — small, pure, and exactly the layer everything
   else depends on.
2. **Unit tests for the wizard guards** (`useWizardGuard`) and the
   Context reducers (`DriverRequestContext`, `StoreContext`,
   `DispatcherOrderContext`) — these encode real state-machine logic
   (phase transitions, accept/decline, arrival → delivery) that's easy to
   regress silently.
3. **One end-to-end smoke test per role** (Playwright, since the app
   already runs on web) — splash → onboarding → role pick → auth → OTP →
   dashboard, for all three roles. This alone would have caught the
   original dispatcher auth-bypass gap and would catch the next one like
   it.
4. **A basic GitHub Actions workflow** running `npx tsc --noEmit` and
   `npm run lint` on every PR at minimum, expanding to the above test
   suites as they exist. Type-checking already caught real mistakes
   during this session's dispatcher build (a typed-route mismatch) before
   they'd have shown up at runtime — wiring that into CI means every
   future change gets the same check for free.

---

## P2 — UX & accessibility

1. **No "seen onboarding" persistence.** The 3-slide carousel replays on
   every cold start for every role. A simple `storage.ts` flag would fix
   this cheaply.
2. **No accessibility labels/roles** on custom pressables
   (`AnimatedPressable`, icon-only buttons like the tab bar's bell/avatar
   `Ionicons`). Screen-reader users currently can't meaningfully use this
   app. Worth an accessibility pass once the core flows stabilize —
   `accessibilityLabel`/`accessibilityRole` on interactive elements,
   sufficient color contrast (check the slate-on-white palette used
   throughout driver/dispatcher screens against WCAG AA), and dynamic
   type support.
3. **No dark mode**, despite `react-native`'s `useColorScheme` being free
   to wire up. If the color-system unification (P1 above) happens, doing
   it as light/dark-aware tokens from the start avoids a second migration
   later.
4. **No loading/error states designed for real network latency or
   failure.** Every "network" call today is a fixed-duration
   `setTimeout` that always succeeds. The moment any of the P1
   integrations above land, every one of those call sites needs a real
   loading state, a real error state, and retry/offline handling — none
   of which exists as a pattern anywhere in the app yet, so it's worth
   establishing one (e.g. a shared `useAsyncAction` hook or a small
   result-state helper) before the first real API call is wired in,
   rather than inventing it ad hoc per screen.
5. **Orders/activity lists aren't pressable** (`OrderScreen.tsx` on the
   requester side is explicitly static; several other "recent activity"
   style lists are display-only). Worth a pass once there's real data
   worth drilling into.

---

## P2 — Performance & scale

1. **Lists render via `.map()` inside `ScrollView`**, not `FlatList`,
   throughout (order lists, product grids, earnings entries). Fine at the
   current mock-data scale (a handful of items); switch to `FlatList`
   (or `FlashList`) before any of these lists are backed by real,
   potentially large data.
2. **No image optimization/caching strategy** beyond what
   `expo-image`/`Image` do by default — worth revisiting once product
   photos and uploaded documents are real, remotely-hosted files rather
   than bundled assets.
3. **No memoization pass.** Context values (`DriverRequestContext`,
   `StoreContext`, `DispatcherOrderContext`) are recreated as a fresh
   object every render, which will start to matter once dashboards have
   more consumers or larger lists. Not urgent at current scale; worth a
   pass alongside the `FlatList` migration.

---

## Suggested phasing

A rough, non-binding order that front-loads the things that get harder to
retrofit the longer they wait:

1. **Stabilize** — fix the P0 disconnected-flow bugs (dropped params,
   missing IDs, dispatcher earnings not derived from real completions).
   These are all small, local fixes with no architectural dependency on
   anything else in this list.
2. **Secure the foundations** — decide the requester session story,
   unify the color system, extract the shared account menu, set up CI
   with type-check + lint. All of this makes every subsequent change
   safer and faster, before more surface area is added on top.
3. **Go real** — backend, real OTP/payment providers, real file storage,
   real-time location/matching, push notifications. This is the big one
   and should be sequenced by business priority (payments and OTP are
   probably the two that block "real users" soonest).
4. **Polish** — accessibility, dark mode, loading/error/retry patterns,
   list virtualization, memoization. Genuinely valuable, but safe to do
   last since none of it blocks correctness or security.
