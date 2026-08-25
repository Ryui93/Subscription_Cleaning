# 구독청소

구독청소는 여러 카드와 결제 알림에 흩어진 자동결제를 AI로 정리해주는 개인정보 보호형 구독 관리 도구입니다. 사용자는 결제내역을 붙여넣기만 하면 결제처를 통합하고, 구독 가능성과 해지 우선순위, 예상 절약액을 확인할 수 있습니다. 금융기관 연동이나 서버 저장을 기본으로 사용하지 않아 개인정보 부담을 낮춘 것이 특징입니다.

현재 버전은 **v0.3.0 / 전체 후보 AI 일괄 분석 기능을 포함한 출품 준비 상태**입니다.

## v0.1.0 요약

- 1단계 MVP 완료
- 기본 분석은 API 키 없이 동작
- AI 일괄 분석은 `GEMINI_API_KEY` 설정 시 활성화
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

## AI 기능

`분석` 버튼을 누르면 결제 원문 대신 브라우저에서 추출한 모든 후보의 최소 요약값만
Vercel 서버 함수를 통해 Gemini에 한 번에 전달합니다. AI는 통합된 결제처와 자동 분류, 후보로
판단한 이유, 해지 우선순위, 월·연 지출 영향을 후보별로 짧게 설명합니다.

- 원문 결제내역은 AI 요청에 포함하지 않음
- API 키는 브라우저에 노출하지 않고 Vercel 환경변수로만 사용
- AI 연결이 없거나 실패하면 로컬 자동 설명으로 대체
- AI 분석은 사용자가 `분석` 버튼을 눌렀을 때만 실행되며 하루 7회 한도와 사용량을 표시
- 카드번호·계좌번호·전화번호처럼 보이는 값은 AI 서버 전송 전에 제거
- AI 결과는 금융 자문이나 해지 대행이 아닌 참고 정보

실행 중 AI: Google Gemini API  
개발 보조: ChatGPT/Codex  
사용량 초과 및 API 오류 시 로컬 분석 fallback 제공

Vercel Production 환경변수:

```text
GEMINI_API_KEY=발급받은 서버용 키
GEMINI_MODEL=Gemini 3.6 Flash
```

`GEMINI_API_KEY`는 브라우저나 저장소에 넣지 않고 Vercel 서버 함수에서만 읽습니다. `GEMINI_MODEL`은
환경변수로 바꿀 수 있으며, 표시형 이름은 Gemini API 모델 ID로 정규화됩니다.

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

1. 결제내역 텍스트 붙여넣기
2. 카드 문자/앱 알림/CSV/TSV에서 날짜, 결제처, 금액 추출
3. 카드사/간편결제사 이름 일부 인식
4. 반복결제 후보 탐지
5. 월 예상 자동결제 금액 계산
6. 다음 결제 예상일 표시
7. 후보별 신뢰도 표시
8. 결제처 표현 자동 통합 (`APPLE.COM/BILL`, `애플`, `Apple 결제` 등)
9. OTT/쇼핑/AI 도구/클라우드/음악/게임 자동 분류
10. 반복 주기·금액·횟수 기반 자동결제 후보 설명
11. `유지 / 해지예정 / 모름` 상태 관리와 해지 우선순위 추천
12. 해지예정 월 절약액 및 1년 예상 절약액 표시
13. 월 절약 목표 진행률
14. 원문 거래 목록 확인
15. 고객 요청 방명록
16. 다크모드
17. PWA 설치 버튼
18. 로컬 데이터 백업 파일 다운로드
19. 전체 데이터 삭제

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

- `app.js`, `api/ai-insight.js`, 테스트 파일, `sw.js` 문법 체크 통과
- 샘플 입력 기준 14건 거래 파싱
- 5개 자동결제 후보 탐지
- 4개 카드 그룹 요약
- 새로고침 후 분석 결과/상태 유지 확인
- 해지예정 상태 변경 시 절약액 즉시 갱신 확인
- 전체 데이터 삭제 후 0원/0건 초기화 확인
- 샘플 버튼 -> 분석 -> 해지예정 보기 흐름 확인
- 전체 후보 AI 요약값 생성과 서버 함수 응답 형식 확인

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

- [원티드 출품 준비 문서](docs/contest-entry.md)
- [작업계획서](docs/work-plan.md)
- [배포 가이드](docs/deploy.md)

## 다음 우선순위

1. Vercel Production에 `GEMINI_API_KEY`와 필요 시 `GEMINI_MODEL` 환경변수 등록
2. 실제 카드 알림 샘플 20~30개로 전체 후보 AI 분석과 파서 테스트 확장
3. 원티드 제출 폼에 서비스 링크와 스크린샷 등록
4. 제출 마감 전 배포 링크와 전체 후보 AI 분석 최종 확인
