// service-worker.js
const STATIC_CACHE = "gastos-static-v1";   // cambia la versión cuando actualices assets
const DYNAMIC_CACHE = "gastos-dynamic-v1";
const MAX_DYNAMIC_ITEMS = 50;

const STATIC_FILES = [
  "./",
  "./index.html",
  "./offline.html",
  "./styles.css",
  "./script.js",
  "./manifest.json?v=4",
  "./icons/apple-touch-icon.png?v=4",
  "./icons/icon-192.png?v=4",
  "./icons/icon-512.png?v=4",
  "https://cdn.jsdelivr.net/npm/chart.js"
];

// Helper: limitar tamaño del cache dinámico
async function trimCache(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxItems) {
    await cache.delete(keys[0]);
    await trimCache(cacheName, maxItems);
  }
}

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(STATIC_FILES))
      .catch(err => console.error("Error cacheando archivos estáticos:", err))
  );
});

self.addEventListener("activate", event => {
  // borrar caches viejos
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== STATIC_CACHE && k !== DYNAMIC_CACHE)
          .map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

// Estrategia de fetch:
// - Para navegaciones (document) -> Network first -> fallback offline.html
// - Para archivos estáticos listados -> Cache first
// - Para otros -> Cache first then network and cache dynamically
self.addEventListener("fetch", event => {
  const req = event.request;
  const url = new URL(req.url);

  // Only handle GET requests
  if (req.method !== "GET") return;

  // Network-first for navigation (HTML pages)
  if (req.mode === "navigate" || (req.headers.get("accept") || "").includes("text/html")) {
    event.respondWith(
      fetch(req)
        .then(res => {
          // Update static cache with latest index.html if fetched
          const copy = res.clone();
          caches.open(STATIC_CACHE).then(cache => cache.put("./", copy));
          return res;
        })
        .catch(() => caches.match("./offline.html"))
    );
    return;
  }

  // Cache-first for our known static files
  if (STATIC_FILES.some(path => req.url.includes(path.replace(/^\.\//, "")))) {
    event.respondWith(
      caches.match(req).then(cacheResp => cacheResp || fetch(req).then(fetchResp => {
        // no cache update for CDN resources to avoid CORS problems, but cache local files
        if (req.url.startsWith(self.location.origin)) {
          const clone = fetchResp.clone();
          caches.open(STATIC_CACHE).then(cache => cache.put(req, clone));
        }
        return fetchResp;
      }))
    );
    return;
  }

  // Default: Cache first, else fetch and add to dynamic cache
  event.respondWith(
    caches.match(req).then(cacheResp => {
      return cacheResp || fetch(req).then(fetchResp => {
        return caches.open(DYNAMIC_CACHE).then(cache => {
          // only cache same-origin responses to avoid CORS issues
          if (req.url.startsWith(self.location.origin)) {
            cache.put(req, fetchResp.clone());
            trimCache(DYNAMIC_CACHE, MAX_DYNAMIC_ITEMS);
          }
          return fetchResp;
        });
      }).catch(() => {
        // If it's an image or font maybe return a fallback (optional)
        if (req.destination === "image") {
          // return generic placeholder (could add /icons/fallback.png)
          return new Response("", { status: 404, statusText: "Not found" });
        }
      });
    })
  );
});

// Permitir comunicación desde la página (p. ej. para forzar limpieza)
self.addEventListener("message", (event) => {
  if (!event.data) return;
  if (event.data.type === "CLEAR_CACHES") {
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))));
  }
});
