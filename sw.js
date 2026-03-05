/* ============================================
   Vietnam Field Journal — Service Worker
   Network-first for code, cache-first for images
   ============================================ */

const CACHE = 'vn-journal-v3';

const SHELL = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './resources/images/ho-chi-minh.jpg',
  './resources/images/hoi_an.jpg',
  './resources/images/hanoi.jpg',
  './resources/images/ninh-binh.jpg',
  './resources/images/phong-nha.jpg'
];

const CODE_FILES = new Set(['/', '/index.html', '/styles.css', '/app.js', '/manifest.json']);

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Only handle same-origin GET requests
  if (e.request.method !== 'GET' || url.origin !== self.location.origin) return;

  const path = url.pathname.replace(/\/$/, '') || '/';
  const isCodeFile = CODE_FILES.has(path) || path === '';

  if (isCodeFile || url.hostname.includes('fonts.g')) {
    // Network-first: always try fresh copy, fall back to cache offline
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // Images + everything else: cache-first (big files that rarely change)
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res && res.status === 200 && res.type !== 'opaque') {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      });
    })
  );
});
