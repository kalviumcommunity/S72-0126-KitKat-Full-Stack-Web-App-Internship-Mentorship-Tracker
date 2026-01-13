// Authentication redirect hook - Client-side hook
// Handles authentication-based redirects and route protection

'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/lib/types';

interface UseAuthRedirectOptions {
  requireAuth?: boolean;
  allowedRoles?: UserRole[];
  redirectTo?: string;
  onUnauthorized?: () => void;
}

export function useAuthRedirect({
  requireAuth = false,
  allowedRoles,
  redirectTo,
  onUnauthorized,
}: UseAuthRedirectOptions = {}) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isLoading) return;

    // Handle authentication requirement
    if (requireAuth && !isAuthenticated) {
      const currentPath = window.location.pathname;
      const loginUrl = `/login?redirect=${encodeURIComponent(currentPath)}`;
      router.push(loginUrl);
      return;
    }

    // Handle role-based access
    if (isAuthenticated && user && allowedRoles && allowedRoles.length > 0) {
      const hasAccess = allowedRoles.includes(user.role);
      
      if (!hasAccess) {
        if (onUnauthorized) {
          onUnauthorized();
        } else {
          // Redirect to appropriate dashboard based on user role
          const dashboardUrl = user.role === 'STUDENT' ? '/student' : 
                              user.role === 'MENTOR' ? '/mentor' : 
                              user.role === 'ADMIN' ? '/admin' : '/';
          router.push(dashboardUrl);
        }
        return;
      }
    }

    // Handle custom redirect
    if (redirectTo) {
      router.push(redirectTo);
      return;
    }

    // Handle redirect after login
    const redirectParam = searchParams.get('redirect');
    if (isAuthenticated && redirectParam) {
      router.push(decodeURIComponent(redirectParam));
      return;
    }
  }, [
    isLoading, 
    isAuthenticated, 
    user, 
    requireAuth, 
    allowedRoles, 
    redirectTo, 
    onUnauthorized, 
    router, 
    searchParams
  ]);

  return {
    isLoading,
    isAuthenticated,
    user,
    hasAccess: !allowedRoles || !user || allowedRoles.includes(user.role),
  };
}

// Convenience hooks for specific use cases
export function useRequireAuth() {
  return useAuthRedirect({ requireAuth: true });
}

export function useRequireStudent() {
  return useAuthRedirect({ 
    requireAuth: true, 
    allowedRoles: ['STUDENT'] 
  });
}

export function useRequireMentor() {
  return useAuthRedirect({ 
    requireAuth: true, 
    allowedRoles: ['MENTOR'] 
  });
}

export function useRequireAdmin() {
  return useAuthRedirect({ 
    requireAuth: true, 
    allowedRoles: ['ADMIN'] 
  });
}

export function useRequireRole(roles: UserRole[]) {
  return useAuthRedirect({ 
    requireAuth: true, 
    allowedRoles: roles 
  });
}