# UIMP Frontend Testing Guide

## Overview

This document outlines the comprehensive testing strategy implemented for the UIMP (Unified Internship & Mentorship Portal) frontend application. Our testing approach ensures reliability, accessibility, and maintainability of the user interface.

## Testing Stack

- **Testing Framework**: Jest
- **React Testing**: React Testing Library
- **User Interactions**: @testing-library/user-event
- **DOM Assertions**: @testing-library/jest-dom
- **Test Environment**: jsdom

## Test Categories

### 1. Unit Tests

**Location**: `src/components/**/__tests__/`

**Purpose**: Test individual components in isolation

**Coverage**:
- ✅ UI Components (Button, Input, Badge, ErrorState, EmptyState)
- ✅ Form Components (LoginForm, SignupForm, ApplicationForm)
- ✅ Feature Components (ApplicationCard, FeedbackCard)

**Example**:
```typescript
// Button.test.tsx
it('handles click events', () => {
  const handleClick = jest.fn()
  render(<Button onClick={handleClick}>Click me</Button>)
  
  fireEvent.click(screen.getByRole('button'))
  expect(handleClick).toHaveBeenCalledTimes(1)
})
```

### 2. Integration Tests

**Location**: `src/__tests__/integration/`

**Purpose**: Test complete user workflows and component interactions

**Coverage**:
- ✅ Authentication Flow (Login/Signup)
- ✅ Application Management Flow (Create/Edit/View)
- ✅ Form Validation and Error Handling

**Example**:
```typescript
// ApplicationFlow.test.tsx
it('allows user to create a new application end-to-end', async () => {
  const user = userEvent.setup()
  render(<ApplicationForm mode="create" />)
  
  await user.type(screen.getByLabelText(/company/i), 'Google')
  await user.click(screen.getByRole('button', { name: /create/i }))
  
  await waitFor(() => {
    expect(mockCreate).toHaveBeenCalled()
  })
})
```

### 3. Accessibility Tests

**Location**: `src/__tests__/accessibility/`

**Purpose**: Ensure WCAG compliance and screen reader compatibility

**Coverage**:
- ✅ ARIA Labels and Roles
- ✅ Keyboard Navigation
- ✅ Focus Management
- ✅ Screen Reader Support
- ✅ Color Contrast Independence

**Example**:
```typescript
// AccessibilityTests.test.tsx
it('associates error messages with input', () => {
  render(<Input label="Email" error="Invalid email" />)
  const input = screen.getByLabelText('Email')
  
  expect(input).toHaveAttribute('aria-invalid', 'true')
  expect(input).toHaveAttribute('aria-describedby')
})
```

## Test Configuration

### Jest Configuration (`jest.config.js`)

```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
}

module.exports = createJestConfig(customJestConfig)
```

### Test Setup (`jest.setup.js`)

Key mocks and configurations:
- Next.js router and navigation
- Window APIs (matchMedia, IntersectionObserver)
- Global fetch and storage APIs
- React Testing Library DOM matchers

## Running Tests

### Available Scripts

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests in CI mode
npm run test:ci
```

### Test Execution

```bash
# Run specific test file
npm test Button.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="login"

# Run tests for specific directory
npm test src/components/ui

