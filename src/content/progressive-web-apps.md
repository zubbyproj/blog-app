---
title: "Building Progressive Web Apps (PWAs)"
date: "2024-02-10"
excerpt: "Learn how to transform your web application into a Progressive Web App with offline capabilities and native-like features"
imageUrl: "/images/pwa.jpg"
---

# Building Progressive Web Apps (PWAs)

Progressive Web Apps combine the best of web and native applications. Let's explore how to build one.

## Web App Manifest

Create a manifest file for your PWA:

```json
// public/manifest.json
{
  "name": "My PWA App",
  "short_name": "PWA App",
  "description": "A Progressive Web App example",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

Link the manifest in your HTML:

```html
<!-- pages/_document.tsx -->
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#000000" />
<link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black" />
```

## Service Worker

Register a service worker for offline functionality:

```typescript
// public/service-worker.js
const CACHE_NAME = 'my-pwa-cache-v1';
const urlsToCache = [
  '/',
  '/styles/main.css',
  '/scripts/main.js',
  '/images/logo.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then((response) => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          });
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
```

Register the service worker:

```typescript
// utils/serviceWorker.ts
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('SW registered:', registration);
        })
        .catch((error) => {
          console.log('SW registration failed:', error);
        });
    });
  }
}
```

## Offline Support

Implement offline fallback pages:

```typescript
// pages/offline.tsx
import { useEffect, useState } from 'react';

export default function Offline() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) {
    return <div>You are back online!</div>;
  }

  return (
    <div className="offline-page">
      <h1>You are offline</h1>
      <p>Please check your internet connection</p>
    </div>
  );
}
```

## Background Sync

Implement background sync for offline actions:

```typescript
// utils/backgroundSync.ts
export async function registerBackgroundSync() {
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register('syncData');
    } catch (err) {
      console.error('Background sync registration failed:', err);
    }
  }
}

// In service worker
self.addEventListener('sync', (event) => {
  if (event.tag === 'syncData') {
    event.waitUntil(
      syncData()
    );
  }
});

async function syncData() {
  try {
    const dataToSync = await getOfflineData();
    await sendToServer(dataToSync);
    await clearOfflineData();
  } catch (error) {
    console.error('Sync failed:', error);
  }
}
```

## Push Notifications

Implement push notifications:

```typescript
// utils/notifications.ts
export async function requestNotificationPermission() {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
      });
      
      // Send subscription to server
      await fetch('/api/push-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription)
      });
    }
  }
}

// In service worker
self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('New Notification', options)
  );
});
```

## App Shell Architecture

Implement the App Shell pattern:

```typescript
// components/AppShell.tsx
import { Suspense } from 'react';
import { Header } from './Header';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { LoadingSpinner } from './LoadingSpinner';

export function AppShell({ children }) {
  return (
    <div className="app-shell">
      <Header />
      <Navigation />
      <main className="content">
        <Suspense fallback={<LoadingSpinner />}>
          {children}
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
```

## Best Practices

1. **Performance**
   - Implement app shell architecture
   - Use service workers for caching
   - Optimize assets and loading

2. **Offline Support**
   - Cache critical resources
   - Provide offline fallback
   - Implement background sync

3. **User Experience**
   - Add to home screen prompt
   - Smooth transitions
   - Responsive design

## Testing PWA Features

Test your PWA implementation:

```typescript
// __tests__/pwa.test.ts
describe('PWA Features', () => {
  it('service worker registers successfully', async () => {
    const registration = await navigator.serviceWorker.register('/service-worker.js');
    expect(registration.active).toBeTruthy();
  });

  it('caches static assets', async () => {
    const cache = await caches.open('my-pwa-cache-v1');
    const cachedResponse = await cache.match('/');
    expect(cachedResponse).toBeTruthy();
  });

  it('handles offline mode', async () => {
    await goOffline();
    const response = await fetch('/');
    expect(response.status).toBe(200);
    await goOnline();
  });
});
```

## Conclusion

Progressive Web Apps provide a powerful way to deliver native-like experiences through the web platform. By implementing these features, you can create fast, reliable, and engaging web applications that work offline and can be installed on users' devices. 