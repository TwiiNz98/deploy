/* ============================================================
   CÍRCULO DE SABORES — Service Worker v2.0
   Strategies:
     · Static assets  → Cache-first  (long TTL)
     · Own-origin     → Stale-While-Revalidate (offline-resilient)
     · Firebase / CDN → Network-only (bypass cache)
   ============================================================ */

const CACHE_VERSION  = 'cds-v2';
const STATIC_CACHE   = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE  = `${CACHE_VERSION}-dynamic`;

/* Core assets pre-cached on install */
const STATIC_ASSETS = [
  './',
  './index.html',
  './app.js',
  './styles.css',
  './manifest.json',
];

/* Hosts that must always hit the network (auth, Firestore, etc.) */
const NETWORK_ONLY_HOSTS = [
  'firestore.googleapis.com',
  'www.googleapis.com',
  'identitytoolkit.googleapis.com',
  'securetoken.googleapis.com',
  'firebase.googleapis.com',
  'firebasestorage.googleapis.com',
];

/* External static resources to cache aggressively */
const CACHEABLE_CDN_HOSTS = [
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'cdnjs.cloudflare.com',
];

/* ── INSTALL: pre-cache core assets ─────────────────────── */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache =>
      /* Use allSettled so one bad asset doesn't break the whole SW */
      Promise.allSettled(STATIC_ASSETS.map(url =>
        cache.add(url).catch(err => console.warn('[SW] pre-cache miss:', url, err))
      ))
    )
  );
  /* Take control immediately; page refreshes after client.claim() */
  self.skipWaiting();
});

/* ── ACTIVATE: purge stale caches ───────────────────────── */
self.addEventListener('activate', event => {
  const KEEP = [STATIC_CACHE, DYNAMIC_CACHE];
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => !KEEP.includes(k)).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

/* ── FETCH ───────────────────────────────────────────────── */
self.addEventListener('fetch', event => {
  /* Ignore non-GET and non-HTTP requests */
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith('http')) return;

  const url = new URL(event.request.url);

  /* Always network for Firebase and auth endpoints */
  if (NETWORK_ONLY_HOSTS.some(h => url.hostname.includes(h))) return;

  /* CDN fonts/icons: cache-first, very long TTL */
  if (CACHEABLE_CDN_HOSTS.some(h => url.hostname.includes(h))) {
    event.respondWith(_cacheFirst(event.request, STATIC_CACHE));
    return;
  }

  /* Own-origin assets: stale-while-revalidate */
  if (url.origin === self.location.origin) {
    event.respondWith(_staleWhileRevalidate(event.request));
    return;
  }
});

/* ── MESSAGE: runtime control ───────────────────────────── */
self.addEventListener('message', event => {
  if (!event.data) return;
  switch (event.data.type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
    case 'CLEAR_CACHE':
      caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))));
      break;
    case 'PING':
      event.source?.postMessage({ type: 'PONG', version: CACHE_VERSION });
      break;
  }
});

/* ── STRATEGY: Cache-first ──────────────────────────────── */
async function _cacheFirst(request, cacheName = DYNAMIC_CACHE) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('Sin conexión', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
}

/* ── STRATEGY: Stale-while-revalidate ──────────────────── */
async function _staleWhileRevalidate(request) {
  const cache  = await caches.open(DYNAMIC_CACHE);
  const cached = await cache.match(request);

  /* Kick off background refresh (fire-and-forget) */
  const revalidate = fetch(request)
    .then(response => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => null);

  if (cached) {
    revalidate; /* intentional: return stale while updating */
    return cached;
  }

  /* No cache: wait for network */
  const fresh = await revalidate;
  if (fresh) return fresh;

  /* Offline navigation fallback: serve shell */
  if (request.mode === 'navigate') {
    const shell = await cache.match('./index.html');
    if (shell) return shell;
  }

  return new Response('Sin conexión', {
    status: 503,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
