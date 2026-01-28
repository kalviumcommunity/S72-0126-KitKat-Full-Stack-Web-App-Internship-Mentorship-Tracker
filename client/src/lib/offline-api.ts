'use client';

import { offlineStorage } from './offline-storage';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  cache?: boolean;
  cacheExpiry?: number; // minutes
}

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  isFromCache: boolean;
  isOffline: boolean;
}

class OfflineApi {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  async request<T>(endpoint: string, options: ApiOptions = {}): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      body,
      headers = {},
      cache = true,
      cacheExpiry = 30
    } = options;

    const url = `${this.baseUrl}${endpoint}`;
    const cacheKey = `${method}:${endpoint}`;

    // Check if we're offline
    const isOffline = !navigator.onLine;

    // For GET requests, try cache first if offline or cache is enabled
    if (method === 'GET' && (isOffline || cache)) {
      const cachedData = await offlineStorage.getCachedApiResponse<T>(cacheKey);
      if (cachedData) {
        return {
          data: cachedData,
          error: null,
          isFromCache: true,
          isOffline
        };
      }
    }

    // If offline and no cache, return error
    if (isOffline) {
      return {
        data: null,
        error: 'No internet connection and no cached data available',
        isFromCache: false,
        isOffline: true
      };
    }

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Cache successful GET responses
      if (method === 'GET' && cache) {
        await offlineStorage.cacheApiResponse(cacheKey, data, cacheExpiry);
      }

      return {
        data,
        error: null,
        isFromCache: false,
        isOffline: false
      };
    } catch (error) {
      // If network request fails, try cache as fallback
      if (method === 'GET') {
        const cachedData = await offlineStorage.getCachedApiResponse<T>(cacheKey);
        if (cachedData) {
          return {
            data: cachedData,
            error: null,
            isFromCache: true,
            isOffline: true
          };
        }
      }

      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        isFromCache: false,
        isOffline: true
      };
    }
  }

  // Specific API methods
  async getStudents() {
    const response = await this.request<any[]>('/students');
    
    // Cache students data separately for better offline access
    if (response.data && !response.isFromCache) {
      await offlineStorage.cacheStudents(response.data);
    }
    
    return response;
  }

  async getStudent(id: string) {
    return await this.request<any>(`/students/${id}`);
  }

  async getFeedback() {
    const response = await this.request<any[]>('/feedback');
    
    // Cache feedback data separately
    if (response.data && !response.isFromCache) {
      await offlineStorage.cacheFeedback(response.data);
    }
    
    return response;
  }

  async createFeedback(feedback: any) {
    const response = await this.request<any>('/feedback', {
      method: 'POST',
      body: feedback,
      cache: false
    });

    // If offline, queue the action for later
    if (response.isOffline) {
      await this.queueOfflineAction('createFeedback', feedback);
    }

    return response;
  }

  async getProfile() {
    const response = await this.request<any>('/profile');
    
    // Cache profile data separately
    if (response.data && !response.isFromCache) {
      await offlineStorage.cacheProfile(response.data);
    }
    
    return response;
  }

  async updateProfile(profile: any) {
    const response = await this.request<any>('/profile', {
      method: 'PUT',
      body: profile,
      cache: false
    });

    // If offline, queue the action for later
    if (response.isOffline) {
      await this.queueOfflineAction('updateProfile', profile);
    }

    return response;
  }

  // Queue actions for when back online
  private async queueOfflineAction(action: string, data: any) {
    const queueKey = `offline-queue-${Date.now()}`;
    await offlineStorage.set('cache', queueKey, {
      action,
      data,
      timestamp: Date.now()
    });
  }

  // Process queued offline actions when back online
  async processOfflineQueue() {
    const queueItems = await offlineStorage.getAll<any>('cache');
    const offlineActions = queueItems.filter(item => 
      typeof item === 'object' && item.action
    );

    for (const item of offlineActions) {
      try {
        switch (item.action) {
          case 'createFeedback':
            await this.createFeedback(item.data);
            break;
          case 'updateProfile':
            await this.updateProfile(item.data);
            break;
          // Add more actions as needed
        }
        
        // Remove processed item from queue
        await offlineStorage.delete('cache', `offline-queue-${item.timestamp}`);
      } catch (error) {
        console.error('Failed to process offline action:', error);
      }
    }
  }
}

export const offlineApi = new OfflineApi();