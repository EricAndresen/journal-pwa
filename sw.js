// TODO: Does not work with local resources, need to make database external to make it work

const cacheName = 'journal-pwa-v1'

// when the service work is installed cache page assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            return cache.addAll([
                
                '/index.html',
                '/restaurant.html',
                '/styles.css'
            ])
        })
    );
});

// intercept fetch events and return cache data if available
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then( response => {
            return response || fetch(event.request);
        })
        .catch( e => console.log(e))
    );;
});