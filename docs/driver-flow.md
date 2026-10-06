# Driver / Provider Flow ("I provide emergency services")

The full screen-by-screen breakdown of this section lives in
[`app/driver/FLOW.md`](../app/driver/FLOW.md) (kept next to the code it
describes, and kept up to date as that code changes). This page is the
project-wide summary and index into it.

## Who this covers

Two provider types share one entry point and registration wizard, then
branch into two separate dashboards:

- **Ambulance Service Provider** → `/driver/dashboard`
- **Medical Supplier / Pharmacy** → `/driver/store`

## Entry point

Tapping **"I provide emergency services"** on `app/main.tsx` always goes to
`/auth` with `redirectTo=/driver` — the same pattern as the requester
entry point (`/auth` directly), so it never silently reuses an old session.
From there, `/auth`'s Log In vs. Sign Up tabs are the "returning provider"
vs. "new provider" split:

- **Log In** → treated as an already-registered account, unconditionally.
  Routes straight to a dashboard — no picker, no wizard. If a verification
  record exists it's reused (so the type chosen at signup is remembered);
  otherwise it defaults to `serviceType: 'ambulance'` and marks the account
  verified on the spot.
- **Sign Up** → `/driver`, the Provider Verification screen: pick Ambulance
  or Supplier, then "Continue to Business Details" walks through the full
  registration wizard (business details → ambulance/supplier-specific
  details → contact & operations → review & submit → verification in
  progress).

## Guards

- `app/driver/_layout.tsx` requires a session token for anything under
  `/driver/*` (wizard, ambulance dashboard, supplier store alike).
- `components/useWizardGuard.ts` enforces the wizard's step order — each
  screen after the picker requires proof the previous step forwarded its
  data, redirecting back to `/driver` if a step is skipped (e.g. via a
  direct URL).

See `app/driver/FLOW.md` §3 ("Guards against skipping steps") for exactly
which param each screen checks.

## Data & persistence

- `services/auth.ts` — session token (`auth_token`).
- `services/verification.ts` — `{ serviceType, status: 'verified' }` record. There is **no backend approval step**; a provider becomes "verified" the instant "Submit For Verification" is pressed.
- Both are backed by `services/storage.ts` (`localStorage` on web, `expo-secure-store` on native) — see [services-and-data.md](services-and-data.md).
- The registration wizard itself has **no global form state**: each screen reads incoming values via `useLocalSearchParams`, keeps its own local state, and forwards `{ ...params, ...itsOwnFields }` to the next screen on "Continue". File uploads (documents/photos) round-trip as JSON-encoded arrays of names/URIs in the params — fine for this in-memory demo, not wired to real storage.

## Dashboards

- **Ambulance dashboard** (`app/driver/dashboard/`) — Tabs layout wrapping `DriverRequestProvider`: Home (online toggle, earnings, incoming request Accept/Decline cards), Request (detail → negotiate → active trip states), Profile.
- **Supplier store** (`app/driver/store/`) — Stack layout wrapping `StoreProvider`, with a nested Tabs group for the 3 real tabs (Home, Inventory, Profile) plus sibling stack screens (add/edit product, delivery tracking/complete).
- Both dashboards' "Log Out" clears **both** the session token and the verification record — a full reset, not a real account log-out, since there's no backend account to log back into.

For the mermaid diagram, the full screen table, and the reasoning behind
the Store section's two-layer navigator, see `app/driver/FLOW.md` directly.
