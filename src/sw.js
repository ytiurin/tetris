// Chrome's currently missing some useful cache methods,
// this polyfill adds them.
importScripts('./public/serviceworker-cache-polyfill.js');

// Here comes the install event!
// This only happens once, when the browser sees this
// version of the ServiceWorker for the first time.
self.addEventListener('install', function(event) {

  if (self.skipWaiting)
    self.skipWaiting()

  // We pass a promise to event.waitUntil to signal how
  // long install takes, and if it failed
  event.waitUntil(
    // We open a cache…
    caches.open('simple-sw-v1').then(function(cache) {

      cache.addAll([
        './public/ambience.ogg',
        './public/beep.ogg',
        './public/key1.ogg',
        './public/key2.ogg',
        './public/key3.ogg',
        './public/key4.ogg',
        './public/space.ogg',
        './public/DejaVuSansMono.ttf'
      ]);

      // And add resources to it
      return cache.addAll([
        './',
        './manifest.json',
        './public/styles.css',
        './public/all.js'
      ]);
    })
  );
});

// The fetch event happens for the page request with the
// ServiceWorker's scope, and any request made within that
// page
self.addEventListener('fetch', function(event) {

  var response = fetch(event.request).then(function (response) {
    // We return the original response for
    // anything other then a local file
    var isLocalFile = new RegExp( event.request.referrer + "(|.+\\..+)$" )
    if ( !isLocalFile.test( response.url ))
      return response
    // Then replace the cached response
    // with the newly recieved
    caches.open('simple-sw-v1').then(function(cache) {
      cache.put( event.request.url, response )
    })
    // And keep the response copy for
    // case when the cache is empty
    return response.clone()
  }).catch(function(){
    // Do smth when offline
  })

  // Calling event.respondWith means we're in charge
  // of providing the response. We pass in a promise
  // that resolves with a response object
  event.respondWith(
    // First we look for something in the caches that
    // matches the request
    caches.match(event.request).then(function(cached) {
      // Then return the cached response or
      // if empty, the fresh response
      return cached || response
    })
  );
});
