// Service Worker — شاهي قمرا PWA
const CACHE = "qamra-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./customer.html",
  "./staff.html",
  "./manifest.json",
  "https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  if (e.request.url.includes("firestore") || e.request.url.includes("firebase")) return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      const net = fetch(e.request).then(res => {
        if (res.ok) caches.open(CACHE).then(c => c.put(e.request, res.clone())).catch(() => {});
        return res;
      }).catch(() => cached);
      return cached || net;
    })
  );
});
