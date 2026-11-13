// 차차차: 설치(홈 화면 앱)를 위한 최소 서비스워커. 기록은 저장하지 않고 항상 네트워크에서 가져옵니다.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {}); // 설치 조건을 맞추기 위한 빈 처리(캐시 안 함)