# Run tests with verbose output
npm test -- --verbose
```

## Test Patterns and Best Practices

### 1. Component Testing Pattern

```typescript
describe('ComponentName', () => {
  // Test rendering
  it('renders with required props', () => {
    render(<Component requiredProp="value" />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })

  // Test interactions
  it('handles user interactions', async () => {
    const user = userEvent.setup()
    const mockHandler = jest.fn()
    
    render(<Component onAction={mockHandler} />)
    await user.click(screen.getByRole('button'))
    
    expect(mockHandler).toHaveBeenCalled()
  })

  // Test edge cases
  it('handles edge cases gracefully', () => {
    render(<Component data={null} />)
    expect(screen.getByText('No data available')).toBeInTheDocument()
  })
})
```

### 2. Form Testing Pattern

```typescript
describe('FormComponent', () => {
  it('validates required fields', async () => {
    const user = userEvent.setup()
    render(<FormComponent />)
    
    await user.click(screen.getByRole('button', { name: /submit/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/required/i)).toBeInTheDocument()
    })
  })

  it('submits valid data', async () => {
    const user = userEvent.setup()
    const mockSubmit = jest.fn()
    
    render(<FormComponent onSubmit={mockSubmit} />)
    
    await user.type(screen.getByLabelText(/field/i), 'valid data')
    await user.click(screen.getByRole('button', { name: /submit/i }))
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(expect.objectContaining({
        field: 'valid data'
      }))
    })
  })
})
```

### 3. Accessibility Testing Pattern

```typescript
describe('Component Accessibility', () => {
  it('has proper ARIA attributes', () => {
    render(<Component />)
    const element = screen.getByRole('button')
    
    expect(element).toHaveAttribute('aria-label')
    expect(element).not.toHaveAttribute('aria-hidden', 'true')
  })

  it('supports keyboard navigation', () => {
    render(<Component />)
    const focusableElements = screen.getAllByRole('button')
    
    focusableElements.forEach(element => {
      expect(element).toHaveAttribute('tabIndex', '0')
    })
  })
})
```

## Mock Strategies

### 1. API Mocks

```typescript
// Mock API calls
jest.mock('@/lib/api', () => ({
  applications: {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}))
```

### 2. Context Mocks

```typescript
// Mock React contexts
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: mockUser,
    login: jest.fn(),
    logout: jest.fn(),
    loading: false,
  }),
}))
```

### 3. Next.js Mocks

```typescript
// Mock Next.js components and hooks
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}))
```

## Coverage Requirements

### Current Coverage Targets

- **Statements**: 70%
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%

### Coverage Reports

```bash
# Generate coverage report
npm run test:coverage

# View coverage in browser
open coverage/lcov-report/index.html
```

## Test Data Management

### Mock Data Utilities

```typescript
// testUtils.ts
export const testUtils = {
  mockUser: {
    id: '1',
    email: 'test@example.com',
    role: 'STUDENT',
    firstName: 'John',
    lastName: 'Doe',
  },
  
  mockApplication: {
    id: '1',
    company: 'Google',
    role: 'Software Engineer',
    status: 'APPLIED',
  },
  
  createMockFeedback: (overrides = {}) => ({
    id: 'f1',
    content: 'Great work!',
    priority: 'HIGH',
    ...overrides,
  }),
}
```

## Debugging Tests

### Common Issues and Solutions

1. **Async Operations**
   ```typescript
   // Use waitFor for async updates
   await waitFor(() => {
     expect(screen.getByText('Updated')).toBeInTheDocument()
   })
   ```

2. **User Events**
   ```typescript
   // Use userEvent for realistic interactions
   const user = userEvent.setup()
   await user.click(button)
   await user.type(input, 'text')
   ```

3. **Query Debugging**
   ```typescript
   // Debug what's in the DOM
   screen.debug()
   
   // Find elements by role
   screen.getByRole('button', { name: /submit/i })
   ```

## Continuous Integration

### GitHub Actions Integration

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm run test:ci
```

## Test Maintenance

### Regular Tasks

1. **Update Snapshots**: `npm test -- --updateSnapshot`
2. **Review Coverage**: Check coverage reports monthly
3. **Refactor Tests**: Keep tests DRY and maintainable
4. **Update Mocks**: Ensure mocks match real API behavior

### Adding New Tests

1. Create test file alongside component
2. Follow naming convention: `ComponentName.test.tsx`
3. Include unit, integration, and accessibility tests
4. Update test documentation

## Performance Testing

### Future Enhancements

- Component rendering performance
- Memory leak detection
- Bundle size impact testing
- Lighthouse CI integration

## Visual Testing

### Future Enhancements

- Storybook integration
- Visual regression testing
- Cross-browser compatibility
- Responsive design validation

## Conclusion

This comprehensive testing strategy ensures the UIMP frontend is reliable, accessible, and maintainable. The test suite covers critical user flows, component functionality, and accessibility requirements, providing confidence in the application's quality and user experience.

For questions or contributions to the testing strategy, please refer to the development team or create an issue in the project repository.