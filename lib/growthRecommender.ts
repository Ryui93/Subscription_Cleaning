import { contentTypes, type ContentType } from "@/types/content";
import type { AccountGrowthState } from "@/types/accountGrowth";
import type { Nikke } from "@/types/nikke";
import type { OwnedNikkeState } from "@/types/owned";
import type { EquipmentGrowthRecommendation, GrowthPriorityItem, GrowthRecommendation } from "@/types/team";
import { defaultAccountGrowthState } from "./accountGrowthDefaults";
import { getAccountGrowthAdjustedScore, getAccountGrowthReasons, getSynchroScoreContext } from "./accountGrowthScoring";
import {
  equipmentSlots,
  getAverageEquipmentLevel,
  getEquipmentAdjustedScore,
  getEquipmentSummary,
  getOverloadCount,
  getRecommendedOverloadOptions
} from "./equipmentUtils";
import { clampScore, getMetaSignalScore, getNikkeContentScore, getRoleScore, getSourceStatusPenalty } from "./scoring";

const getPriority = (score: number): GrowthPriorityItem["priority"] => {
  if (score >= 88) return "최우선";
  if (score >= 76) return "높음";
  if (score >= 62) return "보통";
  return "낮음";
};

const hasAnyRole = (nikke: Nikke, roles: string[]) => nikke.roles.some((role) => roles.includes(role));

const getGrowthScore = (
  nikke: Nikke,
  content?: ContentType,
  ownedState?: OwnedNikkeState,
  accountGrowth: AccountGrowthState = defaultAccountGrowthState
) => {
  const contentAverage = content
    ? getNikkeContentScore(nikke, content)
    : contentTypes.reduce((total, type) => total + getNikkeContentScore(nikke, type), 0) / contentTypes.length;

  const roleAverage = content
    ? getRoleScore(nikke, content)
    : contentTypes.reduce((total, type) => total + getRoleScore(nikke, type), 0) / contentTypes.length;

  const mainDpsBonus = nikke.roles.includes("메인딜러") ? 9 : 0;
  const cooldownBonus = nikke.cooldown === 20 && (nikke.burst === 1 || nikke.burst === 2) ? 8 : 0;
  const supportBonus = hasAnyRole(nikke, ["공버프", "버퍼", "쿨감", "힐러"]) ? 6 : 0;
  const debuffBonus = hasAnyRole(nikke, ["디버퍼", "방깎", "받피증"]) ? 5 : 0;
  const favoriteBonus = ownedState?.isFavorite ? 8 : 0;
  const investmentBonus =
    ((ownedState?.skill1 ?? 0) + (ownedState?.skill2 ?? 0) + (ownedState?.burstSkill ?? 0)) * 0.35 +
    getEquipmentAdjustedScore(nikke, ownedState, content) * 0.7;
  const collectionBonus = ownedState?.collectionOwned ? 2 : 0;
  const accountGrowthBonus = getAccountGrowthAdjustedScore(nikke, ownedState, accountGrowth, content);
  const lowSynchroPriorityBonus =
    getSynchroScoreContext(accountGrowth).isLowSynchroAccount && (nikke.goodFor.includes("story") || nikke.goodFor.includes("boss")) ? 2 : 0;
  const metaBonus = content
    ? getMetaSignalScore(nikke, content)
    : contentTypes.reduce((total, type) => total + getMetaSignalScore(nikke, type), 0) / contentTypes.length;

  return clampScore(
    contentAverage * 0.72 +
      roleAverage * 0.72 +
      mainDpsBonus +
      cooldownBonus +
      supportBonus +
      debuffBonus +
      favoriteBonus +
      investmentBonus +
      collectionBonus +
      accountGrowthBonus +
      lowSynchroPriorityBonus +
      metaBonus +
      getSourceStatusPenalty(nikke)
  );
};

