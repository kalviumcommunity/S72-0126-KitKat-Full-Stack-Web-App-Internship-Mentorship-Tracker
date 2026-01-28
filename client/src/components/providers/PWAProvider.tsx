'use client';

import { useEffect } from 'react';
import { offlineApi } from '@/lib/offline-api';

export function PWAProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered successfully:', registration);
          
          // Handle updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New content is available, prompt user to refresh
                  if (confirm('New version available! Refresh to update?')) {
                    window.location.reload();
                  }
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });

      // Handle messages from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'CACHE_UPDATED') {
          console.log('Cache updated:', event.data.payload);
        }
      });

      // Process offline queue when coming back online
      window.addEventListener('online', () => {
        console.log('Back online, processing offline queue...');
        offlineApi.processOfflineQueue();
      });
    }

    // Initialize offline storage
    import('@/lib/offline-storage').then(({ offlineStorage }) => {
      offlineStorage.init().catch(console.error);
    });
  }, []);

  return <>{children}</>;
}