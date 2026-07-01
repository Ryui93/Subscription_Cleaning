# 데이터 검수 배치 01

작업일: 2026-07-01

## 목표

`missingPlaceholders.ts`에 먼저 생성해 둔 누락 니케 140명 중 추천 알고리즘에 바로 영향을 주는 SSR 우선순위 항목을 1차로 채웠다.

이번 배치는 전체 140명을 한 번에 완성하지 않고, 추천 결과에서 쓰일 가능성이 높은 버스트/역할/점수/별칭 정보만 보수적으로 보강했다. 최신 메타 위치가 불확실하거나 스킬 투자 순서 검증이 더 필요한 항목은 `needsReview`로 유지했다.

## 결과

- 1차 검수 적용: 32명
- 생성 placeholder 잔여: 108명
- 전체 `sourceStatus: "placeholder"` 잔여: 120명
- 검증 결과: `validate:nikkes` 에러 0, 경고만 남음

## 상태 분류

`communityChecked`로 승격한 항목은 기본 전투 정보와 추천 점수의 방향성이 비교적 명확하고, 현재 추천 카드에 들어가도 큰 오판 가능성이 낮다고 본 항목이다.

- Ade: Agent Bunny
- Cinderella
- Ein
- Grave
- Leona
- Ludmilla: Winter Owner
- Rapi: Red Hood
- Rosanna: Chic Ocean
- Rouge
- Sakura: Bloom in Summer

`needsReview`로 유지한 항목은 기본 필드는 채웠지만 최신 레이드 평가, 스킬 투자 순서, 큐브/오버로드 추천을 한 번 더 확인해야 하는 항목이다.

- Ade
- Admi
- Alice: Wonderland Bunny
- Aria
- Bay
- Clay
- Cocoa
- D
- Diesel
- Emma
- Epinel
- Eunhwa
- Exia
- Flora
- Folkwang
- Frima
- Guillotine
- Guilty
- Kilo
- Maiden
- Mary
- Moran

## 반영 기준

- Prydwen 캐릭터 페이지에서 등급, 버스트, 클래스, 무기, 코드, 제조사 같은 정적 전투 정보를 대조했다.
- Nikke Deck 한국어 로스터 카운트와 기존 209명 기준은 유지했다.
- 스킬 설명문은 외부 문구를 복사하지 않고 앱 내부 추천용 요약 문장으로 작성했다.
- 점수는 현재 앱 추천 로직용 임시 신뢰값이다. 최신 솔로 레이드/유니온 레이드 티어 확정값이 아니면 과감하게 `needsReview`로 남겼다.
- 콜라보, 미출시/최신 의심 항목, Treasure 항목은 이번 배치에서 의도적으로 남겨 다음 배치 후보로 올렸다.

## 주요 소스

- [Prydwen NIKKE Characters](https://www.prydwen.gg/nikke/characters)
- [Nikke Deck 한국어 덱/로스터](https://nikke-deck.com/ko/deck)
- 캐릭터별 Prydwen 페이지: `https://www.prydwen.gg/nikke/characters/{id}` 형식으로 `sourceUrls`에 저장

## 다음 배치 후보

우선순위 재계산 기준 다음 상위권은 콜라보/한정/이벤트성 placeholder가 많이 남아 있다.

- Ada Wong
- Asuka Shikinami Langley: Wille
- Chisato Nishikigi
- Claire Redfield
- Eve
- Jill Valentine
- Lily
- Makima
- Mary: Bay Goddess
- Mica: Snow Buddy
- Power
- Raven
- Rei Ayanami (Tentative Name)
- Rupee: Winter Shopper
- Sakura Suzuhara
- Takina Inoue

## 검증 기록

```text
npm run validate:nikkes
- Total: 209
- Errors: 0
- Warnings: 120
- Generated placeholder warnings: 108
- SourceStatus placeholder warnings: 120
- Needs review warnings: 60
- Result: PASS WITH WARNINGS

npm run typecheck
- PASS
```
