// Development utilities for better error handling and debugging

/**
 * Suppress console errors for expected authentication failures in development
 * This helps reduce noise in the console while maintaining proper error handling
 */
export function suppressExpectedAuthErrors() {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  // Store original console.error
  const originalConsoleError = console.error;

  // Override console.error to filter out expected auth errors
  console.error = (...args: any[]) => {
    const message = args.join(' ');
    
    // Skip logging for expected authentication errors
    if (
      message.includes('401 (Unauthorized)') ||
      message.includes('GET http://localhost:3001/api/auth/me 401') ||
      message.includes('UNAUTHORIZED') && message.includes('auth')
    ) {
      return; // Suppress these expected errors
    }
    
    // Log all other errors normally
    originalConsoleError.apply(console, args);
  };

  // Store reference to restore if needed
  (window as any).__originalConsoleError = originalConsoleError;
}

/**
 * Restore original console.error behavior
 */
export function restoreConsoleError() {
  if ((window as any).__originalConsoleError) {
    console.error = (window as any).__originalConsoleError;
    delete (window as any).__originalConsoleError;
  }
}

/**
 * Enhanced fetch wrapper that handles expected auth errors gracefully
 */
export async function authAwareFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  try {
    const response = await fetch(input, init);
    
    // For auth endpoints returning 401, this is expected behavior
    if (response.status === 401) {
      const url = typeof input === 'string' ? input : input.toString();
      if (url.includes('/auth/me') || url.includes('/auth/refresh')) {
        // Create a custom response that won't trigger console errors
        return new Response(
          JSON.stringify({
            success: false,
            error: { code: 'UNAUTHORIZED', message: 'Not authenticated' }
          }),
          {
            status: 401,
            statusText: 'Unauthorized',
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
    }
    
    return response;
  } catch (error) {
    throw error;
  }
}