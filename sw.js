const CACHE_NAME = 'cheatsheets-v1';
const urlsToCache = [
  '/',
  '/cheatsheets-app/',
  '/cheatsheets-app/index.html',
  '/cheatsheets-app/manifest.json',
  '/cheatsheets-app/src/main.tsx',
  '/cheatsheets-app/src/App.tsx',
  // Add other assets like CSS, JS bundles
  // Note: In production, these will be hashed, so cache dynamically
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache if available
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});