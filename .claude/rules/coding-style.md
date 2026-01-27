# Key Patterns

## Component Architecture Pattern

This project follows a layered component architecture to separate concerns between data fetching, state management, and presentation:

### 1. **Page Components** (`page.tsx`)
- Entry point for each route
- Typically, renders a `*-section` component
- May include route-specific configurations (e.g., `export const dynamic = 'force-dynamic'`)

### 2. **Section Components** (`*-section.tsx`) - **Server Components**
- **Responsibility**: Data fetching and data transformation
- **Location**: Placed in the same directory as `page.tsx`
- **Characteristics**:
    - Server Components by default (may use `'use cache'` directive)
    - Fetch data directly from Firestore (no API routes)
    - Transform raw data (e.g., `RawExhibition` → `Exhibition`)
    - Pass processed data to presentation components
- **Example**: `top-page-section.tsx` fetches exhibitions from Firestore and passes them to `TopPagePresentation`

### 3. **Presentation Components** (`*-presentation.tsx`) - **Client Components**
- **Responsibility**: UI rendering and state management
- **Location**: Placed in the same directory as corresponding section component
- **Characteristics**:
    - Client Components (use `'use client'` directive)
    - Handle user interactions and UI state (filters, search, dialogs, etc.)
    - Manage local state with React hooks
    - Receive data as props from section components
    - Do NOT fetch data directly
- **Example**: `top-page-presentation.tsx` manages filter states and renders museum cards

**Special Case: Authentication-Required Pages**
- For pages that require user authentication (e.g., account settings, protected routes), authentication state is managed using React hooks (`useAuth`, `useRequireAuth`)
- In these cases:
    - Handles authentication checks and redirects
    - Get user-specific data from global state (Jotai atoms)
    - Manages loading states during authentication
- **Example**: `account-page-presentation.tsx` is a Client Component that use user data and handles auth state

### 4. **Page-Specific Components** (`_components/`)
- **Responsibility**: Reusable UI components specific to a page or feature
- **Location**: `_components/` directory within the page route
- **Characteristics**:
    - Can be either Server Components or Client Components
    - Split into appropriate granularity for readability and reusability
    - Used by presentation components or other page-specific components
- **Examples**: `search-input.tsx`, `museum-card.tsx`, `filter-drawer.tsx`

### Data Fetching Rules

1. **Server Components** (`*-section.tsx`):
    - Fetch data directly from Firestore
    - Do NOT use API routes for read operations
    - Perform data transformations (Timestamp → ISO strings, etc.)
    - **Exception**: Authentication-required pages use Client Components for `*-section.tsx` (see Special Case above)

2. **Client Components** (`*-presentation.tsx`, `_components/`):
    - Do NOT fetch data directly from Firestore
    - Use API routes for all write/update operations (POST, PATCH, DELETE)
    - Receive data via props from parent Server Components (or parent Client Components for auth-required pages)

3. **Client Components in Authentication-Required Pages** (`*-section.tsx` in protected routes):
    - Use React hooks to access authentication state (e.g., `useAuth`, `useRequireAuth`)
    - Fetch user-specific data from global state (Jotai atoms) or API routes
    - Handle authentication checks and redirects
    - Pass data to presentation components

4. **API Routes** (`app/api/`):
    - Handle data mutations (create, update, delete)
    - Handle authenticated read operations for user-specific data
    - Called from Client Components
    - Verify authentication tokens
    - Validate request data with Zod schemas

### Example Flow

**Public Pages (Standard Flow)**
```
page.tsx (Server)
  ↓
*-section.tsx (Server Component)
  ├─ Fetch from Firestore
  ├─ Transform data
  ↓
*-presentation.tsx (Client Component)
  ├─ Manage UI state
  ├─ Handle user interactions
  ├─ Call API routes for mutations
  ↓
_components/*.tsx (Server/Client Components)
  └─ Render specific UI elements
```

## Firestore Authentication
The application uses **Application Default Credentials (ADC)** for Google Cloud authentication. No explicit credentials are passed in code. See `src/lib/firestore.ts` for implementation details.

## Client-Side Authentication

The application uses Firebase Authentication for client-side authentication with a centralized initialization pattern.

### Architecture Overview

```
Root Layout (app/layout.tsx)
  └─ AuthInitializer (components/auth/auth-initializer.tsx)
      └─ useAuth() hook
          ├─ Sets up onAuthStateChanged listener (once)
          ├─ Updates Jotai atoms (firebaseUserAtom, userAtom, etc.)
          └─ Fetches user data from Firestore via API

Protected Pages & Components
  ├─ useRequireAuth() - For route protection with redirect
  │   └─ Reads from atoms (isAuthenticatedAtom, authLoadingAtom)
  │
  └─ Direct atom access - For reading auth state
      └─ useAtomValue(firebaseUserAtom | userAtom | isAuthenticatedAtom)
```

