import type { NikkeEquipmentState } from "./equipment";

export type OwnedNikkeState = {
  id: string;
  owned: boolean;
  level?: number;
  limitBreak?: number;
  coreEnhancement?: number;
  skill1?: number;
  skill2?: number;
  burstSkill?: number;
  overloadCount?: number;
  collectionOwned?: boolean;
  collectionLevel?: number;
  collectionMemo?: string;
  equipment?: NikkeEquipmentState;
  overclockMemo?: string;
  isFavorite?: boolean;
  memo?: string;
};
