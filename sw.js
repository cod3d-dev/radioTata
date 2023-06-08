const STATIC_CACHE = "radioTata-v59"
const DYNAMIC_CACHE = 'radioTata-dynamic-v553';

const STATIC_FILES = [
  "/",
  "/index.html",
  "https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css",
  "/css/style.css",
  "/css/app.css",
  "https://fonts.googleapis.com/css2?family=Hind:wght@300;400;500;600;700&display=swap",
  "https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&display=swap",
  "fonts/css/fontawesome-all.min.css",
  "/app/icons/icon-32x32.png",
  "/app/icons/icon-16x16.png",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
  "https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js",
  "/js/app.js",
  '/js/idb.js',
  '/js/feed.js',
  '/js/idbutility.js',
  '/funk-01.jpeg',
  '/app/icons/icon2-512x512.png',
  'https://fonts.gstatic.com/s/lato/v24/S6u9w4BMUTPHh6UVSwiPGQ3q5d0.woff2',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-solid-900.woff2',
  'https://fonts.gstatic.com/s/lato/v24/S6uyw4BMUTPHjx4wXiWtFCc.woff2',
  '/images/funk.jpeg',
  '/images/offline.png'
];


// Carga los archivos estáticos en el cache
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(STATIC_CACHE)
    .then(function (cache) {
      cache.addAll(STATIC_FILES);
    })
  );
  self.skipWaiting();
});

// Elimina los caches antiguos
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys
          .filter(function (key) {
            return key !== STATIC_CACHE && key !== DYNAMIC_CACHE;
          })
          .map(function (key) {
            return caches.delete(key);
          })
        );
      })
  );
  return self.clients.claim();
});


// Carga los archivos dinámicos en el cache
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        if (response) {
          return response;
        } else {
          return fetch(event.request)
            .then(function (res) {
              return caches.open(DYNAMIC_CACHE)
                .then(function (cache) {
                  cache.put(event.request.url, res.clone());
                  return res;
                });
            })
            .catch(function (err) {
              return caches.open(STATIC_CACHE)
                .then(function (cache) {
                  return cache.match('/images/offline.png');
                });
            });
        }
      })
  );
});
