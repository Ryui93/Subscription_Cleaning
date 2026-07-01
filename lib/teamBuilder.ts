import { contentRules } from "@/data/contentRules";
import { nikkes } from "@/data/nikkes";
import { contentLabels, type ContentType } from "@/types/content";
import type { Nikke, RoleId } from "@/types/nikke";
import { roleLabels } from "@/types/nikke";
import type { AccountGrowthState } from "@/types/accountGrowth";
import type { OwnedNikkeState } from "@/types/owned";
import type { TeamAlternative, TeamRecommendation, TeamSlots } from "@/types/team";
import { defaultAccountGrowthState } from "./accountGrowthDefaults";
import { getAccountGrowthAdjustedScore, getAccountGrowthReasons, getAccountGrowthWarnings, getSynchroScoreContext } from "./accountGrowthScoring";
import { getEquipmentAdjustedScore, getEquipmentSummary, getEquipmentWarnings } from "./equipmentUtils";
import { getTeamConfidence } from "./dataQuality";
import { getNikkeCompositeScore, scoreTeam } from "./scoring";

type TeamBuildOptions = {
  manufacturer?: string;
  accountGrowth?: AccountGrowthState;
  ownedStates?: OwnedNikkeState[];
};

export type TeamBuildIssue = {
  enoughMembers: boolean;
  missingBursts: string[];
  message: string;
};

const byComposite = (content: ContentType) => (a: Nikke, b: Nikke) =>
  getNikkeCompositeScore(b, content) - getNikkeCompositeScore(a, content);

const assignSlots = (team: Nikke[], content: ContentType): TeamSlots => {
  const sorted = [...team].sort(byComposite(content));
  const take = (predicate: (nikke: Nikke) => boolean, used: Set<string>) => {
    const found = sorted.find((nikke) => predicate(nikke) && !used.has(nikke.id)) ?? null;
    if (found) {
      used.add(found.id);
    }
    return found;
  };

  const used = new Set<string>();
  const burst1 = take((nikke) => nikke.burst === 1, used);
  const burst2 = take((nikke) => nikke.burst === 2, used);
  const burst3 = take((nikke) => nikke.burst === 3 && nikke.roles.includes("메인딜러"), used) ?? take((nikke) => nikke.burst === 3, used);
  const subDps = take((nikke) => nikke.roles.includes("서브딜러") || nikke.roles.includes("보스딜") || nikke.roles.includes("광역딜"), used);
  const support = take((nikke) => nikke.roles.includes("버퍼") || nikke.roles.includes("힐러") || nikke.roles.includes("실드"), used);

  return { burst1, burst2, burst3, subDps, support };
};

const getRoleCoverageReason = (nikke: Nikke, missingRoles: RoleId[]) => {
  const covered = nikke.roles.find((role) => missingRoles.includes(role));
  if (covered) {
    return `부족한 ${roleLabels[covered]} 역할 보강`;
  }

  if (nikke.burst === 1 || nikke.burst === 2) {
    return `${nikke.burst}버스트 대체 슬롯`;
  }

  return "딜러/서포터 대체 후보";
};

const getAlternatives = (
  owned: Nikke[],
  team: Nikke[],
  content: ContentType,
  missingRoles: RoleId[]
): TeamAlternative[] => {
  const teamIds = new Set(team.map((nikke) => nikke.id));
  const ownedAlternatives = owned
    .filter((nikke) => !teamIds.has(nikke.id))
    .sort(byComposite(content))
    .slice(0, 3)
    .map((nikke) => ({
      nikke,
      available: true,
      reason: getRoleCoverageReason(nikke, missingRoles)
    }));

  const ownedIds = new Set(owned.map((nikke) => nikke.id));
  const globalAlternatives = nikkes
    .filter((nikke) => !ownedIds.has(nikke.id) && !teamIds.has(nikke.id))
    .filter((nikke) => missingRoles.length === 0 || nikke.roles.some((role) => missingRoles.includes(role)))
    .sort(byComposite(content))
    .slice(0, Math.max(0, 4 - ownedAlternatives.length))
    .map((nikke) => ({
      nikke,
      available: false,
      reason: getRoleCoverageReason(nikke, missingRoles)
    }));

  return [...ownedAlternatives, ...globalAlternatives];
};

const getSkillOrder = (team: Nikke[]) =>
  team.map((nikke, index) => `${index + 1}. ${nikke.name}: ${nikke.skillPriority}`);

const getGearOrder = (team: Nikke[]) =>
  team.map((nikke, index) => `${index + 1}. ${nikke.name}: ${nikke.gearPriority} / 오버로드 ${nikke.overloadPriority}`);

const getCubeNotes = (team: Nikke[]) => team.map((nikke) => `${nikke.name}: ${nikke.cubeRecommendation}`);

const hasSameMembers = (a: Nikke[], b: Nikke[]) => {
  const left = a.map((nikke) => nikke.id).sort().join(",");
  const right = b.map((nikke) => nikke.id).sort().join(",");
  return left === right;
};

