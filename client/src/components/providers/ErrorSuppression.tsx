'use client';

import { useEffect } from 'react';

/**
 * Component that suppresses expected authentication errors in development
 * This helps reduce console noise while maintaining proper error handling
 */
export function ErrorSuppression() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    // Store original console methods
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalLog = console.log;

    // Override console.error to filter out expected auth errors
    console.error = (...args: any[]) => {
      const message = args.join(' ');
      
      // Skip logging for expected authentication errors
      if (
        message.includes('401 (Unauthorized)') ||
        message.includes('GET http://localhost:3001/api/auth/me 401') ||
        message.includes('api/auth/me 401') ||
        message.includes('handleAuthRequest@api.ts') ||
        (message.includes('UNAUTHORIZED') && message.includes('auth')) ||
        message.includes('AuthContext.tsx') && message.includes('401')
      ) {
        return; // Suppress these expected errors
      }
      
      // Log all other errors normally
      originalError.apply(console, args);
    };

    // Also suppress related warnings
    console.warn = (...args: any[]) => {
      const message = args.join(' ');
      
      if (
        message.includes('401') && message.includes('auth') ||
        message.includes('Unauthorized') && message.includes('auth')
      ) {
        return; // Suppress auth-related warnings
      }
      
      originalWarn.apply(console, args);
    };

    // Intercept network errors at a lower level
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        
        // Don't log 401s for auth endpoints
        if (response.status === 401) {
          const url = args[0]?.toString() || '';
          if (url.includes('/api/auth/me') || url.includes('/api/auth/refresh')) {
            // Create a silent response that won't trigger console errors
            const clonedResponse = response.clone();
            return clonedResponse;
          }
        }
        
        return response;
      } catch (error) {
        throw error;
      }
    };

    // Store references for cleanup
    (window as any).__originalConsole = {
      error: originalError,
      warn: originalWarn,
      log: originalLog,
      fetch: originalFetch
    };

    // Cleanup function to restore original console methods
    return () => {
      console.error = originalError;
      console.warn = originalWarn;
      console.log = originalLog;
      window.fetch = originalFetch;
      delete (window as any).__originalConsole;
    };
  }, []);

  return null; // This component doesn't render anything
}