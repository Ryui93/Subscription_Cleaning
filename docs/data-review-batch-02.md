# 데이터 검수 배치 02

작업일: 2026-07-01

## 목표

남은 SSR placeholder 103명 중 사용량과 검수 범위를 고려해 50명만 2차로 처리했다.

이번 배치는 전체 나머지를 한 번에 확정하지 않고, Prydwen 캐릭터 페이지에서 확인 가능한 정적 전투 정보만 먼저 반영했다. 최신 메타 점수, 스킬 투자 순서, 오버로드/큐브 추천은 대부분 `needsReview`로 유지했다.

## 결과

- 2차 적용: 50명
- 누적 적용: 82명
- 생성 placeholder 잔여: 58명
- 전체 `sourceStatus: "placeholder"` 잔여: 70명

## 2차 적용 대상

- Ada Wong
- Anchor: Innocent Maid
- Anis: Star
- Anne: Miracle Fairy
- Arcana
- Arcana: Fortune Mate
- Ark Ranger Black
- Asuka Shikinami Langley: Wille
- Avistar
- Bay (Treasure)
- Bready
- Brid
- Brid: Silent Track
- Centi (Treasure)
- Chime
- Chisato Nishikigi
- Crow
- Crust
- Delta: Ninja Thief
- Diesel (Treasure)
- Diesel: Winter Sweets
- Dorothy: Serendipity
- Drake (Treasure)
- E.H.
- Elegg: Boom and Shock
- Emma: Tactical Upgrade
- Eunhwa: Tactical Upgrade
- Eve
- Exia (Treasure)
- Frima (Treasure)
- Guillotine: Winter Slayer
- Helm (Treasure)
- Jill Valentine
- Julia
- Julia (Treasure)
- K
- Label
- Laplace (Treasure)
- Liberalio
- Ludmilla
- Maiden: Ice Rose
- Makima
- Mana
- Mary: Bay Goddess
- Mast: Romantic Maid
- Mica: Snow Buddy
- Mihara: Bonding Chain
- Milk
- Milk (Treasure)
- Milk: Blooming Bunny

## 반영 기준

- rarity, burst, class, weapon, element, manufacturer를 우선 반영했다.
- Treasure 항목은 별도 캐릭터처럼 유지하되 역할 태그에는 허용되지 않는 `Treasure` 문자열을 넣지 않았다.
- 콜라보/한정/해방/이벤트 속성은 확인 가능한 범위에서만 반영했다.
- 세부 성능 평가는 앱 추천용 임시 점수이며, 확정 메타 데이터가 아니므로 `needsReview`로 남겼다.

## 검증 기록

```text
npm run validate:nikkes
- Total: 209
- Errors: 0
- Warnings: 70
- Generated placeholder warnings: 58
- SourceStatus placeholder warnings: 70
- Needs review warnings: 110
- Result: PASS WITH WARNINGS

npm run typecheck
- PASS

npm run lint
- PASS
```
