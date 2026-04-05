/* ============================================================
   CÍRCULO DE SABORES — Service Worker
   Cache-first strategy for offline support
   ============================================================ */
const CACHE_NAME  = 'cds-cache-v1';
const CORE_ASSETS = [
  './',
  './index.html',
  './app.js',
  './styles.css',
  './manifest.json',
];

/* ── INSTALL: cache core assets ─────────────────────────── */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(CORE_ASSETS);
    })
  );
  self.skipWaiting();
});

/* ── ACTIVATE: purge old caches ─────────────────────────── */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

/* ── FETCH: cache-first, network fallback ───────────────── */
self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  // Skip non-http(s) schemes (chrome-extension, etc.)
  if (!event.request.url.startsWith('http')) return;

  // Skip Firebase / external API requests — always network
  const url = new URL(event.request.url);
  const skipHosts = ['firestore.googleapis.com', 'www.googleapis.com',
                     'fonts.googleapis.com', 'fonts.gstatic.com',
                     'cdnjs.cloudflare.com', 'www.gstatic.com'];
  if (skipHosts.some(h => url.hostname.includes(h))) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request)
        .then(response => {
          // Cache successful responses for local assets
          if (response.ok && url.origin === self.location.origin) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => {
          // Offline fallback: return index.html for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
    })
  );
});