const getReasons = (
  nikke: Nikke,
  content?: ContentType,
  ownedState?: OwnedNikkeState,
  accountGrowth: AccountGrowthState = defaultAccountGrowthState
) => {
  const reasons: string[] = [];

  if (nikke.roles.includes("메인딜러")) reasons.push("메인 딜러라 장비와 오버로드 효율이 높습니다.");
  if (nikke.roles.includes("쿨감")) reasons.push("쿨타임 감소 역할이 있어 조합 안정성에 직접 기여합니다.");
  if (nikke.cooldown === 20 && (nikke.burst === 1 || nikke.burst === 2)) reasons.push("20초 버스트 축이라 여러 조합에 넣기 좋습니다.");
  if (nikke.roles.includes("공버프")) reasons.push("공격 버프로 다른 딜러의 효율을 끌어올립니다.");
  if (hasAnyRole(nikke, ["힐러", "실드", "유지력"])) reasons.push("유지력 보강으로 진행 안정성이 좋아집니다.");
  if (content && nikke.goodFor.includes(content)) reasons.push("선택한 콘텐츠 적합도가 높게 설정되어 있습니다.");
  if (ownedState?.isFavorite) reasons.push("주력 니케로 체크되어 있습니다.");
  if ((ownedState?.overloadCount ?? 0) > 0) reasons.push("이미 오버로드 투자가 있어 추가 투자 효율을 반영했습니다.");
  if (getEquipmentAdjustedScore(nikke, ownedState, content) > 0) reasons.push("장비 강화/오버로드 상태를 보조 보정으로 반영했습니다.");
  if (ownedState?.collectionOwned) reasons.push("애장품/소장품 보유 상태를 소폭 반영했습니다.");
  getAccountGrowthReasons(nikke, ownedState, accountGrowth, content)
    .filter((reason) => reason !== "계정 성장 보정 없음")
    .forEach((reason) => reasons.push(reason));
  if (getSynchroScoreContext(accountGrowth).isLowSynchroAccount && (nikke.goodFor.includes("story") || nikke.goodFor.includes("boss"))) {
    reasons.push("싱크로 레벨 입력값 기준으로 스토리/보스 범용 성장 우선도를 보강했습니다.");
  }

  return reasons.length > 0 ? reasons : ["보유 니케 안에서 콘텐츠 점수와 역할 균형을 기준으로 계산했습니다."];
};

