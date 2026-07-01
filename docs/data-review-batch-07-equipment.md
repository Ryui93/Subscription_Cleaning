# 데이터 검수 배치 07-C - 장비 / 오버로드 / 오버클럭

## 목표
- 장비 상태 입력 구조 추가
- 장비 강화/오버로드 옵션 반영
- 오버클럭 조건 입력 구조 추가
- 솔로레이드 5덱 분배 전 장비 기반 마련

## 추가된 타입
- EquipmentSlot
- EquipmentTier
- EquipmentManufacturerBonus
- OverloadOptionType
- EquipmentSlotState
- NikkeEquipmentState
- OverclockState

## 추가된 유틸
- equipmentUtils.ts
- accountGrowthScoring 연동
- accountExport 연동

## 수정된 기능
- OwnedNikkeState
- 보유 니케 카드
- 추천 점수 계산
- 육성 추천
- 추천 결과 카드
- 계정 성장 페이지
- 검색 필터

## 검증 결과
- npm run validate:nikkes
- npm run typecheck
- npm run lint
- npm run build
