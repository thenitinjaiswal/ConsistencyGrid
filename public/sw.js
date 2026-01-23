/**
 * Service Worker for Consistency Grid
 * Handles offline support, caching, and background sync
 */

const CACHE_VERSION = 'v1';
const CACHE_NAME = `consistency-grid-${CACHE_VERSION}`;
const RUNTIME_CACHE = `runtime-${CACHE_VERSION}`;
const API_CACHE = `api-${CACHE_VERSION}`;

// Assets to cache on install
const ASSETS_TO_CACHE = [
  '/',
  '/offline.html',
  '/globals.css',
  '/images/icon-192.png',
  '/images/icon-512.png',
];

// API routes to cache
const API_ROUTES_TO_CACHE = [
  '/api/goals',
  '/api/habits',
  '/api/reminders',
];

/**
 * Install event - cache assets
 */
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching assets');
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('[Service Worker] Failed to cache some assets:', err);
        // Don't fail installation if some assets fail to cache
        return Promise.resolve();
      });
    })
  );
  
  self.skipWaiting(); // Activate immediately
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => {
            return (
              name !== CACHE_NAME &&
              name !== RUNTIME_CACHE &&
              name !== API_CACHE
            );
          })
          .map((name) => {
            console.log('[Service Worker] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  
  self.clients.claim(); // Take control immediately
});

/**
 * Fetch event - network-first strategy for API, cache-first for assets
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome extensions and other non-http requests
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return;
  }

  // API requests - network-first, fallback to cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstStrategy(request, API_CACHE));
    return;
  }

  // HTML pages - network-first for fresh content
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(networkFirstStrategy(request, RUNTIME_CACHE));
    return;
  }

  // Assets (JS, CSS, images) - cache-first
  event.respondWith(cacheFirstStrategy(request, CACHE_NAME));
});

/**
 * Network-first strategy: try network, fallback to cache
 */
async function networkFirstStrategy(request, cacheName) {
  try {
    const response = await fetch(request);
    
    // Cache successful responses
    if (response.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('[Service Worker] Network failed, using cache:', request.url);
    const cached = await caches.match(request);
    
    if (cached) {
      return cached;
    }

    // Return offline page for navigation requests
    if (request.headers.get('accept')?.includes('text/html')) {
      return caches.match('/offline.html');
    }

    // Return offline error for API requests
    return new Response(
      JSON.stringify({ error: 'Offline' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * Cache-first strategy: try cache first, fallback to network
 */
async function cacheFirstStrategy(request, cacheName) {
  const cached = await caches.match(request);
  
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    
    if (response.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('[Service Worker] Network failed:', request.url);
    
    // Return placeholder response for failed assets
    return new Response('Asset not available offline', {
      status: 503,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}

/**
 * Background sync - sync goals/habits when back online
 */
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync:', event.tag);
  
  if (event.tag === 'sync-goals') {
    event.waitUntil(syncGoals());
  } else if (event.tag === 'sync-habits') {
    event.waitUntil(syncHabits());
  }
});

async function syncGoals() {
  try {
    const response = await fetch('/api/goals/sync', { method: 'POST' });
    console.log('[Service Worker] Goals synced:', response.status);
  } catch (error) {
    console.error('[Service Worker] Failed to sync goals:', error);
    throw error;
  }
}

async function syncHabits() {
  try {
    const response = await fetch('/api/habits/sync', { method: 'POST' });
    console.log('[Service Worker] Habits synced:', response.status);
  } catch (error) {
    console.error('[Service Worker] Failed to sync habits:', error);
    throw error;
  }
}

/**
 * Message handling - receive messages from clients
 */
self.addEventListener('message', (event) => {
  console.log('[Service Worker] Message received:', event.data);
  
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data?.type === 'CLEAR_CACHE') {
    caches.delete(RUNTIME_CACHE).then(() => {
      console.log('[Service Worker] Runtime cache cleared');
    });
  }
});