const getTeamKey = (team: Nikke[]) => team.map((nikke) => nikke.id).sort().join(",");

const getPersonalAdjustment = (
  nikke: Nikke,
  ownedStateById: Map<string, OwnedNikkeState>,
  accountGrowth: AccountGrowthState,
  content: ContentType
) => getAccountGrowthAdjustedScore(nikke, ownedStateById.get(nikke.id), accountGrowth, content) + getEquipmentAdjustedScore(nikke, ownedStateById.get(nikke.id), content);

const getAdjustedCompositeSorter = (
  content: ContentType,
  ownedStateById: Map<string, OwnedNikkeState>,
  accountGrowth: AccountGrowthState
) => {
  const scoreCache = new Map<string, number>();
  const getScore = (nikke: Nikke) => {
    const cached = scoreCache.get(nikke.id);
    if (cached !== undefined) return cached;
    const score = getNikkeCompositeScore(nikke, content) + getPersonalAdjustment(nikke, ownedStateById, accountGrowth, content);
    scoreCache.set(nikke.id, score);
    return score;
  };

  return (a: Nikke, b: Nikke) => getScore(b) - getScore(a);
};

const getTopPool = (sorted: Nikke[], predicate: (nikke: Nikke) => boolean, limit: number) => {
  const pool = sorted.filter(predicate).slice(0, limit);
  return pool.length > 0 ? pool : sorted.slice(0, Math.min(limit, sorted.length));
};

const buildBoundedCandidateTeams = (
  owned: Nikke[],
  content: ContentType,
  ownedStateById: Map<string, OwnedNikkeState>,
  accountGrowth: AccountGrowthState
) => {
  const sorted = [...owned].sort(getAdjustedCompositeSorter(content, ownedStateById, accountGrowth));
  const maxTeams = 650;
  const burst1Pool = getTopPool(sorted, (nikke) => nikke.burst === 1, 4);
  const burst2Pool = getTopPool(sorted, (nikke) => nikke.burst === 2, 4);
  const burst3Pool = getTopPool(sorted, (nikke) => nikke.burst === 3, 5);
  const supportPool = getTopPool(
    sorted,
    (nikke) => nikke.roles.includes("버퍼") || nikke.roles.includes("힐러") || nikke.roles.includes("실드") || nikke.roles.includes("쿨감"),
    5
  );
  const flexPool = sorted.slice(0, 8);
  const candidateMap = new Map<string, Nikke[]>();

  const addTeam = (team: Nikke[]) => {
    const unique = Array.from(new Map(team.map((nikke) => [nikke.id, nikke])).values());
    if (unique.length !== 5) {
      return;
    }

    candidateMap.set(getTeamKey(unique), unique);
  };

  for (const b1 of burst1Pool) {
    for (const b2 of burst2Pool) {
      for (const b3 of burst3Pool) {
        for (const support of supportPool) {
          for (const flex of flexPool) {
            addTeam([b1, b2, b3, support, flex]);
            if (candidateMap.size >= maxTeams) {
              return Array.from(candidateMap.values());
            }
          }
        }
      }
    }
  }

  for (let index = 0; index <= sorted.length - 5 && candidateMap.size < maxTeams; index += 1) {
    addTeam(sorted.slice(index, index + 5));
  }

  sorted.slice(0, 15).forEach((anchor) => {
    if (candidateMap.size >= maxTeams) return;
    addTeam([anchor, ...sorted.filter((nikke) => nikke.id !== anchor.id).slice(0, 4)]);
  });

  return Array.from(candidateMap.values());
};

const getRecommendationTitle = (content: ContentType, index: number, team: Nikke[]) => {
  const prefix = index === 0 ? "" : `${index + 1}순위 `;
  const hasHealer = team.some((nikke) => nikke.roles.includes("힐러") || nikke.roles.includes("실드") || nikke.roles.includes("유지력"));
  const hasArenaBurst = team.some((nikke) => nikke.roles.includes("버스트충전") || nikke.roles.includes("선버스트"));

  if (content === "story") return `${prefix}${hasHealer ? "안정형" : "진격형"} 스토리 스쿼드`;
  if (content === "boss" || content === "interception") return `${prefix}보스전 집중 화력 스쿼드`;
  if (content === "arena") return `${prefix}${hasArenaBurst ? "아레나 선버스트" : "아레나 압박"} 스쿼드`;
  if (content === "soloRaid") return `${prefix}솔로레이드 범용 스쿼드`;
  if (content === "unionRaid") return `${prefix}유니온레이드 대체 대응 스쿼드`;
  return `${prefix}${contentLabels[content]} 범용 스쿼드`;
};