### Key Components and Hooks

#### 1. **AuthInitializer** (`src/components/auth/auth-initializer.tsx`)
- **Responsibility**: Initialize authentication state globally
- **Location**: Mounted in root layout (`app/layout.tsx`)
- **Behavior**:
  - Calls `useAuth()` once to set up Firebase auth listener
  - Runs on application mount
  - Returns `null` (no UI rendering)

#### 2. **useAuth** (`src/hooks/use-auth.ts`)
- **Responsibility**: Set up Firebase authentication listener and sync state to Jotai atoms
- **Usage**: Should ONLY be called by `AuthInitializer`
- **Behavior**:
  - Registers `onAuthStateChanged` listener
  - Updates Jotai atoms: `firebaseUserAtom`, `userAtom`, `authLoadingAtom`, `authErrorAtom`
  - Fetches user data from Firestore when authenticated
  - Returns auth state for the caller (but external components should use atoms directly)

**⚠️ DO NOT call `useAuth` in components or pages** - this would create duplicate auth listeners.

#### 3. **useRequireAuth** (`src/hooks/use-require-auth.ts`)
- **Responsibility**: Protect routes by redirecting unauthenticated users
- **Usage**: Call in protected page components or layouts
- **Behavior**:
  - Reads authentication state from atoms (`isAuthenticatedAtom`, `authLoadingAtom`)
  - Redirects to `/signin` if not authenticated
  - Does NOT set up auth listeners
- **Example**:
  ```tsx
  'use client'

  export function AccountPagePresentation() {
    const { loading, isAuthenticated } = useRequireAuth('/account')

    if (loading) return <LoadingSpinner />
    if (!isAuthenticated) return null // Redirect in progress

    return <AccountContent />
  }
  ```

#### 4. **Direct Atom Access**
- **Responsibility**: Read authentication state in any client component
- **Usage**: When you need auth state but don't need redirect logic
- **Available Atoms**:
  - `firebaseUserAtom` - Firebase Auth user object
  - `userAtom` - Application user data from Firestore
  - `isAuthenticatedAtom` - Boolean authentication status
  - `authLoadingAtom` - Loading state during initial auth check
  - `userDisplayNameAtom` - Computed display name
  - `linkedProvidersAtom` - Linked authentication providers
- **Example**:
  ```tsx
  'use client'

  import { useAtomValue } from 'jotai'
  import { userAtom } from '@/store/auth'

  export function UserProfile() {
    const user = useAtomValue(userAtom)

    if (!user) return null
    return <div>{user.displayName}</div>
  }
  ```

### Authentication State Management Rules

#### ✅ DO:
- Use `AuthInitializer` in root layout to initialize auth state once
- Use `useRequireAuth()` in protected pages/components for automatic redirect
- Use `useAtomValue(authAtom)` to read auth state in any component
- Keep auth listener registration centralized in `AuthInitializer`

#### ❌ DO NOT:
- Call `useAuth()` directly in components (except `AuthInitializer`)
- Create additional `onAuthStateChanged` listeners
- Duplicate auth initialization logic
- Use `useAuth()` when you only need to read auth state

### Authentication Flow

#### Initial Load
```
1. App mounts
2. AuthInitializer calls useAuth()
3. useAuth() sets up onAuthStateChanged listener
4. Firebase resolves auth state
5. Atoms updated (firebaseUserAtom, userAtom, etc.)
6. authLoadingAtom set to false
7. All components receive updated auth state
```

#### Protected Route Access
```
1. User navigates to protected route
2. Component calls useRequireAuth()
3. useRequireAuth reads isAuthenticatedAtom
4. If not authenticated → redirect to /signin
5. If authenticated → render protected content
```

### Benefits of This Architecture

- **Single Source of Truth**: One auth listener updates global state
- **Performance**: No duplicate listeners or unnecessary re-renders
- **Simplicity**: Components read from atoms, no complex auth logic
- **Maintainability**: Auth initialization centralized in one place
- **Type Safety**: All auth state is typed through Jotai atoms

## Schema Organization

The project separates type definitions into **DB layer** and **UI layer** to maintain clear boundaries between Firestore types and application types.

### Directory Structure

```
src/schema/
├── db/              # Database layer types (Firestore)
└── ui/              # UI layer types (Application)
```

### DB Layer Types (`src/schema/db/`)

