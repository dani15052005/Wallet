// service-worker.js
const STATIC_CACHE = "gastos-static-v2";
const DYNAMIC_CACHE = "gastos-dynamic-v1";
const MAX_DYNAMIC_ITEMS = 50;

const STATIC_FILES = [
  "./",
  "./index.html",
  "./offline.html",
  "./styles.css",
  "./script.js",
  "./manifest.json?v=5",
  "./icons/apple-touch-icon.png?v=5",
  "./icons/icon-192.png?v=5",
  "./icons/icon-512.png?v=5",
  "https://cdn.jsdelivr.net/npm/chart.js"
];

const PLACEHOLDER_IMAGE = "./icons/icon-192.png";

async function trimCache(cacheName, maxItems) {
  try {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    for (let i = 0; i < keys.length - maxItems; i++) {
      await cache.delete(keys[i]);
    }
  } catch (err) {
    console.error("Error recortando cache:", err);
  }
}

// Instalación: cache inicial
self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(STATIC_FILES))
      .catch(err => console.error("Error cacheando archivos estáticos:", err))
  );
});

// Activación
self.addEventListener("activate", event => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter(k => k !== STATIC_CACHE && k !== DYNAMIC_CACHE)
            .map(k => caches.delete(k))
      );
      await self.clients.claim();

      const clientsArr = await self.clients.matchAll({ type: "window" });
      for (const client of clientsArr) {
        client.postMessage({ type: "SW_UPDATED" });
      }
    })()
  );
});

// Fetch
self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;

  const isStatic = STATIC_FILES.some(path => req.url.includes(path.replace(/^\.\//, "")));

  if (req.mode === "navigate" || (req.headers.get("accept") || "").includes("text/html")) {
    // Network-first para navegación
    event.respondWith(
      fetch(req)
        .then(res => {
          caches.open(STATIC_CACHE).then(cache => cache.put("./", res.clone()));
          return res;
        })
        .catch(() => caches.match("./offline.html"))
    );
    return;
  }

  if (isStatic) {
    // Cache-first + actualización para archivos estáticos
    event.respondWith(
      (async () => {
        const cache = await caches.open(STATIC_CACHE);
        const cachedResp = await cache.match(req);

        try {
          const fetchResp = await fetch(req);

          if (!cachedResp) {
            await cache.put(req, fetchResp.clone());
            return fetchResp;
          }

          // Comprobar si cambió content-length o etag
          const fetchedLength = +fetchResp.headers.get('content-length') || 0;
          const cachedLength = +cachedResp.headers.get('content-length') || 0;

          if (fetchedLength !== cachedLength || fetchResp.headers.get('etag') !== cachedResp.headers.get('etag')) {
            await cache.put(req, fetchResp.clone());

            // Notificar a la página de actualización parcial
            const clientsArr = await self.clients.matchAll({ type: "window" });
            for (const client of clientsArr) {
              client.postMessage({ type: "SW_UPDATED_PARTIAL", url: req.url });
            }
          }

          return fetchResp;
        } catch {
          return cachedResp || new Response("", { status: 503, statusText: "Servicio no disponible" });
        }
      })()
    );
    return;
  }

  // Default: Cache-first + dinámico
  event.respondWith(
    (async () => {
      const cache = await caches.open(DYNAMIC_CACHE);
      const cachedResp = await cache.match(req);

      try {
        const fetchResp = await fetch(req);
        if (!cachedResp) {
          await cache.put(req, fetchResp.clone());
          trimCache(DYNAMIC_CACHE, MAX_DYNAMIC_ITEMS);
          return fetchResp;
        }
        await cache.put(req, fetchResp.clone());
        trimCache(DYNAMIC_CACHE, MAX_DYNAMIC_ITEMS);
        return fetchResp;
      } catch {
        if (cachedResp) return cachedResp;
        if (req.destination === "image") {
          const placeholderCache = await caches.open(STATIC_CACHE);
          const placeholder = await placeholderCache.match(PLACEHOLDER_IMAGE);
          return placeholder || new Response("", { status: 404 });
        }
        return new Response("", { status: 503, statusText: "Servicio no disponible" });
      }
    })()
  );
});

// Comunicación desde la página
self.addEventListener("message", (event) => {
  if (!event.data) return;

  if (event.data.type === "CLEAR_CACHES") {
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))));
  }

  if (event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});