export const analyzeRosterForTeamBuild = (owned: Nikke[], options: TeamBuildOptions = {}): TeamBuildIssue => {
  const scopedOwned =
    options.manufacturer && options.manufacturer !== "all"
      ? owned.filter((nikke) => nikke.manufacturer === options.manufacturer)
      : owned;
  const missingBursts = [
    scopedOwned.some((nikke) => nikke.burst === 1) ? "" : "B1",
    scopedOwned.some((nikke) => nikke.burst === 2) ? "" : "B2",
    scopedOwned.some((nikke) => nikke.burst === 3) ? "" : "B3"
  ].filter(Boolean);

  if (scopedOwned.length < 5) {
    return {
      enoughMembers: false,
      missingBursts,
      message: `5인 조합에는 최소 5명이 필요합니다. 현재 ${scopedOwned.length}명입니다.`
    };
  }

  if (missingBursts.length > 0) {
    return {
      enoughMembers: true,
      missingBursts,
      message: `버스트 루프가 불안정합니다. 부족한 단계: ${missingBursts.join(", ")}`
    };
  }

  return {
    enoughMembers: true,
    missingBursts: [],
    message: "추천 가능한 로스터입니다."
  };
};

// TODO: 솔로레이드 5덱 자동 분배 단계에서 이미 사용한 니케를 제외하며 여러 조합을 생성한다.
export const buildSoloRaidDeckDistribution = () => [];

export const buildTeamRecommendations = (
  owned: Nikke[],
  content: ContentType,
  options: TeamBuildOptions = {}
): TeamRecommendation[] => {
  const scopedOwned =
    options.manufacturer && options.manufacturer !== "all"
      ? owned.filter((nikke) => nikke.manufacturer === options.manufacturer)
      : owned;

  if (scopedOwned.length < 5) {
    return [];
  }

  const accountGrowth = options.accountGrowth ?? defaultAccountGrowthState;
  const ownedStateById = new Map((options.ownedStates ?? []).map((state) => [state.id, state]));
  const scoredTeams = buildBoundedCandidateTeams(scopedOwned, content, ownedStateById, accountGrowth).map((team) => {
    const score = scoreTeam(team, content).score;
    const accountGrowthBonus = team.reduce(
      (total, nikke) => total + getAccountGrowthAdjustedScore(nikke, ownedStateById.get(nikke.id), accountGrowth, content),
      0
    );
    const equipmentBonus = team.reduce(
      (total, nikke) => total + getEquipmentAdjustedScore(nikke, ownedStateById.get(nikke.id), content),
      0
    );
    return { team, score: Math.min(100, score + accountGrowthBonus + equipmentBonus) };
  });

  const picked: Nikke[][] = [];

  return scoredTeams
    .sort((a, b) => b.score - a.score)
    .filter(({ team }) => {
      if (picked.some((existing) => hasSameMembers(existing, team))) {
        return false;
      }

      picked.push(team);
      return true;
    })
    .slice(0, 3)
    .map(({ team, score }, index) => {
      const breakdown = scoreTeam(team, content);
      const growthOrder = [...team].sort(byComposite(content));
      const synchro = getSynchroScoreContext(accountGrowth);
      const accountGrowthNotes = [
        ...(synchro.synchroLevel ? [`싱크로 레벨: ${synchro.synchroLevel}`] : []),
        ...growthOrder.flatMap((nikke) =>
          getAccountGrowthReasons(nikke, ownedStateById.get(nikke.id), accountGrowth, content)
            .filter((reason) => reason !== "계정 성장 보정 없음")
            .map((reason) => `${nikke.name}: ${reason}`)
        )
      ];

      return {
        id: `${content}-${index + 1}`,
        name: getRecommendationTitle(content, index, team),
        content,
        score: Math.round(score),
        scoreDetails: { ...breakdown.scoreDetails, finalScore: Math.round(score) },
        confidence: getTeamConfidence(team),
        members: team,
        slots: assignSlots(team, content),
        reasons: breakdown.reasons,
        warnings: breakdown.warnings,
        accountGrowthNotes,
        accountGrowthWarnings: Array.from(
          new Set(growthOrder.flatMap((nikke) => getAccountGrowthWarnings(nikke, ownedStateById.get(nikke.id), accountGrowth)))
        ),
        equipmentNotes: growthOrder.map((nikke) => getEquipmentSummary(nikke, ownedStateById.get(nikke.id), content)),
        equipmentWarnings: [
          ...Array.from(new Set(growthOrder.flatMap((nikke) => getEquipmentWarnings(nikke, ownedStateById.get(nikke.id))))),
          ...(accountGrowth.overclock?.enabled
            ? [
                `오버클럭 조건 반영: 고난도 조건에서 생존/유지력 역할 가치가 높아질 수 있습니다. 현재 레벨 ${
                  accountGrowth.overclock.level ?? "미입력"
                }, 조건 ${accountGrowth.overclock.selectedOptions?.join(" / ") || "메모 기준"}`
              ]
            : [])
        ],
        missingRoles: breakdown.missingRoles,
        alternatives: getAlternatives(scopedOwned, team, content, breakdown.missingRoles),
        growthOrder,
        skillOrder: getSkillOrder(growthOrder),
        gearOrder: getGearOrder(growthOrder),
        cubeNotes: getCubeNotes(growthOrder),
        operationNotes: contentRules[content].operationNotes
      };
    });
};