- **Purpose**: Define Firestore document schemas with native Firestore types
- **Characteristics**:
  - Contains `Timestamp` objects for date/time fields
  - Matches the exact structure stored in Firestore
  - Used in Server Components and API routes for database operations
- **Naming Convention**: `RawExhibition`, `RawUser`, `RawBookmark`, etc.

### UI Layer Types (`src/schema/ui/`)

- **Purpose**: Define serializable application types for Client Components
- **Characteristics**:
  - Uses ISO date strings or JavaScript `Date` objects instead of `Timestamp`
  - Fully serializable (can be passed through Server/Client boundary)
  - Used in Client Components and as props
  - May include computed fields (e.g., `ongoingStatus`)
- **Naming Convention**: `Exhibition`, `User`, `Bookmark`, etc. (no "Raw" prefix)

### Type Conversion Responsibilities

1. **Server Components** (`*-section.tsx`):
   - Import from `src/schema/db/` for Firestore reads
   - Transform DB types → UI types before passing to Client Components
   - Convert `Timestamp` → ISO strings using `TZDate` with 'Asia/Tokyo' timezone

2. **API Routes** (`app/api/`):
   - Import from `src/schema/db/` for Firestore writes
   - Import from `src/schema/ui/` for request/response validation
   - Convert UI types → DB types when writing to Firestore

3. **Client Components**:
   - Only import from `src/schema/ui/`
   - Never import or use DB layer types
   - Work exclusively with serializable types

### Benefits of This Approach

- **Type Safety**: Enforces correct type usage at compile time
- **Clear Boundaries**: Separates concerns between database and application layers
- **Serializability**: Prevents non-serializable types from crossing Server/Client boundary
- **Maintainability**: Changes to database schema are isolated to DB layer
- **Flexibility**: UI types can include computed fields without affecting database schema

## Data Flow & Type Transformations

### Read Operations (Server Components)
1. **Firestore Document** (`RawExhibition`, `RawUser`, etc.)
    - Contains Firestore-specific types like `Timestamp`
    - Raw data structure from database

2. **Data Transformation** (in `*-section.tsx`)
    - Convert `Timestamp` → ISO date strings or JavaScript `Date` objects
    - Transform raw types to application types
    - Group/aggregate data as needed (e.g., exhibitions → museums)

3. **Application Types** (`Exhibition`, `User`, `Museum`, etc.)
    - Clean, serializable data structures
    - Compatible with Client Components (no Firestore types)
    - Passed as props to presentation components

### Write Operations (Client Components → API Routes)
1. **Client Component** triggers mutation (button click, form submit)
2. **API Route** receives request
    - Verifies authentication token
    - Validates request data with Zod schemas
    - Transforms application types to Firestore types if needed
    - Writes to Firestore
3. **Response** returned to client
    - Client updates UI (optimistic updates, refetch, etc.)

### Example: Exhibition Data Flow
```
Firestore (RawExhibition with Timestamp)
  ↓
top-page-section.tsx
  ├─ Convert Timestamp → ISO string (YYYY-MM-DD)
  ├─ Add computed fields (ongoingStatus)
  ├─ Group by museum
  ↓
Exhibition[] / Museum[] (serializable)
  ↓
top-page-presentation.tsx
  └─ Render with client-side filtering/search
```

## Date Handling
- Firestore stores dates as `Timestamp` objects
- Application converts to ISO date strings using `TZDate` with 'Asia/Tokyo' timezone
- Active exhibitions are filtered by `endDate >= now`

## Type Safety
- All Firestore data is validated with Zod schemas
- Use `satisfies` operator for type checking without widening types
- Strict TypeScript mode enabled

# Font Configuration
The app uses two Google Fonts:
- **Ubuntu**: Latin characters (400, 700)
- **Noto Sans JP**: Japanese characters (400, 700)

Both are configured as CSS variables in the root layout.

# Path Aliases
- `@/*` maps to `src/*` (configured in tsconfig.json)

## Styling

### className Composition
- Use the `cn` utility function from `@/utils/shadcn` for combining class names
- Import: `import { cn } from '@/utils/shadcn'`
- **Do NOT** use string concatenation or template literals for className composition
- **Example**:
  ```tsx
  // Good
  <div className={cn('base-class', condition && 'conditional-class', className)} />

  // Bad
  <div className={`base-class ${condition ? 'conditional-class' : ''} ${className}`} />
  ```

## Code Quality

# Linting & Formatting
- ESLint with Next.js TypeScript config
- Prettier integration (conflicts disabled via eslint-config-prettier)
- Auto-fix on commit via lefthook
