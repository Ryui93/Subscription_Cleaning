import type { ContentType } from "@/types/content";
import type {
  EquipmentManufacturerBonus,
  EquipmentSlot,
  EquipmentSlotState,
  EquipmentTier,
  NikkeEquipmentState,
  OverloadOptionType
} from "@/types/equipment";
import type { Nikke } from "@/types/nikke";
import type { OwnedNikkeState } from "@/types/owned";

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export const equipmentSlots: EquipmentSlot[] = ["helmet", "gloves", "chest", "boots"];

export const equipmentSlotLabels: Record<EquipmentSlot, string> = {
  helmet: "머리",
  gloves: "장갑",
  chest: "몸통",
  boots: "신발"
};

export const equipmentTierLabels: Record<EquipmentTier, string> = {
  none: "없음",
  T7: "T7",
  T8: "T8",
  T9: "T9",
  T9M: "T9 기업",
  OL: "오버로드",
  unknown: "미확인"
};

export const equipmentManufacturerBonusLabels: Record<EquipmentManufacturerBonus, string> = {
  none: "없음",
  matched: "기업 일치",
  unmatched: "기업 불일치",
  unknown: "미확인"
};

export const overloadOptionLabels: OverloadOptionType[] = [
  "공격력",
  "최대장탄수",
  "우월코드",
  "차지속도",
  "차지데미지",
  "명중률",
  "크리티컬확률",
  "크리티컬데미지",
  "방어력",
  "검수필요"
];

const tierScore: Record<EquipmentTier, number> = {
  none: 0,
  T7: 0.3,
  T8: 0.6,
  T9: 1,
  T9M: 1.4,
  OL: 2,
  unknown: 0
};

const isRecord = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === "object" && !Array.isArray(value);

const optionalNumber = (value: unknown) => (typeof value === "number" && Number.isFinite(value) ? value : undefined);

const normalizeTier = (value: unknown): EquipmentTier =>
  value === "none" || value === "T7" || value === "T8" || value === "T9" || value === "T9M" || value === "OL" || value === "unknown"
    ? value
    : "none";

const normalizeManufacturerBonus = (value: unknown): EquipmentManufacturerBonus =>
  value === "none" || value === "matched" || value === "unmatched" || value === "unknown" ? value : "none";

const normalizeOptions = (value: unknown): OverloadOptionType[] =>
  Array.isArray(value) ? value.filter((option): option is OverloadOptionType => overloadOptionLabels.includes(option as OverloadOptionType)) : [];

export const createDefaultEquipmentState = (nikkeId: string): NikkeEquipmentState => ({
  nikkeId,
  slots: {
    helmet: { slot: "helmet", tier: "none", manufacturerBonus: "none", isOverloaded: false, overloadOptions: [], memo: "" },
    gloves: { slot: "gloves", tier: "none", manufacturerBonus: "none", isOverloaded: false, overloadOptions: [], memo: "" },
    chest: { slot: "chest", tier: "none", manufacturerBonus: "none", isOverloaded: false, overloadOptions: [], memo: "" },
    boots: { slot: "boots", tier: "none", manufacturerBonus: "none", isOverloaded: false, overloadOptions: [], memo: "" }
  },
  equipmentMemo: ""
});

export const normalizeEquipmentState = (nikkeId: string, value: unknown): NikkeEquipmentState => {
  const item = isRecord(value) ? value : {};
  const rawSlots = isRecord(item.slots) ? item.slots : {};
  const defaults = createDefaultEquipmentState(nikkeId);

  return {
    nikkeId,
    slots: Object.fromEntries(
      equipmentSlots.map((slot) => {
        const rawSlot = isRecord(rawSlots[slot]) ? rawSlots[slot] : {};
        const normalized: EquipmentSlotState = {
          slot,
          tier: normalizeTier(rawSlot.tier),
          level: optionalNumber(rawSlot.level),
          manufacturerBonus: normalizeManufacturerBonus(rawSlot.manufacturerBonus),
          isOverloaded: Boolean(rawSlot.isOverloaded),
          overloadOptions: normalizeOptions(rawSlot.overloadOptions),
          memo: typeof rawSlot.memo === "string" ? rawSlot.memo : ""
        };
        return [slot, { ...defaults.slots[slot], ...normalized }];
      })
    ) as NikkeEquipmentState["slots"],
    equipmentMemo: typeof item.equipmentMemo === "string" ? item.equipmentMemo : ""
  };
};

export const getOverloadCount = (equipment?: NikkeEquipmentState) => {
  if (!equipment) return 0;
  return equipmentSlots.filter((slot) => equipment.slots[slot]?.isOverloaded || equipment.slots[slot]?.tier === "OL").length;
};

export const getAverageEquipmentLevel = (equipment?: NikkeEquipmentState) => {
  if (!equipment) return 0;
  const levels = equipmentSlots.map((slot) => equipment.slots[slot]?.level).filter((level): level is number => typeof level === "number");
  if (levels.length === 0) return 0;
  return Number((levels.reduce((total, level) => total + level, 0) / levels.length).toFixed(1));
};

