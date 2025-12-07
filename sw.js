// sw.js
const CACHE_NAME = "muscleup-cache-v1";
const urlsToCache = [
  "/Themuscleupgym/",
  "/Themuscleupgym/index.html",
  "/Themuscleupgym/user.html",
  "/Themuscleupgym/trainer.html",
  "/Themuscleupgym/owner.html",
  "/Themuscleupgym/manifest.json"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});
self.addEventListener("fetch", event => {
  event.respondWith(caches.match(event.request).then(response => response || fetch(event.request)));
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))));
});
