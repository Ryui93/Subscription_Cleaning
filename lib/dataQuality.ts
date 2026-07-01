import { contentTypes } from "@/types/content";
import type { Nikke, NikkeAvailability, NikkeRarity, NikkeSourceStatus } from "@/types/nikke";

export type TeamConfidence = {
  level: "높음" | "보통" | "낮음";
  verifiedCount: number;
  needsReviewCount: number;
  placeholderCount: number;
  message: string;
};

export type DataQualityStats = {
  total: number;
  byRarity: Record<NikkeRarity, number>;
  bySourceStatus: Record<NikkeSourceStatus, number>;
  limitedCount: number;
  collabCount: number;
  pilgrimCount: number;
  abnormalCount: number;
  treasurePlaceholderCount: number;
  reviewCompleteCount: number;
  reviewCompleteRate: number;
  placeholderRate: number;
};

export type ReviewPriorityItem = {
  nikke: Nikke;
  priorityScore: number;
  reasons: string[];
  suggestedAction: string;
};

export const sourceStatusLabels: Record<NikkeSourceStatus, string> = {
  verified: "검수 완료",
  communityChecked: "커뮤니티 확인",
  needsReview: "검수 필요",
  placeholder: "임시 데이터"
};

export const availabilityLabels: Record<NikkeAvailability, string> = {
  standard: "상시",
  limited: "한정",
  collab: "콜라보",
  event: "이벤트",
  liberation: "해방",
  rehabilitation: "갱생",
  unknown: "미확인"
};

const getRate = (value: number, total: number) => (total === 0 ? 0 : Math.round((value / total) * 100));

export const isTreasurePlaceholder = (nikke: Nikke) =>
  nikke.sourceStatus === "placeholder" && (nikke.id.includes("treasure") || nikke.name.includes("(Treasure)"));

export const getAverageContentScore = (nikke: Nikke) => {
  const total = contentTypes.reduce((sum, content) => sum + nikke.contentScores[content], 0);
  return Math.round(total / contentTypes.length);
};

export const getNikkeQualityIssues = (nikke: Nikke) => {
  const issues: string[] = [];
  const averageScore = getAverageContentScore(nikke);
  const needsTextReview = [nikke.notes, nikke.skillPriority, nikke.gearPriority, nikke.overloadPriority, nikke.cubeRecommendation, nikke.collectionPriority].some(
    (value) => value.includes("검수 필요") || value.includes("TBD")
  );

  if (nikke.sourceStatus === "placeholder") issues.push("임시 데이터");
  if (nikke.sourceStatus === "needsReview") issues.push("검수 필요 상태");
  if (needsTextReview) issues.push("추천/메모 검수 필요");
  if (nikke.roles.length === 0) issues.push("역할 태그 없음");
  if (nikke.aliases.length === 0) issues.push("별칭 없음");
  if (nikke.aliases.length < 2) issues.push("별칭 보강 필요");
  if (nikke.goodFor.length === 0) issues.push("추천 콘텐츠 없음");
  if (averageScore === 0) issues.push("콘텐츠 점수 미입력");
  if (averageScore > 0 && averageScore < 50) issues.push("콘텐츠 점수 신뢰도 낮음");
  if (nikke.weapon === "미확인" || nikke.element === "미확인" || nikke.manufacturer === "기타" || nikke.availability === "unknown") {
    issues.push("기본 분류 검수 필요");
  }

  return Array.from(new Set(issues));
};

export const isReviewRequired = (nikke: Nikke) => getNikkeQualityIssues(nikke).length > 0;

