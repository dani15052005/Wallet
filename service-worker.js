// service-worker.js
const STATIC_CACHE = "gastos-static-v26";
const DYNAMIC_CACHE = "gastos-dynamic-v1";
const MAX_DYNAMIC_ITEMS = 50;

const STATIC_FILES = [
  "./",
  "./index.html",
  "./offline.html",
  "./styles.css",
  "./script.js",
  "./chart.umd.min.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png"
];

const PLACEHOLDER_IMAGE = "./icon-192.png";

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

// Instalación: cachea archivos uno a uno sin tumbar la instalación si alguno falla
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil((async () => {
    try {
      const cache = await caches.open(STATIC_CACHE);
      for (const url of STATIC_FILES) {
        try {
          await cache.add(url); // fetch + put
          // console.log('[SW] Cacheado:', url);
        } catch (e) {
          console.warn("[SW] No se pudo cachear:", url, e);
        }
      }
      // console.log('[SW] Instalación completa');
    } catch (e) {
      console.error("[SW] Error durante install:", e);
    }
  })());
});

// Activación
self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {

    // Limpia caches antiguos
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter(k => ![STATIC_CACHE, DYNAMIC_CACHE].includes(k))
        .map(k => caches.delete(k))
    );

    // Habilitar Navigation Preload (si está soportado)
    if (self.registration.navigationPreload) {
      try { await self.registration.navigationPreload.enable(); } catch {}
    }

    // Toma control de las páginas abiertas
    await self.clients.claim();

    // Notificar actualización SOLO si ya había páginas controladas (update real)
    const clientsArr = await self.clients.matchAll({ type: "window" });
    if (clientsArr.length) {
      for (const client of clientsArr) {
        client.postMessage({ type: "SW_UPDATED" });
      }
    }
  })());
});

// --- FETCH robusto ---
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

    // Fallback de favicon: sirve icon-192.png cuando piden /favicon.ico
  try {
    const url = new URL(req.url);
    if (url.origin === self.location.origin && url.pathname === "/favicon.ico") {
      event.respondWith((async () => {
        const cache = await caches.open(STATIC_CACHE);
        const cached = await cache.match("./icon-192.png");
        if (cached) return cached;
        // Si no está cacheado aún, lo traemos y guardamos
        const resp = await fetch("./icon-192.png");
        await cache.put("./icon-192.png", resp.clone());
        return resp;
      })());
      return;
    }
  } catch {}

  const isSameOrigin = (u) => new URL(u, self.location.href).origin === self.location.origin;
  const sameOrigin = isSameOrigin(req.url);
  const acceptsHTML = (req.headers.get("accept") || "").includes("text/html");
  const isNavigate = req.mode === "navigate" || acceptsHTML;

  // 1) Navegación (HTML): cache-first del app shell con actualización en segundo plano
if (isNavigate) {
  event.respondWith((async () => {
    const cache = await caches.open(STATIC_CACHE);

    // Intenta servir el app shell desde caché inmediatamente
    const cachedShell = await cache.match("./index.html");

    // En paralelo, intenta ir a red para actualizar el shell en caché
    const updatePromise = (async () => {
      try {
        const preloaded = await event.preloadResponse;
        const network = preloaded || await fetch(req);
        // Guarda una copia "canónica" del shell
        await cache.put("./index.html", network.clone());
        return network;
      } catch (e) {
        return null;
      }
    })();

    if (cachedShell) {
      // Devolvemos de caché para que funcione offline inmediatamente
      return cachedShell;
    }

    // Si no hay shell en caché (primera carga), prueba red y si falla, offline.html
    const net = await updatePromise;
    if (net) return net;

    const offline = await caches.match("./offline.html");
    return offline || new Response("Offline", { status: 503, statusText: "Servicio no disponible" });
  })());
  return;
}

  // 2) Cross-origin (CDN, etc.): no cachear (evita respuestas opacas problemáticas)
  if (!sameOrigin) {
    event.respondWith(fetch(req).catch(async () => {
      const cached = await caches.match(req);
      if (cached) return cached;
      if (req.destination === "image") {
        const ph = await caches.match(PLACEHOLDER_IMAGE);
        return ph || new Response("", { status: 404 });
      }
      return new Response("", { status: 503, statusText: "Servicio no disponible" });
    }));
    return;
  }

  // 3) Estáticos same-origin: cache-first + actualización segura
  const isStatic = STATIC_FILES.some(path => req.url.includes(path.replace(/^\.\//, "")));
  if (isStatic) {
    event.respondWith((async () => {
      const cache = await caches.open(STATIC_CACHE);
      const cachedResp = await cache.match(req);

      try {
        const network = await fetch(req);

        if (!cachedResp) {
          await cache.put(req, network.clone());
          return network;
        }

        // si no es opaca, compara headers para avisar de actualización parcial
        if (network.type !== "opaque") {
          const netLen = +network.headers.get("content-length") || 0;
          const cachedLen = +((cachedResp.headers && cachedResp.headers.get("content-length")) || 0);
          const netETag = network.headers.get("etag");
          const cachedETag = cachedResp.headers ? cachedResp.headers.get("etag") : null;

          if (netLen !== cachedLen || (netETag && netETag !== cachedETag)) {
            await cache.put(req, network.clone());
            const clientsArr = await self.clients.matchAll({ type: "window" });
            for (const client of clientsArr) client.postMessage({ type: "SW_UPDATED_PARTIAL", url: req.url });
          }
        } else {
          // caso raro: guarda una copia sin comparar
          await cache.put(req, network.clone());
        }

        // devuelve lo mejor que tengamos disponible
        return cachedResp || network;
      } catch {
        return cachedResp || new Response("", { status: 503, statusText: "Servicio no disponible" });
      }
    })());
    return;
  }

  // 4) Resto same-origin: dinámico (cache-first + refresh)
  event.respondWith((async () => {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResp = await cache.match(req);

    try {
      const network = await fetch(req);
      await cache.put(req, network.clone());
      trimCache(DYNAMIC_CACHE, MAX_DYNAMIC_ITEMS);
      return network;
    } catch {
      if (cachedResp) return cachedResp;
      if (req.destination === "image") {
        const ph = await caches.match(PLACEHOLDER_IMAGE);
        return ph || new Response("", { status: 404 });
      }
      return new Response("", { status: 503, statusText: "Servicio no disponible" });
    }
  })());
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