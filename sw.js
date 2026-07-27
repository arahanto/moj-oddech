/* ===== Mój Oddech — service worker: praca bez internetu ===== */

const WERSJA = "moj-oddech-v1";
const PLIKI = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./data.js",
  "./backup.js",
  "./jadlospis.js",
  "./manifest.json",
  "./ikony/ikona.svg",
  "./ikony/ikona-192.png",
  "./ikony/ikona-512.png",
  "./ikony/apple-touch-icon.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(WERSJA).then(c => c.addAll(PLIKI)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(klucze => Promise.all(klucze.filter(k => k !== WERSJA).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  // GitHub API (backup) zawsze przez sieć; reszta: najpierw cache, potem sieć
  if (e.request.url.includes("api.github.com")) return;
  e.respondWith(
    caches.match(e.request).then(z => z || fetch(e.request).then(odp => {
      if (odp.ok && e.request.method === "GET") {
        const kopia = odp.clone();
        caches.open(WERSJA).then(c => c.put(e.request, kopia));
      }
      return odp;
    }))
  );
});

self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: "window" }).then(lista =>
    lista.length ? lista[0].focus() : clients.openWindow("./")
  ));
});
