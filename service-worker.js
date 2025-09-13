// service-worker.js — versión ajustada
const STATIC_CACHE = "gastos-static-v31"; // ⬅️ sube versión al cambiar el SW
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

function notifyAll(msg) {
  self.clients.matchAll({ type: "window" }).then(clientsArr => {
    clientsArr.forEach(c => c.postMessage(msg));
  });
}

// ================== INSTALL ==================
self.addEventListener("install", (event) => {
  // ✅ No skipWaiting aquí; dejamos al nuevo SW en "waiting"
  event.waitUntil((async () => {
    try {
      const cache = await caches.open(STATIC_CACHE);
      for (const url of STATIC_FILES) {
        try {
          await cache.add(url);
        } catch (e) {
          console.warn("[SW] No se pudo cachear:", url, e);
        }
      }

      // Si hay clientes abiertos, comunica que hay versión lista (waiting)
      // Esto hace que el cliente muestre el overlay.
      const clientsArr = await self.clients.matchAll({ type: "window" });
      if (clientsArr.length) {
        notifyAll({ type: "SW_UPDATED" });
      }
    } catch (e) {
      console.error("[SW] Error durante install:", e);
    }
  })());
});

// ================== ACTIVATE ==================
self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    // Limpia caches antiguos
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter(k => ![STATIC_CACHE, DYNAMIC_CACHE].includes(k))
        .map(k => caches.delete(k))
    );

    // Navigation Preload
    if (self.registration.navigationPreload) {
      try { await self.registration.navigationPreload.enable(); } catch {}
    }

    // Control de clientes
    await self.clients.claim();

    // ❌ Ya no notificamos aquí; el aviso se hace:
    // - al terminar install (quedando en 'waiting'), o
    // - cuando detectamos cambios en recursos (parciales), o
    // - desde la página al ver registration.waiting / updatefound.
  })());
});

// ================== FETCH ==================
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  // Favicon -> icon-192
  try {
    const url = new URL(req.url);
    if (url.origin === self.location.origin && url.pathname === "/favicon.ico") {
      event.respondWith((async () => {
        const cache = await caches.open(STATIC_CACHE);
        const cached = await cache.match("./icon-192.png");
        if (cached) return cached;
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

  // 1) Navegación (HTML) — cache-first con actualización y AVISO si cambia index.html
  if (isNavigate) {
    event.respondWith((async () => {
      const cache = await caches.open(STATIC_CACHE);
      const cachedShell = await cache.match("./index.html");

      // Intento de red/preload (sin-cache para forzar frescura en dev)
      const updatePromise = (async () => {
        try {
          const preloaded = await event.preloadResponse;
          const network = preloaded || await fetch(req, { cache: "no-store" });

          // Si ya teníamos shell cacheado, compara contenido para avisar
          if (cachedShell) {
            try {
              const [oldText, newText] = await Promise.all([
                cachedShell.clone().text(),
                network.clone().text()
              ]);
              if (oldText !== newText) {
                // Cambió el app shell -> avisa (parcial es suficiente: recargar aplica cambios)
                notifyAll({ type: "SW_UPDATED_PARTIAL", url: "index.html" });
              }
            } catch {}
          }

          // Guarda la nueva versión en caché
          await cache.put("./index.html", network.clone());
          return network;
        } catch {
          return null;
        }
      })();

      if (cachedShell) {
        // Sirve inmediatamente desde caché
        // (la actualización y el posible aviso van en paralelo)
        return cachedShell;
      }

      // Primera carga sin caché
      const net = await updatePromise;
      if (net) return net;

      const offline = await caches.match("./offline.html");
      return offline || new Response("Offline", { status: 503, statusText: "Servicio no disponible" });
    })());
    return;
  }

  // 2) Cross-origin sin cacheo (evita opacas problemáticas)
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

  // 3) Estáticos same-origin: cache-first + actualización + aviso parcial
  const isStatic = STATIC_FILES.some(path => req.url.includes(path.replace(/^\.\//, "")));
  if (isStatic) {
    event.respondWith((async () => {
      const cache = await caches.open(STATIC_CACHE);
      const cachedResp = await cache.match(req);

      try {
        const network = await fetch(req, { cache: "no-store" });

        if (!cachedResp) {
          await cache.put(req, network.clone());
          return network;
        }

        // Compara headers básicos (ETag/Last-Modified/Content-Length)
        const netLen = +network.headers.get("content-length") || 0;
        const cachedLen = +((cachedResp.headers && cachedResp.headers.get("content-length")) || 0);
        const netETag = network.headers.get("etag");
        const cachedETag = cachedResp.headers ? cachedResp.headers.get("etag") : null;
        const netLM = network.headers.get("last-modified");
        const cachedLM = cachedResp.headers ? cachedResp.headers.get("last-modified") : null;

        let changed = false;
        if (netETag && cachedETag && netETag !== cachedETag) changed = true;
        else if (netLM && cachedLM && netLM !== cachedLM) changed = true;
        else if (netLen && cachedLen && netLen !== cachedLen) changed = true;

        if (changed) {
          await cache.put(req, network.clone());
          notifyAll({ type: "SW_UPDATED_PARTIAL", url: req.url });
        } else {
          // Sin señal clara en headers -> reescribe igual por si acaso
          await cache.put(req, network.clone());
        }

        return cachedResp || network;
      } catch {
        return cachedResp || new Response("", { status: 503, statusText: "Servicio no disponible" });
      }
    })());
    return;
  }

  // 4) Dinámicos same-origin: cache-first + refresh
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

// ================== MENSAJERÍA ==================
self.addEventListener("message", (event) => {
  if (!event.data) return;

  if (event.data.type === "CLEAR_CACHES") {
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))));
  }

  if (event.data.type === "SKIP_WAITING") {
    // El cliente pulsa "Actualizar ahora"
    self.skipWaiting();
  }
});