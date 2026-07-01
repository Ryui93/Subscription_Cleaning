# 니케의 모든 것

승리의 여신: 니케 유저를 위한 비공식 통합 도우미 웹앱 MVP입니다. 현재 앱은 다크 사이버/SF 콘솔 UI를 유지하면서, 사용자가 보유 니케를 직접 체크하고 콘텐츠별 추천 조합, 부족한 역할, 대체 니케, 육성 우선순위, 외부 도구, 메타 참고 신호를 확인할 수 있게 구성되어 있습니다.

## 기술 스택

- Next.js App Router
- TypeScript
- Tailwind CSS
- localStorage 기반 보유 니케 저장
- 로컬 TypeScript 데이터 파일 기반 MVP
- Vercel 배포 가능 구조

## 실행 방법

```powershell
npm install
npm run dev
```

기본 주소는 `http://localhost:3000`입니다.

## 빌드 방법

```powershell
npm run build
```

검증용 명령:

```powershell
npm run lint
npm run typecheck
npm run validate:nikkes
```

## 주요 페이지

- `/` 홈: 보유 니케 수, 외부 도구 수, 검수 완료 메타 수, 빠른 시작 버튼
- `/owned` 내 보유 니케: 검색, 버스트/클래스/속성/무기/제조사 필터, 상세 투자 메모 저장
- `/account` 계정 성장: 호감도, 싱크로 디바이스, 리사이클룸, 택틱 아카데미 입력
- `/recommend` 조합 추천: 콘텐츠별 5인 스쿼드 3개, 이유, 경고, 부족 역할, 대체 니케
- `/growth` 육성 추천: 전체 TOP 10, 콘텐츠별 우선순위, 스킬/오버로드/큐브/소장품 계획
- `/tools` 외부 도구: 검색, 카테고리 필터, 신뢰도, 새 탭 링크
- `/meta` 메타 참고: 출처/콘텐츠/검수/반응 필터
- `/admin` 데이터 검수 대시보드: 전체 209명 현황, sourceStatus 통계, placeholder 비율, 검수 우선순위 TOP 30
- `/admin/data-quality` 데이터 품질 표: 검색, rarity/sourceStatus/manufacturer/availability/한정/콜라보/필그림 필터, 검수 필요 배지

## 데이터 수정 위치

- 니케 로스터 호환 export: `data/nikkes.ts`
- SSR/SR/R 니케 로스터: `data/nikkeRoster/ssr.ts`, `data/nikkeRoster/sr.ts`, `data/nikkeRoster/r.ts`
- 니케 로스터 기본값/출처: `data/nikkeRoster/common.ts`
- 니케 로스터 검증 규칙: `data/nikkeRoster/validation.ts`
- 콘텐츠별 역할 규칙: `data/contentRules.ts`
- 외부 도구 링크: `data/externalTools.ts`
- 메타 참고 신호: `data/communitySignals.ts`
- 샘플 보유 목록: `data/sampleOwned.ts`

## 현재 로스터 범위

현재 로스터는 검수 데이터와 누락 placeholder를 합쳐 209명입니다. 지시서의 1순위 메타/자주 쓰이는 SSR, SR, R 기본 항목은 우선 등록했고, Prydwen Characters 및 Nikke Deck 209명 카운트 기준으로 빠져 있던 140명은 `data/nikkeRoster/missingPlaceholders.ts`에 `placeholder`로 먼저 생성했습니다.

누락 대조 목록은 `docs/missing-nikkes.md`에서 확인할 수 있습니다. `(Treasure)` 항목은 세부 검수가 필요하지만, 외부 덱 빌더 카운트와 맞추기 위해 우선 placeholder로 포함했습니다.

## 데이터 검수 관리

`sourceStatus` 배지는 사용자 카드, 추천 결과, 관리자 표에서 공통으로 사용합니다.

- `verified`: 검수 완료
- `communityChecked`: 커뮤니티 확인
- `needsReview`: 검수 필요
- `placeholder`: 임시 데이터

