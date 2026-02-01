# Artlyst

A Next.js app that displays museum exhibition information. It fetches exhibition data from Firestore and groups them by museum/venue.

## Features

- Exhibition listings (current and upcoming)
- Search by venue/exhibition name, filter by venue type and area
- Favorite venues (Free: 1 venue / Pro: unlimited)
- Firebase Authentication (email/password, Google OAuth)

## Tech Stack

- Next.js 15.x (App Router)
- React 19
- TypeScript (strict)
- Tailwind CSS 4.x
- Firestore (@google-cloud/firestore)
- Firebase Auth (firebase / firebase-admin)
- Jotai, Zod, Radix UI

## Getting Started

### 1. Install

```bash
pnpm install
```

### 2. Environment Variables

Set the following in `.env.local`.

#### Client (Firebase Web SDK)

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

#### Server (Firebase Admin SDK)

Authenticate using one of the methods below.

- Option A: Application Default Credentials (recommended)
  - Set ADC via `gcloud auth application-default login`, etc.

- Option B: Explicit environment variables

```
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=
```

### 3. Run

```bash
pnpm dev
```

## Scripts

```bash
pnpm dev        # Dev server (Turbopack)
pnpm build      # Production build (Turbopack)
pnpm start      # Start production server
pnpm lint       # ESLint (auto-fix)
pnpm lint:fix   # ESLint (no auto-fix)
pnpm typecheck  # TypeScript typecheck
pnpm format     # Prettier check
pnpm format:fix # Prettier write
```

## Architecture Notes

- Layering: `page.tsx` → `*-section.tsx` (Server) → `*-presentation.tsx` (Client).
- Server Components read Firestore directly (reads).
- Client Components never read Firestore directly. Mutations go through API Routes.
- Protected pages use `useRequireAuth()` in Client Components.

## Deployment

- Docker-ready (standalone output). See `Dockerfile`.
- Container port is `3000`.
