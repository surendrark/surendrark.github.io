const STATIC_CACHE = 'static-cache-v1.0.1';
const DYNAMIC_CACHE = 'dynamic-cache-v1.0.1';

const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/assets/files/Curriculum_Vitae_Surendra.pdf'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
      .catch(() => {})
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
            .map((name) => caches.delete(name))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (!request.url.startsWith('http')) return;

  if (request.mode === 'navigate') {
    // Network-first for page navigations so each route (e.g. /gallery, /instances,
    // /flights, /fun) returns its own HTML. Fall back to the cached page, then to
    // the home page, only when offline.
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status === 200) {
            const copy = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() =>
          caches.match(request).then((cached) => cached ?? caches.match('/'))
        )
    );
    return;
  }

  const url = new URL(request.url);
  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/assets/') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css')
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.status === 200) {
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, response.clone()));
          }
          return response;
        });
      })
    );
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.status === 200 && request.method === 'GET') {
          caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, response.clone()));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});
