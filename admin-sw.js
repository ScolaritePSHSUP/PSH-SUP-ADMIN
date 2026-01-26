const BASE_PATH = "/PSH-SUP-ADMIN";

/* ===============================
   INSTALL / ACTIVATE
=============================== */
self.addEventListener("install", event => {
  console.log("SW installed");
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  console.log("SW activated");
  self.clients.claim();
});

/* ===============================
   FETCH (ne pas casser Supabase)
=============================== */
self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  // ne pas intercepter supabase / externes
  if (url.origin !== self.location.origin) return;
  if (event.request.method !== "GET") return;

  event.respondWith(fetch(event.request));
});

/* ===============================
   PUSH
=============================== */
self.addEventListener("push", event => {
  console.log("📩 PUSH reçu", event);

  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      data = { title: "Nouvelle réservation", body: "Nouvelle demande" };
    }
  }

  event.waitUntil(
    self.registration.showNotification(
      data.title || "Nouvelle réservation",
      {
        body: data.body || "Une nouvelle réservation a été créée",
        icon: "/PSH-SUP-ADMIN/icons/icon-192.png",
        badge: "/PSH-SUP-ADMIN/icons/icon-192.png",
        vibrate: [200, 100, 200],
        tag: "reservation",
        data: { url: "/PSH-SUP-ADMIN/admin-reservations.html" }
      }
    )
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
