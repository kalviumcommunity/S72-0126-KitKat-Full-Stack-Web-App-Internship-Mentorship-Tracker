// API Integration Layer
// Handles API calls with error handling, loading states, and data transformation

import { apiClient } from './api';
import type { ApiResponse } from './types';

// ============================================
// API INTEGRATION UTILITIES
// ============================================

/**
 * Generic API call wrapper with error handling
 */
export async function apiCall<T>(
  apiFunction: () => Promise<ApiResponse<T>>,
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (error: string) => void;
    showLoading?: boolean;
  }
): Promise<{ data: T | null; error: string | null; success: boolean }> {
  try {
    const response = await apiFunction();

    if (response.success && response.data) {
      if (options?.onSuccess) {
        options.onSuccess(response.data);
      }
      return { data: response.data, error: null, success: true };
    } else {
      const error = response.error || 'An error occurred';
      if (options?.onError) {
        options.onError(error);
      }
      return { data: null, error, success: false };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Network error';
    if (options?.onError) {
      options.onError(errorMessage);
    }
    return { data: null, error: errorMessage, success: false };
  }
}

/**
 * Check if API is available
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Get API base URL
 */
export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
}

/**
 * Check if we should use mock data (API not available)
 */
export async function shouldUseMockData(): Promise<boolean> {
  const isHealthy = await checkApiHealth();
  return !isHealthy;
}

// ============================================
// API INTEGRATION STATUS
// ============================================

export interface ApiIntegrationStatus {
  isConnected: boolean;
  baseUrl: string;
  useMockData: boolean;
  lastChecked: Date;
}

let cachedStatus: ApiIntegrationStatus | null = null;
let statusCheckPromise: Promise<ApiIntegrationStatus> | null = null;

/**
 * Get API integration status with caching
 */
export async function getApiStatus(): Promise<ApiIntegrationStatus> {
  // Return cached status if available and recent (< 30 seconds old)
  if (cachedStatus && Date.now() - cachedStatus.lastChecked.getTime() < 30000) {
    return cachedStatus;
  }

  // If a check is already in progress, wait for it
  if (statusCheckPromise) {
    return statusCheckPromise;
  }

  // Start new status check
  statusCheckPromise = (async () => {
    const isConnected = await checkApiHealth();
    const status: ApiIntegrationStatus = {
      isConnected,
      baseUrl: getApiBaseUrl(),
      useMockData: !isConnected,
      lastChecked: new Date(),
    };
    cachedStatus = status;
    statusCheckPromise = null;
    return status;
  })();

  return statusCheckPromise;
}

/**
 * Clear cached API status
 */
export function clearApiStatusCache(): void {
  cachedStatus = null;
  statusCheckPromise = null;
}

// ============================================
// DATA TRANSFORMATION UTILITIES
// ============================================

/**
 * Transform date strings to Date objects
 */
export function transformDates<T extends Record<string, any>>(
  data: T,
  dateFields: (keyof T)[]
): T {
  const transformed = { ...data };
  dateFields.forEach((field) => {
    if (transformed[field] && typeof transformed[field] === 'string') {
      transformed[field] = new Date(transformed[field] as string) as any;
    }
  });
  return transformed;
}

/**
 * Transform API response to frontend format
 */
export function transformApiResponse<T>(data: any): T {
  // Add any global transformations here
  return data as T;
}

// ============================================
// ERROR HANDLING UTILITIES
// ============================================

export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: any;
}

/**
 * Parse API error response
 */
export function parseApiError(error: any): ApiError {
  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'CLIENT_ERROR',
    };
  }

  if (typeof error === 'string') {
    return {
      message: error,
      code: 'UNKNOWN_ERROR',
    };
  }

  return {
    message: error?.message || 'An unexpected error occurred',
    code: error?.code || 'UNKNOWN_ERROR',
    statusCode: error?.statusCode,
    details: error?.details,
  };
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyErrorMessage(error: ApiError): string {
  const errorMessages: Record<string, string> = {
    NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection.',
    UNAUTHORIZED: 'You are not authorized to perform this action. Please log in again.',
    FORBIDDEN: 'You do not have permission to access this resource.',
    NOT_FOUND: 'The requested resource was not found.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    SERVER_ERROR: 'A server error occurred. Please try again later.',
    TIMEOUT: 'The request timed out. Please try again.',
  };

  return errorMessages[error.code || ''] || error.message;
}

