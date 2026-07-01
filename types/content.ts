export type ContentType =
  | "story"
  | "boss"
  | "tower"
  | "arena"
  | "soloRaid"
  | "unionRaid"
  | "interception";

export const contentTypes: ContentType[] = [
  "story",
  "boss",
  "tower",
  "arena",
  "soloRaid",
  "unionRaid",
  "interception"
];

export const contentLabels: Record<ContentType, string> = {
  story: "스토리",
  boss: "보스전",
  tower: "타워",
  arena: "아레나",
  soloRaid: "솔로 레이드",
  unionRaid: "유니온 레이드",
  interception: "특수요격/개인요격"
};

export const contentDescriptions: Record<ContentType, string> = {
  story: "버스트 순환, 광역딜, 유지력, 자동전투 안정성을 중점으로 계산합니다.",
  boss: "단일 대상 딜, 방어력 감소, 공격 버프, 장기전 유지력을 중점으로 계산합니다.",
  tower: "기업 제한 확장을 고려하되, MVP에서는 전체 보유 니케 기준으로 계산합니다.",
  arena: "빠른 버스트 충전, 제어기, 생존기, 광역 압박을 PVE와 별도로 계산합니다.",
  soloRaid: "최상위 1개 덱과 대체 조합을 우선 산출하도록 설계했습니다.",
  unionRaid: "보스전 기준에 대체 딜러와 덱 재사용 가능성을 더해 계산합니다.",
  interception: "보스별 기믹 데이터 추가 전까지 범용 보스전 조합으로 처리합니다."
};
