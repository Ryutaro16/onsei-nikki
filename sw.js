/* リマインド通知を受け取るための仕組み(筋モンの sw.js の通知部分と同じ)。
   ページの保存(オフライン用)はしない。日記はアプリの中(IndexedDB)にあり、整えるにはネットが要るため */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

// 通知サーバーから届いたら表示する
self.addEventListener('push', (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch { d = { body: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.title || '音声日記', {
    body: d.body || '今日の日記はまだです', icon: 'icon-180.png', badge: 'icon-180.png', tag: 'nikki-remind', data: { url: d.url || './' },
  }));
});
// 押されたら、アプリの「話す」画面を開く
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((cs) => {
    const c = cs.find((x) => 'focus' in x);
    return c ? c.focus() : self.clients.openWindow(e.notification.data?.url || './');
  }));
});
