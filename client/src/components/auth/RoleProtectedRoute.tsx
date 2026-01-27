// Role-based route protection component
// Ensures users can only access routes appropriate for their role

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/types';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallbackRoute?: string;
}

export function RoleProtectedRoute({ 
  children, 
  allowedRoles, 
  fallbackRoute 
}: RoleProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      // If not authenticated, redirect to login (handled by AuthContext)
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      // If authenticated but wrong role, redirect to appropriate dashboard
      if (user && !allowedRoles.includes(user.role)) {
        const redirectRoute = fallbackRoute || getRoleBasedRoute(user.role);
        router.push(redirectRoute);
        return;
      }
    }
  }, [isLoading, isAuthenticated, user, allowedRoles, fallbackRoute, router]);

  // Show loading while checking authentication and role
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Show access denied if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Required</h1>
          <p className="text-gray-600">Please log in to access this page.</p>
        </div>
      </div>
    );
  }

  // Show access denied if wrong role
  if (user && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
          <p className="text-sm text-gray-500 mt-2">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Helper function to get role-based route
function getRoleBasedRoute(role: UserRole): string {
  switch (role) {
    case UserRole.STUDENT:
      return '/dashboard/user';
    case UserRole.MENTOR:
      return '/dashboard/mentor';
    case UserRole.ADMIN:
      return '/dashboard/admin';
    default:
      return '/login';
  }
}

// Convenience components for specific roles
export function StudentRoute({ children }: { children: React.ReactNode }) {
  return (
    <RoleProtectedRoute allowedRoles={[UserRole.STUDENT]}>
      {children}
    </RoleProtectedRoute>
  );
}

export function MentorRoute({ children }: { children: React.ReactNode }) {
  return (
    <RoleProtectedRoute allowedRoles={[UserRole.MENTOR]}>
      {children}
    </RoleProtectedRoute>
  );
}

export function CompanyRoute({ children }: { children: React.ReactNode }) {
  return (
    <RoleProtectedRoute allowedRoles={[UserRole.MENTOR]}>
      {children}
    </RoleProtectedRoute>
  );
}

export function AdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <RoleProtectedRoute allowedRoles={[UserRole.ADMIN]}>
      {children}
    </RoleProtectedRoute>
  );
}