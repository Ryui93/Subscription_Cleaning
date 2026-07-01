import type { ContentType } from "./content";
import type { Nikke, RoleId } from "./nikke";
import type { TeamConfidence } from "@/lib/dataQuality";

export type TeamSlotKey = "burst1" | "burst2" | "burst3" | "subDps" | "support";

export type TeamSlots = Record<TeamSlotKey, Nikke | null>;

export type TeamAlternative = {
  nikke: Nikke;
  available: boolean;
  reason: string;
};

export type TeamRecommendation = {
  id: string;
  name: string;
  content: ContentType;
  score: number;
  scoreDetails: {
    baseAverage: number;
    roleScore: number;
    roleFitScore: number;
    teamSynergyScore: number;
    sourcePenalty: number;
    finalScore: number;
  };
  confidence: TeamConfidence;
  members: Nikke[];
  slots: TeamSlots;
  reasons: string[];
  warnings: string[];
  accountGrowthNotes: string[];
  accountGrowthWarnings: string[];
  equipmentNotes: string[];
  equipmentWarnings: string[];
  missingRoles: RoleId[];
  alternatives: TeamAlternative[];
  growthOrder: Nikke[];
  skillOrder: string[];
  gearOrder: string[];
  cubeNotes: string[];
  operationNotes: string[];
};

export type GrowthPriorityItem = {
  nikke: Nikke;
  score: number;
  priority: "최우선" | "높음" | "보통" | "낮음";
  reasons: string[];
  skillPlan: string;
  gearPlan: string;
  overloadPlan: string;
  cubePlan: string;
  collectionPlan: string;
};

export type GrowthRecommendation = {
  overall: GrowthPriorityItem[];
  byContent: Record<ContentType, GrowthPriorityItem[]>;
  skill: GrowthPriorityItem[];
  overload: GrowthPriorityItem[];
  cube: GrowthPriorityItem[];
  collection: GrowthPriorityItem[];
  equipment: EquipmentGrowthRecommendation[];
  overloadEquipment: EquipmentGrowthRecommendation[];
  overloadOptionReview: EquipmentGrowthRecommendation[];
};

export type EquipmentGrowthRecommendation = {
  nikke: Nikke;
  priority: "최우선" | "높음" | "보통" | "낮음";
  category: "장비 강화" | "오버로드" | "옵션 검수";
  score: number;
  reasons: string[];
  currentStateSummary: string;
  recommendedAction: string;
};
