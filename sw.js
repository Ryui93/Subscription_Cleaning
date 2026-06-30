const CACHE_NAME = "subscription-cleaning-v20";
const ASSETS = [
  "./",
  "./index.html",
  "./about.html",
  "./guide.html",
  "./privacy.html",
  "./terms.html",
  "./contact.html",
  "./sitemap.html",
  "./articles/subscription-checklist.html",
  "./articles/auto-payment-check.html",
  "./articles/card-message-guide.html",
  "./articles/card-alert-subscription.html",
  "./articles/coupang-ott-appstore-checklist.html",
  "./articles/ott-subscription-saving.html",
  "./articles/before-cancel-subscription.html",
  "./articles/auto-payment-vs-transfer.html",
  "./articles/subscription-cleaning-example.html",
  "./articles/ai-tool-subscription.html",
  "./articles/local-storage-privacy.html",
  "./articles/browser-only-privacy.html",
  "./styles.css",
  "./app.js",
  "./manifest.webmanifest",
  "./assets/icon.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});
