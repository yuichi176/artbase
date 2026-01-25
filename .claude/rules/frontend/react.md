---
paths: src/**/*.{ts,tsx}
---

# React Guidelines

## 1. Component Structure

- Use PascalCase for component names
- Use functional components with hooks. Avoid class components unless there is a strong justification.
- Each component should have a single responsibility.

## 2. State Management

- Use React's built-in hooks (`useState`, `useReducer`, `useContext`) for local state.
- Use jotai for global state.
- Avoid prop drilling by using context or global state where appropriate.

## 3. Props and Types

- Define prop types using TypeScript interfaces.
- All props must be explicitly typed.
- Use default values for optional props where appropriate.

## 4. Side Effects

- Use `useEffect` for side effects. Clean up effects when necessary to prevent memory leaks.
- Avoid unnecessary dependencies in effect dependency arrays.

## 5. Performance Optimization

- Use `React.memo` to prevent unnecessary re-renders of pure components.
- Use `useCallback` and `useMemo` to memoize functions and values passed as props.
- Split large components into smaller, reusable components.

## 6. JSX and Styling

- Use JSX syntax in `.tsx` files only.
- Use TailwindCSS utility classes for styling.
- Use `clsx` as composition utilities for conditional class names.

## 7. Accessibility

- Ensure all interactive elements are accessible (e.g., proper roles, aria attributes).
- Use semantic HTML wherever possible.
