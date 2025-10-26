# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Artbase Tokyo is a Next.js application that displays exhibition information for art museums in Tokyo. It fetches exhibition data from Google Cloud Firestore and displays them grouped by museum/venue.

## Development Commands

### Package Manager
This project uses **pnpm** as the package manager.

### Common Commands
- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build production bundle with Turbopack
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint and auto-fix issues
- `pnpm lint:fix` - Run ESLint without auto-fix
- `pnpm typecheck` - Run TypeScript type checking without emitting files
- `pnpm format` - Check code formatting with Prettier
- `pnpm format:fix` - Auto-format code with Prettier

### Pre-commit Hooks
The project uses **lefthook** for Git hooks. On every commit, the following checks run automatically:
1. Lint (with auto-fix and staging)
2. Format (with auto-fix and staging)
3. Type checking

## Architecture

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
├── app/                          # Next.js App Router
│   ├── _components/              # Private components (not routes)
│   │   └── TopPageSection.tsx    # Main exhibition display component
│   ├── layout.tsx                # Root layout with fonts
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── components/ui/                # Reusable UI components (shadcn/ui)
│   ├── badge.tsx
│   └── card.tsx
├── lib/                          # Utility libraries
│   ├── firestore.ts              # Firestore client instance
│   └── utils.ts                  # General utilities
└── schema/                       # Type definitions and schemas
    └── exhibition.ts             # Exhibition and Museum types
