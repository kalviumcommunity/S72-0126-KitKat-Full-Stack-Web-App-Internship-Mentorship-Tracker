# Error Handling Guide

## Overview
This guide provides comprehensive information on error handling and empty states in the UIMP application.

## Table of Contents
1. [Error State Components](#error-state-components)
2. [Empty State Components](#empty-state-components)
3. [Inline Feedback](#inline-feedback)
4. [Toast Notifications](#toast-notifications)
5. [Error Boundaries](#error-boundaries)
6. [Best Practices](#best-practices)
7. [Common Patterns](#common-patterns)

## Error State Components

### ErrorState Component
**File**: `components/ui/ErrorState.tsx`

Generic error display for full-page errors.

```typescript
import { ErrorState } from '@/components/ui/ErrorState';

<ErrorState
  title="Something went wrong"
  message="An error occurred while loading this content."
  error={error.message}
  onRetry={() => refetch()}
  onGoBack={() => router.back()}
  showDetails={process.env.NODE_ENV === 'development'}
  icon="⚠️"
/>
```

### Specific Error Variants

#### NetworkErrorState
For network connectivity issues:
```typescript
import { NetworkErrorState } from '@/components/ui/ErrorState';

<NetworkErrorState onRetry={() => refetch()} />
```

#### NotFoundErrorState
For 404 errors:
```typescript
import { NotFoundErrorState } from '@/components/ui/ErrorState';

<NotFoundErrorState onGoBack={() => router.back()} />
```

#### UnauthorizedErrorState
For authentication errors:
```typescript
import { UnauthorizedErrorState } from '@/components/ui/ErrorState';

<UnauthorizedErrorState onGoBack={() => router.push('/login')} />
```

#### ServerErrorState
For 500 errors:
```typescript
import { ServerErrorState } from '@/components/ui/ErrorState';

<ServerErrorState onRetry={() => refetch()} />
```

## Empty State Components

### EmptyState Component
**File**: `components/ui/EmptyState.tsx`

Generic empty state display.

```typescript
import { EmptyState } from '@/components/ui/EmptyState';

<EmptyState
  title="No items found"
  description="There are no items to display at this time."
  icon="📭"
  actionLabel="Create Item"
  actionHref="/create"
  secondaryActionLabel="Learn More"
  secondaryActionHref="/docs"
/>
```

### Specific Empty State Variants

#### NoApplicationsState
```typescript
import { NoApplicationsState } from '@/components/ui/EmptyState';

<NoApplicationsState />
```

#### NoFeedbackState
```typescript
import { NoFeedbackState } from '@/components/ui/EmptyState';

<NoFeedbackState />
```

#### NoNotificationsState
```typescript
import { NoNotificationsState } from '@/components/ui/EmptyState';

<NoNotificationsState />
```

#### NoSearchResultsState
```typescript
import { NoSearchResultsState } from '@/components/ui/EmptyState';

<NoSearchResultsState onClear={() => clearFilters()} />
```

#### NoStudentsState
```typescript
import { NoStudentsState } from '@/components/ui/EmptyState';

<NoStudentsState />
```

#### NoMentorsState
```typescript
import { NoMentorsState } from '@/components/ui/EmptyState';

<NoMentorsState />
```

## Inline Feedback

### Inline Error Components
**File**: `components/ui/InlineError.tsx`

For form errors and inline feedback.

#### InlineError
```typescript
import { InlineError } from '@/components/ui/InlineError';

<InlineError message="Please enter a valid email address" />
```

#### InlineWarning
```typescript
import { InlineWarning } from '@/components/ui/InlineError';

<InlineWarning message="This action cannot be undone" />
```

#### InlineInfo
```typescript
import { InlineInfo } from '@/components/ui/InlineError';

<InlineInfo message="Your changes have been saved automatically" />
```

#### InlineSuccess
```typescript
import { InlineSuccess } from '@/components/ui/InlineError';

<InlineSuccess message="Application submitted successfully" />
```

## Toast Notifications

### Toast System
**Files**: 
- `components/ui/Toast.tsx`
- `contexts/ToastContext.tsx`

Temporary notification messages.

### Setup
Wrap your app with ToastProvider:

```typescript
// app/layout.tsx
import { ToastProvider } from '@/contexts/ToastContext';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
```

### Usage

```typescript
'use client';

import { useToast } from '@/contexts/ToastContext';

export function MyComponent() {
  const toast = useToast();

  const handleSuccess = () => {
    toast.success('Success!', 'Your changes have been saved.');
  };

  const handleError = () => {
    toast.error('Error!', 'Something went wrong.');
  };

  const handleWarning = () => {
    toast.warning('Warning!', 'Please review your input.');
  };

  const handleInfo = () => {
    toast.info('Info', 'New features are available.');
  };

  // Custom toast
  const handleCustom = () => {
    toast.showToast('success', 'Custom', 'Custom message', 3000);
  };

  return (
    <div>
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={handleError}>Show Error</button>
      <button onClick={handleWarning}>Show Warning</button>
      <button onClick={handleInfo}>Show Info</button>
    </div>
  );
}
```

## Error Boundaries

### Global Error Boundary
**File**: `app/global-error.tsx`

Catches errors at the root level.

```typescript
// Automatically used by Next.js
// Displays when an unhandled error occurs
```

### Page-Level Error Boundaries
**File**: `app/[route]/error.tsx`

Catches errors within a specific route.

```typescript
'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Page error:', error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

### Component-Level Error Boundaries
Use React Error Boundary component:

```typescript
import { ErrorBoundary } from '@/components/error/ErrorBoundary';

<ErrorBoundary fallback={<ErrorState />}>
  <MyComponent />
</ErrorBoundary>
```

## Best Practices

### 1. Always Handle Errors
```typescript
// Good
try {
  const response = await api.call();
  if (!response.success) {
    toast.error('Error', response.error);
    return;
  }
  // Handle success
} catch (error) {
  toast.error('Error', 'An unexpected error occurred');
}

// Bad
const response = await api.call();
// No error handling
```

### 2. Provide Actionable Error Messages
```typescript
// Good
toast.error(
  'Upload Failed',
  'File size exceeds 5MB. Please choose a smaller file.'
);

// Bad
toast.error('Error', 'Upload failed');
```

### 3. Use Appropriate Error Types
```typescript
// Network error
<NetworkErrorState onRetry={refetch} />

// Not found
<NotFoundErrorState onGoBack={goBack} />

// Unauthorized
<UnauthorizedErrorState onGoBack={goToLogin} />

// Server error
<ServerErrorState onRetry={refetch} />
```

### 4. Show Loading States
```typescript
if (isLoading) return <LoadingState />;
if (error) return <ErrorState error={error} />;
if (!data) return <EmptyState />;
return <DataDisplay data={data} />;
```

### 5. Log Errors for Debugging
```typescript
try {
  // Operation
} catch (error) {
  console.error('Operation failed:', {
    error,
    context: 'user-action',
    timestamp: new Date().toISOString(),
  });
  toast.error('Error', 'Operation failed');
}
```

### 6. Use Empty States for Better UX
```typescript
// Good
if (items.length === 0) {
  return <NoItemsState />;
}

// Bad
if (items.length === 0) {
  return <div>No items</div>;
}
```

### 7. Provide Recovery Options
```typescript
<ErrorState
  error={error}
  onRetry={() => refetch()}
  onGoBack={() => router.back()}
/>
```

## Common Patterns

### Pattern 1: API Call with Error Handling

```typescript
'use client';

import { useState } from 'react';
import { useToast } from '@/contexts/ToastContext';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState';

export function DataComponent() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.getData();
      
      if (!response.success) {
        throw new Error(response.error);
      }
      
      setData(response.data);
    } catch (err) {
      setError(err.message);
      toast.error('Error', 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={fetchData} />;
  if (!data) return <EmptyState />;
  
  return <DataDisplay data={data} />;
}
```

### Pattern 2: Form Submission with Error Handling

```typescript
'use client';

import { useState } from 'react';
import { useToast } from '@/contexts/ToastContext';
import { InlineError } from '@/components/ui/InlineError';

export function FormComponent() {
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await api.submit(data);
      
      if (!response.success) {
        setError(response.error);
        return;
      }
      
      toast.success('Success', 'Form submitted successfully');
      router.push('/success');
    } catch (err) {
      setError('An unexpected error occurred');
      toast.error('Error', 'Failed to submit form');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      
      {error && <InlineError message={error} />}
      
      <button disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
```

### Pattern 3: List with Empty State

```typescript
export function ListComponent({ items }) {
  if (items.length === 0) {
    return <NoItemsState />;
  }

  return (
    <div>
      {items.map(item => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
```

### Pattern 4: Search with No Results

```typescript
export function SearchComponent() {
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (query) => {
    const data = await api.search(query);
    setResults(data);
    setHasSearched(true);
  };

  if (hasSearched && results.length === 0) {
    return <NoSearchResultsState onClear={() => setHasSearched(false)} />;
  }

  return <ResultsList results={results} />;
}
```

### Pattern 5: Protected Route with Error

```typescript
export default async function ProtectedPage() {
  const user = await getUser();

  if (!user) {
    return <UnauthorizedErrorState onGoBack={() => router.push('/login')} />;
  }

  return <PageContent user={user} />;
}
```

## Error Message Guidelines

### Do's
- ✅ Be specific about what went wrong
- ✅ Provide actionable next steps
- ✅ Use friendly, non-technical language
- ✅ Include recovery options
- ✅ Log technical details separately

### Don'ts
- ❌ Show technical stack traces to users
- ❌ Use vague messages like "Error occurred"
- ❌ Blame the user
- ❌ Use jargon or technical terms
- ❌ Leave users without options

### Examples

#### Good Error Messages
```typescript
// Specific and actionable
"File size exceeds 5MB. Please choose a smaller file."

// Friendly and helpful
"We couldn't find that application. It may have been deleted."

// Clear next steps
"Your session has expired. Please log in again to continue."
```

#### Bad Error Messages
```typescript
// Too vague
"Error"

// Too technical
"ERR_CONNECTION_REFUSED: ECONNREFUSED 127.0.0.1:3001"

// Blaming user
"You entered invalid data"
```

## Testing Error States

### Manual Testing Checklist
- [ ] Test network errors (disconnect internet)
- [ ] Test 404 errors (invalid URLs)
- [ ] Test 401 errors (logout and access protected route)
- [ ] Test 500 errors (trigger server error)
- [ ] Test empty states (clear all data)
- [ ] Test form validation errors
- [ ] Test file upload errors
- [ ] Test concurrent request errors

### Automated Testing
```typescript
// Test error state rendering
it('displays error state on API failure', async () => {
  mockApi.getData.mockRejectedValue(new Error('API Error'));
  
  render(<Component />);
  
  await waitFor(() => {
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });
});

// Test empty state rendering
it('displays empty state when no data', async () => {
  mockApi.getData.mockResolvedValue({ success: true, data: [] });
  
  render(<Component />);
  
  await waitFor(() => {
    expect(screen.getByText('No items found')).toBeInTheDocument();
  });
});
```

## Resources

### Components
- `components/ui/ErrorState.tsx`
- `components/ui/EmptyState.tsx`
- `components/ui/InlineError.tsx`
- `components/ui/Toast.tsx`
- `contexts/ToastContext.tsx`

### Error Boundaries
- `app/global-error.tsx`
- `app/[route]/error.tsx`
- `components/error/ErrorBoundary.tsx`

### Related Guides
- [API Integration Guide](./API_INTEGRATION_GUIDE.md)
- [Development Standards](./DEVELOPMENT_STANDARDS.md)
- [Component Hierarchy](./COMPONENT_HIERARCHY.md)