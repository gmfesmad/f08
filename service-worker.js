const CACHE_STATIC_NAME = "static-v1";
const CACHE_DYNAMIC_NAME = "dynamic-v1";

const OFFLINE_URL = "offline.html";

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE_STATIC_NAME).then(function (cache) {
      return cache.addAll([OFFLINE_URL]);
    })
  );
});

self.addEventListener("fetch", function (e) {
  async function handleNavigationRequest(request) {
    try {
      const networkResponse = await fetch(request);
      return networkResponse;
    } catch (error) {
      console.log("Fetch failed; returning offline page instead.", error);

      const cache = await caches.open(CACHE_STATIC_NAME);
      const cachedResponse = await cache.match(OFFLINE_URL);
      return cachedResponse;
    }
  }

  if (e.request.mode === "navigate") {
    e.respondWith(handleNavigationRequest(e.request));
  } else {
    e.respondWith(
      caches.match(e.request).then(function (response) {
        if (response) {
          return response;
        } else {
          return fetch(e.request)
            .then(function (res) {
              return caches.open(CACHE_DYNAMIC_NAME).then(function (cache) {
                cache.put(e.request.url, res.clone());
                return res;
              });
            })
            .catch(function (err) {
              console.log(err);
            });
        }
      })
    );
  }
});

self.addEventListener('push', function (e) {
  console.log("PUSH EVENT")
  var body;
  if (e.data) {
    body = e.data.text();
  } else {
    body = 'Push message no payload';
  }

  var options = {
    body: body, vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }, 
    actions: [
      {action: 'explore', title: 'Explore this new world'},
    {action: 'close', title: 'I don\'t want any of this', icon: 'images/xmark.png'},
  
    ]
  };
  e, waitUntil(
    self.registration.showNotification('Push Notification', options)
  );
});
