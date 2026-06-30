# 배포 가이드

구독청소는 빌드 과정이 없는 정적 PWA입니다. `index.html`, `styles.css`, `app.js`, `manifest.webmanifest`, `sw.js`, `assets/`를 그대로 배포하면 됩니다.

## 배포 전 체크

```powershell
npm run check
npm test
```

로컬에서 PWA 캐시까지 확인하려면:

```powershell
npm run serve
```

그다음 `http://localhost:5173`으로 접속합니다.

## Vercel

1. Git 저장소를 Vercel에 연결합니다.
2. Framework Preset은 `Other`로 둡니다.
3. Build Command는 비워둡니다.
4. Output Directory는 `.`로 둡니다.
5. 배포 후 HTTPS 주소에서 앱 설치 버튼과 오프라인 캐시를 확인합니다.

`vercel.json`은 `sw.js`, `manifest.webmanifest`, `index.html`이 과하게 캐시되지 않도록 설정합니다.

## Netlify

1. Git 저장소를 Netlify에 연결합니다.
2. Build command는 비워둡니다.
3. Publish directory는 `.`로 둡니다.
4. 배포 후 HTTPS 주소에서 앱 설치 버튼과 오프라인 캐시를 확인합니다.

`netlify.toml`은 PWA 핵심 파일의 캐시 정책을 지정합니다.

## 배포 후 확인

- 새로고침 후 화면이 정상 표시되는지
- 샘플 버튼과 분석 버튼이 동작하는지
- 다크모드/초기화/설치 버튼이 동작하는지
- 로컬 저장 후 새로고침해도 상태가 유지되는지
- `백업 파일 받기`와 `전체 데이터 삭제`가 동작하는지
- Chrome DevTools Application 탭에서 service worker가 등록되는지
