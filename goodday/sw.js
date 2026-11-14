// 항상일상 서비스워커 (설치용). 기준: app\_공통\설치준비.md
// - 화면 파일(html)은 네트워크 먼저, 못 받을 때만 저장본(옛 화면이 남지 않게). embed(?embed=1)도 같은 규칙.
// - 구글 로그인·Drive·Picker 등 다른 주소 요청은 가로채지 않음. 기록 데이터는 저장하지 않음(화면 코드만).
// - 새 버전이 오면 skipWaiting + clients.claim.
const CACHE = "goodday-v1";
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(
  caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
));
const keyOf = (url) => { const u = new URL(url); return u.origin + u.pathname; }; // 주소의 ?뒤·#뒤는 빼고 하나로 저장(화면 코드뿐)
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  if (new URL(req.url).origin !== self.location.origin) return; // 다른 주소는 그대로 통과
  if (req.mode !== "navigate") return; // 화면(html) 이동만 다룸. 아이콘 등은 브라우저가 알아서
  e.respondWith(
    fetch(req).then((res) => {
      if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(keyOf(req.url), copy)); }
      return res;
    }).catch(() => caches.match(keyOf(req.url)).then((r) => r || Response.error()))
  );
});
