const CACHE_NAME = "psh-admin-v6";
const BASE_PATH = "/PSH-SUP-ADMIN";

/* ===============================
   INSTALL / ACTIVATE
=============================== */
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

/* ===============================
   FETCH (SAFE)
=============================== */
self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  // ⚠️ ne pas intercepter Supabase / externes
  if (url.origin !== self.location.origin) return;
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match("/PSH-SUP-ADMIN/index.html")
    )
  );
});

/* ===============================
   MESSAGE (notif locale)
=============================== */
self.addEventListener("message", event => {
  if (event.data?.type === "PUSH_NOTIFICATION") {
    self.registration.showNotification(event.data.title, {
      body: event.data.body,
      icon: "/PSH-SUP-ADMIN/icons/icon-192.png",
      badge: "/PSH-SUP-ADMIN/icons/icon-192.png"
    });
  }
});

/* ===============================
   PUSH (VRAIE NOTIF)
=============================== */
self.addEventListener("push", event => {
  let data = {};
  if (event.data) {
    data = event.data.json();
  }

  self.registration.showNotification(
    data.title || "Nouvelle réservation",
    {
      body: data.body || "Une nouvelle réservation a été créée",
      icon: "/PSH-SUP-ADMIN/icons/icon-192.png",
      badge: "/PSH-SUP-ADMIN/icons/icon-192.png",
      vibrate: [200, 100, 200],
      tag: "reservation"
    }
  );
});

/* ===============================
   CLICK NOTIF
=============================== */
self.addEventListener("notificationclick", event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow("/PSH-SUP-ADMIN/admin-reservations.html")
  );
});