export const getDataQualityStats = (items: Nikke[]): DataQualityStats => {
  const byRarity: Record<NikkeRarity, number> = { SSR: 0, SR: 0, R: 0 };
  const bySourceStatus: Record<NikkeSourceStatus, number> = {
    verified: 0,
    communityChecked: 0,
    needsReview: 0,
    placeholder: 0
  };

  items.forEach((nikke) => {
    byRarity[nikke.rarity] += 1;
    bySourceStatus[nikke.sourceStatus] += 1;
  });

  const reviewCompleteCount = bySourceStatus.verified + bySourceStatus.communityChecked;

  return {
    total: items.length,
    byRarity,
    bySourceStatus,
    limitedCount: items.filter((nikke) => nikke.isLimited || nikke.availability === "limited").length,
    collabCount: items.filter((nikke) => nikke.isCollab || nikke.availability === "collab").length,
    pilgrimCount: items.filter((nikke) => nikke.isPilgrim || nikke.manufacturer === "필그림").length,
    abnormalCount: items.filter((nikke) => nikke.manufacturer === "어브노멀").length,
    treasurePlaceholderCount: items.filter(isTreasurePlaceholder).length,
    reviewCompleteCount,
    reviewCompleteRate: getRate(reviewCompleteCount, items.length),
    placeholderRate: getRate(bySourceStatus.placeholder, items.length)
  };
};

const getSuggestedAction = (nikke: Nikke, reasons: string[]) => {
  if (nikke.sourceStatus === "placeholder") return "한국어명, 기본 분류, 버스트/무기/속성, 별칭부터 확인";
  if (reasons.some((reason) => reason.includes("콘텐츠 점수"))) return "콘텐츠별 점수와 goodFor 검수";
  if (reasons.some((reason) => reason.includes("별칭"))) return "한국 커뮤니티 별칭과 검색어 보강";
  return "스킬작, 오버로드, 큐브, 소장품 메모 검수";
};

export const getReviewPriority = (items: Nikke[]): ReviewPriorityItem[] =>
  items
    .map((nikke) => {
      const reasons = getNikkeQualityIssues(nikke);
      const averageScore = getAverageContentScore(nikke);
      let priorityScore = 0;

      if (nikke.rarity === "SSR") priorityScore += 20;
      if (nikke.sourceStatus === "placeholder") priorityScore += 35;
      if (nikke.sourceStatus === "needsReview") priorityScore += 25;
      if (nikke.roles.length === 0) priorityScore += 12;
      if (nikke.aliases.length < 2) priorityScore += 8;
      if (averageScore === 0) priorityScore += 18;
      else if (averageScore < 50) priorityScore += 10;
      if (nikke.goodFor.length === 0) priorityScore += 10;
      if (nikke.nameKo === nikke.nameEn || nikke.aliases.length < 3) priorityScore += 6;
      if (nikke.isPilgrim || nikke.manufacturer === "필그림") priorityScore += 10;
      if (nikke.isLimited || nikke.isCollab || nikke.availability === "limited" || nikke.availability === "collab") priorityScore += 8;
      if (nikke.burst === 1 || nikke.burst === 2 || nikke.burst === 3) priorityScore += 5;

      return {
        nikke,
        priorityScore,
        reasons,
        suggestedAction: getSuggestedAction(nikke, reasons)
      };
    })
    .filter((item) => item.priorityScore > 0)
    .sort((a, b) => b.priorityScore - a.priorityScore || a.nikke.name.localeCompare(b.nikke.name, "ko"));

export const getTeamConfidence = (members: Nikke[]): TeamConfidence => {
  const verifiedCount = members.filter((nikke) => nikke.sourceStatus === "verified" || nikke.sourceStatus === "communityChecked").length;
  const needsReviewCount = members.filter((nikke) => nikke.sourceStatus === "needsReview").length;
  const placeholderCount = members.filter((nikke) => nikke.sourceStatus === "placeholder").length;
  const level: TeamConfidence["level"] =
    verifiedCount >= 4 && placeholderCount === 0 ? "높음" : placeholderCount > 0 ? "낮음" : needsReviewCount >= 1 && needsReviewCount <= 2 ? "보통" : "낮음";

  const message =
    level === "높음"
      ? "검수된 데이터 비중이 높아 추천 신뢰도가 높습니다."
      : level === "보통"
        ? "일부 검수 필요 데이터가 있어 최신 메타와 다를 수 있습니다."
        : "임시 데이터가 포함되어 실제 성능과 추천 우선순위가 크게 달라질 수 있습니다.";

  return { level, verifiedCount, needsReviewCount, placeholderCount, message };
};
