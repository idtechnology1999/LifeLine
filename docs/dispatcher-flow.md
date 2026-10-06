# Dispatcher Flow ("I Help dispatch Medical Supplies")

The courier side of the app — an independent rider (bicycle, bike,
tricycle, or car) who delivers medical supplies dispatched from a
pharmacy to a customer. Built to deliberately mirror the driver flow's
established patterns: same `_layout.tsx` session-guard shape, same
`useWizardGuard` step-order enforcement, same Context-provider-wraps-Tabs
dashboard structure, same Earnings → Withdraw → Payment Processed screen
trio as the ambulance dashboard.

## Entry point

Tapping **"I Help dispatch Medical Supplies"** on `app/main.tsx` routes to
`/auth?redirectTo=/dispatcher/ride-details` — the same pattern as the
`driver` role, so it always goes through Log In / Sign Up first (no silent
reuse of a stale session). The bare `/dispatcher` route
(`app/dispatcher/index.tsx`) is a redirect to `/dispatcher/ride-details`.

- **Log In** → treated as an already-registered account. Routes straight
  to `/dispatcher/dashboard` — no picker, no wizard. If a verification
  record exists it's reused; otherwise it defaults to
  `serviceType: 'dispatcher'` and marks the account verified on the spot
  (`src/screens/OtpVerificationScreen.tsx`).
- **Sign Up** → `/dispatcher/ride-details`, the start of the registration
  wizard.

## Guards

- `app/dispatcher/_layout.tsx` requires a session token for anything
  under `/dispatcher/*` — checks `getToken()` on mount, shows a spinner
  while checking, redirects to `/auth?redirectTo=/dispatcher/ride-details`
  if there's no session. Identical shape to `app/driver/_layout.tsx`.
- `components/useWizardGuard.ts` enforces the wizard's step order. This
  hook now takes an optional `fallback` path (defaulting to `/driver` for
  backward compatibility with the existing driver-wizard call sites) —
  the dispatcher wizard passes `/dispatcher/ride-details` so a skipped
  step redirects back to *this* wizard's start, not the driver's.

## Registration wizard (Sign Up only)

```
/dispatcher/ride-details
  (Bicycle / Bike / Tricycle / Car — single-select, no prior param required)
  -> push /dispatcher/document-upload { rideType }

/dispatcher/document-upload
  (Valid ID*, Driver's License*, Ride Papers (optional), Ride Registration Number*
   — guarded on params.rideType)
  -> push /dispatcher/availability-hours { ...params, validIdUri, driversLicenseUri, ridePapersUri, rideRegNumber }

/dispatcher/availability-hours
  (24/7 Emergency Service vs. Scheduled Hours Only + Start/End time + Weekend Availability note
   — guarded on params.rideRegNumber)
  -> setVerified('dispatcher') -> replace /dispatcher/dashboard
```

Same "no global form state" pattern as the driver wizard: each screen
reads incoming params via `useLocalSearchParams`, keeps its own local
`useState`, and forwards `{ ...params, ...itsOwnFields }` on Continue.
Document/photo pickers (`expo-image-picker`) store local URIs forwarded
as plain string params — not wired to real file storage.

## Dashboard (`app/dispatcher/dashboard/`)

A `Tabs` layout (`_layout.tsx`) wrapping `DispatcherOrderProvider`
(`components/DispatcherOrderContext.tsx`), three tabs:

| Tab | File | Purpose |
|---|---|---|
| Home | `index.tsx` | Rider Status toggle, Today's Sales card, New Orders list with direct Accept/Decline |
| Order | `order.tsx` | Phase-driven: pending-orders list, or live pickup→delivery trip tracking |
| Profile | `profile.tsx` | Rider stats, settings links, Earnings, Log Out |

### The Order tab's two states

- **`phase: 'none'`** — "Delivery Request" screen: the same order cards as
  Home (Pick-up / Delivery to / Distance / Earning, Decline / Accept).
- **`phase: 'active'`** — live tracking, itself split by
  `deliveryPhase`:
  - **`'toPickup'`** — heading pill and contact card show the pharmacy
    (`activeOrder.pickup` / `pickupPhone`). Button: **"I've Arrived at
    Pickup"** → `arrivedAtPickup()` flips `deliveryPhase` to
    `'toCustomer'`. The trip does **not** end here — this was a
    deliberate correction from an earlier one-tap "arrival completes the
    order" simplification, once it became clear pickup and drop-off are
    two separate legs with two separate contacts.
  - **`'toCustomer'`** — heading pill and contact card now show the
    customer (`activeOrder.customerName` / `customerPhone`). Button:
    **"I've Delivered to {first name}"** → on confirm, captures the
    order's earning amount, calls `completeDelivery()` (removes the order,
    clears active state), then navigates to `/dispatcher/delivery-complete`
    with that amount.

### `DispatcherOrderContext` (`components/DispatcherOrderContext.tsx`)

Holds: `orders` (seeded with 2 mock deliveries), `activeOrder`, `phase`
(`'none' | 'active'`), `deliveryPhase` (`'toPickup' | 'toCustomer'`),
`online` (Rider Status toggle). Actions: `acceptOrder`, `declineOrder`,
`arrivedAtPickup`, `completeDelivery`, `clearActive`. Resets on reload —
nothing here touches `services/storage.ts`.

## Post-delivery money flow

Pushed as plain Stack screens directly under `app/dispatcher/` (siblings
of `dashboard/`, not inside its `Tabs`), so they render full-screen with
no tab bar — the same trick `app/driver/store/` uses for its own
non-tab pushed screens:

```
/dispatcher/delivery-complete   (SuccessPop, amount just earned, auto-redirects to /dispatcher/dashboard/order after 2.5s)
/dispatcher/earnings            (static list of past deliveries + total, "Withdraw Earnings")
  -> /dispatcher/withdraw-earnings   (Account Name / Bank Name / Account Number)
    -> /dispatcher/payment-processed  (SuccessPop, auto-redirects to /dispatcher/dashboard/profile after 2.5s)
```

This trio is a structural copy of the ambulance dashboard's
`earnings.tsx` / `withdraw-earnings.tsx` / `payment-processed.tsx`, with
"patient / trip type" relabeled to "pharmacy / items".

**Known gap** (tracked in [improvement.md](improvement.md)):
`earnings.tsx`'s list is a separate static mock array — completing a
delivery via `completeDelivery()` doesn't add a row here. This mirrors an
identical, pre-existing gap in the ambulance dashboard's own
`earnings.tsx`.

## Data & persistence

Same two services as the driver flow, both via `services/storage.ts`:

- `services/auth.ts` — session token (`auth_token`).
- `services/verification.ts` — `{ serviceType: 'dispatcher', status: 'verified' }`. No backend approval step; verified the instant the wizard's last screen is completed.

"Log Out" on `dashboard/profile.tsx` clears **both** — a full reset, since
there's no real account to log back into, matching the driver dashboards'
behavior exactly.

## What's still mock here

Same caveats as the rest of the app (see
[services-and-data.md](services-and-data.md)): seed orders, sales
figures, and earnings entries are hardcoded and reset on reload; document
uploads are local URIs, not real files; there's no map SDK behind the
gradient "heading to..." hero, no push notification for new orders, and
only one active order can be modeled at a time. Full detail and fix
shapes: [improvement.md](improvement.md#p1--dispatcher-specific-follow-ups).