`npm run validate:nikkes`는 placeholder warning을 실패로 처리하지 않고, 전체 수, sourceStatus 분포, rarity 분포, 주요 warning 유형을 요약합니다. errors가 0이면 `PASS WITH WARNINGS` 상태로 종료 코드 0을 유지합니다.

추천 결과에는 `confidence`가 표시됩니다.

- 높음: 검수/커뮤니티 확인 데이터가 4명 이상이고 placeholder가 없음
- 보통: needsReview가 일부 포함됨
- 낮음: placeholder가 1명 이상 포함됨

placeholder는 추천에서 완전히 제외하지 않습니다. 대신 점수 감점, 검수 경고, 추천 신뢰도 낮음 표시로 실제 메타와 다를 수 있음을 보여줍니다.

## 보유 니케 저장 구조

localStorage key는 `nikke-all-in-one-owned`입니다.

```ts
type OwnedNikkeState = {
  id: string
  owned: boolean
  level?: number
  limitBreak?: number
  coreEnhancement?: number
  skill1?: number
  skill2?: number
  burstSkill?: number
  overloadCount?: number
  collectionOwned?: boolean
  collectionLevel?: number
  collectionMemo?: string
  equipment?: NikkeEquipmentState
  overclockMemo?: string
  isFavorite?: boolean
  memo?: string
}
```

기존 MVP 키(`nikke-everything-owned-v1`)의 단순 id 배열도 읽을 수 있게 유지했습니다.

## 계정 성장 저장 구조

계정 성장 데이터는 보유 니케 데이터와 분리해서 `nikke-all-in-one-account-growth` localStorage key에 저장합니다.

- 호감도: 니케별 사용자 입력값이며 보유 니케 카드와 `/account` 페이지에서 같은 데이터를 공유합니다.
- 싱크로 디바이스: 현재 싱크로 레벨, 최대 슬롯 수, 사용 중 슬롯 수, 메모를 저장합니다.
- 리사이클룸: 클래스별/제조사별 투자 레벨과 메모를 저장합니다.
- 택틱 아카데미: 현재 진행 단계, 완료 수업 메모, 추가 메모를 저장합니다.
- 오버클럭: 사용 여부, 레벨, 선택 조건 메모, 주의 메모를 저장합니다.

계정 성장 보정은 실제 게임 전투력 공식을 복제하지 않고, 추천 점수와 육성 우선순위에 소폭만 반영합니다. 향후 계정 데이터 내보내기/가져오기 UI를 붙일 수 있도록 `lib/accountExport.ts`에 백업/복구 유틸을 준비했습니다.

## 장비 / 오버로드 저장 구조

장비 데이터는 보유 니케 데이터 안의 `equipment` 필드에 저장합니다. localStorage key는 기존과 동일하게 `nikke-all-in-one-owned`를 사용하므로 기존 보유 데이터와 함께 백업됩니다.

- 장비 슬롯: 머리, 장갑, 몸통, 신발
- 장비 티어: 없음, T7, T8, T9, T9 기업, 오버로드, 미확인
- 슬롯별 강화 레벨 입력
- 슬롯별 기업 장비 일치 여부 입력
- 슬롯별 오버로드 여부와 주요 옵션 입력
- 장비 메모와 오버클럭 관련 보유 니케 메모 입력

장비 상태는 추천 점수에 소폭만 반영되며, 미입력 상태에서는 기본 추천을 사용합니다. 솔로레이드 5덱 분배에서는 장비/오버로드/오버클럭 정보가 계정별 분배 보정값으로 사용될 예정입니다. 자세한 기준은 `docs/equipment-guide.md`를 참고합니다.

## Data Review Batch 05 Status

