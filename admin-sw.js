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
      caches.match(`${BASE_PATH}/admin-reservations.html`)
    )
  );
});

/* ===============================
   MESSAGE (notif locale optionnelle)
=============================== */
self.addEventListener("message", event => {
  if (event.data?.type === "PUSH_NOTIFICATION") {
    self.registration.showNotification(event.data.title, {
      body: event.data.body,
      icon: `${BASE_PATH}/icons/icon-192.png`,
      badge: `${BASE_PATH}/icons/icon-192.png`
    });
  }
});

/* ===============================
   PUSH (VRAIE NOTIF)
=============================== */
self.addEventListener("push", event => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      console.error("Erreur parsing push data", e);
    }
  }

  self.registration.showNotification(
    data.title || "Nouvelle réservation",
    {
      body: data.body || "Une nouvelle réservation a été créée",
      icon: `${BASE_PATH}/icons/icon-192.png`,
      badge: `${BASE_PATH}/icons/icon-192.png`,
      vibrate: [200, 100, 200],
      tag: "reservation",
      requireInteraction: true, // la notif reste jusqu'au clic
      data: {
        url: data.url || `${BASE_PATH}/admin-reservations.html`
      }
    }
  );
});

/* ===============================
   CLICK NOTIF
=============================== */
self.addEventListener("notificationclick", event => {
  event.notification.close();

  const url = event.notification.data?.url || `${BASE_PATH}/admin-reservations.html`;

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(windowClients => {
      for (const client of windowClients) {
        if (client.url.includes(url) && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
