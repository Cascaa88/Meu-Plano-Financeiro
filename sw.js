const CACHE_NAME = 'meu-pwa-cache-v1';
const OFFLINE_URL = '/offline.html'
const urlsToCache = [
  '/',
  '/index.html',
  '/css/style.css', // Se você tiver um arquivo CSS
  '/js/script.js',
  '/js/main.js',   // Se você tiver um arquivo JavaScript
  '/images/icone-192x192.png',
  '/images/icone-512x512.png'
  // Adicione aqui todos os outros recursos que você quer cachear
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - retorna a resposta do cache
        if (response) {
          return response;
        }
        // Nenhuma correspondência no cache, busca na rede
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Excluindo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
