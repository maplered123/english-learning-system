/**
 * Service Worker - 专升本英语学习系统
 * 实现离线缓存和 PWA 功能
 */

const CACHE_NAME = 'english-learning-v1';
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
  '/js/data/reading.js'
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
  
  // 静态资源：缓存优先，网络更新
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // 有缓存，先返回缓存，同时后台更新
        fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
        }).catch(() => {
          // 网络失败，忽略（用缓存就行）
        });
        return cachedResponse;
      }
      
      // 没有缓存，走网络
      return fetch(request).then((networkResponse) => {
        // 缓存成功的响应
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // 网络失败，返回离线页面
        if (request.mode === 'navigate') {
          return caches.match(OFFLINE_URL);
        }
        return new Response('离线状态', { status: 503 });
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
