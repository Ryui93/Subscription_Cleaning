import { communitySignals } from "@/data/communitySignals";
import { contentRules } from "@/data/contentRules";
import { getRoleFitScore } from "@/data/contentScorePolicy";
import type { CommunitySignal } from "@/types/meta";
import { communitySourcePriority } from "@/types/meta";
import type { ContentType } from "@/types/content";
import type { Nikke, RoleId } from "@/types/nikke";
import { roleLabels } from "@/types/nikke";

export type TeamScoreBreakdown = {
  score: number;
  reasons: string[];
  warnings: string[];
  missingRoles: RoleId[];
  scoreDetails: {
    baseAverage: number;
    roleScore: number;
    roleFitScore: number;
    teamSynergyScore: number;
    sourcePenalty: number;
    finalScore: number;
  };
};

export const clampScore = (score: number) => Math.max(0, Math.min(100, Math.round(score)));

export const getNikkeContentScore = (nikke: Nikke, content: ContentType) => nikke.contentScores[content] ?? 50;

export const getMetaSignalScore = (
  nikke: Nikke,
  content: ContentType,
  signals: CommunitySignal[] = communitySignals
) => {
  return signals.reduce((total, signal) => {
    const matchesCharacter = signal.characters.includes(nikke.name);
    const matchesContent = signal.contentTypes.includes(content);

    if (!matchesCharacter || !matchesContent) {
      return total;
    }

    const verificationMultiplier = signal.adminVerified ? 1 : 0.25;
    const sourceWeight = communitySourcePriority[signal.source] / 7;
    const sentimentWeight = signal.sentiment === "negative" ? -1 : signal.sentiment === "mixed" ? 0.45 : 1;

    return total + (signal.confidence / 100) * sourceWeight * sentimentWeight * verificationMultiplier * 8;
  }, 0);
};

export const getRoleScore = (nikke: Nikke, content: ContentType) => {
  const weights = contentRules[content].roleWeights;

  return nikke.roles.reduce((total, role) => total + (weights[role] ?? 0), 0);
};

export const getSourceStatusPenalty = (nikke: Nikke) => {
  if (nikke.sourceStatus === "verified") return 0;
  if (nikke.sourceStatus === "communityChecked") return -1;
  if (nikke.sourceStatus === "needsReview") return -5;
  return -15;
};

export const getNikkeCompositeScore = (nikke: Nikke, content: ContentType) => {
  const contentScore = getNikkeContentScore(nikke, content);
  const roleScore = getRoleScore(nikke, content);
  const roleFitScore = getRoleFitScore(nikke.roles, content);
  const burstBonus = nikke.cooldown === 20 && (nikke.burst === 1 || nikke.burst === 2) ? 6 : 0;
  const dpsBonus = nikke.roles.includes("메인딜러") ? 6 : nikke.roles.includes("서브딜러") ? 3 : 0;
  const metaScore = getMetaSignalScore(nikke, content);

  return contentScore + roleScore + roleFitScore + burstBonus + dpsBonus + metaScore + getSourceStatusPenalty(nikke);
};

const hasRole = (team: Nikke[], role: RoleId) => team.some((nikke) => nikke.roles.includes(role));

const getPolicyTeamSynergyScore = (team: Nikke[], content: ContentType) => {
  const role = (role: RoleId) => hasRole(team, role);
  const hasMainDps = role("메인딜러");
  const hasBuffer = role("버퍼") || role("공버프");
  const hasDebuffer = role("디버퍼") || role("방깎") || role("받피증");
  const hasSustain = role("힐러") || role("실드") || role("유지력");

  if (content === "story") {
    return (
      (role("쿨감") ? 8 : 0) +
      (role("광역딜") ? 6 : 0) +
      (hasSustain ? 5 : 0) +
      (team.filter((nikke) => nikke.roles.includes("메인딜러")).length >= 2 ? 5 : 0)
    );
  }

  if (content === "boss" || content === "interception") {
    return (hasMainDps ? 8 : 0) + (hasBuffer ? 8 : 0) + (hasDebuffer ? 6 : 0) + (role("파츠딜") ? 4 : 0);
  }

  if (content === "arena") {
    return (
      (role("버스트충전") ? 10 : 0) +
      (role("선버스트") ? 8 : 0) +
      (role("도발") || role("무적") || role("피해분배") ? 8 : 0) +
      (role("아레나광역") ? 6 : 0) +
      (role("힐러") || role("부활") ? 4 : 0)
    );
  }

  if (content === "soloRaid" || content === "unionRaid") {
    return (hasMainDps ? 8 : 0) + (hasBuffer ? 8 : 0) + (hasDebuffer ? 8 : 0) + (role("쿨감") ? 6 : 0) + (hasSustain ? 4 : 0);
  }

  return 0;
};

const getDuplicateRolePenalty = (team: Nikke[]) => {
  const counts = new Map<RoleId, number>();

  team.forEach((nikke) => {
    nikke.roles.forEach((role) => {
      counts.set(role, (counts.get(role) ?? 0) + 1);
    });
  });

  return Array.from(counts.values()).reduce((penalty, count) => {
    if (count <= 3) {
      return penalty;
    }

    return penalty + (count - 3) * 2;
  }, 0);
};

const getSurvivalBonus = (team: Nikke[], content: ContentType) => {
  if (!["story", "boss", "tower", "interception"].includes(content)) {
    return 0;
  }

  const survivalRoles: RoleId[] = ["힐러", "회복", "실드", "도발", "탱커", "부활", "무적", "유지력", "생존"];
  return Math.min(10, survivalRoles.filter((role) => hasRole(team, role)).length * 3);
};

