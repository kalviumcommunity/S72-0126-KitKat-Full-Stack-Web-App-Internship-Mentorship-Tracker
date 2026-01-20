# Development Standards & Guidelines - UIMP Frontend

## Overview

This document outlines the development standards, coding conventions, and best practices for the UIMP frontend application. Following these guidelines ensures code consistency, maintainability, and team collaboration.

## Table of Contents

1. [Code Style & Formatting](#code-style--formatting)
2. [TypeScript Guidelines](#typescript-guidelines)
3. [React & Next.js Best Practices](#react--nextjs-best-practices)
4. [Component Architecture](#component-architecture)
5. [Form Validation](#form-validation)
6. [Error Handling](#error-handling)
7. [Performance Guidelines](#performance-guidelines)
8. [Accessibility Standards](#accessibility-standards)
9. [Testing Standards](#testing-standards)
10. [Git Workflow](#git-workflow)

---

## Code Style & Formatting

### Prettier Configuration

We use Prettier for consistent code formatting with the following rules:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

### ESLint Rules

Our ESLint configuration enforces:

- **TypeScript strict mode** with comprehensive type checking
- **React best practices** including hooks rules
- **Accessibility standards** with jsx-a11y plugin
- **Import organization** with automatic sorting
- **Code quality rules** preventing common mistakes

### Key Style Guidelines

1. **Line Length**: Maximum 100 characters
2. **Indentation**: 2 spaces (no tabs)
3. **Quotes**: Single quotes for strings, double quotes for JSX attributes
4. **Semicolons**: Always required
5. **Trailing Commas**: ES5 style (objects, arrays, function parameters)

---

## TypeScript Guidelines

### Strict Configuration

We use TypeScript in strict mode with additional checks:

```json
{
  "strict": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "exactOptionalPropertyTypes": true,
  "noImplicitReturns": true,
  "noFallthroughCasesInSwitch": true,
  "noUncheckedIndexedAccess": true
}
```

### Type Definitions

1. **Interface vs Type**: Prefer `interface` for object shapes, `type` for unions/intersections
2. **Explicit Return Types**: Required for exported functions
3. **Generic Constraints**: Use meaningful constraint names
4. **Utility Types**: Leverage built-in utility types (`Pick`, `Omit`, `Partial`, etc.)

### Examples

```typescript
// ✅ Good
interface UserProps {
  id: string;
  name: string;
  email?: string;
}

export function createUser(data: UserProps): Promise<User> {
  // Implementation
}

// ❌ Avoid
function createUser(data: any) {
  // Implementation
}
```

---

## React & Next.js Best Practices

### Component Types

1. **Server Components** (default): Use for data fetching and static content
2. **Client Components**: Use `'use client'` directive for interactivity
3. **Async Server Components**: For data fetching operations

### Component Structure

```typescript
// ✅ Recommended structure
'use client'; // Only if needed

import type { ComponentProps } from 'react';
import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { validateEmail } from '@/lib/validations';

interface MyComponentProps {
  title: string;
  onSubmit: (data: FormData) => void;
}

export function MyComponent({ title, onSubmit }: MyComponentProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Component logic here

  return (
    <div>
      {/* JSX here */}
    </div>
  );
}
```

### Hooks Guidelines

1. **Custom Hooks**: Prefix with `use` and extract reusable logic
2. **Dependencies**: Always include all dependencies in useEffect
3. **Cleanup**: Properly cleanup subscriptions and timers
4. **State Updates**: Use functional updates for state based on previous state

---

## Component Architecture

### File Organization

```
src/
├── components/
│   ├── ui/              # Base UI components
│   ├── forms/           # Form components
│   ├── layout/          # Layout components
│   ├── dashboard/       # Dashboard-specific components
│   └── features/        # Feature-specific components
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and configurations
└── app/                 # Next.js App Router pages
```

### Component Naming

1. **PascalCase** for component names and files
2. **Descriptive names** that indicate purpose
3. **Consistent prefixes** for related components

### Props Design

1. **Interface definitions** for all props
2. **Optional props** with default values
3. **Event handlers** with descriptive names
4. **Children prop** when accepting nested content

```typescript
// ✅ Good props design
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}
```

---

## Form Validation

### Validation Strategy

We use **Zod** for schema validation with our custom `useFormValidation` hook:

```typescript
import { useFormValidation } from '@/hooks/useFormValidation';
import { loginSchema } from '@/lib/validations';

const { values, validation, getFieldProps } = useFormValidation({
  schema: loginSchema,
  initialValues: { email: '', password: '' },
  validateOnChange: true,
  validateOnBlur: true,
});
```

### Validation Components

1. **FormField**: Wrapper with validation states
2. **ValidationIndicator**: Visual feedback for validation status
3. **PasswordStrengthIndicator**: Password complexity feedback

### Best Practices

1. **Real-time validation** with debouncing
2. **Accessible error messages** with proper ARIA attributes
3. **Visual feedback** for validation states
4. **Progressive enhancement** with client-side validation

---

## Error Handling

### Error Boundaries

Implement error boundaries for graceful error handling:

```typescript
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }

    return this.props.children;
  }
}
```

### API Error Handling

1. **Consistent error format** from API responses
2. **User-friendly messages** for different error types
3. **Retry mechanisms** for transient failures
4. **Loading states** during error recovery

---

## Performance Guidelines

### Code Splitting

1. **Route-based splitting** with Next.js App Router
2. **Component-based splitting** with `dynamic()` imports
3. **Library splitting** for large dependencies

### Optimization Techniques

1. **React.memo** for expensive components
2. **useMemo** for expensive calculations
3. **useCallback** for stable function references
4. **Image optimization** with Next.js Image component

### Bundle Analysis

```bash
# Analyze bundle size
npm run build
npm run analyze
```

---

## Accessibility Standards

### WCAG 2.1 AA Compliance

1. **Semantic HTML** elements
2. **Keyboard navigation** support
3. **Screen reader** compatibility
4. **Color contrast** ratios (4.5:1 minimum)
5. **Focus management** in interactive components

### Implementation

```typescript
// ✅ Accessible button
<button
  type="button"
  aria-label="Close dialog"
  aria-describedby="dialog-description"
  onClick={handleClose}
>
  ×
</button>

// ✅ Accessible form field
<div>
  <label htmlFor="email">Email Address</label>
  <input
    id="email"
    type="email"
    aria-describedby="email-error"
    aria-invalid={hasError}
  />
  {hasError && (
    <div id="email-error" role="alert">
      Please enter a valid email address
    </div>
  )}
</div>
```

---

## Testing Standards

### Testing Strategy

1. **Unit Tests**: Individual component testing
2. **Integration Tests**: Component interaction testing
3. **E2E Tests**: User journey testing
4. **Accessibility Tests**: Automated a11y testing

### Testing Tools

- **Jest**: Unit testing framework
- **React Testing Library**: Component testing
- **Playwright**: E2E testing
- **axe-core**: Accessibility testing

---

## Git Workflow

### Branch Naming

- `feature/description` - New features
- `bugfix/description` - Bug fixes
- `hotfix/description` - Critical fixes
- `refactor/description` - Code refactoring

### Commit Messages

Follow conventional commits format:

```
type(scope): description

feat(auth): add password strength indicator
fix(forms): resolve validation error display
docs(readme): update installation instructions
```

### Pre-commit Hooks

Our pre-commit hooks run:

1. **ESLint** with auto-fix
2. **Prettier** formatting
3. **TypeScript** type checking
4. **Spell checking** on changed files

---

## Development Scripts

### Available Commands

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint errors
npm run type-check      # TypeScript type checking
npm run format          # Format with Prettier
npm run format:check    # Check Prettier formatting

# Pre-commit
npm run pre-commit      # Run all quality checks
```

### IDE Setup

1. **VS Code**: Use provided settings and extensions
2. **Format on Save**: Enabled for all file types
3. **Auto Import**: Configured for TypeScript
4. **Error Highlighting**: Real-time error display

---

## Code Review Guidelines

### Review Checklist

- [ ] Code follows style guidelines
- [ ] TypeScript types are properly defined
- [ ] Components are accessible
- [ ] Error handling is implemented
- [ ] Performance considerations addressed
- [ ] Tests are included (when applicable)
- [ ] Documentation is updated

### Review Process

1. **Self-review** before requesting review
2. **Automated checks** must pass
3. **Manual testing** of changes
4. **Accessibility testing** for UI changes
5. **Performance impact** assessment

---

## Troubleshooting

### Common Issues

1. **ESLint Errors**: Run `npm run lint:fix`
2. **TypeScript Errors**: Check `tsconfig.json` and type definitions
3. **Build Failures**: Clear `.next` folder and rebuild
4. **Import Errors**: Verify path aliases in `tsconfig.json`

### Getting Help

1. Check this documentation first
2. Search existing issues in the repository
3. Ask team members for guidance
4. Create detailed issue reports

---

**Last Updated**: Day 5 - Standards & Tooling Implementation  
**Maintained By**: Frontend Team (Gaurav)  
**Version**: 1.0.0