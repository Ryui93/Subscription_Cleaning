import type { OverclockState } from "./equipment";

export type BondLevelData = {
  nikkeId: string;
  bondLevel?: number;
  bondMemo?: string;
};

export type SynchroDeviceData = {
  synchroLevel?: number;
  maxSynchroSlots?: number;
  usedSynchroSlots?: number;
  memo?: string;
};

export type RecyclingRoomData = {
  attackerLevel?: number;
  defenderLevel?: number;
  supporterLevel?: number;
  elysionLevel?: number;
  missilisLevel?: number;
  tetraLevel?: number;
  pilgrimLevel?: number;
  abnormalLevel?: number;
  memo?: string;
};

export type TacticsAcademyData = {
  currentClass?: string;
  completedLessons?: string[];
  memo?: string;
};

export type AccountGrowthState = {
  synchroDevice: SynchroDeviceData;
  recyclingRoom: RecyclingRoomData;
  tacticsAcademy: TacticsAcademyData;
  overclock?: OverclockState;
  bondLevels: Record<string, BondLevelData>;
  updatedAt?: string;
};