export const getEquipmentTierScore = (equipment?: NikkeEquipmentState) => {
  if (!equipment) return 0;
  const total = equipmentSlots.reduce((score, slot) => score + tierScore[equipment.slots[slot]?.tier ?? "none"], 0);
  return Number(clamp(total, 0, 6).toFixed(1));
};

const hasRole = (nikke: Nikke, roles: string[]) => nikke.roles.some((role) => roles.includes(role));

export const getRecommendedOverloadOptions = (nikke: Nikke, contentType?: ContentType): OverloadOptionType[] => {
  const options: OverloadOptionType[] = [];
  const damageContent = contentType === "boss" || contentType === "soloRaid" || contentType === "unionRaid" || contentType === "interception";

  if (hasRole(nikke, ["메인딜러", "서브딜러", "보스딜"]) || nikke.classType === "화력형") {
    options.push("공격력", "최대장탄수");
  }
  if (damageContent) {
    options.push("우월코드");
  }
  if (nikke.weapon.includes("차지") || nikke.weapon.includes("저격") || nikke.weapon.includes("런처")) {
    options.push("차지속도", "차지데미지");
  }
  if (contentType === "arena") {
    options.push("방어력");
  }

  return Array.from(new Set(options.length > 0 ? options : ["공격력", "우월코드"]));
};

export const getOverloadOptionScore = (nikke: Nikke, equipment?: NikkeEquipmentState, contentType?: ContentType) => {
  if (!equipment) return 0;
  const recommended = getRecommendedOverloadOptions(nikke, contentType);
  const selected = new Set(equipmentSlots.flatMap((slot) => equipment.slots[slot]?.overloadOptions ?? []));
  if (selected.has("검수필요")) return 0;

  const matched = recommended.filter((option) => selected.has(option)).length;
  return Number(clamp(matched * 1.4, 0, 5).toFixed(1));
};

export const getEquipmentAdjustedScore = (nikke: Nikke, ownedState?: OwnedNikkeState, contentType?: ContentType) => {
  const equipment = ownedState?.equipment;
  const overloadCount = equipment ? getOverloadCount(equipment) : ownedState?.overloadCount ?? 0;
  const matchedManufacturerCount = equipment
    ? equipmentSlots.filter((slot) => equipment.slots[slot]?.manufacturerBonus === "matched").length
    : 0;
  const averageLevelBonus = clamp(getAverageEquipmentLevel(equipment) / 5, 0, 3);
  const overloadBonus = overloadCount * 1.4 + (overloadCount >= 4 ? 2 : 0);
  const manufacturerBonus = matchedManufacturerCount * 0.75;
  const optionBonus = getOverloadOptionScore(nikke, equipment, contentType);

  return Number(clamp(overloadBonus + manufacturerBonus + averageLevelBonus + optionBonus, 0, 10).toFixed(1));
};

export const getEquipmentWarnings = (nikke: Nikke, ownedState?: OwnedNikkeState) => {
  const warnings: string[] = [];
  const equipment = ownedState?.equipment;

  if (!equipment && !ownedState?.overloadCount) {
    warnings.push(`${nikke.name}: 장비 정보 미입력`);
    return warnings;
  }

  if (equipment) {
    const overloadedWithoutOptions = equipmentSlots.filter((slot) => {
      const slotState = equipment.slots[slot];
      return (slotState.isOverloaded || slotState.tier === "OL") && (slotState.overloadOptions?.length ?? 0) === 0;
    });
    if (overloadedWithoutOptions.length > 0) {
      warnings.push(`${nikke.name}: 오버로드 옵션 미입력 슬롯 ${overloadedWithoutOptions.length}개`);
    }
    if (equipmentSlots.some((slot) => equipment.slots[slot]?.overloadOptions?.includes("검수필요"))) {
      warnings.push(`${nikke.name}: 오버로드 옵션 검수 필요`);
    }
  }

  return warnings;
};

export const getEquipmentSummary = (nikke: Nikke, ownedState?: OwnedNikkeState, contentType?: ContentType) => {
  const equipment = ownedState?.equipment;
  const overloadCount = equipment ? getOverloadCount(equipment) : ownedState?.overloadCount ?? 0;
  const matchedManufacturerCount = equipment
    ? equipmentSlots.filter((slot) => equipment.slots[slot]?.manufacturerBonus === "matched").length
    : 0;
  const options = equipment ? Array.from(new Set(equipmentSlots.flatMap((slot) => equipment.slots[slot]?.overloadOptions ?? []))).filter((option) => option !== "검수필요") : [];
  const score = getEquipmentAdjustedScore(nikke, ownedState, contentType);

  if (!equipment && overloadCount === 0) {
    return `${nikke.name}: 장비 정보 미입력`;
  }

  return `${nikke.name}: 오버로드 ${overloadCount}/4, 평균 강화 ${getAverageEquipmentLevel(equipment)}, 기업 일치 ${matchedManufacturerCount}/4, 주요 옵션 ${
    options.length > 0 ? options.slice(0, 3).join("/") : "미입력"
  }, 장비 보정 +${score}`;
};
