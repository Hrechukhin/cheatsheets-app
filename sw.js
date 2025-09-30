const CACHE_NAME = 'cheatsheets-v1';
const urlsToCache = [
  '/cheatsheets-app/',
  '/cheatsheets-app/index.html',
  '/cheatsheets-app/manifest.json',
  '/cheatsheets-app/icon.svg',
  '/cheatsheets-app/src/data/cheatSheets.json',
  '/cheatsheets-app/src/data/cheatSheets-es.json',
  '/cheatsheets-app/src/data/subjects.json',
  '/cheatsheets-app/src/data/subjects-es.json'
  // Note: JS and CSS bundles will be cached dynamically on fetch
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

// Fetch event - serve from cache if available, cache new assets
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).then(response => {
          // Cache JS, CSS, and other assets
          if (event.request.url.includes('.js') || event.request.url.includes('.css') || event.request.url.includes('.woff')) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        });
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