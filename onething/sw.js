/* 말만해요 서비스워커 (설치용). 규칙: app\_공통\설치준비.md
   - 화면 파일(html)은 네트워크 먼저(검증해서 받음), 실패할 때만 저장본
   - 이 앱 폴더 안의 GET 화면 요청만 다룸. 구글 로그인·Drive·Calendar·Gemini 등 다른 주소 요청은 가로채지 않음
   - 데이터(기록·고객 정보)는 저장하지 않음: 저장하는 건 화면 파일(index.html) 하나뿐
   - 모듈 iframe 주소의 ?embed=1&t= 같은 값과 상관없이 같은 화면 파일 하나로 취급 */
const CACHE = "onething-shell-v1";
const SHELL = new URL("./", self.registration.scope).href;
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});
self.addEventListener("fetch", (e) => {
  const r = e.request;
  if (r.method !== "GET" || r.mode !== "navigate") return; // 화면 이동만. 아이콘·다른 주소는 브라우저가 그대로 처리
  const u = new URL(r.url);
  if (u.origin !== self.location.origin || !u.href.startsWith(SHELL)) return;
  e.respondWith((async () => {
    try {
      const res = await fetch(r.url, { cache: "no-cache" }); // 서버에 새 버전이 있는지 확인하고 받음
      if (res.ok) { const c = await caches.open(CACHE); await c.put(SHELL, res.clone()); }
      return res;
    } catch (err) {
      const c = await caches.open(CACHE);
      return (await c.match(SHELL)) || Response.error();
    }
  })());
});
