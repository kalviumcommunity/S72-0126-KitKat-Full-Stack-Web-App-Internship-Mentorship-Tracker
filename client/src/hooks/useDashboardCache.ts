// Dashboard Data Caching Hook
// Performance optimization for dashboard data with client-side caching

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface UseDashboardCacheOptions {
  cacheKey: string;
  ttl?: number; // Time to live in milliseconds
  refreshInterval?: number; // Auto-refresh interval
  staleWhileRevalidate?: boolean; // Return stale data while fetching fresh
}

interface UseDashboardCacheReturn<T> {
  data: T | null;
  isLoading: boolean;
  isStale: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  clearCache: () => void;
  lastUpdated: Date | null;
}

// In-memory cache store
const cacheStore = new Map<string, CacheEntry<any>>();

// Cache cleanup interval
let cleanupInterval: NodeJS.Timeout | null = null;

// Start cache cleanup if not already running
const startCacheCleanup = () => {
  if (cleanupInterval) return;
  
  cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of cacheStore.entries()) {
      if (now > entry.expiresAt) {
        cacheStore.delete(key);
      }
    }
  }, 60000); // Cleanup every minute
};

export function useDashboardCache<T>(
  fetchFn: () => Promise<T>,
  options: UseDashboardCacheOptions
): UseDashboardCacheReturn<T> {
  const {
    cacheKey,
    ttl = 5 * 60 * 1000, // 5 minutes default
    refreshInterval = 0, // No auto-refresh by default
    staleWhileRevalidate = true,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isStale, setIsStale] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchInProgress = useRef(false);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Start cache cleanup
  useEffect(() => {
    startCacheCleanup();
    return () => {
      if (cleanupInterval) {
        clearInterval(cleanupInterval);
        cleanupInterval = null;
      }
    };
  }, []);

  // Check if cached data is valid
  const isCacheValid = useCallback((entry: CacheEntry<T>): boolean => {
    return Date.now() < entry.expiresAt;
  }, []);

  // Get data from cache
  const getCachedData = useCallback((): CacheEntry<T> | null => {
    const entry = cacheStore.get(cacheKey) as CacheEntry<T> | undefined;
    return entry || null;
  }, [cacheKey]);

  // Set data in cache
  const setCachedData = useCallback((newData: T): void => {
    const now = Date.now();
    const entry: CacheEntry<T> = {
      data: newData,
      timestamp: now,
      expiresAt: now + ttl,
    };
    cacheStore.set(cacheKey, entry);
  }, [cacheKey, ttl]);

  // Fetch fresh data
  const fetchFreshData = useCallback(async (showLoading = true): Promise<T | null> => {
    if (fetchInProgress.current) return null;

    try {
      fetchInProgress.current = true;
      if (showLoading) setIsLoading(true);
      setError(null);

      const freshData = await fetchFn();
      
      // Update cache
      setCachedData(freshData);
      
      // Update state
      setData(freshData);
      setIsStale(false);
      setLastUpdated(new Date());
      
      return freshData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
      setError(errorMessage);
      console.error('Dashboard cache fetch error:', err);
      return null;
    } finally {
      fetchInProgress.current = false;
      if (showLoading) setIsLoading(false);
    }
  }, [fetchFn, setCachedData]);

  // Refresh function
  const refresh = useCallback(async (): Promise<void> => {
    await fetchFreshData(true);
  }, [fetchFreshData]);

  // Clear cache function
  const clearCache = useCallback((): void => {
    cacheStore.delete(cacheKey);
    setData(null);
    setIsStale(false);
    setLastUpdated(null);
    setError(null);
  }, [cacheKey]);

  // Initial data load
  useEffect(() => {
    const loadInitialData = async () => {
      const cachedEntry = getCachedData();
      
      if (cachedEntry) {
        // Use cached data immediately
        setData(cachedEntry.data);
        setLastUpdated(new Date(cachedEntry.timestamp));
        
        if (isCacheValid(cachedEntry)) {
          // Cache is valid, no need to fetch
          setIsStale(false);
        } else {
          // Cache is stale
          setIsStale(true);
          
          if (staleWhileRevalidate) {
            // Return stale data while fetching fresh data in background
            fetchFreshData(false);
          } else {
            // Fetch fresh data with loading state
            await fetchFreshData(true);
          }
        }
      } else {
        // No cached data, fetch fresh
        await fetchFreshData(true);
      }
    };

    loadInitialData();
  }, [cacheKey, getCachedData, isCacheValid, fetchFreshData, staleWhileRevalidate]);

  // Auto-refresh setup
  useEffect(() => {
    if (refreshInterval <= 0) return;

    const setupAutoRefresh = () => {
      refreshTimeoutRef.current = setTimeout(async () => {
        await fetchFreshData(false); // Background refresh
        setupAutoRefresh(); // Schedule next refresh
      }, refreshInterval);
    };

    setupAutoRefresh();

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [refreshInterval, fetchFreshData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);

  return {
    data,
    isLoading,
    isStale,
    error,
    refresh,
    clearCache,
    lastUpdated,
  };
}

// Utility function to preload dashboard data
export const preloadDashboardData = async <T>(
  cacheKey: string,
  fetchFn: () => Promise<T>,
  ttl = 5 * 60 * 1000
): Promise<void> => {
  try {
    const data = await fetchFn();
    const now = Date.now();
    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      expiresAt: now + ttl,
    };
    cacheStore.set(cacheKey, entry);
  } catch (error) {
    console.error('Failed to preload dashboard data:', error);
  }
};

// Utility function to invalidate cache entries
export const invalidateDashboardCache = (pattern?: string): void => {
  if (!pattern) {
    cacheStore.clear();
    return;
  }

  const regex = new RegExp(pattern);
  for (const key of cacheStore.keys()) {
    if (regex.test(key)) {
      cacheStore.delete(key);
    }
  }
};