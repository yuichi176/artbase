# AGENTS

## Key Architecture Pattern (Page/Section/Presentation)
- `page.tsx`: route entry, renders a `*-section` component.
- `*-section.tsx` (Server Component): fetches from Firestore, transforms data, passes props.
- `*-presentation.tsx` (Client Component): UI, interactions, local state; no direct Firestore reads.
- `_components/`: page-specific components; can be server or client.

### Data Fetching Rules
- Server Components read Firestore directly (no API routes for reads).
- Client Components never read Firestore directly.
- Client Components use API routes for all writes/mutations.
- Auth-required routes may have `*-section.tsx` as Client Components.

## Authentication
- Use `AuthInitializer` (root layout) to initialize auth once.
- `useAuth()` must only be called by `AuthInitializer`.
- Use `useRequireAuth()` in protected pages for redirects.
- Read auth state via Jotai atoms when no redirect logic is needed.

## Firestore Guidelines
### Data Modeling
- Use top-level intermediate collections for many-to-many.
- Prefer composite document IDs (e.g., `${userId}_${entityId}`) for uniqueness and fast existence checks.
- Avoid arrays of IDs inside documents.

### Transactions
- Use transactions for check-then-write, atomic updates, and limits.
- All reads must happen before any writes in a transaction.
- Avoid side effects in transactions (no external API calls).
- Transactions are retried; keep them idempotent.

## Frontend Guidelines
### React
- Functional components only; PascalCase names.
- Single responsibility per component.
- Use Jotai for global state.
- Use `useEffect` carefully; clean up side effects.
- Use `React.memo`, `useCallback`, `useMemo` when needed.
- Tailwind CSS for styling; use `clsx` for conditional classes.
- Accessibility: semantic HTML + proper ARIA.

### TypeScript
- Explicit types for all exported functions/variables/components.
- Avoid `any`; prefer `unknown`.
- Prefer `interface` for object shapes; `type` for unions.
- Use full words for names; verbs for booleans (`isX`, `hasX`).
- Avoid `enum` unless required; use string unions.
- Handle `null`/`undefined` explicitly.
- Use RO-RO for multi-parameter functions.

## Testing
### React Component Tests
- Query order: getByRole > getByLabelText > getByPlaceholderText > getByText > getByDisplayValue > getByAltText > getByTitle > getByTestId.
- Use `user-event` over `fireEvent`.
- Arrange-Act-Assert.
- Mock external deps with `vi.mock()` and `vi.fn()`.
- Reset mocks with `vi.resetAllMocks()` and cleanup.

### Vitest
- Use `describe` blocks.
- Test critical paths and edge cases.
- Mock dependencies before importing the module under test.

## Development Commands (pnpm)
- `pnpm dev`, `pnpm build`, `pnpm start`
- `pnpm lint`, `pnpm lint:fix`
- `pnpm typecheck`
- `pnpm format`, `pnpm format:fix`

## Operational Rules
- When learning how to use a library, always use Context7 MCP to retrieve the latest info.
- Prefer fewer changes; keep diffs small and focused.
