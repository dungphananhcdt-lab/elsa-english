// Elsa English Service Worker (Network-First Code Updates + 100% Offline Cache v25)
const CACHE_NAME = 'elsa-ipad-v25';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './apple-touch-icon.png',
  './assets/icons/apple-touch-icon.png',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './css/style.css',
  './js/sound.js',
  './js/speech.js',
  './js/data.js',
  './js/games/forest_zones.js',
  './js/games/coloring.js',
  './js/games/gallery.js',
  './js/games/flashcards.js',
  './js/games/snowball_quiz.js',
  './js/games/feed_olaf.js',
  './js/games/ice_wand.js',
  './js/games/castle_rewards.js',
  './js/app.js',
  './assets/icons/icon.svg',
  './Image/elsa_3d.png',
  './Image/anna_3d.png',
  './Image/olaf_3d.png',
  './Image/sven_3d.png',
  './Image/kristoff_3d.png',
  './Image/frozen_poster.jpg',
  './Image/Ngocmy.jpg',
  './Image/elsa_anna_royal.jpg',
  './Image/elsa_portrait.jpg',
  './Image/let_it_go_song.mp3',
  './Image/abc_song.mp3',
  './Image/gallery_01_elsa_snow.webp',
  './Image/gallery_02_frozen2_journey.jpg',
  './Image/gallery_03_elsa_spirit.jpeg',
  './Image/gallery_04_frozen3_magic.webp',
  './Image/gallery_05_elsa_dress.jpg',
  './Image/gallery_06_elsa_smile.jpg',
  './Image/gallery_07_elsa_castle.jpg',
  './Image/gallery_08_elsa_magic.jpg',
  './Image/gallery_09_elsa_power.jpg',
  './Image/gallery_10_elsa_portrait2.jpg',
  './coloring/elsa_coloring_1.jpg',
  './coloring/elsa_coloring_2.jpg',
  './coloring/elsa_coloring_3.jpg',
  './coloring/elsa_coloring_4.jpg',
  './coloring/elsa_coloring_5.jpg',
  './coloring/elsa_coloring_6.jpg',
  './coloring/elsa_coloring_7.jpg',
  './coloring/elsa_coloring_8.jpg',
  './coloring/elsa_coloring_9.jpg',
  './coloring/elsa_coloring_10.jpg',
  './coloring/elsa_coloring_11.jpg',
  './coloring/elsa_coloring_12.jpg',
  './coloring/elsa_coloring_13.jpg',
  './coloring/elsa_coloring_14.jpg',
  './coloring/elsa_coloring_15.jpg',
  './coloring/elsa_coloring_16.jpg',
  './coloring/elsa_coloring_17.jpg',
  './coloring/elsa_coloring_18.jpg',
  './coloring/elsa_coloring_19.jpg',
  './coloring/elsa_coloring_20.jpg',
  './coloring/elsa_coloring_21.jpg',
  './coloring/elsa_coloring_22.jpg',
  './coloring/elsa_coloring_23.jpg',
  './coloring/elsa_coloring_24.jpg',
  './coloring/elsa_coloring_25.jpg',
  './coloring/elsa_coloring_26.jpg',
  './coloring/elsa_coloring_27.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching fairy forest assets for 100% offline iPhone play...');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Clearing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const isCodeAsset = url.pathname.endsWith('.js') || 
                      url.pathname.endsWith('.css') || 
                      url.pathname.endsWith('.html') || 
                      url.pathname === '/' ||
                      event.request.mode === 'navigate';

  if (isCodeAsset) {
    // Network-First for code: Ensures user immediately gets latest code updates
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match('./index.html')))
    );
    return;
  }

  // Cache-First for static media (images, audio, icons)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      });
    })
  );
});