// ============================================
// RETRY LOGIC
// ============================================

export interface RetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  shouldRetry?: (error: ApiError) => boolean;
}

/**
 * Retry API call with exponential backoff
 */
export async function retryApiCall<T>(
  apiFunction: () => Promise<ApiResponse<T>>,
  options: RetryOptions = {}
): Promise<ApiResponse<T>> {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    shouldRetry = (error) => error.code === 'NETWORK_ERROR',
  } = options;

  let lastError: ApiError | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await apiFunction();
      
      if (response.success) {
        return response;
      }

      lastError = parseApiError(response.error);

      if (!shouldRetry(lastError) || attempt === maxRetries) {
        return response;
      }

      // Wait before retrying with exponential backoff
      await new Promise((resolve) => setTimeout(resolve, retryDelay * Math.pow(2, attempt)));
    } catch (error) {
      lastError = parseApiError(error);

      if (!shouldRetry(lastError) || attempt === maxRetries) {
        return {
          success: false,
          error: lastError.message,
        };
      }

      await new Promise((resolve) => setTimeout(resolve, retryDelay * Math.pow(2, attempt)));
    }
  }

  return {
    success: false,
    error: lastError?.message || 'Max retries exceeded',
  };
}

// ============================================
// CACHE UTILITIES
// ============================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry<any>>();

/**
 * Get cached data
 */
export function getCachedData<T>(key: string): T | null {
  const entry = cache.get(key);
  
  if (!entry) {
    return null;
  }

  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }

  return entry.data;
}

/**
 * Set cached data
 */
export function setCachedData<T>(key: string, data: T, ttl: number = 60000): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    expiresAt: Date.now() + ttl,
  });
}

/**
 * Clear cache
 */
export function clearCache(key?: string): void {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
}

/**
 * API call with caching
 */
export async function cachedApiCall<T>(
  key: string,
  apiFunction: () => Promise<ApiResponse<T>>,
  ttl: number = 60000
): Promise<ApiResponse<T>> {
  // Check cache first
  const cached = getCachedData<T>(key);
  if (cached) {
    return {
      success: true,
      data: cached,
    };
  }

  // Make API call
  const response = await apiFunction();

  // Cache successful responses
  if (response.success && response.data) {
    setCachedData(key, response.data, ttl);
  }

  return response;
}

// ============================================
// BATCH API CALLS
// ============================================

/**
 * Execute multiple API calls in parallel
 */
export async function batchApiCalls<T extends any[]>(
  apiCalls: (() => Promise<ApiResponse<any>>)[]
): Promise<{ results: T; errors: (string | null)[] }> {
  const promises = apiCalls.map((call) =>
    call().catch((error) => ({
      success: false,
      error: parseApiError(error).message,
    }))
  );

  const responses = await Promise.all(promises);

  const results: any[] = [];
  const errors: (string | null)[] = [];

  responses.forEach((response) => {
    if (response.success && response.data) {
      results.push(response.data);
      errors.push(null);
    } else {
      results.push(null);
      errors.push(response.error || 'Unknown error');
    }
  });

  return { results: results as T, errors };
}

// ============================================
// WEBSOCKET INTEGRATION (Future)
// ============================================

export interface WebSocketConfig {
  url: string;
  reconnect?: boolean;
  reconnectDelay?: number;
  maxReconnectAttempts?: number;
}

/**
 * WebSocket connection manager (placeholder for future implementation)
 */
export class WebSocketManager {
  private ws: WebSocket | null = null;
  private config: WebSocketConfig;
  private reconnectAttempts = 0;

  constructor(config: WebSocketConfig) {
    this.config = config;
  }

  connect(): void {
    // TODO: Implement WebSocket connection
    console.log('WebSocket connection not yet implemented');
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  send(data: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }
}

// ============================================
// EXPORT ALL
// ============================================

export default {
  apiCall,
  checkApiHealth,
  getApiBaseUrl,
  shouldUseMockData,
  getApiStatus,
  clearApiStatusCache,
  transformDates,
  transformApiResponse,
  parseApiError,
  getUserFriendlyErrorMessage,
  retryApiCall,
  getCachedData,
  setCachedData,
  clearCache,
  cachedApiCall,
  batchApiCalls,
  WebSocketManager,
};