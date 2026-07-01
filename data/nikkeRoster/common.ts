import type { ContentType } from "@/types/content";
import type { BurstType, ClassType, Nikke, NikkeAvailability, NikkeRarity, NikkeSourceStatus, RoleId } from "@/types/nikke";

export const nikkeSources = {
  officialKrNews: "https://nikke-kr.com/news.html",
  blabla: "https://www.blablalink.com",
  officialDiscord: "https://discord.gg/nikke-en",
  enikk: "https://enikk.app/soloraid",
  nikkeTools: "https://nikke-tools.netlify.app",
  nikkeDeck: "https://nikke-deck.com/ko/",
  fandom: "https://nikke-goddess-of-victory-international.fandom.com/wiki/Home",
  skillSearch: "https://nikkesearch.glide.page/dl/da19fa",
  prydwenCharacters: "https://www.prydwen.gg/nikke/characters"
} as const;

const baseScores: Record<ContentType, number> = {
  story: 50,
  boss: 50,
  tower: 50,
  arena: 50,
  soloRaid: 50,
  unionRaid: 50,
  interception: 50
};

export const scores = (value: Partial<Record<ContentType, number>>): Record<ContentType, number> => ({
  ...baseScores,
  ...value
});

type NikkeSeed = {
  id: string;
  nameKo: string;
  nameEn?: string;
  nameJp?: string;
  aliases?: string[];
  rarity: NikkeRarity;
  burst: BurstType;
  cooldown: number | null;
  classType: ClassType;
  weapon: string;
  element: string;
  manufacturer: string;
  squad?: string;
  availability?: NikkeAvailability;
  isPilgrim?: boolean;
  isLimited?: boolean;
  isCollab?: boolean;
  isFavoriteCandidate?: boolean;
  roles?: RoleId[];
  goodFor?: ContentType[];
  skillPriority?: string;
  gearPriority?: string;
  overloadPriority?: string;
  cubeRecommendation?: string;
  collectionPriority?: string;
  notes?: string;
  contentScores?: Partial<Record<ContentType, number>>;
  releaseDate?: string;
  sourceStatus?: NikkeSourceStatus;
  lastReviewedAt?: string;
  sourceUrls?: string[];
};

export const defineNikke = (seed: NikkeSeed): Nikke => ({
  ...seed,
  name: seed.nameKo,
  aliases: Array.from(new Set([seed.nameKo, seed.id, ...(seed.nameEn ? [seed.nameEn] : []), ...(seed.aliases ?? [])])),
  availability: seed.availability ?? "standard",
  roles: seed.roles ?? ["범용"],
  goodFor: seed.goodFor ?? [],
  skillPriority: seed.skillPriority ?? "검수 필요",
  gearPriority: seed.gearPriority ?? "검수 필요",
  overloadPriority: seed.overloadPriority ?? "검수 필요",
  cubeRecommendation: seed.cubeRecommendation ?? "검수 필요",
  collectionPriority: seed.collectionPriority ?? "검수 필요",
  notes: seed.notes ?? "기본 로스터 등록 항목입니다. 세부 추천 데이터는 검수 필요입니다.",
  contentScores: scores(seed.contentScores ?? {}),
  sourceStatus: seed.sourceStatus ?? "needsReview",
  lastReviewedAt: seed.lastReviewedAt ?? "2026-07-01",
  sourceUrls: seed.sourceUrls ?? [nikkeSources.officialKrNews, nikkeSources.fandom]
});
