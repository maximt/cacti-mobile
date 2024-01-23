import assets from "../assets.json";

// eslint-disable-next-line no-unused-vars
const flatFiles = object => Object.entries(object).map(([a, b]) => {
  if (typeof b === 'string')
    return b;
  return flatFiles(b);//object or array
}).flat(Infinity);


const cacheName = "cacti-2023-01-22";

self.addEventListener("install", function (e) {
  console.log("[ServiceWorker] Install");

  // root
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      /*global URL_ROOT*/
      /*eslint no-undef: "error"*/
      return cache.add(URL_ROOT);
    })
  );

  // index.js
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      return cache.addAll(flatFiles(assets['index']));
    })
  );

  // assets
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      return cache.addAll(flatFiles(assets['']));
    })
  );

});

self.addEventListener("activate", function (e) {
  console.log("[ServiceWorker] Activate");
  e.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(
        keyList.map(function (key) {
          if (key !== cacheName) {
            return caches.delete(key); // Removing old cache
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener("fetch", function (e) {
  console.log("[Service Worker] Fetch", e.request.url);
  e.respondWith(
    caches.match(e.request).then(function (response) {
      return response || fetch(e.request); //cache first
    })
  );
});

self.addEventListener('push', function (event) {
  if (!(self.Notification && self.Notification.permission === 'granted')) {
    console.log('[Service Worker] Notification not allowed');
    return;
  }

  if (!event.data) {
    return;
  }

  const sendNotification = msg => {
    return self.registration.showNotification('Cacti Tray', {
      body: msg,
      icon: 'img/cacti-96.png'
    });
  }

  const message = event.data.text()
  if (message && message === 'update') {
    self.registration.update();
  } else {
    event.waitUntil(sendNotification(message));
  }
});
