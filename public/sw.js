// Minimal service worker: exists only so the app satisfies PWA installability
// checks. It intentionally does not intercept fetch/cache anything, since the
// garderob data (Postgres + Blob-backed) must always be fresh.
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});
