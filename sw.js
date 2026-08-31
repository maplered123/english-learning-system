/**
 * Service Worker - 专升本英语学习系统
 * 实现离线缓存和 PWA 功能
 */

const CACHE_NAME = 'english-learning-v7';
const OFFLINE_URL = '/';

// 需要缓存的核心资源
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/style.css',
  '/js/app.js',
  '/js/data/vocabulary.js',
  '/js/data/vocabulary2.js',
  '/js/data/vocabulary3.js',
  '/js/data/vocabulary4.js',
  '/js/data/vocabulary5.js',
  '/js/data/grammar.js',
  '/js/data/writing.js',
  '/js/data/reading.js',
  '/js/data/translation.js',
  '/js/data/exam-papers.js',
  '/js/data/word-forms.js'
];

// 安装时预缓存核心资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRECACHE_URLS).catch((err) => {
          console.warn('预缓存部分资源失败:', err);
          // 即使部分失败也继续
          return Promise.resolve();
        });
      })
      .then(() => self.skipWaiting())
  );
});

// 激活时清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// 拦截请求 - 缓存优先策略
self.addEventListener('fetch', (event) => {
  const request = event.request;
  
  // 只缓存 GET 请求
  if (request.method !== 'GET') {
    return;
  }
  
  const url = new URL(request.url);
  
  // API 请求不缓存，直接走网络
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response(JSON.stringify({ error: '网络连接失败' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
    return;
  }
  
  // 静态资源：网络优先，离线回退缓存
  var cacheKey = new URL(request.url);
  var noQueryUrl = cacheKey.origin + cacheKey.pathname;
  
  event.respondWith(
    fetch(request).then((networkResponse) => {
      if (networkResponse && networkResponse.status === 200) {
        var responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(noQueryUrl, responseToCache);
        });
      }
      return networkResponse;
    }).catch(function() {
      // 网络失败，回退缓存（忽略查询参数）
      return caches.match(noQueryUrl).then(function(cachedResponse) {
        if (cachedResponse) return cachedResponse;
        return caches.match(request).then(function(cachedResp) {
          if (cachedResp) return cachedResp;
          if (request.mode === 'navigate') {
            return caches.match(OFFLINE_URL);
          }
          return new Response('离线状态', { status: 503 });
        });
      });
    })
  );
});

// 监听推送消息（预留）
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png'
    });
  }
});

// 点击通知
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