- 전체 로스터 209명 유지
- SSR 181명, SR 19명, R 9명 유지
- placeholder 0명 유지
- generated placeholder 0명 유지
- communityChecked 53명
- needsReview 156명
- verified 0명
- 기본 전투 스펙 검수 완료 후 핵심 메타/투자 정밀도 검수를 진행 중입니다.
- Batch 05에서는 추천 알고리즘에 영향이 큰 38명을 우선 검수했습니다.
- 24명을 `needsReview`에서 `communityChecked`로 승격했습니다.
- 한정/콜라보/최신 조합 의존도가 높은 항목은 점수와 메모만 보강하고 `needsReview`로 유지했습니다.
- 작업 기록: `docs/data-review-batch-05.md`
- 검증: `npm run validate:nikkes`, `npm run typecheck`, `npm run lint`, `npm run build` 통과

## Data Review Batch 06 Status

- `contentScores` 숫자만으로 추천을 결정하지 않습니다.
- 추천 점수는 `contentScores`, roles, sourceStatus, 콘텐츠별 팀 시너지를 함께 반영합니다.
- `data/contentScorePolicy.ts`에서 콘텐츠별 핵심 역할, 유효 역할, 약한 역할, 경고 규칙을 관리합니다.
- `lib/contentScoreAudit.ts`에서 점수 분포, 만능형 후보, needsReview 고점 후보, 역할 근거 부족 고점 후보를 진단합니다.
- `npm run validate:nikkes`에서 Content Score Audit 요약을 출력합니다.
- `/admin/data-quality`에서 콘텐츠별 평균 점수, 90점 이상 수, 70점 미만 수, 의심 패턴 목록을 확인할 수 있습니다.
- 추천 결과 카드에서 기본 점수, 역할 점수, 역할 적합도, 팀 시너지, 신뢰도 보정을 접어서 확인할 수 있습니다.
- needsReview 고점은 오류가 아니라 경고/진단 대상으로 유지합니다.
- 작업 기록: `docs/data-review-batch-06.md`

## Data Review Batch 07 Status

- `/account` 계정 성장 페이지를 추가했습니다.
- 호감도, 싱크로 디바이스, 리사이클룸, 택틱 아카데미 입력 구조를 추가했습니다.
- 보유 니케 카드에서 호감도와 애장품/소장품 상태를 입력할 수 있습니다.
- 조합 추천 결과에 계정 성장 반영 내역을 표시합니다.
- 육성 추천에서 주력 체크, 호감도, 싱크로 컨텍스트, 리사이클룸, 애장품/소장품, 오버로드 상태를 보조 반영합니다.
- 계정 성장 값은 로스터 검수 데이터가 아니라 개인 계정 추천 보정값으로 분리 저장합니다.
- 작업 기록: `docs/account-growth-guide.md`, `docs/data-review-batch-07-account-growth.md`

## Data Review Batch 07-C Status

- 보유 니케 카드에 슬롯별 장비 입력 구조를 추가했습니다.
- 장비 티어, 강화 레벨, 기업 장비 일치 여부, 오버로드 여부, 오버로드 옵션을 입력할 수 있습니다.
- 장비 상태는 추천 점수와 육성 추천에 과하지 않은 보조 보정으로 반영됩니다.
- 육성 추천에 장비 강화 우선순위, 오버로드 우선순위, 오버로드 옵션 검수 필요 목록을 추가했습니다.
- `/account` 계정 성장 페이지에 오버클럭 입력 섹션을 추가했습니다.
- 보유 니케 검색/필터에서 장비 메모, 오버로드 옵션, 오버로드 보유, 4오버로드, 기업 장비 일치 여부를 확인할 수 있습니다.
- 작업 기록: `docs/equipment-guide.md`, `docs/data-review-batch-07-equipment.md`

## 니케 데이터 추가 방법

`data/nikkes.ts`는 기존 import를 깨지 않기 위한 호환 export입니다. 실제 니케 추가/수정은 레어도에 따라 `data/nikkeRoster/ssr.ts`, `data/nikkeRoster/sr.ts`, `data/nikkeRoster/r.ts`에 `defineNikke(...)` 항목을 추가합니다.

