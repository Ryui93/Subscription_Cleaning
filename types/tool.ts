export type ExternalToolCategory =
  | "official"
  | "lostRelic"
  | "soloRaid"
  | "arena"
  | "outpost"
  | "skillSearch"
  | "simulator"
  | "wiki"
  | "community";

export type ExternalTool = {
  id: string;
  name: string;
  category: ExternalToolCategory;
  url: string;
  description: string;
  recommendedUse: string;
  useInApp: "directLink" | "referenceOnly" | "manualDataSource";
  trustLevel: 1 | 2 | 3 | 4 | 5;
};

export const externalToolCategoryLabels: Record<ExternalToolCategory, string> = {
  official: "공식/계정",
  lostRelic: "유실물",
  soloRaid: "솔로레이드",
  arena: "아레나",
  outpost: "전초기지",
  skillSearch: "스킬/색인",
  simulator: "시뮬레이터",
  wiki: "위키/이미지",
  community: "커뮤니티"
};
