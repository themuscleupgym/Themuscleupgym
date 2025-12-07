const CACHE_NAME = "muscleup-cache-v1";

const urlsToCache = [
  "/Themuscleupgym/",
  "/Themuscleupgym/index.html",
  "/Themuscleupgym/user.html",
  "/Themuscleupgym/trainer.html",
  "/Themuscleupgym/owner.html",
  "/Themuscleupgym/manifest.json"
];

// Install SW and cache essential files
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Caching app shell...");
      return cache.addAll(urlsToCache);
    })
  );
});

// Intercept fetch requests
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Return cached file or fetch from network
      return response || fetch(event.request);
    })
  );
});

// Activate SW and remove old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(cache => cache !== CACHE_NAME)
          .map(cache => caches.delete(cache))
      )
    )
  );
});
