// 팀쿡: 홈 화면 설치용 서비스워커 (app\_공통\설치준비.md 기준)
// 화면(html)은 네트워크 먼저, 실패할 때만 저장본. 아이콘·manifest만 저장. 구글 로그인·Drive 등 다른 주소는 가로채지 않음. 진행 데이터는 저장하지 않음.
const C = "teamcook-v1";
const SHELL = ["./", "index.html", "manifest.webmanifest", "favicon.png", "apple-touch-icon.png", "icon-192.png", "icon-512.png", "icon-512-maskable.png"];
self.addEventListener("install", (e) => { self.skipWaiting(); e.waitUntil(caches.open(C).then((c) => c.addAll(SHELL)).catch(() => {})); });
self.addEventListener("activate", (e) => e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== C).map((k) => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener("fetch", (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin || !u.pathname.startsWith(new URL("./", self.registration.scope).pathname)) return;
  if (e.request.mode === "navigate" || u.pathname.endsWith(".html") || u.pathname.endsWith("/")) {
    e.respondWith(fetch(e.request, { cache: "no-store" }).then((r) => { const cp = r.clone(); caches.open(C).then((c) => c.put("index.html", cp)).catch(() => {}); return r; }).catch(() => caches.match("index.html")));
    return;
  }
  if (/\.(png|webmanifest)$/.test(u.pathname)) e.respondWith(caches.match(e.request).then((m) => m || fetch(e.request)));
});
