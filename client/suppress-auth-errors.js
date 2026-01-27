// Browser console script to suppress expected 401 authentication errors
// Run this in your browser's developer console if you're still seeing auth errors

(function() {
  console.log('🔧 Suppressing expected authentication errors...');
  
  // Store original console.error
  const originalError = console.error;
  
  // Override console.error to filter out auth errors
  console.error = function(...args) {
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
  
  console.log('✅ Auth error suppression active! Expected 401 errors will be hidden.');
  console.log('💡 To restore normal logging, refresh the page.');
  
  // Store reference to restore if needed
  window.__originalConsoleError = originalError;
})();

// To restore normal error logging, run:
// console.error = window.__originalConsoleError;