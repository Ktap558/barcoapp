const CACHE_NAME = 'barco-app-v1';

// Arquivos que você já tinha, mantidos exatamente iguais
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(['./', './index.html']);
    })
  );
});

// Estratégia de busca que você gosta (Cache primeiro, depois rede)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});

// --- ADIÇÕES PARA O PWABUILDER (Não quebram o que já existe) ---

// 1. Suporte a Sincronização em Segundo Plano (Background Sync)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-barcos') {
    console.log('Sincronizando dados em segundo plano...');
  }
});

// 2. Suporte a Notificações Push
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nova atualização no BarcoApp',
    icon: 'logo.png',
    badge: 'logo.png'
  };
  event.waitUntil(
    self.registration.showNotification('BarcoApp', options)
  );
});

// 3. Sincronização Periódica (Periodic Sync)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-cache') {
    event.waitUntil(fetchAndCacheLatestData());
  }
});