const getArenaBonus = (team: Nikke[], content: ContentType) => {
  if (content !== "arena") {
    return 0;
  }

  const arenaRoles: RoleId[] = ["버스트충전", "선버스트", "광역딜", "아레나광역", "도발", "무적", "부활", "피해분배", "아레나방어"];
  return Math.min(18, arenaRoles.filter((role) => hasRole(team, role)).length * 4);
};

const getMissingBurstWarnings = (b1: Nikke[], b2: Nikke[], b3: Nikke[]) => {
  const missing: string[] = [];
  if (b1.length === 0) missing.push("B1");
  if (b2.length === 0) missing.push("B2");
  if (b3.length === 0) missing.push("B3");
  return missing;
};

export const scoreTeam = (team: Nikke[], content: ContentType): TeamScoreBreakdown => {
  const rule = contentRules[content];
  const warnings: string[] = [];
  const reasons: string[] = [];

  const b1 = team.filter((nikke) => nikke.burst === 1);
  const b2 = team.filter((nikke) => nikke.burst === 2);
  const b3 = team.filter((nikke) => nikke.burst === 3);
  const hasBurstLoop = b1.length > 0 && b2.length > 0 && b3.length > 0;

  const averageCharacterScore = team.reduce((total, nikke) => total + getNikkeContentScore(nikke, content), 0) / team.length;
  const roleScore = Math.min(24, team.reduce((total, nikke) => total + getRoleScore(nikke, content), 0) / 4);
  const roleFitScore = Math.min(18, team.reduce((total, nikke) => total + getRoleFitScore(nikke.roles, content), 0) / 5);
  const metaScore = Math.min(8, team.reduce((total, nikke) => total + getMetaSignalScore(nikke, content), 0));
  const sourcePenalty = team.reduce((total, nikke) => total + getSourceStatusPenalty(nikke), 0);
  const policyTeamSynergyScore = Math.min(24, getPolicyTeamSynergyScore(team, content));

  let burstScore = 0;
  if (b1.length > 0) burstScore += 8;
  if (b2.length > 0) burstScore += 8;
  if (b3.length > 0) burstScore += 8;
  if (hasBurstLoop) burstScore += 14;

  const b1CooldownBonus = b1.some((nikke) => nikke.cooldown === 20) ? 8 : 0;
  const b2CooldownBonus = b2.some((nikke) => nikke.cooldown === 20) ? 8 : 0;
  const b3DpsBonus = b3.filter((nikke) => nikke.roles.includes("메인딜러") || nikke.roles.includes("서브딜러")).length >= 2 ? 9 : 0;
  const cooldownReductionBonus = hasRole(team, "쿨감") ? 8 : 0;
  const mainDpsBonus = hasRole(team, "메인딜러") ? 8 : 0;
  const survivalBonus = getSurvivalBonus(team, content);
  const arenaBonus = getArenaBonus(team, content);
  const duplicatePenalty = getDuplicateRolePenalty(team);
  const missingBursts = getMissingBurstWarnings(b1, b2, b3);

  if (hasBurstLoop) {
    reasons.push("버스트1, 버스트2, 버스트3 순환이 가능합니다.");
  } else {
    warnings.push(`버스트 구성이 완전하지 않습니다. 부족한 단계: ${missingBursts.join(", ")}`);
  }

  if (b1CooldownBonus > 0) reasons.push("20초 버스트1을 확보했습니다.");
  if (b2CooldownBonus > 0) reasons.push("20초 버스트2를 확보했습니다.");
  if (b3DpsBonus > 0) reasons.push("버스트3 딜러를 2명 이상 확보했습니다.");
  if (cooldownReductionBonus > 0) reasons.push("쿨타임 감소 역할이 있어 버스트 순환 안정성이 높습니다.");
  if (mainDpsBonus > 0) reasons.push("메인 딜러 역할을 확보했습니다.");
  if (survivalBonus > 0) reasons.push("힐/실드/도발 등 생존 역할을 확보했습니다.");
  if (arenaBonus > 0) reasons.push("아레나 기준 버스트 충전/광역/생존 역할이 반영되었습니다.");
  if (team.some((nikke) => nikke.sourceStatus === "needsReview" || nikke.sourceStatus === "placeholder")) {
    warnings.push("일부 니케 데이터는 검수 필요 상태입니다.");
  }

  const missingRoles = rule.preferredRoles.filter((role) => !hasRole(team, role));
  if (missingRoles.length > 0) {
    warnings.push(`콘텐츠 핵심 역할 일부가 부족합니다: ${missingRoles.slice(0, 4).map((role) => roleLabels[role]).join(", ")}`);
  }

  const rawScore =
    averageCharacterScore * 0.48 +
    roleScore +
    roleFitScore +
    metaScore +
    burstScore +
    b1CooldownBonus +
    b2CooldownBonus +
    b3DpsBonus +
    cooldownReductionBonus +
    mainDpsBonus +
    survivalBonus +
    arenaBonus +
    policyTeamSynergyScore +
    sourcePenalty -
    duplicatePenalty;

  const finalScore = clampScore(rawScore);

  return {
    score: finalScore,
    reasons,
    warnings,
    missingRoles,
    scoreDetails: {
      baseAverage: Math.round(averageCharacterScore),
      roleScore: Math.round(roleScore),
      roleFitScore: Math.round(roleFitScore),
      teamSynergyScore: Math.round(policyTeamSynergyScore),
      sourcePenalty,
      finalScore
    }
  };
};
