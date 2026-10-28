const CACHE_NAME = 'paniel-walk-v15-20261029';
const ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/imported_data.js',
  './js/store.js',
  './js/charts.js',
  './js/app.js',
  './assets/apple-touch-icon.png',
  './assets/login_church_logo.png',
  './manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Network-First 전략: 온라인일 때는 항상 최신 일기 데이터 및 앱 코드를 가져오고, 오프라인일 때만 캐시 사용
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request, { cache: 'no-cache' })
      .then((res) => {
        if (res && res.status === 200 && res.type === 'basic') {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
