/**
 * Service Worker for Consistency Grid
 * Handles offline support, caching, and background sync
 */

const CACHE_VERSION = 'v1';
const CACHE_NAME = `consistency-grid-${CACHE_VERSION}`;
const RUNTIME_CACHE = `runtime-${CACHE_VERSION}`;
const API_CACHE = `api-${CACHE_VERSION}`;

// Assets to cache on install
// Keep this minimal - only cache files that are guaranteed to exist
const ASSETS_TO_CACHE = [
  '/',
  '/offline.html',
];

// API routes to cache (disabled during install - cache on first use)
const API_ROUTES_TO_CACHE = [];

/**
 * Install event - cache assets
 */
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching assets');
      // Cache assets individually to avoid addAll failure blocking entire install
      return Promise.all(
        ASSETS_TO_CACHE.map((asset) =>
          fetch(asset)
            .then((response) => {
              if (response.ok) {
                return cache.put(asset, response);
              }
            })
            .catch((err) => {
              console.warn(`[Service Worker] Failed to cache ${asset}:`, err.message);
              // Continue with other assets if one fails
            })
        )
      ).catch((err) => {
        console.warn('[Service Worker] Asset caching error:', err);
        // Don't fail installation if caching fails
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

  // External fonts (Google Fonts) - network-first to get latest
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(networkFirstStrategy(request, CACHE_NAME));
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
    if (response.status !== 200) {
      console.warn('[Service Worker] Goals sync returned non-OK status:', response.status);
    }
  } catch (error) {
    console.error('[Service Worker] Failed to sync goals:', error);
    throw error;
  }
}

async function syncHabits() {
  try {
    const response = await fetch('/api/habits/sync', { method: 'POST' });
    if (response.status !== 200) {
      console.warn('[Service Worker] Habits sync returned non-OK status:', response.status);
    }
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
