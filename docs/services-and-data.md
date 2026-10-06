# Services & Data — What's Real vs. Mocked

## `services/` — the real, generic infrastructure

- **`services/storage.ts`** — a cross-platform key/value store: `window.localStorage` on web, `expo-secure-store` on native (`Platform.OS === 'web'` branch). This exists because `expo-secure-store` has no web implementation and throws if called directly on web. Solid, no known issues.
- **`services/auth.ts`** — thin wrapper over `storage.ts` for a single key, `auth_token`: `getToken` / `setToken` / `removeToken`. **Only ever used on the driver/provider path** (`src/screens/OtpVerificationScreen.tsx` when `redirectTo` is present, `app/driver/_layout.tsx`'s guard, and the driver dashboards' "Log Out" buttons). The requester flow never calls this — a requester session isn't persisted at all.
- **`services/verification.ts`** — wrapper storing one record: `{ serviceType: 'ambulance' | 'supplier' | 'dispatcher', status: 'verified' }`. Used to decide, on the driver/dispatcher side, whether a login lands on `/driver/dashboard`, `/driver/store`, or `/dispatcher/dashboard`, and whether the Sign Up entry point shows the registration wizard or Log In skips straight to a dashboard. There is **no backend approval step** — an account becomes "verified" the instant the registration wizard's final submit is pressed (or, for Log In, synthetically the moment you log in with no prior record).
- **`services/index.ts`** — a barrel re-exporting the above. Nothing in the app actually imports from this barrel (every consumer imports directly from `@/services/auth` or `@/services/verification`), so it's currently inert but harmless.
- **`services/api.ts`** — a real, generic `apiRequest<T>()` fetch wrapper pointed at `process.env.EXPO_PUBLIC_API_URL ?? 'https://api.lifeline.app'`. **Nothing in the app calls it.** This is scaffolding for a future backend that doesn't exist yet — worth knowing about so nobody assumes any screen is backend-connected because this file exists.

## What every "backend-looking" interaction actually does

| Interaction | What really happens |
|---|---|
| Sending an OTP (`AuthScreen` → "Send OTP") | Nothing is sent. The next screen just accepts any 6 digits. |
| Confirming an OTP | Local state check only (`code.length === 6`). No verification against a real code. |
| Ambulance price / driver match (`dispatch-status.tsx`) | 4.2s fake timer, then picks from 3 hardcoded `MOCK_DRIVERS`. |
| Price negotiation (`price-negotiation.tsx`) | A local state machine that narrows a counter-offer toward a hardcoded driver price each round — no server, no other party. |
| Any "Pay Now" screen (`secure-payment.tsx`, `order-secure-payment.tsx`) | A ~1.2s `setTimeout`, then navigates to a success screen. No payment SDK (Stripe/Paystack/etc.) is in `package.json`. |
| Submitting the driver registration wizard | Calls `setVerified()` locally — flips a stored flag. No document upload actually happens; file pickers just carry names/URIs through route params. |
| Delivery/trip tracking screens | Fully hardcoded map pins, ETAs, and order items — no live location data, no real driver. |

## The only genuinely persisted state

Everything else resets on reload. The two exceptions, both driver/provider-only, both via `services/storage.ts`:

1. **`auth_token`** — the provider's session token (`'demo-token'`, a literal string — there is no real backend authentication issuing it).
2. **`provider_verification`** — the `{ serviceType, status }` record described above.

Mock data seeded into React Context (`DriverRequestContext` for the
ambulance dashboard, `StoreContext` for the supplier store,
`DispatcherOrderContext` for the delivery dashboard — orders, products,
active trips) is created once per session and resets on a full reload; it
doesn't touch `storage.ts` at all.

## Color/theme duplication

There are **three** parallel color systems in the codebase (see
[total-documentation.md §10](total-documentation.md#10-duplication-inventory-three-things-not-two)
for the full inventory table):

- **`constants/colors.ts`** (`Colors`) — `primary`, `secondary`, `success`, `warning`, `text`, `subtext`, `border`, `white`. Used by `app/onboarding.tsx`, `app/main.tsx`, `components/RoleCard.tsx`.
- **`src/theme/colors.ts`** (`colors`) — `white`, `black`, `accentBlue`, `accentGreen`, `danger`, `subtext`, `border`, `tabBg`, `infoBg`/`infoBorder`/`infoText`, `disabled`, `placeholder`, `inputBg`. Used by the auth/OTP screens and every requester ambulance/supplies screen.
- **An unnamed third set of inline hex literals** — `'#0F172A'`, `'#64748B'`, `'#E2E8F0'`, `'#94A3B8'`, etc., repeated directly in `StyleSheet.create` calls throughout every screen under `app/driver/**` and `app/dispatcher/**` (registration wizards, both provider dashboards, the delivery dashboard). Doesn't reference either named palette above.

The first two both define the same brand blue (`#0A7AFF`) under different
key names (`primary` vs. `accentBlue`) — `src/theme/colors.ts` looks like
the newer, more complete palette (it's what every screen built alongside
the requester flow adopted), while `constants/colors.ts` is the older one
still in use by onboarding/main. The third set is the largest by file
count and shares no values with either — see
[improvement.md](improvement.md#p1--consistency--architecture) for the
suggested fix.

`constants/layout.ts` (`Spacing`, `Radius`, `IconSize` tokens) has no
importers found anywhere in `app/` or `src/` — it appears to be unused
scaffolding.

## Dead navigation types

`src/navigation/types.ts` defines a React Navigation-style
`RootStackParamList` (`Splash`, `Onboarding`, `MainPage`, `Auth`, `RequesterHome`,
`DriverHome`, `DispatcherHome`, `Home`, ...) that doesn't match any actual
expo-router route (routes are file-based paths like `/main`, `/requester`,
not named screens like `MainPage`). Nothing imports this file — it's
leftover from before the project adopted expo-router's file-based routing.
Safe to delete if someone's doing a cleanup pass; documented here rather
than removed outright since removing dead code wasn't the ask.
