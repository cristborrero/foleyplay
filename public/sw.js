const CACHE = 'foleyplay-v1';
const PRECACHE = ['/', '/browse'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Robust Fetch handler: only handle same-origin HTTP/HTTPS GET requests
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;

  let url;
  try {
    url = new URL(e.request.url);
  } catch {
    return;
  }

  // Only handle HTTP/HTTPS (filters out chrome-extension, data:, etc.)
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  // Only handle same-origin requests (avoids CORS and external asset issues)
  if (url.origin !== self.location.origin) return;

  // Do not cache API routes
  if (url.pathname.startsWith('/api/')) return;

  e.respondWith(
    fetch(e.request)
      .then((res) => {
        // Cache successful static responses
        if (res.ok && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, clone));
        }
        return res;
      })
      .catch(async () => {
        const cached = await caches.match(e.request);
        if (cached) return cached;
        // Let it fail naturally without returning undefined to avoid Response type error
        throw new Error('Offline and not cached');
      })
  );
});
