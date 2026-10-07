// タスクリアのサービスワーカー
// 画面のファイルをブラウザに保存しておき、ネットがなくてもアプリを開けるようにする
// ・いつもは、ネットから新しいファイルを取ってきて、保存しなおす（アプリを新しくしたら、すぐ反映される）
// ・ネットがないときだけ、保存しておいたファイルを使う

// 保存場所の名前（このファイルの中身を大きく変えたときは、v の数字を上げる）
const CACHE_NAME = "tasclear-v1";

// 最初に保存しておくファイル
const APP_FILES = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png",
  "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2",
];

// 入れたとき：ファイルを保存しておく（1つ失敗しても、ほかは保存する）
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return Promise.allSettled(APP_FILES.map(function (file) {
        return cache.add(file);
      }));
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

// 新しくなったとき：前の保存場所を消して、すぐ使いはじめる
self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (names) {
      return Promise.all(names.filter(function (name) {
        return name !== CACHE_NAME;
      }).map(function (name) {
        return caches.delete(name);
      }));
    }).then(function () {
      return self.clients.claim();
    })
  );
});

// 保存してよいファイルかを返す（このアプリのファイルと、Supabase の道具だけ。音のファイルと、Supabase とのやりとりは保存しない）
function shouldCache(request) {
  const url = new URL(request.url);
  if (request.method !== "GET" || url.pathname.endsWith(".mp3")) {
    return false;
  }
  return url.origin === self.location.origin || url.href.startsWith("https://cdn.jsdelivr.net/npm/@supabase/");
}

// ファイルを取りにいくとき：まずネットから。だめなら保存しておいたものを使う
self.addEventListener("fetch", function (event) {
  if (!shouldCache(event.request)) {
    return; // ふつうにネットから取る
  }
  event.respondWith(
    fetch(event.request).then(function (response) {
      if (response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request, copy);
        });
      }
      return response;
    }).catch(function () {
      return caches.match(event.request).then(function (saved) {
        return saved || caches.match("./index.html");
      });
    })
  );
});

// お知らせ（通知）を押したとき：開いているアプリを前に出す（なければ開く）
self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (windows) {
      if (windows.length > 0) {
        return windows[0].focus();
      }
      return self.clients.openWindow("./index.html");
    })
  );
});
