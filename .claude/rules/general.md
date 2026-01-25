# Project Overview

Artlyst is a Next.js application that displays exhibition information for art museums. It fetches exhibition data from Google Cloud Firestore and displays them grouped by museum/venue.

## Key Features
- **Exhibition Listing**: Browse current and upcoming exhibitions grouped by museum/venue
- **Search & Filtering**: Search by venue/exhibition name, filter by venue type, area, museum, and ongoing status
- **Favorite Venues**: Authenticated users can favorite venues (Free plan: 1 venue, Pro plan: unlimited)
- **Authentication**: Firebase Authentication with email/password and Google OAuth

# Deployment

The project is configured for containerized deployment:
- **Output**: Standalone mode (Next.js standalone output)
- **Dockerfile**: Multi-stage build optimized for production
- **Port**: 3000
- Uses pnpm for dependency management in container

# Development Commands

## Package Manager
This project uses **pnpm** as the package manager.

## Common Commands
- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build production bundle with Turbopack
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint and auto-fix issues
- `pnpm lint:fix` - Run ESLint without auto-fix
- `pnpm typecheck` - Run TypeScript type checking without emitting files
- `pnpm format` - Check code formatting with Prettier
- `pnpm format:fix` - Auto-format code with Prettier

## Pre-commit Hooks
The project uses **lefthook** for Git hooks. On every commit, the following checks run automatically:
1. Lint (with auto-fix and staging)
2. Format (with auto-fix and staging)
3. Type checking

# Architecture

### Tech Stack
- **Framework**: Next.js 15.5.4 (App Router)
- **Runtime**: React 19.1.0
- **Language**: TypeScript (strict mode enabled)
- **Styling**: Tailwind CSS 4.x
- **Database**: Google Cloud Firestore (@google-cloud/firestore)
- **Validation**: Zod
- **Date Handling**: @date-fns/tz
- **UI Components**: Radix UI primitives (shadcn/ui style)

### Project Structure
```
src/
├── app/                                   # Next.js App Router
│   ├── (auth)/                            # Authentication routes (signin, signup)
│   ├── (protected)/                       # Protected routes (requires auth)
│   ├── tokyo/exhibitions/                 # Exhibition listing
│   ├── api/                               # API Routes
│   │   └── utils.ts                       # Shared API utilities
│   ├── layout.tsx                         # Root layout with fonts
│   └── globals.css                        # Global styles
├── components/                            # Reusable UI components
│   └── shadcn-ui/                         # shadcn/ui styled components
├── lib/                                   # Utility libraries
│   ├── firestore.ts                       # Firestore client instance
│   ├── firebase-admin.ts                  # Firebase Admin SDK
│   ├── auth/                              # Auth utilities
│   ├── data/                              # Data fetching layer
│   └── utils.ts                           # General utilities
├── schema/                                # Type definitions and schemas
├── hooks/                                 # Custom React hooks
└── store/                                 # Global state (Jotai)
```
