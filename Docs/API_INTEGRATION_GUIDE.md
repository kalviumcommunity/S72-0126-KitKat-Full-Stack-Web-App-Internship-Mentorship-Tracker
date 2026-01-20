# API Integration Guide

## Overview
This document provides comprehensive guidance for integrating frontend components with backend APIs in the UIMP application.

## Table of Contents
1. [API Configuration](#api-configuration)
2. [Integration Patterns](#integration-patterns)
3. [Error Handling](#error-handling)
4. [Mock Data vs Real API](#mock-data-vs-real-api)
5. [Testing Integration](#testing-integration)
6. [Common Issues](#common-issues)

## API Configuration

### Environment Variables
Create a `.env.local` file in the client directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Optional: Enable mock data fallback
NEXT_PUBLIC_USE_MOCK_DATA=false
```

### API Base URL
The API base URL is configured in `lib/api.ts`:
- **Development**: `http://localhost:3001/api`
- **Production**: Set via `NEXT_PUBLIC_API_URL` environment variable

## Integration Patterns

### Pattern 1: Server Component with API Call

```typescript
// app/(dashboard)/student/applications/page.tsx
import { applications } from '@/lib/api';
import { getApiStatus } from '@/lib/api-integration';

export default async function ApplicationsPage() {
  // Check API status
  const apiStatus = await getApiStatus();
  
  // Fetch data from API
  const response = await applications.getAll();
  
  if (!response.success) {
    // Handle error - show error page or use mock data
    return <ErrorPage error={response.error} />;
  }
  
  return <ApplicationList applications={response.data} />;
}
```

### Pattern 2: Client Component with API Call

```typescript
'use client';

import { useState, useEffect } from 'react';
import { applications } from '@/lib/api';
import { apiCall } from '@/lib/api-integration';

export function ApplicationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);
    setError(null);
    
    const result = await apiCall(
      () => applications.create(data),
      {
        onSuccess: (data) => {
          // Handle success
          router.push(`/student/applications/${data.id}`);
        },
        onError: (error) => {
          setError(error);
        },
      }
    );
    
    setIsSubmitting(false);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      {error && <ErrorMessage message={error} />}
    </form>
  );
}
```

### Pattern 3: API Call with Retry

```typescript
import { retryApiCall } from '@/lib/api-integration';
import { applications } from '@/lib/api';

async function fetchApplicationsWithRetry() {
  const response = await retryApiCall(
    () => applications.getAll(),
    {
      maxRetries: 3,
      retryDelay: 1000,
      shouldRetry: (error) => error.code === 'NETWORK_ERROR',
    }
  );
  
  return response;
}
```

### Pattern 4: Cached API Call

```typescript
import { cachedApiCall } from '@/lib/api-integration';
import { applications } from '@/lib/api';

async function fetchApplicationsCached() {
  const response = await cachedApiCall(
    'applications-list',
    () => applications.getAll(),
    60000 // Cache for 60 seconds
  );
  
  return response;
}
```

## Error Handling

### Error Types

```typescript
interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: any;
}
```

### Common Error Codes
- `NETWORK_ERROR`: Network connectivity issues
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Invalid input data
- `SERVER_ERROR`: Internal server error
- `TIMEOUT`: Request timeout

### Error Handling Example

```typescript
import { parseApiError, getUserFriendlyErrorMessage } from '@/lib/api-integration';

try {
  const response = await applications.create(data);
  
  if (!response.success) {
    const error = parseApiError(response.error);
    const userMessage = getUserFriendlyErrorMessage(error);
    
    // Show user-friendly message
    toast.error(userMessage);
    
    // Log technical details
    console.error('API Error:', error);
  }
} catch (error) {
  const apiError = parseApiError(error);
  const userMessage = getUserFriendlyErrorMessage(apiError);
  toast.error(userMessage);
}
```

## Mock Data vs Real API

### Automatic Fallback
The application automatically detects if the backend API is available:

```typescript
import { getApiStatus } from '@/lib/api-integration';

const apiStatus = await getApiStatus();

if (apiStatus.useMockData) {
  // Use mock data
  const mockData = getMockApplications();
  return mockData;
} else {
  // Use real API
  const response = await applications.getAll();
  return response.data;
}
```

### Manual Mock Data Toggle
Set environment variable:
```env
NEXT_PUBLIC_USE_MOCK_DATA=true
```

### Mock Data Location
Mock data is currently embedded in components. For production:
1. Move mock data to `lib/mock-data/`
2. Create separate mock data files per feature
3. Use conditional imports based on API status

## Testing Integration

### Health Check
Test if the backend API is running:

```typescript
import { checkApiHealth } from '@/lib/api-integration';

const isHealthy = await checkApiHealth();
console.log('API Health:', isHealthy);
```

### API Status Check
Get detailed API status:

```typescript
import { getApiStatus } from '@/lib/api-integration';

const status = await getApiStatus();
console.log('API Status:', {
  connected: status.isConnected,
  baseUrl: status.baseUrl,
  useMockData: status.useMockData,
  lastChecked: status.lastChecked,
});
```

### Test API Endpoints

#### Authentication
```bash
# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@example.com","password":"password123"}'

# Get current user
curl http://localhost:3001/api/auth/me \
  -H "Cookie: token=YOUR_TOKEN"
```

#### Applications
```bash
# Get all applications
curl http://localhost:3001/api/applications \
  -H "Cookie: token=YOUR_TOKEN"

# Create application
curl -X POST http://localhost:3001/api/applications \
  -H "Content-Type: application/json" \
  -H "Cookie: token=YOUR_TOKEN" \
  -d '{"company":"Google","role":"SWE Intern","platform":"COMPANY_WEBSITE","status":"DRAFT"}'
```

#### Feedback
```bash
# Get all feedback
curl http://localhost:3001/api/feedback \
  -H "Cookie: token=YOUR_TOKEN"
```

## Integration Checklist

### Pre-Integration
- [ ] Backend API is running
- [ ] Environment variables are configured
- [ ] API endpoints are documented
- [ ] Authentication is working
- [ ] CORS is configured correctly

### During Integration
- [ ] Replace mock data with API calls
- [ ] Add error handling
- [ ] Add loading states
- [ ] Test with real data
- [ ] Handle edge cases
- [ ] Add retry logic for critical operations

### Post-Integration
- [ ] Test all user flows
- [ ] Verify error messages
- [ ] Check loading states
- [ ] Test offline behavior
- [ ] Verify data persistence
- [ ] Test authentication flow
- [ ] Check authorization rules

## Component Integration Status

### ✅ Completed (Mock Data)
- Authentication pages
- Application list and detail pages
- Feedback pages
- Dashboard pages
- Upload components
- Notification system

### 🔄 Ready for Integration
All components are ready to integrate with real APIs. Follow these steps:

1. **Start Backend Server**
   ```bash
   cd server
   npm run dev
   ```

2. **Configure Environment**
   ```bash
   # client/.env.local
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

3. **Test API Connection**
   ```typescript
   import { checkApiHealth } from '@/lib/api-integration';
   const isHealthy = await checkApiHealth();
   ```

4. **Update Components**
   - Remove mock data
   - Use API client functions
   - Add error handling
   - Test thoroughly

## Common Issues

### Issue 1: CORS Errors
**Problem**: Browser blocks API requests due to CORS policy

**Solution**: Configure CORS in backend
```typescript
// server/src/index.ts
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
```

### Issue 2: Authentication Not Persisting
**Problem**: User logged out after page refresh

**Solution**: Ensure cookies are sent with requests
```typescript
// lib/api.ts
credentials: 'include', // Already configured
```

### Issue 3: API Not Found (404)
**Problem**: API endpoints return 404

**Solution**: 
1. Check API base URL
2. Verify endpoint paths
3. Check backend routes

### Issue 4: Slow API Responses
**Problem**: Pages load slowly

**Solution**:
1. Implement caching
2. Use loading states
3. Optimize backend queries
4. Consider pagination

### Issue 5: Type Mismatches
**Problem**: TypeScript errors with API responses

**Solution**:
1. Verify types in `lib/types.ts`
2. Update API client return types
3. Add type transformations if needed

## Best Practices

### 1. Always Handle Errors
```typescript
const response = await applications.getAll();
if (!response.success) {
  // Handle error
  return <ErrorState error={response.error} />;
}
```

### 2. Show Loading States
```typescript
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  fetchData().finally(() => setIsLoading(false));
}, []);

if (isLoading) return <LoadingState />;
```

### 3. Use Type Safety
```typescript
// Good
const response: ApiResponse<Application[]> = await applications.getAll();

// Bad
const response: any = await applications.getAll();
```

### 4. Implement Retry Logic for Critical Operations
```typescript
// For critical operations like authentication
const response = await retryApiCall(
  () => auth.login(credentials),
  { maxRetries: 3 }
);
```

### 5. Cache Frequently Accessed Data
```typescript
// Cache dashboard data
const response = await cachedApiCall(
  'dashboard-data',
  () => dashboard.getStudentData(),
  300000 // 5 minutes
);
```

### 6. Validate Data Before Sending
```typescript
// Use Zod schemas from lib/validations.ts
const validatedData = applicationSchema.parse(formData);
const response = await applications.create(validatedData);
```

### 7. Log Errors for Debugging
```typescript
if (!response.success) {
  console.error('API Error:', {
    endpoint: '/applications',
    error: response.error,
    timestamp: new Date().toISOString(),
  });
}
```

## Migration from Mock Data

### Step-by-Step Migration

1. **Identify Component with Mock Data**
   ```typescript
   // Before
   const mockData = [/* ... */];
   ```

2. **Add API Call**
   ```typescript
   // After
   const response = await applications.getAll();
   const data = response.success ? response.data : [];
   ```

3. **Add Error Handling**
   ```typescript
   if (!response.success) {
     return <ErrorState error={response.error} />;
   }
   ```

4. **Add Loading State**
   ```typescript
   if (isLoading) {
     return <LoadingState />;
   }
   ```

5. **Test Thoroughly**
   - Test with real data
   - Test error scenarios
   - Test loading states
   - Test edge cases

## Performance Optimization

### 1. Implement Pagination
```typescript
const response = await applications.getAll(
  filters,
  page,
  limit
);
```

### 2. Use Caching
```typescript
const response = await cachedApiCall(
  'cache-key',
  () => apiFunction(),
  ttl
);
```

### 3. Batch API Calls
```typescript
const { results, errors } = await batchApiCalls([
  () => applications.getAll(),
  () => feedback.getAll(),
  () => notifications.getUnread(),
]);
```

### 4. Implement Debouncing for Search
```typescript
const debouncedSearch = useMemo(
  () => debounce((query) => searchApplications(query), 300),
  []
);
```

## Security Considerations

### 1. Never Store Sensitive Data in LocalStorage
```typescript
// Bad
localStorage.setItem('token', token);

// Good - Use HttpOnly cookies (handled by backend)
```

### 2. Validate All User Input
```typescript
const validatedData = schema.parse(userInput);
```

### 3. Handle Authentication Errors
```typescript
if (error.code === 'UNAUTHORIZED') {
  // Redirect to login
  router.push('/login');
}
```

### 4. Sanitize Display Data
```typescript
// Use React's built-in XSS protection
<p>{userInput}</p> // Automatically escaped
```

## Support and Resources

### Documentation
- [API Contracts](../Docs/API_CONTRACTS.md)
- [Frontend Data Requirements](./FRONTEND_DATA_REQUIREMENTS.md)
- [Development Standards](./DEVELOPMENT_STANDARDS.md)

### Tools
- API Client: `lib/api.ts`
- Integration Utilities: `lib/api-integration.ts`
- Type Definitions: `lib/types.ts`
- Validation Schemas: `lib/validations.ts`

### Getting Help
1. Check this guide
2. Review API documentation
3. Check backend logs
4. Use browser DevTools Network tab
5. Contact backend team (Heramb)