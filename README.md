# 구독청소

구독청소는 카드 승인 문자, 카드앱 결제 알림, 통장 거래내역 텍스트를 붙여넣으면 반복되는 자동결제 후보를 찾아 정리해주는 모바일 웹/PWA입니다.

현재 버전은 **v0.1.0 / 1단계 MVP 완료 상태**입니다.

## v0.1.0 요약

- 1단계 MVP 완료
- API 키 없음
- 로그인 없음
- 서버 저장 없음
- 외부 DB 없음
- 브라우저 로컬 분석
- `localStorage` 저장
- PWA 설치/캐시 대응
- 구독 후보 탐지
- 유지/해지예정/모름 상태 관리
- 해지예정 절약액 표시
- 로컬 백업/전체 삭제 지원

## 제품 방향

구독청소는 가계부가 아니라 **새는 돈 점검 도구**입니다.

모든 지출을 기록하게 만드는 대신, 사용자가 놓치기 쉬운 자동결제, 구독, 멤버십, 앱스토어 결제, AI 도구 결제, 렌탈성 지출만 빠르게 찾아 보여주는 것을 목표로 합니다.

## 개인정보 원칙

v0.1.0에서는 입력한 결제내역이 서버로 전송되지 않습니다.

- 분석은 현재 브라우저에서만 실행됩니다.
- 분석 결과와 상태는 `localStorage`에 저장됩니다.
- 사용자가 직접 `전체 데이터 삭제`를 누르면 로컬 저장 데이터가 초기화됩니다.
- 고객 요청 방명록도 현재 브라우저에만 저장됩니다.
- 카드번호 전체, 주민번호, 비밀번호, 인증서, 계좌번호 전체는 입력하지 않는 것을 전제로 합니다.

## 주요 기능

1. 결제 알림 텍스트 붙여넣기
2. 카드 문자/앱 알림/CSV/TSV에서 날짜, 결제처, 금액 추출
3. 카드사/간편결제사 이름 일부 인식
4. 반복결제 후보 탐지
5. 월 예상 자동결제 금액 계산
6. 다음 결제 예상일 표시
7. 후보별 신뢰도 표시
8. 후보로 잡힌 이유 표시
9. `유지 / 해지예정 / 모름` 상태 관리
10. 해지예정 예상 절약액 표시
11. 월 절약 목표 진행률
12. 원문 거래 목록 확인
13. 고객 요청 방명록
14. 다크모드
15. PWA 설치 버튼
16. 로컬 데이터 백업 파일 다운로드
17. 전체 데이터 삭제

## 바로 실행

파일을 바로 열어도 기본 기능은 동작합니다.

```text
index.html
```

PWA 캐시와 설치 흐름까지 확인하려면 로컬 서버로 실행하세요.

```powershell
python -m http.server 5173
```

그다음 브라우저에서 접속합니다.

```text
http://localhost:5173
```

## 테스트

PowerShell에서 `npm` 실행 정책 오류가 나면 `cmd.exe /c`를 붙여 실행합니다.

```powershell
cmd.exe /c npm run check
cmd.exe /c npm test
```

현재 확인된 테스트:

- `app.js`, `tests/parser-smoke.js`, `sw.js` 문법 체크 통과
- 샘플 입력 기준 14건 거래 파싱
- 5개 자동결제 후보 탐지
- 4개 카드 그룹 요약
- 새로고침 후 분석 결과/상태 유지 확인
- 해지예정 상태 변경 시 절약액 즉시 갱신 확인
- 전체 데이터 삭제 후 0원/0건 초기화 확인
- 샘플 버튼 -> 분석 -> 해지예정 보기 흐름 확인

## 샘플 탐지 결과

기본 샘플 입력 기준으로 다음 후보가 탐지됩니다.

- `NETFLIX`: 최근 3개월 반복 결제 감지
- `쿠팡와우`: 최근 3개월 반복 결제 감지
- `APPLE.COM/BILL`: 최근 3개월 반복 결제 감지
- `OPENAI *CHATGPT`: 반복 결제 가능성 감지
- `ADOBE CREATIVE CLOUD`: 반복 내역이 부족해 확인 필요

## 배포 상태

정적 배포 준비 파일은 포함되어 있습니다.

- `about.html`
- `guide.html`
- `privacy.html`
- `terms.html`
- `contact.html`
- `sitemap.html`
- `articles/subscription-checklist.html`
- `articles/auto-payment-check.html`
- `articles/card-message-guide.html`
- `articles/card-alert-subscription.html`
- `articles/coupang-ott-appstore-checklist.html`
- `articles/ott-subscription-saving.html`
- `articles/before-cancel-subscription.html`
- `articles/auto-payment-vs-transfer.html`
- `articles/subscription-cleaning-example.html`
- `articles/ai-tool-subscription.html`
- `articles/local-storage-privacy.html`
- `articles/browser-only-privacy.html`
- `vercel.json`
- `netlify.toml`
- `manifest.webmanifest`
- `sw.js`

Vercel 배포와 공개 URL 확인까지 진행했습니다.

배포 방법은 [배포 가이드](docs/deploy.md)를 참고하세요.

## 문서

- [작업계획서](docs/work-plan.md)
- [배포 가이드](docs/deploy.md)

## 다음 우선순위

1. Git 첫 커밋 생성
2. `v0.1.0` 태그 생성
3. Netlify 또는 Vercel 배포
4. 실제 카드 알림 샘플 20~30개로 파서 테스트 확장
5. 베타 사용자 테스트 체크리스트 작성
6. 애드센스 신청 전 실제 배포 URL에서 모바일 메뉴/정책 페이지/콘텐츠 페이지 재확인
