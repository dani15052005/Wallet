// service-worker.js — robusto y consistente en avisos
const STATIC_CACHE = "gastos-static-v33";
const DYNAMIC_CACHE = "gastos-dynamic-v1";
const MAX_DYNAMIC_ITEMS = 50;

const APP_SHELL = "./index.html";

const STATIC_FILES = [
  // ❌ quitamos "./" para no introducir cadena vacía
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
    console.error("[SW] Error recortando cache:", err);
  }
}

function notifyAll(msg) {
  try {
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(clientsArr => clientsArr.forEach(c => c.postMessage(msg)));
  } catch (e) {
    console.warn("[SW] notifyAll fallo:", e);
  }
}

// Normaliza a path absoluto y hacemos un Set exacto de estáticos
const toAbsPath = (p) => new URL(p, self.location).pathname;
const STATIC_PATHS_SET = new Set(
  STATIC_FILES
    .map(toAbsPath)
    .filter(Boolean) // evita entradas vacías
);

function isStaticReq(reqUrl) {
  const u = new URL(reqUrl, self.location.href);
  return STATIC_PATHS_SET.has(u.pathname);
}

// ---------- INSTALL ----------
self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    try {
      const cache = await caches.open(STATIC_CACHE);
      for (const url of STATIC_FILES) {
        try { await cache.add(url); }
        catch (e) { console.warn("[SW] No cacheó:", url, e); }
      }

      // solo avisar si ya había uno activo
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
    const keys = await caches.keys();
    await Promise.all(
      keys.filter(k => ![STATIC_CACHE, DYNAMIC_CACHE].includes(k)).map(k => caches.delete(k))
    );

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

  // ---- 1) Navegación (HTML): cache-first del shell + refresh explícito de index.html
  if (isNavigate) {
    event.respondWith((async () => {
      const cache = await caches.open(STATIC_CACHE);
      const cachedShell = await cache.match(APP_SHELL, { ignoreSearch: true });

      // Refresco del shell en paralelo (siempre sobre index.html)
      const updatePromise = (async () => {
        try {
          // Usamos preload si está disponible; si no, pedimos el shell explícito
          const preloaded = await event.preloadResponse;
          const network = preloaded || await fetch(APP_SHELL, { cache: "no-store" });
          if (!network || !network.ok) return null;

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

          await cache.put(APP_SHELL, network.clone());
          return network;
        } catch {
          return null;
        }
      })();

      if (cachedShell) return cachedShell;
      const net = await updatePromise;
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

  // ---- 3) Estáticos same-origin: cache-first + refresh + aviso si cambian
  if (isStaticReq(req.url)) {
    event.respondWith((async () => {
      const cache = await caches.open(STATIC_CACHE);
      const cachedResp = await cache.match(req, { ignoreSearch: true });

      try {
        const network = await fetch(req, { cache: "no-store" });
        if (!network || !network.ok) {
          // si la red falla o no es OK, no sobreescribimos
          return cachedResp || network;
        }

        let changed = false;
        if (cachedResp) {
          // Compara headers (si existen)
          const netLen = +network.headers.get("content-length") || 0;
          const cachedLen = +((cachedResp.headers && cachedResp.headers.get("content-length")) || 0);
          const netETag = network.headers.get("etag");
          const cachedETag = cachedResp.headers ? cachedResp.headers.get("etag") : null;
          const netLM = network.headers.get("last-modified");
          const cachedLM = cachedResp.headers ? cachedResp.headers.get("last-modified") : null;

          if (netETag && cachedETag && netETag !== cachedETag) changed = true;
          else if (netLM && cachedLM && netLM !== cachedLM) changed = true;
          else if (netLen && cachedLen && netLen !== cachedLen) changed = true;
        } else {
          changed = true; // primera vez
        }

        await cache.put(req, network.clone());
        if (changed) notifyAll({ type: "SW_UPDATED_PARTIAL", url: req.url });

        // cache-first
        return cachedResp || network;
      } catch {
        return cachedResp || new Response("", { status: 503, statusText: "Servicio no disponible" });
      }
    })());
    return;
  }

  // ---- 4) Dinámicos same-origin: cache-first de respaldo + refresh
  event.respondWith((async () => {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResp = await cache.match(req, { ignoreSearch: true });

    try {
      const network = await fetch(req);
      if (network && network.ok) {
        await cache.put(req, network.clone());
        await trimCache(DYNAMIC_CACHE, MAX_DYNAMIC_ITEMS);
      }
      return network.ok ? network : (cachedResp || network);
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
    self.skipWaiting();
  }
});