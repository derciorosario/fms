const CACHE_NAME = "version-1";
//const urlsToCache = [ 'index.html', 'offline.html',''];

const urlsToCache=[
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  '/login',
  '/src/main*.jsx', 
  '/*.jpg',
  "/**/*.{js,ts,jsx,tsx}",
  '/@vite/client'
  //'/assets/index*.js',
  //'/assets/index*.css',
  
]
const self = this;



// Install SW
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');

                return cache.addAll(urlsToCache);
            })
    )
});

// Listen for requests
/*self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(() => {
                return fetch(event.request) 
                    .catch(() => caches.match('offline.html'))
            })
    )
});

/*self.addEventListener('fetch', event => {
    
    event.respondWith(
      caches.match(event.request)
        //.then(response => response || fetch(event.request))
        .then(response => {
          if(response)  return response
        })
    );
});*/





// Activate the SW
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [];
    cacheWhitelist.push(CACHE_NAME);

    event.waitUntil(
        caches.keys().then((cacheNames) => Promise.all(
            cacheNames.map((cacheName) => {
                if(!cacheWhitelist.includes(cacheName)) {
                    return caches.delete(cacheName);
                }
            })
        ))
            
    )
});

