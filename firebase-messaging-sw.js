/* আল ইনসাফ — পুশ নোটিফিকেশনের সার্ভিস ওয়ার্কার
   এই ফাইলটি index.html-এর ঠিক পাশে (একই ফোল্ডারে) আপলোড করতে হবে। */
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAUMU4FCcPm3o6JpZwmPKfR3P5rpMMkzV0",
  authDomain: "al-insaf-e36ba.firebaseapp.com",
  projectId: "al-insaf-e36ba",
  storageBucket: "al-insaf-e36ba.firebasestorage.app",
  messagingSenderId: "111499337358",
  appId: "1:111499337358:web:3ac2e98ee2a2b7e61173df"
});

const messaging = firebase.messaging();

/* অ্যাপ বন্ধ বা ব্যাকগ্রাউন্ডে থাকলে বার্তা দেখানো (সার্ভার শুধু data পাঠায়, তাই দ্বিগুণ দেখাবে না) */
messaging.onBackgroundMessage((payload) => {
  const d = (payload && payload.data) || {};
  return self.registration.showNotification(d.title || 'আল ইনসাফ', {
    body: d.body || '',
    tag: d.tag || 'alinsaf',
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    data: { url: d.url || './' }
  });
});

/* নোটিফিকেশনে চাপলে অ্যাপ খুলবে (খোলা থাকলে সেটিই সামনে আসবে) */
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || './', self.registration.scope).href;
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const c of list) {
        if (c.url.indexOf(self.registration.scope) === 0 && 'focus' in c) return c.focus();
      }
      return self.clients.openWindow(url);
    })
  );
});

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
