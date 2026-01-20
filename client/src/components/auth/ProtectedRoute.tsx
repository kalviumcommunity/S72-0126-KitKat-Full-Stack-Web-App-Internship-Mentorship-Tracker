// Protected Route Component - Client Component
// Provides route-level authentication and role-based access control

'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/types';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  requireAuth?: boolean;
  fallback?: ReactNode;
}

export function ProtectedRoute({ 
  children, 
  allowedRoles, 
  requireAuth = true,
  fallback 
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      // Redirect to login if authentication is required but user is not authenticated
      if (requireAuth && !isAuthenticated) {
        const loginUrl = `/login?redirect=${encodeURIComponent(pathname)}`;
        router.push(loginUrl);
        return;
      }

      // Check role-based access
      if (isAuthenticated && user && allowedRoles && allowedRoles.length > 0) {
        const hasAccess = allowedRoles.includes(user.role);
        
        if (!hasAccess) {
          // Redirect to appropriate dashboard based on user role
          const dashboardUrl = user.role === 'STUDENT' ? '/student' : 
                              user.role === 'MENTOR' ? '/mentor' : 
                              user.role === 'ADMIN' ? '/admin' : '/';
          router.push(dashboardUrl);
          return;
        }
      }
    }
  }, [isLoading, isAuthenticated, user, requireAuth, allowedRoles, router, pathname]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return fallback || <LoadingSpinner />;
  }

  // Don't render if authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return fallback || <LoadingSpinner />;
  }

  // Don't render if user doesn't have required role
  if (isAuthenticated && user && allowedRoles && allowedRoles.length > 0) {
    const hasAccess = allowedRoles.includes(user.role);
    if (!hasAccess) {
      return fallback || <LoadingSpinner />;
    }
  }

  return <>{children}</>;
}

// Convenience components for specific roles
export function StudentRoute({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={[UserRole.STUDENT]} fallback={fallback}>
      {children}
    </ProtectedRoute>
  );
}

export function MentorRoute({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={[UserRole.MENTOR]} fallback={fallback}>
      {children}
    </ProtectedRoute>
  );
}

export function AdminRoute({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={[UserRole.ADMIN]} fallback={fallback}>
      {children}
    </ProtectedRoute>
  );
}

export function AuthenticatedRoute({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <ProtectedRoute requireAuth={true} fallback={fallback}>
      {children}
    </ProtectedRoute>
  );
}