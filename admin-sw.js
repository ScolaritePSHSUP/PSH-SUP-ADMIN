const CACHE_NAME = "psh-admin-v3"; // ⬅️ CHANGE LA VERSION À CHAQUE MODIF
const BASE_PATH = "/PSH-SHUP-ADMIN";

const ASSETS = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/admin-login.html`,
  `${BASE_PATH}/admin-dashboard.html`,
  `${BASE_PATH}/style.css`,
  `${BASE_PATH}/admin-manifest.json`,
  `${BASE_PATH}/admin-sw.js`,
  `${BASE_PATH}/icons/icon-192.png`,
  `${BASE_PATH}/icons/icon-512.png`
];

// INSTALL
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// ACTIVATE (nettoyage anciens caches)
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// FETCH
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request))
  );
});
