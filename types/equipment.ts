export type EquipmentSlot = "helmet" | "gloves" | "chest" | "boots";

export type EquipmentTier = "none" | "T7" | "T8" | "T9" | "T9M" | "OL" | "unknown";

export type EquipmentManufacturerBonus = "none" | "matched" | "unmatched" | "unknown";

export type OverloadOptionType =
  | "공격력"
  | "방어력"
  | "최대장탄수"
  | "우월코드"
  | "차지속도"
  | "차지데미지"
  | "명중률"
  | "크리티컬확률"
  | "크리티컬데미지"
  | "검수필요";

export type EquipmentSlotState = {
  slot: EquipmentSlot;
  tier: EquipmentTier;
  level?: number;
  manufacturerBonus?: EquipmentManufacturerBonus;
  isOverloaded?: boolean;
  overloadOptions?: OverloadOptionType[];
  memo?: string;
};

export type NikkeEquipmentState = {
  nikkeId: string;
  slots: Record<EquipmentSlot, EquipmentSlotState>;
  equipmentMemo?: string;
};

export type OverclockState = {
  enabled?: boolean;
  level?: number;
  selectedOptions?: string[];
  memo?: string;
};
