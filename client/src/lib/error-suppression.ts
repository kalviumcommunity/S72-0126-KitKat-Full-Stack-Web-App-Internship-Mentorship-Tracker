// Error suppression utilities for development
// This helps reduce console noise from expected authentication failures

let isSuppressionActive = false;
let originalConsoleError: typeof console.error;

/**
 * Initialize error suppression for development
 * Call this early in the application lifecycle
 */
export function initializeErrorSuppression() {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') {
    return;
  }

  if (isSuppressionActive) {
    return; // Already initialized
  }

  // Store original console.error
  originalConsoleError = console.error;

  // Override console.error to filter out expected auth errors
  console.error = (...args: any[]) => {
    const message = args.join(' ');
    
    // Skip logging for expected authentication errors
    if (
      message.includes('401 (Unauthorized)') ||
      message.includes('GET http://localhost:3001/api/auth/me 401') ||
      message.includes('api/auth/me 401') ||
      message.includes('handleAuthRequest@api.ts') ||
      message.includes('AuthContext.tsx') && message.includes('401') ||
      (message.includes('UNAUTHORIZED') && message.includes('auth'))
    ) {
      return; // Suppress these expected errors
    }
    
    // Log all other errors normally
    originalConsoleError.apply(console, args);
  };

  isSuppressionActive = true;
  console.log('🔧 Development mode: Auth error suppression active');
}

/**
 * Restore original console.error behavior
 */
export function restoreErrorLogging() {
  if (typeof window === 'undefined' || !isSuppressionActive) {
    return;
  }

  if (originalConsoleError) {
    console.error = originalConsoleError;
    isSuppressionActive = false;
    console.log('✅ Error logging restored to normal');
  }
}

/**
 * Check if error suppression is currently active
 */
export function isErrorSuppressionActive(): boolean {
  return isSuppressionActive;
}

// Auto-initialize in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Use setTimeout to ensure this runs after the page loads
  setTimeout(initializeErrorSuppression, 100);
}