const CACHE_NAME = 'bible-app-cache-v5-range';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './header_logo.png?v=2',
  './bible_db_66.js',
  './bible_data/bible_db_easy.js',
  './bible_data/bible_db_hyundai.js',
  './bible_data/bible_db_niv.js',
  './bible_data/bible_db_nlt.js',
  './bible_data/bible_db_nkjv.js',
  './bible_data/bible_db_rsv.js'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 성경 DB 대용량 파일은 캐시 우선, 앱 로직(index.html, app.js, style.css)은 네트워크 우선
self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  const isBibleDb = url.includes('bible_db_');

  if (isBibleDb) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request);
      })
    );
  } else {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request))
    );
  }
});
