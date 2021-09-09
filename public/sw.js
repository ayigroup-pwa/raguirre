var CACHE_STATIC_NAME = 'static-v2';
var CACHE_DYNAMIC_NAME = 'dynamic-v1';
var STATIC_FILES = [
  '/',
  '/index.html',
  '/src/css/app.css',
  '/src/css/main.css',
  '/src/js/main.js',
  '/src/js/material.min.js',
  'https://fonts.googleapis.com/css?family=Roboto:400,700',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
];


self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME)
      .then(function(cache) {
        cache.addAll([
          '/',
          '/index.html',
          '/src/css/app.css',
          '/src/css/main.css',
          '/src/js/main.js',
          '/src/js/material.min.js',
          'https://fonts.googleapis.com/css?family=Roboto:400,700',
          'https://fonts.googleapis.com/icon?family=Material+Icons',
          'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
        ]);
      })
  )
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys()
      .then(function(keyList) {
        return Promise.all(keyList.map(function(key) {
          if (key !== CACHE_STATIC_NAME) {
            return caches.delete(key);
          }
        }));
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        } else {
          return fetch(event.request)
            .then(function(res) {
              return caches.open(CACHE_DYNAMIC_NAME)
                .then(function(cache) {
                  cache.put(event.request.url, res.clone());
                  return res;
                });
            })
            .catch(function(err) {

            });
        }
      })
  );
});
//1) Cache with Network fallback.
/*
2) NETWORK ONLY STRATEGY
self.addEventListener('fetch', event =>{
  event.respondWith(fetch(event.request));
});
*/
/*
3) CACHE ONLY STRATEGY
self.addEventListener('fetch', event =>{
  event.respondWith(caches.match(event.request));
});
*/
/*
4) NETWORK, CACHE FALLBACK STRATEGY
self.addEventListener('fetch', event =>{
  event.respondWith(
    fetch(event.request)
    .then(res =>{
      return caches.open(ACHE_DYNAMIC_NAME).then((cache) => {
        cache.put(event.request.url, res.clone());
        return res;
      })
    })
    .catch((err) => {
      return caches.match(event.request);
    })
    )
  });
*/
/*
5) CACHE, THEN NETWORK STRATEGY
let estaEnElArray = (string, array) =>{
  for(item in array){
    if(array[item] == string){
      return true;
    }
  }
  return false;
}
self.addEventListener('fetch', event => {
  if(event.request.url.indexOf('https://httpbin.org/ip') > -1){
    event.respondWith(
      caches.open(CACHE_DYNAMIC_NAME)
      .then(cache => {
        return fetch(event.request)
        .then(response=> {
          cache.put(event.request.url, res.clone());
          return response;
        });
      })
      )
      //buscamos en los archivos estáticos
    }else if(estaEnElArray(event.request.url, STATIC_FILES)){
      event.respondWith(
        caches.match(event.request)
        );
*/
/*
6) ADD "ROUTING"/ URL PARSING
let estaEnElArray = (string, array) =>{
  for(item in array){
    if(array[item] == string){
      return true;
    }
  }
  return false;
}
self.addEventListener('fetch', event => {
  if(event.request.url.indexOf('https://httpbin.org/ip') > -1){
    event.respondWith(
      caches.open(CACHE_DYNAMIC_NAME)
      .then(cache => {
        return fetch(event.request)
        .then(response=> {
          cache.put(event.request.url, res.clone());
          return response;
        });
      })
      )
      //buscamos en los archivos estáticos
  }else if(estaEnElArray(event.request.url, STATIC_FILES)){
    event.respondWith(
      caches.match(event.request)
      );
  }else{
    event.respondWith(
      caches.match(event.request)
      .then(res =>{
        if(res){
          return res;
        }else{
          return fetch(event.request)
          .then(response=>{
            return caches.open(CACHE_DYNAMIC_NAME)
            .then(cache =>{
              cache.put(event.request.url, response.clone())
              return response;
            })
          })
          .catch(err=>{ 
            return caches.match('/offline.html');    
          })
        }
      })
      )}
    });*/
        
        