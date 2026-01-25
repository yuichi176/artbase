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
  ├─ Add computed fields (isOngoing)
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

## Code Quality

# Linting & Formatting
- ESLint with Next.js TypeScript config
- Prettier integration (conflicts disabled via eslint-config-prettier)
- Auto-fix on commit via lefthook
