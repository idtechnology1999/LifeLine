# Requester Flow ("I need emergency help")

Covers everything a patient/requester does: signing in, requesting an
ambulance, and ordering medical supplies for delivery.

## Entry chain

```
app/index.tsx (splash, 2.6s)
  -> router.replace('/onboarding')
app/onboarding.tsx (3-slide carousel; "Skip" or last slide's "Get Started")
  -> router.replace('/main')
app/main.tsx (role picker)
  -> "I need emergency help" -> router.push('/auth')
```

Onboarding replays on every cold start — there's no "seen onboarding
before" flag persisted anywhere.

## Auth + OTP

- `app/auth.tsx` re-exports `src/screens/AuthScreen.tsx` — Log In / Sign Up
  tabs, phone number (+ full name/email for Sign Up). "Send OTP" pushes to
  `/otp-verification` with `{ phone, mode, name, email }`. This is pure UI
  state — no OTP is actually sent by any service.
- `app/otp-verification.tsx` re-exports `src/screens/OtpVerificationScreen.tsx`
  — a 6-digit code entry screen. **Any 6 digits are accepted** (there's no
  real code to match against). On Confirm, for the plain requester path
  (no `redirectTo` param, i.e. not arriving via the driver entry point):
  - Sign Up → `router.replace('/auth')` (bounces back to the login tab —
    there's no separate "welcome" step after signup).
  - Log In → `router.replace('/requester')`.

**No session token is ever stored for requesters.** `services/auth.ts`'s
`setToken` is only called on the driver/provider path (`redirectTo`
present). A requester can deep-link straight to `/requester` with zero
auth — there is no guard on `app/requester/_layout.tsx` the way
`app/driver/_layout.tsx` guards the provider section.

## Requester tab shell

`app/requester/_layout.tsx` is an expo-router `Tabs` navigator (shared
`components/CustomTabBar.tsx`) with four tabs, each a one-line re-export of
`src/screens/requester/*.tsx`:

| Tab | File | Route file (re-export) |
|---|---|---|
| Home | `RequesterHomeScreen.tsx` | `app/requester/index.tsx` |
| Request | `RequestScreen.tsx` | `app/requester/request.tsx` |
| Orders | `OrderScreen.tsx` | `app/requester/order.tsx` |
| Profile | `ProfileScreen.tsx` | `app/requester/profile.tsx` |

All four screens are seeded entirely with hardcoded mock objects/arrays
(`MOCK_USER`, `MOCK_CONTACTS`, `MOCK_ACTIVITY`, `ACTIVE_REQUEST`,
`MOCK_ORDERS`, a hardcoded `user` profile) — nothing is fetched or read
from storage.

- **Home** — two primary CTAs: "Request Ambulance" → `/request-ambulance`, "Medical Supplies" → `/medical-supplies`. Also shows a static subscription banner (no link), an emergency-contacts list (tap-to-call via `Linking.openURL('tel:...')`), and a recent-activity list (display only).
- **Request** — shows one hardcoded active-request card; tapping it is the *only* way to reach `/ambulance-tracking` in the whole app.
- **Orders** — a static, non-pressable list of mock orders (no drill-down to order detail).
- **Profile** — links out to all 8 shared account screens (see [shared-screens.md](shared-screens.md)); "Log Out" just does `router.replace('/')` (there's no token to clear).

## Ambulance request sub-flow

State flows purely through route params — no context, no store, no
persistence between steps:

```
app/request-ambulance.tsx
  (triage tier: red/yellow/green/black, symptom chips, BLS/ALS/ERV type, notes)
  -> push /pickup-destination { severity, ambulanceType, symptomLabels, otherDescription, notes }

app/pickup-destination.tsx
  (pickup: text input + real expo-location reverse-geocode via "Use current location";
   destination: search against hardcoded MOCK_HOSPITALS)
  -> push /confirm-request { ...params, pickup, destination }

app/confirm-request.tsx
  (read-only summary; price computed from hardcoded BASE_RATES: bls 2500, als 4200, erv 3400)
  -> push /dispatch-status { ...params, estimatedPrice }

app/dispatch-status.tsx
  ("searching" for 4.2s, then "matched" showing 3 hardcoded MOCK_DRIVERS)
  -> per-driver "Connect" -> push /price-negotiation { systemEstimate, driverPrice: estimate+800, driverName, driverPhone, vehicleCode, ... }

app/price-negotiation.tsx
  (simulated counter-offer chat; local state machine narrows the offer each round)
  -> "Accept" -> push /secure-payment { amount, driverName, vehicleCode }

app/secure-payment.tsx
  (Card / Apple Pay / Google Pay picker — no payment SDK; 1.2s fake delay)
  -> replace /payment-success   (note: the `amount` param is dropped here, not forwarded)

app/payment-success.tsx
  -> "View Request" -> replace /requester/request
```

### ⚠️ Where this flow actually disconnects

`payment-success.tsx`'s "View Request" hardcodes its target to
`/requester/request`, which shows the unrelated static `ACTIVE_REQUEST`
mock, which opens `/ambulance-tracking` with its *own* unrelated hardcoded
driver data. **The driver name, price, and vehicle you just negotiated in
`price-negotiation.tsx` are computed, displayed, then discarded** — they
never appear again. If you want the negotiated result to actually show up
on a tracking screen, this is the seam to fix (either have
`payment-success` forward its params into a tracking screen, or have
`RequestScreen`/`ambulance-tracking` read from a shared context instead of
static mocks).

There is also a near-duplicate, **effectively dead** tracking screen:
`app/order-ambulance-tracking.tsx` — fully hardcoded, no params, reachable
only if `order-secure-payment`'s `type` param were ever something other
than `'supplies'`, which nothing in the app currently sets it to.

## Medical supplies sub-flow

```
app/medical-supplies.tsx
  (product grid, hardcoded PRODUCTS[] with real bundled images)
  -> cart icon -> push /cart
  -> tap a product card -> push /product-details   (NOTE: no product id is passed)

app/product-details.tsx
  (always shows the same hardcoded "Lisinopril" product, regardless of which card was tapped —
   the missing id param means this screen can't actually show per-product detail yet)
  -> "Add to Cart" -> push /cart   (quantity picked here is not passed/added either)

app/cart.tsx
  (hardcoded seed: Blood Pressure Monitor + Lisinopril; qty +/- and remove are local-only, not persisted)
  -> "Proceed to Checkout" -> push /order-secure-payment   (no `type` param passed)

app/order-secure-payment.tsx
  (orderType = params.type ?? 'supplies' -> always 'supplies' since nothing sets it)
  (Card / Bank / USSD picker, fully fake)
  -> replace /order-payment-success { type: orderType }

app/order-payment-success.tsx
  (isSupplies = type === 'supplies' -> always true in practice)
  -> "Track Delivery" -> replace /order-delivery-tracking

app/order-delivery-tracking.tsx
  (fully hardcoded delivery UI: warehouse/driver/user map pins, fake ETA, fake order items)
  Terminal screen — no further navigation out.
```

### Duplication worth knowing about

`payment-success.tsx` / `order-payment-success.tsx` are near-identical
success animations (one hardcoded for ambulance copy, one branching on a
`type` param that's always `'supplies'` today). Likewise
`secure-payment.tsx` / `order-secure-payment.tsx` are two independently
built "pick a payment method, fake-process it" screens with different
styling and different payment method options (Card/Apple Pay/Google Pay
vs. Card/Bank/USSD). If either flow is extended, consolidating these pairs
into one parameterized screen would remove real duplication.
