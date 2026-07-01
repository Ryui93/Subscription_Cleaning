# 누락 니케 Placeholder 목록

기준: Prydwen NIKKE Characters 목록 및 Nikke Deck 209명 카운트. 기존 로스터 69명과 대조해 빠져 있던 항목 140명을 `sourceStatus: "placeholder"`로 생성했습니다.

`(Treasure)` 항목은 별도 소유 니케 여부 검수가 필요하지만, Nikke Deck 카운트와 맞추기 위해 우선 placeholder로 포함했습니다.

## placeholder가 의도된 이유

- 전체 209명 카운트를 먼저 맞춰 검색/보유 체크 누락을 줄이기 위함입니다.
- 전투 데이터가 불확실한 항목은 지어내지 않고 `burst: "none"`, `weapon: "미확인"`, `element: "미확인"`, `contentScores: 0`으로 둡니다.
- 추천 알고리즘에서는 placeholder가 제외되지 않지만 신뢰도 낮음 표시와 점수 감점이 적용됩니다.

## 향후 검수 순서

1. SSR placeholder의 한국어명, 버스트, 클래스, 무기, 속성, 제조사 확인
2. 필그림, 한정, 콜라보, 어브노멀 항목의 분류와 별칭 보강
3. 실제 보유/추천에서 자주 보이는 B1/B2/B3 캐릭터의 `goodFor`, 역할 태그, contentScores 입력
4. Treasure 17개가 별도 로스터 항목인지, 강화 상태 항목인지 최종 분류
5. `needsReview` 캐릭터의 스킬작, 오버로드, 큐브, 소장품 메모 검수

## 데이터 채우기 우선순위

- 1순위: SSR placeholder, 필그림, 한정, 콜라보, 해방/갱생
- 2순위: 추천 조합에서 버스트 루프에 영향을 주는 B1/B2/B3 캐릭터
- 3순위: SR/R 기본 정보와 한국어 별칭
- 4순위: Treasure placeholder의 최종 처리 기준 정리

## 생성한 Placeholder

- Ada Wong
- Ade
- Ade: Agent Bunny
- Admi
- Alice: Wonderland Bunny
- Anchor
- Anchor: Innocent Maid
- Anis: Star
- Anne: Miracle Fairy
- Arcana
- Arcana: Fortune Mate
- Aria
- Ark Ranger Black
- Asuka Shikinami Langley: Wille
- Avistar
- Bay
- Bay (Treasure)
- Bready
- Brid
- Brid: Silent Track
- Centi (Treasure)
- Chime
- Chisato Nishikigi
- Cinderella
- Claire Redfield
- Clay
- Cocoa
- Crow
- Crust
- D
- Delta: Ninja Thief
- Diesel
- Diesel (Treasure)
- Diesel: Winter Sweets
- Dorothy: Serendipity
- Drake (Treasure)
- E.H.
- Ein
- Elegg: Boom and Shock
- Emma
- Emma: Tactical Upgrade
- Epinel
- Eunhwa
- Eunhwa: Tactical Upgrade
- Eve
- Exia
- Exia (Treasure)
- Flora
- Folkwang
- Frima
- Frima (Treasure)
- Grave
- Guillotine
- Guillotine: Winter Slayer
- Guilty
- Helm (Treasure)
- Himeno
- Jill Valentine
- Julia
- Julia (Treasure)
- K
- Kilo
- Kurumi
- Label
- Laplace (Treasure)
- Leona
- Liberalio
- Lily
- Ludmilla
- Ludmilla: Winter Owner
- Maiden
- Maiden: Ice Rose
- Makima
- Mana
- Mary
- Mary: Bay Goddess
- Mast: Romantic Maid
- Mica: Snow Buddy
- Mihara: Bonding Chain
- Milk
- Milk (Treasure)
- Milk: Blooming Bunny
- Mint
- Miranda (Treasure)
- Misato Katsuragi
- Moran
- Moran (Treasure)
- Mori
- Nayuta
- Neon: Vision Eye
- Nero
- Neve
- Nihilister
- Pascal
- Phantom
- Poli (Treasure)
- Power
- Prika
- Privaty (Treasure)
- Quency
- Quency: Escape Queen
- Quiry
- Rapi: Red Hood
- Rapunzel: Pure Grace
- Raven
- Rei
- Rei Ayanami (Tentative Name)
- Rosanna
- Rosanna: Chic Ocean
- Rouge
- Rumani
- Rupee: Winter Shopper
- Sakura
- Sakura Suzuhara
- Sakura: Bloom in Summer
- Signal
- Sin
- Siren
- Snow Crane
- Snow White: Heavy Arms
- Snow White: Innocent Days
- Soda
- Soda: Twinkling Bunny
- Soline
- Soline: Frost Ticket
- Sora
- Takina Inoue
- Tove
- Tove (Treasure)
- Trina
- Trony
- Velvet
- Vesti: Tactical Upgrade
- Viper
- Viper (Treasure)
- Yan
- Yulha
- Yuni
- Zwei
- Zwei (Treasure)