const rank = (
  owned: Nikke[],
  ownedStateById: Map<string, OwnedNikkeState>,
  accountGrowth: AccountGrowthState,
  content?: ContentType,
  limit = 10
): GrowthPriorityItem[] =>
  owned
    .map((nikke) => {
      const ownedState = ownedStateById.get(nikke.id);
      const score = getGrowthScore(nikke, content, ownedState, accountGrowth);
      return {
        nikke,
        score,
        priority: getPriority(score),
        reasons: getReasons(nikke, content, ownedState, accountGrowth),
        skillPlan: nikke.skillPriority,
        gearPlan: nikke.gearPriority,
        overloadPlan: nikke.overloadPriority,
        cubePlan: ownedState?.memo ? `${nikke.cubeRecommendation} / 메모: ${ownedState.memo}` : nikke.cubeRecommendation,
        collectionPlan: ownedState?.collectionOwned
          ? `${nikke.collectionPriority} / 애장품 단계: ${ownedState.collectionLevel ?? "미입력"}`
          : nikke.collectionPriority
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

const getEquipmentPriorityRecommendations = (
  owned: Nikke[],
  ownedStateById: Map<string, OwnedNikkeState>,
  accountGrowth: AccountGrowthState,
  category: EquipmentGrowthRecommendation["category"],
  limit = 10
): EquipmentGrowthRecommendation[] =>
  owned
    .map((nikke) => {
      const ownedState = ownedStateById.get(nikke.id);
      const equipment = ownedState?.equipment;
      const overloadCount = equipment ? getOverloadCount(equipment) : ownedState?.overloadCount ?? 0;
      const averageLevel = getAverageEquipmentLevel(equipment);
      const roleBonus = nikke.roles.includes("메인딜러") || nikke.goodFor.includes("soloRaid") || nikke.goodFor.includes("boss") ? 16 : 6;
      const favoriteBonus = ownedState?.isFavorite ? 8 : 0;
      const collectionBonus = ownedState?.collectionOwned ? 4 : 0;
      const recycleBonus = getAccountGrowthAdjustedScore(nikke, ownedState, accountGrowth, "soloRaid");
      const missingOverloadBonus = category === "오버로드" ? Math.max(0, 4 - overloadCount) * 5 : 0;
      const lowEquipmentBonus = category === "장비 강화" ? Math.max(0, 5 - averageLevel) * 3 : 0;
      const optionReviewBonus =
        category === "옵션 검수" && equipment
          ? equipmentSlots.some((slot) => equipment.slots[slot]?.overloadOptions?.includes("검수필요") || (equipment.slots[slot]?.isOverloaded && !equipment.slots[slot]?.overloadOptions?.length))
            ? 22
            : 0
          : 0;
      const score = Math.round(roleBonus + favoriteBonus + collectionBonus + recycleBonus + missingOverloadBonus + lowEquipmentBonus + optionReviewBonus);
      const recommendedOptions = getRecommendedOverloadOptions(nikke, "soloRaid");

      return {
        nikke,
        priority: getPriority(score),
        category,
        score,
        reasons: [
          ...(nikke.roles.includes("메인딜러") ? ["메인 딜러라 장비 투자 효율이 높습니다."] : []),
          ...(nikke.goodFor.includes("soloRaid") || nikke.goodFor.includes("boss") ? ["보스/솔로레이드 점수가 높아 장비 보정 가치가 있습니다."] : []),
          ...(ownedState?.isFavorite ? ["주력 체크됨"] : []),
          ...(ownedState?.collectionOwned ? ["애장품/소장품 보유"] : []),
          ...(recycleBonus > 0 ? ["호감도/리사이클룸 보정이 높습니다."] : []),
          ...(category === "오버로드" && overloadCount < 4 ? [`오버로드가 ${overloadCount}/4라 추가 여지가 있습니다.`] : []),
          ...(category === "옵션 검수" ? [`추천 옵션 후보: ${recommendedOptions.join(" / ")}`] : [])
        ],
        currentStateSummary: getEquipmentSummary(nikke, ownedState, "soloRaid"),
        recommendedAction:
          category === "장비 강화"
            ? "평균 강화 레벨과 기업 장비 일치 상태를 먼저 정리하세요."
            : category === "오버로드"
              ? "T9 기업 장비와 주력 딜러 슬롯을 우선 오버로드 후보로 봅니다."
              : "공격력/최대장탄수/우월코드 등 핵심 옵션 여부를 직접 검수하세요."
      };
    })
    .filter((item) => (category === "옵션 검수" ? item.score >= 20 : item.score > 0))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

export const getGrowthRecommendations = (
  owned: Nikke[],
  ownedStates: OwnedNikkeState[] = [],
  accountGrowth: AccountGrowthState = defaultAccountGrowthState
): GrowthRecommendation => {
  const ownedStateById = new Map(ownedStates.map((state) => [state.id, state]));
  const byContent = contentTypes.reduce(
    (acc, content) => ({
      ...acc,
      [content]: rank(owned, ownedStateById, accountGrowth, content, 5)
    }),
    {} as GrowthRecommendation["byContent"]
  );

  const overall = rank(owned, ownedStateById, accountGrowth, undefined, 10);

  return {
    overall,
    byContent,
    skill: [...overall].sort((a, b) => {
      const left = hasAnyRole(a.nikke, ["쿨감", "공버프"]) ? 1 : 0;
      const right = hasAnyRole(b.nikke, ["쿨감", "공버프"]) ? 1 : 0;
      return right - left || b.score - a.score;
    }),
    overload: [...overall].sort((a, b) => {
      const left = hasAnyRole(a.nikke, ["메인딜러", "보스딜"]) ? 1 : 0;
      const right = hasAnyRole(b.nikke, ["메인딜러", "보스딜"]) ? 1 : 0;
      return right - left || b.score - a.score;
    }),
    cube: [...overall].sort((a, b) => b.score - a.score),
    collection: [...overall].sort((a, b) => {
      const left = a.nikke.collectionPriority.includes("높") || a.nikke.collectionPriority.includes("우선") || a.score >= 80 ? 1 : 0;
      const right = b.nikke.collectionPriority.includes("높") || b.nikke.collectionPriority.includes("우선") || b.score >= 80 ? 1 : 0;
      return right - left || b.score - a.score;
    }),
    equipment: getEquipmentPriorityRecommendations(owned, ownedStateById, accountGrowth, "장비 강화"),
    overloadEquipment: getEquipmentPriorityRecommendations(owned, ownedStateById, accountGrowth, "오버로드"),
    overloadOptionReview: getEquipmentPriorityRecommendations(owned, ownedStateById, accountGrowth, "옵션 검수")
  };
};
