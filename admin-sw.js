const CACHE_NAME = "psh-admin-v5";
const BASE = "/PSH-SHUP-ADMIN";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(`${BASE}/index.html`)
    )
  );
});
