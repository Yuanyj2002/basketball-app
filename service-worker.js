const CACHE_NAME = 'bball-pwa-v1';
const ASSETS = ['篮球赛管理系统.html', 'manifest.json', 'basketball-icon.svg'];
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(ASSETS);
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  event.respondWith((async () => {
    try {
      const cached = await caches.match(event.request);
      if (cached) return cached;
      const resp = await fetch(event.request);
      if (resp && resp.status === 200) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(event.request, resp.clone());
      }
      return resp;
    } catch(e) {
      const cached = await caches.match(event.request);
      if (cached) return cached;
      return new Response('Offline', { status: 503 });
    }
  })());
});
