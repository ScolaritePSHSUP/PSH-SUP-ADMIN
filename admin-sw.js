self.addEventListener("install", event => {
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  self.clients.claim();
});

/* ===============================
   PUSH (réception serveur)
=============================== */
self.addEventListener("push", event => {
  console.log("📩 PUSH reçu", event);

  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      console.error("❌ Push JSON invalide", e);
    }
  }

  const title = data.title || "Nouvelle réservation";
  const options = {
    body: data.body || "Une nouvelle réservation a été créée",
    icon: "/PSH-SUP-ADMIN/icons/icon-192.png",
    badge: "/PSH-SUP-ADMIN/icons/icon-192.png",
    data: {
      url: data.url || "/PSH-SUP-ADMIN/admin-reservations.html"
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

/* ===============================
   CLICK NOTIFICATION
=============================== */
self.addEventListener("notificationclick", event => {
  event.notification.close();
  const url = event.notification.data?.url || "/PSH-SUP-ADMIN/admin-reservations.html";

  event.waitUntil(
    clients.openWindow(url)
  );
});
