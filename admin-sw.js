const CACHE_NAME = "psh-admin-v4";
const BASE_PATH = "/PSH-SHUP-ADMIN";

// INSTALL
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

// ACTIVATE (nettoyage anciens caches)
self.addEventListener("activate", (event) => {
  self.clients.claim();
});

// FETCH
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request))
  );
});
