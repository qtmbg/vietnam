/* ============================================================
 * Service worker — carnet Vietnam 2026, offline-first.
 *
 * Objectif : l'itinéraire, les hôtels, les transferts, le budget et le guide
 * restent consultables SANS réseau (toutes ces données sont embarquées dans le
 * bundle JS, donc une seule visite en ligne suffit à tout mettre en cache).
 *
 * Mr. Tang, lui, a besoin d'internet : ses appels /api/* ne sont JAMAIS mis en
 * cache et passent toujours par le réseau (le client affiche un état hors-ligne
 * clair quand il n'y a pas de connexion).
 * ============================================================ */

const VERSION = "v2";
const CACHE = `vietnam2026-${VERSION}`;

// Coquille minimale précachée à l'installation. Le JS/CSS hashés et les images
// sont mis en cache à la volée (stale-while-revalidate) dès la première visite.
const SHELL = ["/", "/index.html", "/manifest.webmanifest", "/favicon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const cacheable = (res) => res && (res.ok || res.type === "opaque");

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // On ne touche qu'aux GET (jamais le POST de Mr. Tang, etc.).
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Mr. Tang & toute API : réseau uniquement, jamais de cache.
  if (url.pathname.startsWith("/api/")) return;

  // Navigations (chargement / rechargement d'une page) : réseau d'abord pour
  // toujours récupérer le bon index.html (qui référence les assets à jour),
  // repli sur la coquille en cache quand on est hors-ligne.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          // Ne mémoriser comme coquille QUE une réponse saine same-origin : une page
          // d'erreur HTTP (500/502/page d'erreur de l'hôte) renvoyée alors qu'on est
          // encore en ligne ne doit pas écraser l'index.html hors-ligne.
          if (res.ok && res.type === "basic") {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put("/index.html", copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => caches.match(request).then((r) => r || caches.match("/index.html")))
    );
    return;
  }

  const sameOrigin = url.origin === self.location.origin;

  // Assets same-origin (JS/CSS/images/SVG) : stale-while-revalidate. On sert
  // immédiatement la version en cache si elle existe, et on rafraîchit en
  // arrière-plan. Hors-ligne, on garde la copie en cache. (Polices = SF Pro
  // système, plus aucun téléchargement de font.)
  if (sameOrigin) {
    event.respondWith(
      caches.open(CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          const network = fetch(request)
            .then((res) => {
              if (cacheable(res)) cache.put(request, res.clone());
              return res;
            })
            .catch(() => cached);
          return cached || network;
        })
      )
    );
  }
});
