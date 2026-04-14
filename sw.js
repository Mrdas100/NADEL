// ═══════════════════════════════════
// Service Worker — شاهي قمرا PWA
// ═══════════════════════════════════
const CACHE_NAME = "qamra-v3";
const STATIC = [
  "./",
  "./index.html",
  "./customer.html",
  "./kitchen.html",
  "./admin.html",
  "./manifest.json",
  "./icon.svg",
  "./icon-192.png",
  "./icon-512.png",
  "https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Noto+Sans+Bengali:wght@400;700;800&display=swap"
];

// ── INSTALL: cache static assets ──
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

// ── ACTIVATE: remove old caches ──
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// ── FETCH: cache-first for static, network-first for Firebase ──
self.addEventListener("fetch", e => {
  const url = e.request.url;

  // Skip non-GET, Firebase, analytics
  if (e.request.method !== "GET") return;
  if (url.includes("firestore.googleapis.com")) return;
  if (url.includes("firebase.googleapis.com")) return;
  if (url.includes("googleapis.com/identitytoolkit")) return;
  if (url.includes("google-analytics")) return;

  // Cache-first for local files and fonts
  if (url.includes(self.location.origin) || url.includes("fonts.g") || url.includes("cdnjs")) {
    e.respondWith(
      caches.match(e.request).then(cached => {
        if (cached) return cached;
        return fetch(e.request).then(res => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then(c => c.put(e.request, clone)).catch(() => {});
          }
          return res;
        }).catch(() => cached || new Response("offline", {status: 503}));
      })
    );
    return;
  }

  // Network-first for everything else (images from dodostatic etc)
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
