# Tech Stack & Project Structure

## Framework & platform

- **Expo SDK ~54**, **React 19.1**, **React Native 0.81**, **react-native-web ~0.21** — one codebase targets iOS, Android, and web.
- **expo-router ~6** (file-based routing, `typedRoutes: true` in `app.json`). Every screen lives under `app/`; a file's path *is* its route. `typedRoutes` is why dynamic pushes like `router.push(\`/${key}\` as any)` need the `as any` escape hatch.
- **react-native-reanimated 4** + **react-native-gesture-handler** — used throughout for press-scale animations (`AnimatedPressable`), fade/slide-in mounts (`FadeSlideIn`), the onboarding carousel, and the splash screen.
- **New Architecture enabled** (`newArchEnabled: true`), **React Compiler enabled** (`reactCompiler: true` under `experiments`).

## Key libraries in use

| Library | Where it's actually used |
|---|---|
| `expo-secure-store` | Native-only backing store for `services/storage.ts` (session token + verification record) |
| `expo-location` | Reverse-geocoding in `app/pickup-destination.tsx` ("Use current location") |
| `expo-document-picker` / `expo-image-picker` | File/photo uploads in the driver registration wizard (`business-details.tsx`, `ambulance-details.tsx`, `supplier-details.tsx`) |
| `expo-haptics` | Tab-bar press feedback (`CustomTabBar.tsx`), guarded to no-op on web |
| `expo-blur`, `expo-linear-gradient` | Visual polish (auth screen glass card, dashboard headers) |
| `@expo/vector-icons` (Ionicons, Feather, MaterialIcons, MaterialCommunityIcons) | All iconography |
| `@react-navigation/*` | Pulled in transitively by expo-router; not used directly |

**Not present** despite what the payment/OTP screens imply: no Stripe/Paystack SDK, no Twilio/SMS SDK, no real backend client library. Those flows are fully simulated — see [services-and-data.md](services-and-data.md).

## Top-level folder structure

```
app/          Every screen + route, file-based (expo-router)
  driver/     Provider side: registration wizard, ambulance dashboard, supplier store
  requester/  Requester tab shell (re-exports src/screens/requester/*)
  dispatcher/ Courier side: registration wizard, delivery dashboard, earnings flow — see dispatcher-flow.md
src/
  screens/    Actual requester + auth/OTP screen implementations
              (app/requester/*.tsx and app/auth.tsx / app/otp-verification.tsx are thin re-exports of these)
  theme/      colors.ts — the color palette most requester/auth screens actually import
  navigation/ types.ts — leftover React Navigation param-list types, unused (see known-issues.md)
components/   Shared UI: AnimatedPressable, FadeSlideIn, SuccessPop, RoleCard, CustomTabBar,
              useWizardGuard, plus two Context providers (DriverRequestContext, StoreContext)
services/     auth.ts, verification.ts, storage.ts (real), api.ts (real but unused), index.ts (barrel)
constants/    colors.ts, layout.ts — an older/partially-unused parallel color system (see known-issues.md)
types/        index.ts — the Role union type ('requester' | 'driver' | 'dispatcher')
utils/        index.ts — a single hapticFeedback() helper
hooks/        empty
assets/       images (logo, icon, onboarding art, product photos)
```

## Screen re-export pattern

Two areas of the app (`app/auth.tsx` / `app/otp-verification.tsx`, and all
of `app/requester/*.tsx`) are one-line files that just re-export a real
implementation from `src/screens/`:

```ts
// app/auth.tsx
export { default } from '@/src/screens/AuthScreen';
```

This keeps the route file (which expo-router requires to live at an exact
path) separate from the component implementation. `app/driver/**` does not
follow this pattern — those screens are implemented directly in `app/driver/`.

## Running the project

```bash
npm install
npx expo start        # then press w for web, or scan the QR code for a device
```

- `npm run web` — web only.
- `npm run android` / `npm run ios` — native, requires a simulator/emulator or device.
- `npm run reset-project` — Expo's built-in "move starter code aside" script; not something you'd normally run on this project since it's already well past the starter template.

## App identity (`app.json`)

- Name/slug: **Lifeline**, scheme `lifeline` (for deep links), version `1.0.0`.
- Icon/splash use `assets/images/Lifeline_logo.png` on a `#101828` dark-navy background (matches the inline splash screen styling in `app/index.tsx`).
- Android package: `com.oluwaseun_123.lifeline`. iOS: tablet support enabled.
- Web build output: `static`.
- Plugins: `expo-router`, `expo-splash-screen` (configured), `expo-secure-store`, `expo-location`.
- EAS project ID is set under `extra.eas`, owner `oluwaseun_123` — the project has EAS build configured, though whether it's actually been built/deployed isn't determinable from the repo alone.
