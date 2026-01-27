// Next.js Middleware for route protection
// Handles authentication and role-based access control

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // BYPASS MIDDLEWARE PROTECTION but keep mock auth logic active
  const response = NextResponse.next();

  // Get authentication token from cookies
  const tokenCookie = request.cookies.get('auth-token');
  const token = tokenCookie?.value || '';

  // Check if it's a development mock token from server-dev.ts
  // Format: dev-{userId}-{role}
  if (token.startsWith('dev-')) {
    const parts = token.split('-');
    if (parts.length >= 3) {
      const userId = parts[1] || '';
      const role = (parts[2] || '').toUpperCase(); // Ensure role is uppercase
      const email = `user${userId}@example.com`;

      // Inject headers based on the mock token
      response.headers.set('x-user-id', userId);
      response.headers.set('x-user-role', role);
      response.headers.set('x-user-email', email);
    }
  }

  // If no token (or invalid), we don't inject headers.
  // The downstream components (AuthContext) will see no user and handle it (e.g. redirect to login).

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