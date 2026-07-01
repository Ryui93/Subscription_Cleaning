import type { ContentType } from "@/types/content";
import type { RoleId } from "@/types/nikke";

export type ContentScorePolicy = {
  contentType: ContentType;
  label: string;
  description: string;
  coreRoles: RoleId[];
  usefulRoles: RoleId[];
  weakRoles: RoleId[];
  highScoreGuideline: string;
  warningRules: string[];
};

export const contentScorePolicies: Record<ContentType, ContentScorePolicy> = {
  story: {
    contentType: "story",
    label: "스토리",
    description: "광역 처리, 버스트 순환, 유지력, 자동전투 안정성을 함께 봅니다.",
    coreRoles: ["메인딜러", "광역딜", "지속딜", "쿨감", "버퍼", "힐러", "실드", "유지력", "자동전투"],
    usefulRoles: ["서브딜러", "공버프", "버스트충전", "뉴비추천", "범용"],
    weakRoles: ["보스딜", "파츠딜", "방깎", "받피증"],
    highScoreGuideline: "85점 이상은 캠페인/타워 진행에서 실제 안정성이나 범용성이 있는 경우에만 사용합니다.",
    warningRules: ["85점 이상인데 스토리 핵심 역할이 없으면 과대평가 후보입니다.", "arena와 story가 동시에 90점 이상이면 역할 근거를 확인합니다."]
  },
  boss: {
    contentType: "boss",
    label: "보스전",
    description: "단일 대상 화력, 버프/디버프, 파츠 처리, 쿨감 기여를 봅니다.",
    coreRoles: ["메인딜러", "보스딜", "버퍼", "디버퍼", "방깎", "받피증", "파츠딜", "쿨감"],
    usefulRoles: ["공버프", "크리버프", "관통딜", "유지력", "저지보조", "서브딜러"],
    weakRoles: ["아레나광역", "아레나방어", "도발", "탱커"],
    highScoreGuideline: "90점 이상은 보스전 주력 딜러, 핵심 버퍼, 핵심 디버퍼에게만 제한적으로 사용합니다.",
    warningRules: ["딜러/버퍼/디버퍼 근거 없이 90점 이상이면 과대평가 후보입니다.", "needsReview 상태에서 90점 이상 콘텐츠가 3개 이상이면 재검수합니다."]
  },
  tower: {
    contentType: "tower",
    label: "타워",
    description: "기업 제한을 고려한 범용성, 버스트 순환, 생존 보조를 봅니다.",
    coreRoles: ["범용", "기업타워", "메인딜러", "버퍼", "힐러", "실드", "쿨감"],
    usefulRoles: ["광역딜", "보스딜", "유지력", "자동전투", "서브딜러"],
    weakRoles: ["콜라보", "한정"],
    highScoreGuideline: "80점 이상은 기업 제한 환경에서도 역할이 분명한 경우에 사용합니다.",
    warningRules: ["기업타워/범용/핵심 전투 역할 없이 높은 점수면 확인합니다."]
  },
  arena: {
    contentType: "arena",
    label: "아레나",
    description: "버스트 충전, 선버스트, 도발/무적/피해분배, 생존과 광역 압박을 봅니다.",
    coreRoles: ["버스트충전", "선버스트", "도발", "무적", "피해분배", "생존", "부활", "아레나광역", "아레나방어"],
    usefulRoles: ["광역딜", "버스트딜", "탱커", "힐러", "실드"],
    weakRoles: ["보스딜", "파츠딜", "저지보조"],
    highScoreGuideline: "85점 이상은 아레나 전용 역할 근거가 있을 때만 사용합니다.",
    warningRules: ["아레나 역할 없이 arena 90점 이상이면 과대평가 후보입니다.", "PVE 강캐라는 이유만으로 arena를 높게 두지 않습니다."]
  },
  soloRaid: {
    contentType: "soloRaid",
    label: "솔로레이드",
    description: "보스 딜, 버프/디버프, 쿨감, 유지력, 여러 덱 분산 가능성을 봅니다.",
    coreRoles: ["메인딜러", "보스딜", "버퍼", "디버퍼", "방깎", "받피증", "파츠딜", "쿨감", "유지력"],
    usefulRoles: ["서브딜러", "공버프", "크리버프", "장탄버프", "관통딜", "저지보조"],
    weakRoles: ["아레나광역", "아레나방어"],
    highScoreGuideline: "90점 이상은 레이드 핵심 딜러/버퍼/디버퍼 중심으로 제한합니다.",
    warningRules: ["특정 버퍼가 과도하게 모든 레이드 조합에 몰리면 이후 덱 분산 로직에서 조정합니다."]
  },
  unionRaid: {
    contentType: "unionRaid",
    label: "유니온레이드",
    description: "보스 딜, 디버프, 대체 딜러 활용성, 장기 운용 안정성을 봅니다.",
    coreRoles: ["메인딜러", "보스딜", "버퍼", "디버퍼", "방깎", "받피증", "쿨감"],
    usefulRoles: ["파츠딜", "관통딜", "유지력", "서브딜러"],
    weakRoles: ["아레나광역", "아레나방어", "탱커"],
    highScoreGuideline: "90점 이상은 보스전 핵심 역할이 명확할 때만 사용합니다.",
    warningRules: ["보스전 역할 없이 높은 점수면 과대평가 후보입니다."]
  },
  interception: {
    contentType: "interception",
    label: "요격전",
    description: "보스 딜, 파츠 처리, 저지/생존 보조, 버스트 안정성을 봅니다.",
    coreRoles: ["메인딜러", "보스딜", "파츠딜", "버퍼", "디버퍼", "쿨감", "유지력"],
    usefulRoles: ["저지보조", "실드", "힐러", "관통딜", "서브딜러"],
    weakRoles: ["아레나광역", "아레나방어"],
    highScoreGuideline: "80점 이상은 보스/파츠/저지 중 하나 이상의 근거가 있어야 합니다.",
    warningRules: ["요격전 근거 없이 높은 점수면 재검수합니다."]
  }
};

export const getRoleFitScore = (roles: RoleId[], contentType: ContentType) => {
  const policy = contentScorePolicies[contentType];
  const coreMatches = roles.filter((role) => policy.coreRoles.includes(role)).length;
  const usefulMatches = roles.filter((role) => policy.usefulRoles.includes(role)).length;
  const weakMatches = roles.filter((role) => policy.weakRoles.includes(role)).length;
  const hasRelevantRole = coreMatches + usefulMatches > 0;

  return Math.max(-8, Math.min(18, coreMatches * 4 + usefulMatches * 2 - weakMatches * 3 + (hasRelevantRole ? 0 : -5)));
};

export const hasCoreRoleForContent = (roles: RoleId[], contentType: ContentType) =>
  roles.some((role) => contentScorePolicies[contentType].coreRoles.includes(role));

export const getContentPolicyWarning = (roles: RoleId[], contentType: ContentType, score: number) => {
  if (score >= 85 && !hasCoreRoleForContent(roles, contentType)) {
    return `${contentScorePolicies[contentType].label} ${score}점이지만 핵심 역할 근거가 부족합니다.`;
  }

  return null;
};
