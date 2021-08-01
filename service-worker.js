const version = "version_01",
const CACHE_NAME = "static-cache-v1";
const DATA_CACHE_NAME = "data-cache-v1"
const FILES_TO_CACHE = [
    "./index.html",
    "/",
    "/css/styles.css",
    "/js/db.js",
    "/js/index.js",
    ".public/icons/icon-72x72.png",
    "./public/icons/icon-96x96.png",
    "./public/icons/icon-128x128.png",
    "./public/icons/icon-144x144.png",
    "./public/icons/icon-152x152.png",
    "./public/icons/icon-192x192.png",
    "./public/icons/icon-384x384.png",
    "./public/icons/icon-512x512.png",
    "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
    "https://cdn.jsdelivr.net/npm/chart.js@2.8.0"
];

self.addEventListener("install", (e) => {
    e.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(FILES_TO_CACHE);
      })
    );
  
    self.skipWaiting();
  });
  
  self.addEventListener("activate", (e) => {
    e.waitUntil(
      caches.keys().then((keyList) => {
        return Promise.all(
          keyList.map((key) => {
            if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
              return caches.delete(key);
            }
          })
        );
      })
    );
  
    self.clients.claim();
  });
  
  self.addEventListener("fetch", (evt) => {
    if (e.request.url.includes("/api/") && e.request.method === "GET") {
      e.respondWith(
        caches
          .open(DATA_CACHE_NAME)
          .then((cache) => {
            return fetch(e.request)
              .then((response) => {
                if (response.status === 200) {
                  cache.put(e.request, response.clone());
                }
  
                return response;
              })
              .catch(() => {
               
                return cache.match(e.request);
              });
          })
          .catch((err) => console.log(err))
      );
  
     
      return;
    }
  
    
    e.respondWith(
      caches.match(e.request).then((response) => {
        return response || fetch(e.request);
      })
    );
  });