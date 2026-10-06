# Lifeline — Project Documentation

Lifeline is an Expo Router (React Native + web) app for emergency medical
services: requesting an ambulance, ordering medical supplies for delivery,
and — on the provider side — registering and running an ambulance or
medical-supply business.

This folder documents the whole project as it exists today. It is written
from reading the actual code (not from a spec), so it calls out mock data,
dead ends, and duplication as plainly as working features.

## Start here

| Doc | Covers |
|---|---|
| [total-documentation.md](total-documentation.md) | The whole app in one continuous read — architecture, all three role flows end to end, data model, cross-role comparison |
| [tech-stack.md](tech-stack.md) | Framework, key libraries, `app.json` config, project structure |
| [requester-flow.md](requester-flow.md) | "I need emergency help" — ambulance requests and medical supply orders |
| [driver-flow.md](driver-flow.md) | "I provide emergency services" — provider login/signup, registration wizard, ambulance & supplier dashboards |
| [dispatcher-flow.md](dispatcher-flow.md) | "I Help dispatch Medical Supplies" — courier registration wizard, delivery dashboard, earnings flow |
| [shared-screens.md](shared-screens.md) | Account/settings screens shared across roles (profile, contacts, payments, etc.) |
| [services-and-data.md](services-and-data.md) | What's a real service vs. hardcoded mock data; how auth/session storage works |
| [known-issues.md](known-issues.md) | Orphaned code, duplicated screens, broken/disconnected navigation paths — a punch list for cleanup |
| [improvement.md](improvement.md) | Prioritized fix/build list — correctness, security, missing integrations, consistency, testing |
| [ui-improvement.md](ui-improvement.md) | Pure design/UX audit — visual consistency, motion, forms, and what's already working well |

## The three roles, at a glance

`app/main.tsx` is the single fork point for every user, right after onboarding:

- **"I need emergency help"** (`requester`) → `/auth` → OTP → `/requester` tabs. See [requester-flow.md](requester-flow.md).
- **"I provide emergency services"** (`driver`) → `/auth` (with `redirectTo=/driver`) → OTP → either straight to a dashboard (Log In) or the registration wizard (Sign Up). See [driver-flow.md](driver-flow.md).
- **"I Help dispatch Medical Supplies"** (`dispatcher`) → `/auth` (with `redirectTo=/dispatcher/ride-details`) → OTP → either straight to the delivery dashboard (Log In) or the registration wizard (Sign Up). See [dispatcher-flow.md](dispatcher-flow.md).

## The one big caveat

**There is no backend.** `services/api.ts` defines a real `fetch` wrapper
pointed at a placeholder domain (`api.lifeline.app`) but nothing in the app
ever calls it. Every payment, OTP code, price negotiation, and dispatch
match is simulated locally with `setTimeout`s and hardcoded mock data. The
only things that are genuinely persisted (via `localStorage` on web /
`expo-secure-store` on native) are the provider's session token and
verification record — see [services-and-data.md](services-and-data.md) for
the full breakdown of what's real.
