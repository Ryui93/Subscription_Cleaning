# 데이터 검수 배치 07 - 계정 성장 시스템

## 목표
- 호감도, 싱크로 디바이스, 리사이클룸, 택틱 아카데미 입력 구조 추가
- 추천/육성 알고리즘에 계정 성장 보정 반영
- 솔로레이드 5덱 분배 전 사용자 계정 상태 기반 마련

## 추가된 타입
- AccountGrowthState
- BondLevelData
- SynchroDeviceData
- RecyclingRoomData
- TacticsAcademyData

## 추가된 페이지
- /account

## 추가된 유틸
- accountGrowthScoring.ts
- accountExport.ts

## 반영된 기능
- 보유 니케 카드 호감도 입력
- 계정 성장 페이지
- 추천 결과 계정 성장 반영 표시
- 육성 추천 계정 성장 반영
- localStorage 저장

## 검증 결과
- npm run validate:nikkes
- npm run typecheck
- npm run lint
- npm run build