```

### Key Patterns

#### Firestore Authentication
The application uses **Application Default Credentials (ADC)** for Google Cloud authentication. No explicit credentials are passed in code. See `src/lib/firestore.ts` for implementation details.

#### Data Flow
1. **RawExhibition**: Firestore document format with Timestamp objects
2. **Exhibition**: Application format with ISO date strings (YYYY-MM-DD)
3. **Museum**: Grouped exhibitions by venue name

The `convertToMuseum` helper function in `TopPageSection.tsx` transforms flat Exhibition arrays into Museum-grouped structure for display.

#### Date Handling
- Firestore stores dates as `Timestamp` objects
- Application converts to ISO date strings using `TZDate` with 'Asia/Tokyo' timezone
- Active exhibitions are filtered by `endDate >= now`

#### Type Safety
- All Firestore data is validated with Zod schemas
- Use `satisfies` operator for type checking without widening types
- Strict TypeScript mode enabled

### Font Configuration
The app uses two Google Fonts:
- **Ubuntu**: Latin characters (400, 700)
- **Noto Sans JP**: Japanese characters (400, 700)

Both are configured as CSS variables in the root layout.

### Path Aliases
- `@/*` maps to `src/*` (configured in tsconfig.json)

## Deployment

The project is configured for containerized deployment:
- **Output**: Standalone mode (Next.js standalone output)
- **Dockerfile**: Multi-stage build optimized for production
- **Port**: 3000
- Uses pnpm for dependency management in container

## Code Quality

### Linting & Formatting
- ESLint with Next.js TypeScript config
- Prettier integration (conflicts disabled via eslint-config-prettier)
- Auto-fix on commit via lefthook

## Coding Conventions

### TypeScript Guidelines

1. Nomenclature

- Use `PascalCase` for classes.
- Use `camelCase` for variables, functions, and methods.
- Use `UPPERCASE` for environment variables.
- Start each function with a verb.
- Use verbs for boolean variables. Example: `isLoading`, `hasError`, `canDelete`, etc.
- Use complete words instead of abbreviations and correct spelling.
- Except for standard abbreviations like API, URL, etc.

2. Type Annotations

- All exported functions, variables, and components must have explicit type annotations.
- Avoid using `any` unless absolutely necessary and justified with a comment.
- Use `unknown` instead of `any` when the type is not known at compile time.

3. Interfaces and Types

- Prefer `interface` over `type` for object shapes and public APIs.
- Use `type` for unions, intersections, and utility types.
- Extend interfaces for shared structures instead of duplicating properties.

4. Strictness

- The project must enable strict mode in `tsconfig.json`:

```json
{
    "compilerOptions": {
        "strict": true
    }
}
```
- No disabling of strict options unless discussed and documented.

5. Utility Types

- Use built-in utility types (`Partial`, `Pick`, `Omit`, `Record`, etc.) for type transformations.
- Prefer `Readonly` and `ReadonlyArray` for immutable data structures.

6. Enum Usage

- Avoid using `enum` unless interoperability with other systems or libraries requires it.
- Prefer union string literal types for simple cases:
```typescript
type ButtonVariant = 'primary' | 'secondary' | 'danger';
```

7. Type Inference

- Leverage TypeScript's type inference for local variables where the type is obvious.
- For function parameters and return types, always specify types explicitly.

8. Third-Party Types

- Always install and use type definitions for third-party libraries (`@types/*`).
- Do not use untyped libraries unless absolutely necessary and with team approval.

9. Error Handling

- Always handle possible `null` and `undefined` values explicitly.
- Use `Optional Chaining (?.)` and `Nullish Coalescing (??)` where appropriate.

10. Function Implementation

- If it returns a boolean, use `isX` or `hasX`, `canX`, etc.
- If it doesn't return anything, use `executeX` or `saveX`, etc.
- Use higher-order functions (map, `filter`, `reduce`, etc.) to avoid function nesting.
- Use arrow functions for simple functions (less than 3 instructions).
- Use named functions for non-simple functions.
- Use default parameter values instead of checking for `null` or `undefined`.
- Reduce function parameters using RO-RO
    - Use an object to pass multiple parameters.
    - Use an object to return results.
    - Declare necessary types for input arguments and output.

11. Class Implementation

- Follow SOLID principles.
- Prefer composition over inheritance.
- Declare interfaces to define contracts.
- Write small classes with a single purpose.
    - Less than 200 instructions.
    - Less than 10 public methods.
    - Less than 10 properties.

### React Guidelines

1. Component Structure

- Use PascalCase for component names
- Use functional components with hooks. Avoid class components unless there is a strong justification.
- Each component should have a single responsibility.

2. State Management

- Use React's built-in hooks (`useState`, `useReducer`, `useContext`) for local state.
- Use jotai for global state.
- Avoid prop drilling by using context or global state where appropriate.

3. Props and Types

- Define prop types using TypeScript interfaces.
- All props must be explicitly typed.
- Use default values for optional props where appropriate.

4. Side Effects

- Use `useEffect` for side effects. Clean up effects when necessary to prevent memory leaks.
- Avoid unnecessary dependencies in effect dependency arrays.

5. Performance Optimization

- Use `React.memo` to prevent unnecessary re-renders of pure components.
- Use `useCallback` and `useMemo` to memoize functions and values passed as props.
- Split large components into smaller, reusable components.

6. JSX and Styling

- Use JSX syntax in `.tsx` files only.
- Use TailwindCSS utility classes for styling.
- Use `clsx` as composition utilities for conditional class names.

7. Accessibility

- Ensure all interactive elements are accessible (e.g., proper roles, aria attributes).
- Use semantic HTML wherever possible.

### Vitest Guidelines

1. Test Structure

- Use `describe` blocks to group related tests for a single component or module.
- Name test cases with `test` followed by a clear, descriptive statement of the expected behavior.
- Follow the AAA pattern for each test:
    - **Arrange**: Set up test conditions and inputs.
    - **Act**: Execute the behavior being tested.
    - **Assert**: Verify the expected outcomes.

2. Best Practices

    1. Focus on Critical Functionality
        - Prioritize tests for business logic, utility functions, and core application flows.
        - Ensure that critical paths are always covered by tests.

    2. Dependency Mocking
        - Always mock external dependencies before importing the module under test using `vi.mock()`.
        - Use spies (`vi.spyOn`) for monitoring function calls when full mocking is unnecessary.

    3. Comprehensive Data Scenarios
        - Test with a variety of input scenarios, including:
            - Valid inputs (expected use cases)
            - Invalid inputs (error or edge cases)
            - Boundary values (minimum/maximum, empty/null/undefined)

    4. Edge Case Coverage

        - Include tests for:
            - `undefined`, `null`, and unexpected data types.
            - Empty arrays, objects, or strings.
            - Error handling and exception cases.

### React Component Test Guidelines

1. Testing Library Best Practices

- Use queries in this order:
    1. `getByRole` (most accessible)
    2. `getByLabelText`
    3. `getByPlaceholderText`
    4. `getByText`
    5. `getByDisplayValue`
    6. `getByAltText`
    7. `getByTitle`
    8. `getByTestId` (last resort)
- Prefer `@testing-library/user-event` over `fireEvent`. (User-Centric Testing)
- Verify DOM roles and ARIA attributes where applicable
- Follow the Arrange-Act-Assert convention.

2. Component Rendering

- Test both presentational and behavioral aspects:
    - Rendering with different props
    - User interactions (clicks, inputs, etc.)
    - Conditional rendering
- Mock external dependencies using `vi.fn()` and `vi.mock()`

3. Test Data Management

- Create reusable test data factories
- Keep test data within the test file unless shared across multiple tests

4. Performance Optimization

- Use `vi.spyOn()` instead of full module mocks when possible
- Clean up resources after tests using `afterEach(cleanup)`
- Use `vi.resetAllMocks()` in `afterEach` to avoid test pollution

5. Assertion Guidelines

- Focus on observable behavior rather than implementation details
- Verify DOM changes rather than state changes
- Use meaningful custom error messages in assertions
