import type { ContentType } from "./content";

export type CommunitySignalSource =
  | "official"
  | "arcalive"
  | "fmkorea"
  | "dcinside"
  | "namuwiki"
  | "fandom"
  | "toolSite";

export type CommunitySignal = {
  id: string;
  source: CommunitySignalSource;
  title: string;
  url: string;
  date: string;
  characters: string[];
  contentTypes: ContentType[];
  keywords: string[];
  sentiment: "positive" | "negative" | "mixed" | "neutral";
  confidence: number;
  summary: string;
  adminVerified: boolean;
};

export const communitySourceLabels: Record<CommunitySignalSource, string> = {
  official: "공식/인게임",
  toolSite: "도구 사이트",
  arcalive: "아카라이브",
  fmkorea: "에펨코리아",
  dcinside: "디시인사이드",
  namuwiki: "나무위키",
  fandom: "팬덤 위키"
};

export const communitySourcePriority: Record<CommunitySignalSource, number> = {
  official: 7,
  toolSite: 6,
  arcalive: 5,
  fmkorea: 4,
  dcinside: 3,
  fandom: 2,
  namuwiki: 1
};
