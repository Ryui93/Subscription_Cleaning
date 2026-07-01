import type { AccountGrowthState } from "@/types/accountGrowth";

export const defaultAccountGrowthState: AccountGrowthState = {
  synchroDevice: {
    synchroLevel: undefined,
    maxSynchroSlots: undefined,
    usedSynchroSlots: undefined,
    memo: ""
  },
  recyclingRoom: {
    attackerLevel: undefined,
    defenderLevel: undefined,
    supporterLevel: undefined,
    elysionLevel: undefined,
    missilisLevel: undefined,
    tetraLevel: undefined,
    pilgrimLevel: undefined,
    abnormalLevel: undefined,
    memo: ""
  },
  tacticsAcademy: {
    currentClass: "",
    completedLessons: [],
    memo: ""
  },
  overclock: {
    enabled: false,
    level: undefined,
    selectedOptions: [],
    memo: ""
  },
  bondLevels: {},
  updatedAt: undefined
};