필수 필드:

- `id`, `nameKo`, `rarity`, `burst`, `cooldown`
- `classType`, `weapon`, `element`, `manufacturer`
- `roles`, `goodFor`
- `notes`, `contentScores`
- `sourceStatus`

선택 필드:

- `nameEn`, `nameJp`, `aliases`, `squad`, `releaseDate`
- `availability`, `isPilgrim`, `isLimited`, `isCollab`, `isFavoriteCandidate`
- `skillPriority`, `gearPriority`, `overloadPriority`, `cubeRecommendation`, `collectionPriority`
- `sourceUrls`, `lastReviewedAt`

`sourceStatus`는 데이터 신뢰도와 추천 점수에 반영됩니다.

- `verified`: 공식/인게임 기준으로 확인 완료
- `communityChecked`: 커뮤니티/도구 교차 확인 완료
- `needsReview`: 실제 운용 가능하지만 세부 검수 필요
- `placeholder`: 이름/분류 중심의 임시 항목

출처가 불확실하거나 최신 메타 확인이 필요한 값은 추측으로 채우지 말고 `needsReview` 또는 `placeholder`로 남깁니다. 수정 후에는 `npm run validate:nikkes`로 필수 필드, 중복 id/alias, 허용 역할 태그, 점수 범위를 확인합니다.

## 외부 도구 추가 방법

`data/externalTools.ts`의 `externalTools` 배열에 추가합니다. 외부 사이트의 데이터를 무단 저장하지 않고, 이름, URL, 설명, 추천 용도, 신뢰도만 관리합니다.

## 메타 참고 데이터 추가 방법

`data/communitySignals.ts`에 수동 등록합니다. 커뮤니티 글 원문은 저장하지 않고 제목, URL, 요약, 태그, 감정, 신뢰도, 관리자 검수 여부만 저장합니다. `adminVerified: true`인 데이터만 추천 점수에 강하게 반영됩니다.

## 추천 알고리즘 설명

- `lib/scoring.ts`: 콘텐츠 점수, 역할 점수, 버스트 루프, 20초 B1/B2, B3 딜러 수, 쿨감, 메인 딜러, 생존 역할, 아레나 역할, 메타 신뢰도를 계산합니다.
- `lib/teamBuilder.ts`: 보유 니케 안에서 5인 조합 후보를 만들고 상위 3개 조합을 반환합니다. 타워 제조사 필터 확장을 위해 `manufacturer` 옵션을 받습니다.
- `lib/accountGrowthScoring.ts`: 호감도, 리사이클룸, 싱크로 컨텍스트, 애장품/소장품 상태를 추천용 보조 보정으로 계산합니다.
- `lib/equipmentUtils.ts`: 장비 티어, 강화 레벨, 기업 장비, 오버로드 개수, 오버로드 옵션을 추천용 보조 보정으로 계산합니다.
- `lib/growthRecommender.ts`: 보유 니케와 주력 체크/투자 상태/계정 성장 상태를 반영해 육성 우선순위를 계산합니다.

## 현재 한계

- 자동 크롤링 없음
- OCR/로그인/Supabase 없음
- 실제 최신 메타는 관리자 검수 데이터 필요
- 샘플 니케 데이터는 추후 검수 필요
- 공식 앱이 아닌 비공식 도우미
- 보스별 상세 기믹 추천은 추후 기능
- 공식 이미지나 게임 리소스를 직접 포함하지 않음

## 향후 추가 기능

- 실제 니케 전체 데이터 입력
- Supabase 연동
- 관리자 로그인
- 니케 데이터 웹 편집
- 솔로레이드 5덱 자동 분배
- 기업 타워 전용 추천
- 보스별 기믹 추천
- 아레나 상대 조합 카운터
- 커뮤니티 링크 입력 시 자동 요약/태깅
- 스크린샷 OCR 보유 니케 인식
- 조합 저장/공유
