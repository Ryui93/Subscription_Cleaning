# 데이터 검수 배치 05

Date: 2026-07-01

## 목표

- 기본 전투 스펙 검수 이후 추천 알고리즘에 직접 영향을 주는 핵심 니케의 메타 정밀도를 보강했습니다.
- 원본 로스터 파일을 대량 수정하지 않고 `data/nikkeRoster/reviewBatch05.ts` 오버라이드 레이어로 roles, aliases, contentScores, 투자 메모, sourceStatus를 보정했습니다.

## 적용 대상

총 38명:

- Crown
- Scarlet: Black Shadow
- Tia
- Drake
- Laplace
- Biscuit
- Marciana
- D: Killer Wife
- Elegg
- 2B
- A2
- Helm
- Pepper
- Novel
- Poli
- Mast
- Privaty: Unkind Maid
- Alice: Wonderland Bunny
- Anchor: Innocent Maid
- Anis: Star
- Bready
- Dorothy: Serendipity
- Laplace (Treasure)
- Phantom
- Anis: Sparkling Summer
- Helm: Aquamarine
- Neon: Blue Ocean
- Emilia
- Rem
- Asuka
- Rei Ayanami
- Mari Makinami
- Ada Wong
- Asuka Shikinami Langley: Wille
- E.H.
- Jill Valentine
- Quency: Escape Queen
- Snow White: Innocent Days

## 상태 변경

| 이름 | 이전 상태 | 변경 상태 | 변경 이유 |
|---|---|---|---|
| Crown | needsReview | communityChecked | 범용 B2 보호/버프 축으로 추천 영향도가 높음 |
| Scarlet: Black Shadow | needsReview | communityChecked | 보스/레이드 주력 딜러 역할이 명확함 |
| Tia | needsReview | communityChecked | 도발/실드 B1 안정화 역할이 명확함 |
| Drake | needsReview | communityChecked | 샷건 보조 딜러와 공버프 역할 정리 |
| Laplace | needsReview | communityChecked | 보스/파츠 딜러 역할 정리 |
| Biscuit | needsReview | communityChecked | 아레나/생존 보조 역할 정리 |
| Marciana | needsReview | communityChecked | 20초 B2 힐러 역할 정리 |
| D: Killer Wife | needsReview | communityChecked | B1 쿨감/차지 보조 역할 정리 |
| Elegg | needsReview | communityChecked | 전격/저지 보조 역할 정리 |
| 2B | needsReview | communityChecked | 콜라보 보유자 기준 보스 딜러 역할 정리 |
| A2 | needsReview | communityChecked | 콜라보 보유자 기준 광역/보스 딜러 역할 정리 |
| Helm | needsReview | communityChecked | 보스전 힐/딜 보조 역할 정리 |
| Pepper | needsReview | communityChecked | 초중반 B1 힐러 역할 정리 |
| Novel | needsReview | communityChecked | 보스 디버퍼 역할 정리 |
| Poli | needsReview | communityChecked | 실드/공버프 B2 역할 정리 |
| Mast | needsReview | communityChecked | 크리/공격 보조 역할 정리 |
| Privaty: Unkind Maid | needsReview | communityChecked | 보스전 B3 딜러 역할 정리 |
| Alice: Wonderland Bunny | needsReview | communityChecked | B1 회복/장탄 보조 역할 정리 |
| Anchor: Innocent Maid | needsReview | communityChecked | B2 보스/레이드 지원 역할 정리 |
| Anis: Star | needsReview | communityChecked | B1 안정화와 상위 스토리 평가 반영 |
| Bready | needsReview | communityChecked | 보스 보조 딜러 역할 정리 |
| Dorothy: Serendipity | needsReview | communityChecked | 필그림 B3 보스 딜러 역할 정리 |
| Laplace (Treasure) | needsReview | communityChecked | Treasure 전제 보스/파츠 딜러 역할 정리 |
| Phantom | needsReview | communityChecked | 보스 보조 딜러 역할 정리 |

## needsReview 유지 대상

- Anis: Sparkling Summer, Helm: Aquamarine, Neon: Blue Ocean
- Emilia, Rem, Asuka, Rei Ayanami, Mari Makinami
- Ada Wong, Asuka Shikinami Langley: Wille, E.H., Jill Valentine
- Quency: Escape Queen, Snow White: Innocent Days

유지 이유:

- 한정/콜라보 또는 최신 조합 의존도가 높아 최신 메타 확정값으로 승격하지 않았습니다.
- 다만 추천 결과가 지나치게 낮게 나오지 않도록 roles, aliases, contentScores, 투자 메모를 보강했습니다.

## 주요 변경 내용

- roles 보강: 메인딜러, 보스딜, 쿨감, 버퍼, 힐러, 실드, 유지력, 한정/콜라보 태그를 추천 규칙에 맞게 정리했습니다.
- aliases 보강: 한국어 별칭, 영어명, 커뮤니티 축약명을 추가했습니다.
- contentScores 정리: 스토리, 보스, 타워, 아레나, 솔로레이드, 유니온레이드, 요격전 점수를 콘텐츠별로 분리했습니다.
- 투자 추천 필드 보강: skillPriority, gearPriority, overloadPriority, cubeRecommendation, collectionPriority를 1~2문장 기준으로 작성했습니다.
- notes 정리: 각 니케의 핵심 역할과 추천 반영 방향을 짧게 정리했습니다.

## 추천 알고리즘 영향

- sourceStatus penalty가 줄어든 핵심 니케가 추천 조합에서 더 자연스럽게 상위로 올라옵니다.
- B1/B2 쿨감, 버퍼, 힐러, 실드 역할이 더 명확해져 조합 슬롯 배치와 누락 역할 경고가 개선됩니다.
- 성장 추천 TOP 10에서 주력 딜러와 핵심 버퍼가 더 안정적으로 노출됩니다.

테스트 보유 세트:

- Liter, Crown, Red Hood, Modernia, Naga
- Dorothy, Blanc, Noir, Scarlet, Alice
- Jackal, Noah, Scarlet, Rapunzel, Centi

확인 결과:

- story, boss, arena, soloRaid 추천 조합 생성 정상
- 추천 점수 NaN 없음
- 성장 추천 점수 NaN 없음
- 핵심 딜러/버퍼/보호 역할이 추천 이유와 성장 순위에 반영됨

## 검증 결과

- `npm run validate:nikkes`
  - Total: 209
  - Errors: 0
  - Warnings: 0
  - SourceStatus placeholder warnings: 0
  - Generated placeholder warnings: 0
  - communityChecked: 53
  - needsReview: 156
  - placeholder: 0
- `npm run typecheck`
- `npm run lint`
- `npm run build`

## 참고 소스

- Prydwen NIKKE Tier List: https://www.prydwen.gg/nikke/tier-list
- Prydwen NIKKE Characters: https://www.prydwen.gg/nikke/characters
