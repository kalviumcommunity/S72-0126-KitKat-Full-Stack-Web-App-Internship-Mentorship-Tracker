// Next.js Middleware for route protection
// Handles authentication and role-based access control

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { ROUTES, PUBLIC_ROUTES, PROTECTED_ROUTES } from '@/lib/constants';
import { UserRole, ApplicationStatus, ApplicationPlatform, FeedbackTag, FeedbackPriority, NotificationType } from '@/lib/types';

// Mock function to verify JWT token - replace with actual implementation
async function verifyToken(token: string): Promise<{ 
  valid: boolean; 
  user?: { id: string; role: string; email: string } 
}> {
  // TODO: Replace with actual JWT verification
  // This is a mock implementation for development
  if (!token) {
    return { valid: false };
  }
  
  try {
    // Mock user data - replace with actual JWT decode
    return {
      valid: true,
      user: {
        id: '1',
        role: UserRole.STUDENT,
        email: 'user@example.com',
      },
    };
  } catch {
    return { valid: false };
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  // Get authentication token from cookies
  const token = request.cookies.get('auth-token')?.value;
  
  // Verify token
  const { valid: isAuthenticated, user } = await verifyToken(token || '');

  // Check if route is public
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname as any);
  
  // Allow access to public routes
  if (isPublicRoute) {
    // Redirect authenticated users away from auth pages
    if (isAuthenticated && (pathname === '/login' || pathname === '/signup')) {
      const redirectUrl = user?.role === 'STUDENT' ? '/student' : 
                         user?.role === 'MENTOR' ? '/mentor' : 
                         user?.role === 'ADMIN' ? '/admin' : '/';
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
    return NextResponse.next();
  }

  // Redirect unauthenticated users to login
  if (!isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check role-based access for protected routes
  if (user) {
    const userRole = user.role;
    
    // Check if user has access to the requested route
    const hasAccess = 
      PROTECTED_ROUTES.ALL.some(route => pathname.startsWith(route)) ||
      PROTECTED_ROUTES[userRole as keyof typeof PROTECTED_ROUTES]?.some(route => 
        pathname.startsWith(route)
      );

    if (!hasAccess) {
      // Redirect to appropriate dashboard based on role
      const dashboardUrl = userRole === 'STUDENT' ? '/student' : 
                          userRole === 'MENTOR' ? '/mentor' : 
                          userRole === 'ADMIN' ? '/admin' : '/';
      return NextResponse.redirect(new URL(dashboardUrl, request.url));
    }
  }

  // Add user info to headers for server components
  const response = NextResponse.next();
  if (user) {
    response.headers.set('x-user-id', user.id);
    response.headers.set('x-user-role', user.role);
    response.headers.set('x-user-email', user.email);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
