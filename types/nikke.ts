import type { ContentType } from "./content";

export type BurstType = 1 | 2 | 3 | "none";
export type ClassType = "화력형" | "방어형" | "지원형";
export type NikkeRarity = "SSR" | "SR" | "R";
export type NikkeSourceStatus = "verified" | "communityChecked" | "needsReview" | "placeholder";
export type NikkeAvailability =
  | "standard"
  | "limited"
  | "collab"
  | "event"
  | "liberation"
  | "rehabilitation"
  | "unknown";

export type RoleId =
  | "메인딜러"
  | "서브딜러"
  | "광역딜"
  | "보스딜"
  | "지속딜"
  | "버스트딜"
  | "파츠딜"
  | "관통딜"
  | "전격딜"
  | "철갑딜"
  | "작열딜"
  | "수냉딜"
  | "풍압딜"
  | "버퍼"
  | "공버프"
  | "크리버프"
  | "장탄버프"
  | "재장전버프"
  | "차지버프"
  | "쿨감"
  | "버스트충전"
  | "힐러"
  | "실드"
  | "회복"
  | "부활"
  | "유지력"
  | "디버퍼"
  | "방깎"
  | "받피증"
  | "공격력감소"
  | "명중감소"
  | "저지보조"
  | "도발"
  | "탱커"
  | "무적"
  | "피해분배"
  | "생존"
  | "선버스트"
  | "아레나광역"
  | "아레나방어"
  | "범용"
  | "뉴비추천"
  | "수동전투"
  | "자동전투"
  | "고투자"
  | "저투자"
  | "한정"
  | "콜라보"
  | "필그림"
  | "기업타워";

export const allowedRoles: RoleId[] = [
  "메인딜러",
  "서브딜러",
  "광역딜",
  "보스딜",
  "지속딜",
  "버스트딜",
  "파츠딜",
  "관통딜",
  "전격딜",
  "철갑딜",
  "작열딜",
  "수냉딜",
  "풍압딜",
  "버퍼",
  "공버프",
  "크리버프",
  "장탄버프",
  "재장전버프",
  "차지버프",
  "쿨감",
  "버스트충전",
  "힐러",
  "실드",
  "회복",
  "부활",
  "유지력",
  "디버퍼",
  "방깎",
  "받피증",
  "공격력감소",
  "명중감소",
  "저지보조",
  "도발",
  "탱커",
  "무적",
  "피해분배",
  "생존",
  "선버스트",
  "아레나광역",
  "아레나방어",
  "범용",
  "뉴비추천",
  "수동전투",
  "자동전투",
  "고투자",
  "저투자",
  "한정",
  "콜라보",
  "필그림",
  "기업타워"
];

export const roleLabels: Record<RoleId, string> = Object.fromEntries(allowedRoles.map((role) => [role, role])) as Record<RoleId, string>;

export type Nikke = {
  id: string;
  name: string;
  nameKo: string;
  nameEn?: string;
  nameJp?: string;
  aliases: string[];
  rarity: NikkeRarity;
  burst: BurstType;
  cooldown: number | null;
  classType: ClassType;
  weapon: string;
  element: string;
  manufacturer: string;
  squad?: string;
  availability: NikkeAvailability;
  isPilgrim?: boolean;
  isLimited?: boolean;
  isCollab?: boolean;
  isFavoriteCandidate?: boolean;
  roles: RoleId[];
  goodFor: ContentType[];
  skillPriority: string;
  gearPriority: string;
  overloadPriority: string;
  cubeRecommendation: string;
  collectionPriority: string;
  notes: string;
  contentScores: Record<ContentType, number>;
  releaseDate?: string;
  sourceStatus: NikkeSourceStatus;
  lastReviewedAt?: string;
  sourceUrls?: string[];
};
