# Frontend Technical Documentation - UIMP

This document provides comprehensive technical documentation for the Unified Internship & Mentorship Portal (UIMP) frontend application built with Next.js 14 and TypeScript.

**Framework**: Next.js 14 (App Router)  
**Language**: TypeScript  
**Styling**: Tailwind CSS  
**State Management**: React Context API  
**Authentication**: JWT with HttpOnly cookies  

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Project Structure](#project-structure)
3. [Routing Strategy](#routing-strategy)
4. [Component Architecture](#component-architecture)
5. [State Management](#state-management)
6. [API Integration](#api-integration)
7. [Authentication Flow](#authentication-flow)
8. [Performance Optimizations](#performance-optimizations)
9. [Error Handling](#error-handling)
10. [Testing Strategy](#testing-strategy)
11. [Development Guidelines](#development-guidelines)

---

## Architecture Overview

The UIMP frontend follows a modern React architecture using Next.js 14's App Router with the following key principles:

- **Server-First Approach**: Leveraging Server Components for initial data fetching
- **Progressive Enhancement**: Client Components only when interactivity is needed
- **Type Safety**: Full TypeScript coverage with strict mode enabled
- **Performance**: Code splitting, lazy loading, and caching strategies
- **Accessibility**: WCAG 2.1 AA compliance throughout the application

### Technology Stack

```typescript
// Core Technologies
- Next.js 14.0+ (App Router)
- React 18.0+
- TypeScript 5.0+
- Tailwind CSS 3.0+

// Development Tools
- ESLint + Prettier
- Husky (Git hooks)
- Jest + React Testing Library
- Playwright (E2E testing)
```

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth route group
│   ├── (dashboard)/       # Dashboard route group
│   ├── applications/      # Application management
│   ├── auth/             # Authentication pages
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # Reusable UI components
│   ├── auth/            # Authentication components
│   ├── dashboard/       # Dashboard-specific components
│   ├── error/           # Error handling components
│   ├── features/        # Feature-specific components
│   ├── forms/           # Form components
│   ├── layout/          # Layout components
│   └── ui/              # Base UI components
├── contexts/            # React Context providers
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions and configurations
└── __tests__/           # Test files
```

### Directory Conventions

- **Route Groups**: `(auth)`, `(dashboard)` for logical grouping without URL segments
- **Component Organization**: Feature-based structure with shared UI components
- **Type Definitions**: Centralized in `lib/types.ts`
- **API Layer**: Abstracted in `lib/api.ts` and `lib/api-integration.ts`

---

## Routing Strategy

### App Router Implementation

The application uses Next.js 14's App Router with the following structure:

```typescript
// Route Structure
/                          # Landing page (public)
/auth/login               # Login page (public)
/auth/signup              # Signup page (public)
/dashboard                # Main dashboard (protected)
/applications             # Application management (protected)
/applications/new         # Create application (protected)
/applications/[id]        # View/edit application (protected)
/applications/[id]/edit   # Edit application (protected)
```

### Route Protection

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token');
  const { pathname } = request.nextUrl;

  // Protected routes
  const protectedRoutes = ['/dashboard', '/applications'];
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Redirect authenticated users from auth pages
  if (token && pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}
```

### Layout Hierarchy

```typescript
// Root Layout (app/layout.tsx)
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

// Dashboard Layout (app/(dashboard)/layout.tsx)
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

---

## Component Architecture

### Component Categories

#### 1. Server Components (Default)
Used for data fetching and static content:

```typescript
// app/dashboard/page.tsx
import { getDashboardData } from '@/lib/api';

export default async function DashboardPage() {
  const data = await getDashboardData();
  
  return (
    <div>
      <DashboardStats stats={data.stats} />
      <RecentApplications applications={data.applications} />
    </div>
  );
}
```

#### 2. Client Components
Used for interactivity and state management:

```typescript
'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function ApplicationForm() {
  const [formData, setFormData] = useState({});
  const { user } = useAuth();
  
  // Interactive form logic
  return <form>...</form>;
}
```

### Component Design Patterns

#### 1. Compound Components
```typescript
// components/ui/Card.tsx
export const Card = ({ children, className, ...props }) => (
  <div className={cn("rounded-lg border bg-card", className)} {...props}>
    {children}
  </div>
);

export const CardHeader = ({ children, className, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props}>
    {children}
  </div>
);

// Usage
<Card>
  <CardHeader>
    <CardTitle>Applications</CardTitle>
  </CardHeader>
  <CardContent>...</CardContent>
</Card>
```

#### 2. Render Props Pattern
```typescript
// components/features/DataFetcher.tsx
interface DataFetcherProps<T> {
  url: string;
  children: (data: T | null, loading: boolean, error: string | null) => React.ReactNode;
}

export function DataFetcher<T>({ url, children }: DataFetcherProps<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch logic...

  return <>{children(data, loading, error)}</>;
}
```

---

## State Management

### Context API Implementation

#### 1. Authentication Context
```typescript
// contexts/AuthContext.tsx
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Auth logic implementation
  
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

#### 2. Toast Notification Context
```typescript
// contexts/ToastContext.tsx
interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
    
    setTimeout(() => {
      removeToast(id);
    }, toast.duration || 5000);
  }, []);

  // Toast management logic...
}
```

### Custom Hooks

#### 1. Form Validation Hook
```typescript
// hooks/useFormValidation.ts
export function useFormValidation<T>(
  initialValues: T,
  validationSchema: z.ZodSchema<T>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const validate = useCallback(() => {
    try {
      validationSchema.parse(values);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof T, string>> = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            fieldErrors[err.path[0] as keyof T] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  }, [values, validationSchema]);

  return { values, errors, touched, setValues, setTouched, validate };
}
```

#### 2. Dashboard Cache Hook
```typescript
// hooks/useDashboardCache.ts
export function useDashboardCache() {
  const [cache, setCache] = useState<Map<string, any>>(new Map());
  const [lastFetch, setLastFetch] = useState<Map<string, number>>(new Map());

  const getCachedData = useCallback((key: string, maxAge: number = 300000) => {
    const cached = cache.get(key);
    const fetchTime = lastFetch.get(key);
    
    if (cached && fetchTime && Date.now() - fetchTime < maxAge) {
      return cached;
    }
    return null;
  }, [cache, lastFetch]);

  const setCachedData = useCallback((key: string, data: any) => {
    setCache(prev => new Map(prev).set(key, data));
    setLastFetch(prev => new Map(prev).set(key, Date.now()));
  }, []);

  return { getCachedData, setCachedData };
}
```

---

## API Integration

### API Client Configuration

```typescript
// lib/api.ts
class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(data.error?.message || 'Request failed', response.status);
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Network error occurred', 500);
    }
  }

  // Auth methods
  async login(email: string, password: string) {
    return this.request<{ user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // Application methods
  async getApplications(params?: ApplicationFilters) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value));
        }
      });
    }
    
    return this.request<{ applications: Application[]; pagination: Pagination }>(
      `/applications?${searchParams.toString()}`
    );
  }
}

export const apiClient = new ApiClient();
```

### Error Handling

```typescript
// lib/api-error-handling.ts
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function handleApiError(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 401:
        return 'Please log in to continue';
      case 403:
        return 'You do not have permission to perform this action';
      case 404:
        return 'The requested resource was not found';
      case 422:
        return 'Please check your input and try again';
      case 500:
        return 'Server error occurred. Please try again later';
      default:
        return error.message;
    }
  }
  
  return 'An unexpected error occurred';
}
```

---

## Authentication Flow

### JWT Cookie-Based Authentication

```typescript
// Authentication Flow Implementation
export async function loginUser(email: string, password: string) {
  try {
    const response = await apiClient.login(email, password);
    
    // Cookie is automatically set by the server (HttpOnly)
    // Update client-side auth state
    setUser(response.data.user);
    
    return response.data.user;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function logoutUser() {
  try {
    await apiClient.logout();
    
    // Cookie is automatically cleared by the server
    // Update client-side auth state
    setUser(null);
    
    // Redirect to login page
    router.push('/auth/login');
  } catch (error) {
    // Even if logout fails, clear local state
    setUser(null);
    router.push('/auth/login');
  }
}
```

### Route Protection

```typescript
// components/auth/ProtectedRoute.tsx
export function ProtectedRoute({ 
  children, 
  requiredRole 
}: { 
  children: React.ReactNode;
  requiredRole?: UserRole;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
    
    if (user && requiredRole && user.role !== requiredRole) {
      router.push('/dashboard'); // Redirect to default page
    }
  }, [user, loading, requiredRole, router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null; // Will redirect
  }

  if (requiredRole && user.role !== requiredRole) {
    return <UnauthorizedMessage />;
  }

  return <>{children}</>;
}
```

---

## Performance Optimizations

### Code Splitting and Lazy Loading

```typescript
// Dynamic imports for heavy components
const ApplicationChart = dynamic(
  () => import('@/components/dashboard/ApplicationChart'),
  { 
    loading: () => <ChartSkeleton />,
    ssr: false // Client-side only component
  }
);

// Route-level code splitting
const ApplicationsPage = lazy(() => import('./ApplicationsPage'));
```

### Caching Strategies

```typescript
// lib/performance-optimizations.ts
export const cacheConfig = {
  // Static data cache (5 minutes)
  staticData: 5 * 60 * 1000,
  
  // User data cache (2 minutes)
  userData: 2 * 60 * 1000,
  
  // Dashboard data cache (1 minute)
  dashboardData: 60 * 1000,
};

// React Query configuration for server state
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: cacheConfig.staticData,
      cacheTime: cacheConfig.staticData * 2,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status === 404) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});
```

### Image Optimization

```typescript
// components/ui/OptimizedImage.tsx
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function OptimizedImage({ 
  src, 
  alt, 
  width = 400, 
  height = 300, 
  priority = false 
}: OptimizedImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
      className="rounded-lg object-cover"
    />
  );
}
```

---

## Error Handling

### Error Boundaries

```typescript
// components/error/ErrorBoundary.tsx
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<
  { children: React.ReactNode; fallback?: React.ComponentType<{ error: Error }> },
  ErrorBoundaryState
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Log to error reporting service
    if (process.env.NODE_ENV === 'production') {
      // logErrorToService(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error!} />;
    }

    return this.props.children;
  }
}
```

### Global Error Handler

```typescript
// app/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Something went wrong!
        </h2>
        <p className="text-gray-600 mb-6">
          We apologize for the inconvenience. Please try again.
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
```

---

## Testing Strategy

### Unit Testing with Jest

```typescript
// __tests__/components/ApplicationCard.test.tsx
import { render, screen } from '@testing-library/react';
import { ApplicationCard } from '@/components/features/ApplicationCard';

const mockApplication = {
  id: '1',
  company: 'Tech Corp',
  role: 'Software Engineer',
  status: 'APPLIED' as const,
  createdAt: '2024-01-15T10:30:00Z',
};

describe('ApplicationCard', () => {
  it('renders application information correctly', () => {
    render(<ApplicationCard application={mockApplication} />);
    
    expect(screen.getByText('Tech Corp')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Applied')).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const onClickMock = jest.fn();
    render(
      <ApplicationCard 
        application={mockApplication} 
        onClick={onClickMock} 
      />
    );
    
    await userEvent.click(screen.getByRole('button'));
    expect(onClickMock).toHaveBeenCalledWith(mockApplication.id);
  });
});
```

### Integration Testing

```typescript
// __tests__/integration/auth-flow.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider } from '@/contexts/AuthContext';
import LoginPage from '@/app/auth/login/page';

// Mock API
jest.mock('@/lib/api', () => ({
  apiClient: {
    login: jest.fn(),
  },
}));

describe('Authentication Flow', () => {
  it('logs in user successfully', async () => {
    const mockLogin = jest.mocked(apiClient.login);
    mockLogin.mockResolvedValue({
      success: true,
      data: { user: { id: '1', email: 'test@example.com', role: 'STUDENT' } },
    });

    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );

    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });
});
```

### E2E Testing with Playwright

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('user can log in and access dashboard', async ({ page }) => {
    await page.goto('/auth/login');
    
    await page.fill('[data-testid="email-input"]', 'student@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');
    
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test('invalid credentials show error message', async ({ page }) => {
    await page.goto('/auth/login');
    
    await page.fill('[data-testid="email-input"]', 'invalid@example.com');
    await page.fill('[data-testid="password-input"]', 'wrongpassword');
    await page.click('[data-testid="login-button"]');
    
    await expect(page.locator('[data-testid="error-message"]')).toContainText(
      'Invalid credentials'
    );
  });
});
```

---

## Development Guidelines

### Code Style and Standards

```typescript
// ESLint Configuration (.eslintrc.json)
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "react-hooks/exhaustive-deps": "error",
    "prefer-const": "error"
  }
}

// Prettier Configuration (.prettierrc.json)
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

### Component Development Standards

```typescript
// Component Template
interface ComponentProps {
  // Props interface with JSDoc comments
  /** The title to display */
  title: string;
  /** Optional click handler */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Component description
 * 
 * @example
 * <Component title="Hello" onClick={() => {}} />
 */
export function Component({ 
  title, 
  onClick, 
  className 
}: ComponentProps): JSX.Element {
  return (
    <div 
      className={cn("base-styles", className)}
      onClick={onClick}
      data-testid="component"
    >
      {title}
    </div>
  );
}

// Export with display name for debugging
Component.displayName = 'Component';
```

### Git Workflow

```bash
# Branch naming convention
feature/auth-implementation
bugfix/login-validation-error
hotfix/security-patch

# Commit message format
feat: add user authentication flow
fix: resolve login validation error
docs: update API documentation
test: add unit tests for auth components
refactor: optimize dashboard performance
```

### Performance Monitoring

```typescript
// lib/performance-monitor.ts
export function measurePerformance(name: string, fn: () => void) {
  if (typeof window !== 'undefined' && 'performance' in window) {
    const start = performance.now();
    fn();
    const end = performance.now();
    
    console.log(`${name} took ${end - start} milliseconds`);
    
    // Report to analytics service
    if (process.env.NODE_ENV === 'production') {
      // analytics.track('performance', { name, duration: end - start });
    }
  } else {
    fn();
  }
}

// Usage in components
useEffect(() => {
  measurePerformance('Dashboard Data Load', () => {
    fetchDashboardData();
  });
}, []);
```

---

## Deployment Configuration

### Environment Variables

```bash
# .env.local (development)
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_ENV=development

# .env.production
NEXT_PUBLIC_API_URL=https://api.uimp.com/api
NEXT_PUBLIC_APP_ENV=production
```

### Build Configuration

```typescript
// next.config.ts
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['s3.amazonaws.com', 'cdn.uimp.com'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

---

**Last Updated**: 2024-01-17  
**Maintained By**: Frontend Team (Gaurav)  
**Review Schedule**: Weekly during development, monthly post-deployment  
**Next.js Version**: 14.0+  
**TypeScript Version**: 5.0+