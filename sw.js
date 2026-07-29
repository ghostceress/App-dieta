/*
 * Service worker: mette in cache tutti i file dell'app al primo avvio, così
 * funziona anche senza rete (in metropolitana, al supermercato nel sotterraneo).
 *
 * Strategia: cache-first per i file dell'app, con aggiornamento in sottofondo.
 * Quando modifichi qualcosa alza VERSIONE, altrimenti gli iPhone che hanno già
 * installato l'app continuano a vedere la versione vecchia.
 */

const VERSIONE = 'dieta-1800-v1';

const FILE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/stile.css',
  './js/app.js',
  './js/piano.js',
  './js/alimenti.js',
  './js/store.js',
  './icons/icona-180.png',
  './icons/icona-192.png',
  './icons/icona-512.png',
  './icons/icona-maskable-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSIONE).then((c) => c.addAll(FILE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((chiavi) => Promise.all(chiavi.filter((k) => k !== VERSIONE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const richiesta = e.request;
  if (richiesta.method !== 'GET' || new URL(richiesta.url).origin !== self.location.origin) return;

  e.respondWith(
    caches.match(richiesta).then((inCache) => {
      // Se la risorsa è in cache la servo subito e intanto provo a rinfrescarla.
      const dallaRete = fetch(richiesta)
        .then((risposta) => {
          if (risposta && risposta.ok) {
            const copia = risposta.clone();
            caches.open(VERSIONE).then((c) => c.put(richiesta, copia));
          }
          return risposta;
        })
        .catch(() => inCache || caches.match('./index.html'));

      return inCache || dallaRete;
    })
  );
});
