# Known Issues & Cleanup Punch List

Everything here was found by reading the code and, for the driver login
flow, by actually driving the app with Playwright. None of it is currently
broken in the sense of throwing errors — the app runs fine — but these are
the seams a future pass should know about.

## Disconnected flows

- **Ambulance request result is discarded.** `payment-success.tsx`'s "View
  Request" hardcodes its target to `/requester/request`, which shows an
  unrelated static mock (`ACTIVE_REQUEST`), which opens
  `/ambulance-tracking` with its *own* unrelated hardcoded driver. The
  driver name/price/vehicle negotiated in `price-negotiation.tsx` is
  computed, displayed once, then never shown again. See
  [requester-flow.md](requester-flow.md#-where-this-flow-actually-disconnects).
- **`app/order-ambulance-tracking.tsx` is effectively dead code** — a
  near-duplicate of `ambulance-tracking.tsx`, reachable only if
  `order-secure-payment`'s `type` param were ever something other than
  `'supplies'`, which nothing currently sets.
- **Dispatcher earnings aren't sourced from completed deliveries.**
  `app/dispatcher/earnings.tsx` is a static mock list; completing a
  delivery via `DispatcherOrderContext`'s `completeDelivery()` doesn't
  add a row to it. This is the same shape as an identical, pre-existing
  gap in the ambulance dashboard's own `earnings.tsx`. See
  [dispatcher-flow.md](dispatcher-flow.md#post-delivery-money-flow).

## Missing IDs / params that silently default

- `medical-supplies.tsx` → `product-details.tsx`: no product id is passed,
  so every product card opens the same hardcoded "Lisinopril" detail
  screen regardless of which one was tapped.
- `product-details.tsx` → `cart.tsx`: the quantity picked on the detail
  screen isn't passed along or added to the cart.
- `cart.tsx` → `order-secure-payment.tsx`: no `type` param is passed, so
  `orderType` always defaults to `'supplies'` (currently harmless since
  there's no other real order type flowing through this screen, but worth
  knowing if an ambulance-payment path is ever routed through it).
- `secure-payment.tsx` → `payment-success.tsx`: the `amount` param is
  computed but dropped, not forwarded.

## Duplicated implementations

- **`payment-success.tsx` / `order-payment-success.tsx`** — near-identical
  success animations; one hardcoded for ambulance copy, one branching on a
  `type` param that's always `'supplies'` in practice today.
- **`secure-payment.tsx` / `order-secure-payment.tsx`** — two independent
  "pick a payment method, fake-process it" screens with different styling
  and different payment method sets (Card/Apple Pay/Google Pay vs.
  Card/Bank/USSD).
- **Account menu logic** — `ProfileScreen.tsx` (requester),
  `driver/dashboard/profile.tsx`, and `driver/store/(tabs)/profile.tsx`
  each maintain their own copy of the routes map and `ListItem` row
  component. See [shared-screens.md](shared-screens.md#duplication-worth-knowing-about).
- **Three parallel color systems, not two** — `constants/colors.ts` and
  `src/theme/colors.ts` both define the same brand blue under different
  key names, and every screen under `app/driver/**` and `app/dispatcher/**`
  uses a *third*, undocumented set of inline hex literals that matches
  neither. See [total-documentation.md §10](total-documentation.md#10-duplication-inventory-three-things-not-two).

## Unused / orphaned code

- **`services/api.ts`** — a real fetch wrapper for a backend that doesn't
  exist and is never called anywhere.
- **`services/index.ts`** barrel — nothing imports from it; all consumers
  import services directly.
- **`constants/layout.ts`** — no importers found anywhere in `app/` or `src/`.
- **`src/navigation/types.ts`** — a React Navigation-style param list from
  before the project adopted expo-router's file-based routing; doesn't
  match any real route name and nothing imports it.
- **`app/driver/progress-saved.tsx`** — built, but no "save & exit" action
  anywhere in the registration wizard currently offers it as a
  destination.

## Auth/session asymmetry (may be intentional, worth confirming)

- The **requester** flow has no session persistence at all — no token is
  ever stored, and `/requester` has no auth guard, so it's reachable via
  direct deep link with zero login. The **driver/provider** flow, by
  contrast, has real session gating (`app/driver/_layout.tsx`) and a
  persisted token/verification record. If requesters are ever meant to
  have real accounts (order history tied to a person, etc.), this is the
  gap to close first.
## Underbuilt areas

- **Orders tab** (`OrderScreen.tsx`) — a static list with no per-order
  drill-down (cards aren't pressable).
- **Dispatcher role** — now has a full wizard, dashboard, and earnings
  flow (see [dispatcher-flow.md](dispatcher-flow.md)), but only one
  active delivery can be modeled at a time, there's no push notification
  for new orders, and state doesn't survive a reload mid-delivery. See
  [improvement.md](improvement.md#p1--dispatcher-specific-follow-ups).

## Not a bug, but worth remembering

None of the OTP, payment, price-negotiation, or dispatch-matching flows
talk to a real backend or SDK — they're deliberately simulated with local
state and `setTimeout`s for this UI-only build. See
[services-and-data.md](services-and-data.md) for the full "what's real vs.
mocked" breakdown before assuming any interaction is backend-connected.
