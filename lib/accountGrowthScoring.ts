import type { AccountGrowthState } from "@/types/accountGrowth";
import type { ContentType } from "@/types/content";
import type { Nikke } from "@/types/nikke";
import type { OwnedNikkeState } from "@/types/owned";

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const smallLevelBonus = (level?: number, max = 3) => {
  if (!level || level <= 0) {
    return 0;
  }

  return Number(clamp((level / 100) * max, 0, max).toFixed(1));
};

const getClassRecycleLevel = (nikke: Nikke, accountGrowth: AccountGrowthState) => {
  if (nikke.classType === "화력형") return accountGrowth.recyclingRoom.attackerLevel;
  if (nikke.classType === "방어형") return accountGrowth.recyclingRoom.defenderLevel;
  if (nikke.classType === "지원형") return accountGrowth.recyclingRoom.supporterLevel;
  return undefined;
};

const getManufacturerRecycleLevel = (nikke: Nikke, accountGrowth: AccountGrowthState) => {
  if (nikke.manufacturer === "엘리시온") return accountGrowth.recyclingRoom.elysionLevel;
  if (nikke.manufacturer === "미실리스") return accountGrowth.recyclingRoom.missilisLevel;
  if (nikke.manufacturer === "테트라") return accountGrowth.recyclingRoom.tetraLevel;
  if (nikke.manufacturer === "필그림") return accountGrowth.recyclingRoom.pilgrimLevel;
  if (nikke.manufacturer === "어브노멀") return accountGrowth.recyclingRoom.abnormalLevel;
  return undefined;
};

export const getBondScoreBonus = (nikke: Nikke, accountGrowth: AccountGrowthState) => {
  const bondLevel = accountGrowth.bondLevels[nikke.id]?.bondLevel;
  return smallLevelBonus(bondLevel, 3);
};

export const getSynchroScoreContext = (accountGrowth: AccountGrowthState) => ({
  hasSynchroInput: Boolean(accountGrowth.synchroDevice.synchroLevel),
  synchroLevel: accountGrowth.synchroDevice.synchroLevel,
  maxSynchroSlots: accountGrowth.synchroDevice.maxSynchroSlots,
  usedSynchroSlots: accountGrowth.synchroDevice.usedSynchroSlots,
  isLowSynchroAccount: Boolean(accountGrowth.synchroDevice.synchroLevel && accountGrowth.synchroDevice.synchroLevel < 200)
});

export const getRecyclingRoomBonus = (nikke: Nikke, accountGrowth: AccountGrowthState) => {
  const classBonus = smallLevelBonus(getClassRecycleLevel(nikke, accountGrowth), 3);
  const manufacturerBonus = smallLevelBonus(getManufacturerRecycleLevel(nikke, accountGrowth), 3);
  return Number((classBonus + manufacturerBonus).toFixed(1));
};

export const getTacticsAcademyBonus = (accountGrowth: AccountGrowthState) => {
  const hasInput = Boolean(accountGrowth.tacticsAcademy.currentClass || accountGrowth.tacticsAcademy.completedLessons?.length || accountGrowth.tacticsAcademy.memo);
  return hasInput ? 0 : 0;
};

export const getAccountGrowthAdjustedScore = (
  nikke: Nikke,
  ownedState: OwnedNikkeState | undefined,
  accountGrowth: AccountGrowthState,
  contentType?: ContentType
) => {
  const bondBonus = getBondScoreBonus(nikke, accountGrowth);
  const recyclingBonus = getRecyclingRoomBonus(nikke, accountGrowth);
  const collectionBonus = ownedState?.collectionOwned ? Math.min(2, 1 + (ownedState.collectionLevel ?? 0) * 0.25) : 0;
  const lowSynchroStoryBonus = getSynchroScoreContext(accountGrowth).isLowSynchroAccount && (contentType === "story" || contentType === "boss") && nikke.roles.includes("범용") ? 1 : 0;

  return Number(clamp(bondBonus + recyclingBonus + collectionBonus + lowSynchroStoryBonus + getTacticsAcademyBonus(accountGrowth), 0, 10).toFixed(1));
};

export const getAccountGrowthWarnings = (nikke: Nikke, ownedState: OwnedNikkeState | undefined, accountGrowth: AccountGrowthState) => {
  const warnings: string[] = [];
  const synchro = getSynchroScoreContext(accountGrowth);

  if (!synchro.hasSynchroInput && Object.keys(accountGrowth.bondLevels).length === 0) {
    warnings.push("계정 성장 정보가 입력되지 않아 기본 추천 점수만 사용했습니다.");
  }
  if (ownedState?.owned && !accountGrowth.bondLevels[nikke.id]?.bondLevel) {
    warnings.push("호감도 미입력");
  }

  return warnings;
};

export const getAccountGrowthReasons = (
  nikke: Nikke,
  ownedState: OwnedNikkeState | undefined,
  accountGrowth: AccountGrowthState,
  contentType?: ContentType
) => {
  const reasons: string[] = [];
  const bondBonus = getBondScoreBonus(nikke, accountGrowth);
  const classLevel = getClassRecycleLevel(nikke, accountGrowth);
  const manufacturerLevel = getManufacturerRecycleLevel(nikke, accountGrowth);
  const classBonus = smallLevelBonus(classLevel, 3);
  const manufacturerBonus = smallLevelBonus(manufacturerLevel, 3);
  const totalBonus = getAccountGrowthAdjustedScore(nikke, ownedState, accountGrowth, contentType);

  if (bondBonus > 0) reasons.push(`호감도 보정 +${bondBonus}`);
  if (classBonus > 0) reasons.push(`${nikke.classType} 리사이클룸 보정 +${classBonus}`);
  if (manufacturerBonus > 0) reasons.push(`${nikke.manufacturer} 리사이클룸 보정 +${manufacturerBonus}`);
  if (ownedState?.collectionOwned) reasons.push(`애장품 보유 보정 +${Math.min(2, 1 + (ownedState.collectionLevel ?? 0) * 0.25)}`);
  if (ownedState?.isFavorite) reasons.push("주력 체크됨");
  if ((ownedState?.overloadCount ?? 0) > 0) reasons.push("오버로드 보유");
  if (totalBonus === 0) reasons.push("계정 성장 보정 없음");

  return reasons;
};
