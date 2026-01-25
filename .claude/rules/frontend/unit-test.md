---
paths: src/**/*.test.tsx
---

# React Component Test Guidelines

## 1. Testing Library Best Practices

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

## 2. Component Rendering

- Test both presentational and behavioral aspects:
    - Rendering with different props
    - User interactions (clicks, inputs, etc.)
    - Conditional rendering
- Mock external dependencies using `vi.fn()` and `vi.mock()`

## 3. Test Data Management

- Create reusable test data factories
- Keep test data within the test file unless shared across multiple tests

## 4. Performance Optimization

- Use `vi.spyOn()` instead of full module mocks when possible
- Clean up resources after tests using `afterEach(cleanup)`
- Use `vi.resetAllMocks()` in `afterEach` to avoid test pollution

## 5. Assertion Guidelines

- Focus on observable behavior rather than implementation details
- Verify DOM changes rather than state changes
- Use meaningful custom error messages in assertions
