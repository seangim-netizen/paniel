const CACHE_NAME = 'bible-app-cache-v3-clean';
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

// 서비스 워커 설치 시 자원 사전 캐싱
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching all app shell and bible databases');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// 활성화 시 오래된 캐시 정리
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Clearing old cache', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 네트워크 요청 가로채기: 캐시 우선 (오프라인/비행기모드 완벽 대응)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        // 동적으로 추가되는 자원이 있다면 여기에 추가 캐싱할 수 있으나,
        // 성경앱은 사전에 등록한 파일들 외에 추가로 로드할 데이터가 없으므로 그대로 반환합니다.
        return networkResponse;
      });
    }).catch(() => {
      // 오프라인 상태에서 매칭되는 캐시가 없을 때의 예외 처리
      if (event.request.mode === 'navigate') {
        return caches.match('./index.html');
      }
    })
  );
});
