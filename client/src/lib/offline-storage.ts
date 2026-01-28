'use client';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry?: number;
}

class OfflineStorage {
  private dbName = 'uimp-offline-db';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores
        if (!db.objectStoreNames.contains('students')) {
          db.createObjectStore('students', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('feedback')) {
          db.createObjectStore('feedback', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('profile')) {
          db.createObjectStore('profile', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('cache')) {
          db.createObjectStore('cache', { keyPath: 'key' });
        }
      };
    });
  }

  async set<T>(storeName: string, key: string, data: T, expiryMinutes?: number): Promise<void> {
    if (!this.db) await this.init();

    const expiry = expiryMinutes ? Date.now() + (expiryMinutes * 60 * 1000) : undefined;
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      expiry
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put({ key, ...item });

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async get<T>(storeName: string, key: string): Promise<T | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const result = request.result as CacheItem<T> & { key: string };
        
        if (!result) {
          resolve(null);
          return;
        }

        // Check if expired
        if (result.expiry && Date.now() > result.expiry) {
          this.delete(storeName, key);
          resolve(null);
          return;
        }

        resolve(result.data);
      };
    });
  }

  async delete(storeName: string, key: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getAll<T>(storeName: string): Promise<T[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const results = request.result as (CacheItem<T> & { key: string })[];
        const validResults = results
          .filter(item => !item.expiry || Date.now() <= item.expiry)
          .map(item => item.data);
        
        resolve(validResults);
      };
    });
  }

  async clear(storeName: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  // Cache API responses
  async cacheApiResponse<T>(endpoint: string, data: T, expiryMinutes = 30): Promise<void> {
    await this.set('cache', endpoint, data, expiryMinutes);
  }

  async getCachedApiResponse<T>(endpoint: string): Promise<T | null> {
    return await this.get<T>('cache', endpoint);
  }

  // Student data caching
  async cacheStudents(students: any[]): Promise<void> {
    for (const student of students) {
      await this.set('students', student.id, student, 60); // Cache for 1 hour
    }
  }

  async getCachedStudents(): Promise<any[]> {
    return await this.getAll('students');
  }

  // Feedback data caching
  async cacheFeedback(feedback: any[]): Promise<void> {
    for (const item of feedback) {
      await this.set('feedback', item.id, item, 60); // Cache for 1 hour
    }
  }

  async getCachedFeedback(): Promise<any[]> {
    return await this.getAll('feedback');
  }

  // Profile data caching
  async cacheProfile(profile: any): Promise<void> {
    await this.set('profile', 'user-profile', profile, 120); // Cache for 2 hours
  }

  async getCachedProfile(): Promise<any | null> {
    return await this.get('profile', 'user-profile');
  }
}

export const offlineStorage = new OfflineStorage();