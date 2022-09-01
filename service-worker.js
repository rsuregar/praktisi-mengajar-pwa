
var staticCacheName = "pwa-v" + new Date().getTime();
var filesToCache = [
    '/offline.html',
    '/images/icons/logo-72.png',
    '/images/icons/logo-96.png',
    '/images/icons/logo-48.png',
    '/images/icons/logo-192.png',
    '/images/icons/logo-512.png',
    '/images/icons/maskable-1024.png',
    '/images/offline.png',
];

// Cache on install
self.addEventListener("install", event => {
    this.skipWaiting();
    event.waitUntil(
        caches.open(staticCacheName)
            .then(cache => {
                return cache.addAll(filesToCache);
            })
    )
});

// Clear cache on activate
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(cacheName => (cacheName.startsWith("pwa-")))
                    .filter(cacheName => (cacheName !== staticCacheName))
                    .map(cacheName => caches.delete(cacheName))
            );
        })
    );
});

// Serve from Cache
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
            .catch(() => {
                return caches.match('offline.html');
            })
    )
});
