const CACHE_NAME = "psh-admin-v6"; 
const BASE_PATH = "/PSH-SUP-ADMIN";

self.addEventListener("install", event => {
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request).catch(() =>
      fetch(`${BASE_PATH}/index.html`)
    )
  );
});
