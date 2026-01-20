// API Error Handling Utilities
// Comprehensive error handling for API requests with retry logic

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: any;
  timestamp: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
}

export class NetworkError extends Error {
  constructor(message: string, public status: number, public code?: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends Error {
  constructor(message: string, public errors: Record<string, string>) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
  }
}

// Enhanced fetch with error handling and retry logic
export async function apiRequest<T>(
  url: string,
  options: RequestInit & {
    retries?: number;
    retryDelay?: number;
    timeout?: number;
  } = {}
): Promise<T> {
  const {
    retries = 3,
    retryDelay = 1000,
    timeout = 10000,
    ...fetchOptions
  } = options;

  // Set default headers
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  // Add authentication token if available
  const token = getAuthToken();
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const requestOptions: RequestInit = {
    ...fetchOptions,
    headers: defaultHeaders,
  };

  let lastError: Error;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...requestOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle different response statuses
      if (!response.ok) {
        await handleErrorResponse(response);
      }

      // Parse response
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        
        // Handle API response format
        if (data.success === false) {
          throw new NetworkError(
            data.error?.message || data.message || 'API request failed',
            response.status,
            data.error?.code
          );
        }
        
        return data.data || data;
      } else {
        // Handle non-JSON responses
        const text = await response.text();
        return text as unknown as T;
      }
    } catch (error) {
      lastError = error as Error;

      // Don't retry on certain errors
      if (
        error instanceof AuthenticationError ||
        error instanceof AuthorizationError ||
        error instanceof ValidationError ||
        (error as any).name === 'AbortError'
      ) {
        throw error;
      }

      // Don't retry on client errors (4xx except 429)
      if (error instanceof NetworkError && 
          error.status >= 400 && 
          error.status < 500 && 
          error.status !== 429) {
        throw error;
      }

      // If this is the last attempt, throw the error
      if (attempt === retries) {
        throw error;
      }

      // Wait before retrying (exponential backoff)
      const delay = retryDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

// Handle error responses
async function handleErrorResponse(response: Response): Promise<never> {
  let errorData: any;
  
  try {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      errorData = await response.json();
    } else {
      errorData = { message: await response.text() };
    }
  } catch {
    errorData = { message: 'Unknown error occurred' };
  }

  const message = errorData.error?.message || errorData.message || `HTTP ${response.status}`;
  const code = errorData.error?.code || errorData.code;

  switch (response.status) {
    case 400:
      if (errorData.errors) {
        throw new ValidationError(message, errorData.errors);
      }
      throw new NetworkError(message, response.status, code);
    
    case 401:
      // Clear invalid token
      clearAuthToken();
      throw new AuthenticationError(message);
    
    case 403:
      throw new AuthorizationError(message);
    
    case 404:
      throw new NetworkError('Resource not found', response.status, code);
    
    case 409:
      throw new NetworkError('Conflict: ' + message, response.status, code);
    
    case 422:
      if (errorData.errors) {
        throw new ValidationError(message, errorData.errors);
      }
      throw new NetworkError(message, response.status, code);
    
    case 429:
      throw new NetworkError('Too many requests. Please try again later.', response.status, code);
    
    case 500:
      throw new NetworkError('Internal server error. Please try again later.', response.status, code);
    
    case 502:
    case 503:
    case 504:
      throw new NetworkError('Service temporarily unavailable. Please try again later.', response.status, code);
    
    default:
      throw new NetworkError(message, response.status, code);
  }
}

// Get authentication token from storage
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  // Try to get from cookie first
  const cookies = document.cookie.split(';');
  const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth-token='));
  if (authCookie) {
    return authCookie.split('=')[1];
  }
  
  // Fallback to localStorage
  return localStorage.getItem('auth-token');
}

// Clear authentication token
function clearAuthToken(): void {
  if (typeof window === 'undefined') return;
  
  // Clear cookie
  document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  
  // Clear localStorage
  localStorage.removeItem('auth-token');
}

// API request helpers
export const api = {
  get: <T>(url: string, options?: RequestInit) => 
    apiRequest<T>(url, { ...options, method: 'GET' }),
  
  post: <T>(url: string, data?: any, options?: RequestInit) => 
    apiRequest<T>(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),
  
  put: <T>(url: string, data?: any, options?: RequestInit) => 
    apiRequest<T>(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),
  
  patch: <T>(url: string, data?: any, options?: RequestInit) => 
    apiRequest<T>(url, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),
  
  delete: <T>(url: string, options?: RequestInit) => 
    apiRequest<T>(url, { ...options, method: 'DELETE' }),
};

// Error message helpers
export function getErrorMessage(error: unknown): string {
  if (error instanceof ValidationError) {
    const firstError = Object.values(error.errors)[0];
    return firstError || error.message;
  }
  
  if (error instanceof NetworkError) {
    return error.message;
  }
  
  if (error instanceof AuthenticationError) {
    return 'Please log in to continue';
  }
  
  if (error instanceof AuthorizationError) {
    return 'You do not have permission to perform this action';
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
}

// Get user-friendly error message
export function getUserFriendlyErrorMessage(error: unknown): string {
  const message = getErrorMessage(error);
  
  // Map technical errors to user-friendly messages
  const errorMappings: Record<string, string> = {
    'Network request failed': 'Unable to connect to the server. Please check your internet connection.',
    'Failed to fetch': 'Unable to connect to the server. Please check your internet connection.',
    'Internal server error': 'Something went wrong on our end. Please try again later.',
    'Service temporarily unavailable': 'The service is temporarily unavailable. Please try again in a few minutes.',
    'Too many requests': 'You are making too many requests. Please wait a moment and try again.',
  };
  
  return errorMappings[message] || message;
}

// Retry helper for failed operations
export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Exponential backoff
      const waitTime = delay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  
  throw lastError!;
}

// Check if error is retryable
export function isRetryableError(error: unknown): boolean {
  if (error instanceof NetworkError) {
    // Retry on server errors and rate limiting
    return error.status >= 500 || error.status === 429;
  }
  
  if (error instanceof Error) {
    // Retry on network errors
    return error.message.includes('fetch') || 
           error.message.includes('network') ||
           error.name === 'NetworkError';
  }
  
  return false;
}

// Log errors for debugging
export function logError(error: unknown, context?: string): void {
  const errorInfo = {
    message: getErrorMessage(error),
    context,
    timestamp: new Date().toISOString(),
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
    url: typeof window !== 'undefined' ? window.location.href : 'server',
  };
  
  if (process.env.NODE_ENV === 'development') {
    console.error('API Error:', errorInfo, error);
  } else {
    // In production, you might want to send this to an error tracking service
    console.error('API Error:', errorInfo.message);
  }
}