import { contentScorePolicies, getContentPolicyWarning, hasCoreRoleForContent } from "@/data/contentScorePolicy";
import { contentLabels, contentTypes, type ContentType } from "@/types/content";
import type { Nikke } from "@/types/nikke";
import { getAverageContentScore } from "./dataQuality";

export type ContentScoreSummary = {
  content: ContentType;
  label: string;
  average: number;
  highScoreCount: number;
  lowScoreCount: number;
  min: number;
  max: number;
};

export type ScoreAuditIssueType =
  | "allRounder"
  | "needsReviewHighScore"
  | "roleMismatchHighScore"
  | "arenaMismatch"
  | "bossMismatch"
  | "lowAverage"
  | "veryHighAverage";

export type ScoreAuditIssue = {
  nikke: Nikke;
  type: ScoreAuditIssueType;
  severity: "info" | "warning";
  message: string;
  contents: ContentType[];
};

const avg = (values: number[]) => (values.length === 0 ? 0 : Math.round(values.reduce((sum, value) => sum + value, 0) / values.length));

const highContents = (nikke: Nikke, threshold = 90) => contentTypes.filter((content) => (nikke.contentScores[content] ?? 0) >= threshold);

const hasAnyRole = (nikke: Nikke, roles: string[]) => nikke.roles.some((role) => roles.includes(role));

export const getContentScoreStats = (items: Nikke[]): ContentScoreSummary[] =>
  contentTypes.map((content) => {
    const scores = items.map((nikke) => nikke.contentScores[content] ?? 0);
    return {
      content,
      label: contentLabels[content],
      average: avg(scores),
      highScoreCount: scores.filter((score) => score >= 90).length,
      lowScoreCount: scores.filter((score) => score < 70).length,
      min: Math.min(...scores),
      max: Math.max(...scores)
    };
  });

export const getScoreDistributionByContent = (items: Nikke[]) =>
  contentTypes.reduce(
    (acc, content) => ({
      ...acc,
      [content]: {
        "0-39": items.filter((nikke) => (nikke.contentScores[content] ?? 0) < 40).length,
        "40-59": items.filter((nikke) => {
          const score = nikke.contentScores[content] ?? 0;
          return score >= 40 && score < 60;
        }).length,
        "60-69": items.filter((nikke) => {
          const score = nikke.contentScores[content] ?? 0;
          return score >= 60 && score < 70;
        }).length,
        "70-79": items.filter((nikke) => {
          const score = nikke.contentScores[content] ?? 0;
          return score >= 70 && score < 80;
        }).length,
        "80-89": items.filter((nikke) => {
          const score = nikke.contentScores[content] ?? 0;
          return score >= 80 && score < 90;
        }).length,
        "90-100": items.filter((nikke) => (nikke.contentScores[content] ?? 0) >= 90).length
      }
    }),
    {} as Record<ContentType, Record<string, number>>
  );

export const getAllRounderCandidates = (items: Nikke[]): ScoreAuditIssue[] =>
  items
    .filter((nikke) => contentTypes.every((content) => (nikke.contentScores[content] ?? 0) >= 85))
    .map((nikke) => ({
      nikke,
      type: "allRounder",
      severity: "warning",
      message: "모든 콘텐츠 점수가 85점 이상입니다. 만능형 점수 근거를 재확인하세요.",
      contents: [...contentTypes]
    }));

export const getLowConfidenceHighScoreCandidates = (items: Nikke[]): ScoreAuditIssue[] =>
  items
    .filter((nikke) => nikke.sourceStatus === "needsReview" && highContents(nikke, 90).length >= 3)
    .map((nikke) => ({
      nikke,
      type: "needsReviewHighScore",
      severity: "warning",
      message: "needsReview 상태인데 90점 이상 콘텐츠가 3개 이상입니다.",
      contents: highContents(nikke, 90)
    }));

export const getOverratedCandidates = (items: Nikke[]): ScoreAuditIssue[] => {
  const issues: ScoreAuditIssue[] = [];

  items.forEach((nikke) => {
    contentTypes.forEach((content) => {
      const score = nikke.contentScores[content] ?? 0;
      const policyWarning = getContentPolicyWarning(nikke.roles, content, score);
      if (policyWarning) {
        issues.push({
          nikke,
          type: "roleMismatchHighScore",
          severity: "warning",
          message: policyWarning,
          contents: [content]
        });
      }
    });

    if ((nikke.contentScores.arena ?? 0) >= 90 && !hasCoreRoleForContent(nikke.roles, "arena")) {
      issues.push({
        nikke,
        type: "arenaMismatch",
        severity: "warning",
        message: "아레나 전용 역할 없이 arena 점수가 90점 이상입니다.",
        contents: ["arena"]
      });
    }

    const hasBossBasis = hasAnyRole(nikke, ["메인딜러", "보스딜", "버퍼", "디버퍼", "방깎", "받피증", "파츠딜"]);
    const bossLikeHigh = ["boss", "soloRaid", "unionRaid"].filter((content) => (nikke.contentScores[content as ContentType] ?? 0) >= 90) as ContentType[];
    if (bossLikeHigh.length > 0 && !hasBossBasis) {
      issues.push({
        nikke,
        type: "bossMismatch",
        severity: "warning",
        message: "딜러/버퍼/디버퍼 근거 없이 보스 계열 점수가 90점 이상입니다.",
        contents: bossLikeHigh
      });
    }
  });

  return issues;
};

export const getUnderratedCandidates = (items: Nikke[]): ScoreAuditIssue[] =>
  items
    .filter((nikke) => nikke.rarity === "SSR" && getAverageContentScore(nikke) < 30)
    .map((nikke) => ({
      nikke,
      type: "lowAverage",
      severity: "warning",
      message: "SSR인데 평균 점수가 30점 미만입니다.",
      contents: [...contentTypes]
    }));

export const getSuspiciousScorePatterns = (items: Nikke[]): ScoreAuditIssue[] => {
  const veryHighAverage = items
    .filter((nikke) => getAverageContentScore(nikke) >= 90)
    .map((nikke) => ({
      nikke,
      type: "veryHighAverage" as const,
      severity: "warning" as const,
      message: "평균 점수가 90점 이상입니다. 과대평가 여부를 확인하세요.",
      contents: [...contentTypes]
    }));

  const combined = [
    ...getAllRounderCandidates(items),
    ...getLowConfidenceHighScoreCandidates(items),
    ...getOverratedCandidates(items),
    ...getUnderratedCandidates(items),
    ...veryHighAverage
  ];

  const unique = new Map<string, ScoreAuditIssue>();
  combined.forEach((issue) => {
    const key = `${issue.nikke.id}-${issue.type}-${issue.contents.join(",")}`;
    unique.set(key, issue);
  });

  return Array.from(unique.values()).sort(
    (a, b) =>
      highContents(b.nikke, 90).length - highContents(a.nikke, 90).length ||
      getAverageContentScore(b.nikke) - getAverageContentScore(a.nikke) ||
      a.nikke.name.localeCompare(b.nikke.name, "ko")
  );
};

export const getScoreAuditOverview = (items: Nikke[]) => {
  const suspicious = getSuspiciousScorePatterns(items);

  return {
    stats: getContentScoreStats(items),
    distribution: getScoreDistributionByContent(items),
    allRounderCandidates: getAllRounderCandidates(items),
    needsReviewHighScoreCandidates: getLowConfidenceHighScoreCandidates(items),
    suspiciousPatterns: suspicious,
    policyLabels: Object.fromEntries(contentTypes.map((content) => [content, contentScorePolicies[content].label])) as Record<ContentType, string>
  };
};
