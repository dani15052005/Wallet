// service-worker.js — robusto y consistente en avisos
const STATIC_CACHE = "gastos-static-v32";
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

// ---------- helpers ----------
async function trimCache(cacheName, maxItems) {
  try {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    for (let i = 0; i < keys.length - maxItems; i++) {
      await cache.delete(keys[i]);
    }
  } catch (err) {
    // silencioso en prod
    console.error("[SW] Error recortando cache:", err);
  }
}

function notifyAll(msg) {
  try {
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(clientsArr => clientsArr.forEach(c => c.postMessage(msg)));
  } catch (e) {
    // sin bloqueo
    console.warn("[SW] notifyAll fallo:", e);
  }
}

const norm = (p) => p.replace(/^\.\//, "").replace(/^\//, "");
const STATIC_PATHS = STATIC_FILES.map(norm);
function isStaticReq(reqUrl) {
  const u = new URL(reqUrl, self.location.href);
  const path = u.pathname.replace(/^\//, ""); // sin query
  return STATIC_PATHS.some(s => path.endsWith(norm(s)));
}

// ---------- INSTALL ----------
self.addEventListener("install", (event) => {
  // No skipWaiting: dejamos al nuevo SW en "waiting"
  event.waitUntil((async () => {
    try {
      const cache = await caches.open(STATIC_CACHE);
      for (const url of STATIC_FILES) {
        try { await cache.add(url); } catch (e) { console.warn("[SW] No cacheó:", url, e); }
      }

      // Avisar SOLO si es actualización (ya había uno activo)
      if (self.registration && self.registration.active) {
        notifyAll({ type: "SW_UPDATED" });
      }
    } catch (e) {
      console.error("[SW] Error durante install:", e);
    }
  })());
});

// ---------- ACTIVATE ----------
self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    // Limpia caches antiguos
    const keys = await caches.keys();
    await Promise.all(
      keys.filter(k => ![STATIC_CACHE, DYNAMIC_CACHE].includes(k)).map(k => caches.delete(k))
    );

    // Navigation Preload (acelera 1ª respuesta en nav)
    try { await self.registration.navigationPreload?.enable(); } catch {}

    await self.clients.claim();
  })());
});

// ---------- FETCH ----------
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  // Favicon → icono cacheado
  try {
    const url = new URL(req.url);
    if (url.origin === self.location.origin && url.pathname === "/favicon.ico") {
      event.respondWith((async () => {
        const cache = await caches.open(STATIC_CACHE);
        const cached = await cache.match("./icon-192.png", { ignoreSearch: true });
        if (cached) return cached;
        const resp = await fetch("./icon-192.png", { cache: "no-store" });
        await cache.put("./icon-192.png", resp.clone());
        return resp;
      })());
      return;
    }
  } catch {}

  const sameOrigin = new URL(req.url, self.location.href).origin === self.location.origin;
  const acceptsHTML = (req.headers.get("accept") || "").includes("text/html");
  const isNavigate = req.mode === "navigate" || acceptsHTML;

  // ---- 1) Navegación (HTML): cache-first + refresh + aviso si cambia index.html
  if (isNavigate) {
    event.respondWith((async () => {
      const cache = await caches.open(STATIC_CACHE);
      const cachedShell = await cache.match("./index.html", { ignoreSearch: true });

      // Actualización en paralelo
      const updatePromise = (async () => {
        try {
          const preloaded = await event.preloadResponse;
          const network = preloaded || await fetch(req, { cache: "no-store" });

          if (cachedShell) {
            try {
              const [oldText, newText] = await Promise.all([
                cachedShell.clone().text(),
                network.clone().text()
              ]);
              if (oldText !== newText) {
                notifyAll({ type: "SW_UPDATED_PARTIAL", url: "index.html" });
              }
            } catch {}
          }

          await cache.put("./index.html", network.clone());
          return network;
        } catch {
          return null;
        }
      })();

      if (cachedShell) return cachedShell;       // respuesta inmediata
      const net = await updatePromise;           // 1ª carga
      if (net) return net;

      const offline = await caches.match("./offline.html", { ignoreSearch: true });
      return offline || new Response("Offline", { status: 503, statusText: "Servicio no disponible" });
    })());
    return;
  }

  // ---- 2) Cross-origin: no cacheamos, solo fallback básico
  if (!sameOrigin) {
    event.respondWith(fetch(req).catch(async () => {
      const cached = await caches.match(req, { ignoreSearch: true });
      if (cached) return cached;
      if (req.destination === "image") {
        const ph = await caches.match(PLACEHOLDER_IMAGE, { ignoreSearch: true });
        return ph || new Response("", { status: 404 });
      }
      return new Response("", { status: 503, statusText: "Servicio no disponible" });
    }));
    return;
  }

  // ---- 3) Estáticos same-origin: cache-first + refresh + aviso si cambia
  if (isStaticReq(req.url)) {
    event.respondWith((async () => {
      const cache = await caches.open(STATIC_CACHE);
      const cachedResp = await cache.match(req, { ignoreSearch: true });

      try {
        const network = await fetch(req, { cache: "no-store" });

        if (!cachedResp) {
          await cache.put(req, network.clone());
          return network;
        }

        // Compara headers (ETag / Last-Modified / Content-Length)
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

        await cache.put(req, network.clone());
        if (changed) notifyAll({ type: "SW_UPDATED_PARTIAL", url: req.url });

        return cachedResp || network;
      } catch {
        return cachedResp || new Response("", { status: 503, statusText: "Servicio no disponible" });
      }
    })());
    return;
  }

  // ---- 4) Dinámicos same-origin: cache-first + refresh
  event.respondWith((async () => {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResp = await cache.match(req, { ignoreSearch: true });

    try {
      const network = await fetch(req);
      await cache.put(req, network.clone());
      await trimCache(DYNAMIC_CACHE, MAX_DYNAMIC_ITEMS);
      return network;
    } catch {
      if (cachedResp) return cachedResp;
      if (req.destination === "image") {
        const ph = await caches.match(PLACEHOLDER_IMAGE, { ignoreSearch: true });
        return ph || new Response("", { status: 404 });
      }
      return new Response("", { status: 503, statusText: "Servicio no disponible" });
    }
  })());
});

// ---------- MENSAJERÍA ----------
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
