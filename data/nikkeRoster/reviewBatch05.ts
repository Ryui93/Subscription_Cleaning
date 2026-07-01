import type { ContentType } from "@/types/content";
import type { Nikke } from "@/types/nikke";
import { nikkeSources } from "./common";

type Batch05Patch = Partial<
  Pick<
    Nikke,
    | "aliases"
    | "roles"
    | "goodFor"
    | "skillPriority"
    | "gearPriority"
    | "overloadPriority"
    | "cubeRecommendation"
    | "collectionPriority"
    | "notes"
    | "contentScores"
    | "sourceStatus"
    | "lastReviewedAt"
    | "sourceUrls"
  >
>;

const reviewedAt = "2026-07-01";
const tierListSource = "https://www.prydwen.gg/nikke/tier-list";

const score = (
  story: number,
  boss: number,
  tower: number,
  arena: number,
  soloRaid: number,
  unionRaid: number,
  interception: number
): Record<ContentType, number> => ({ story, boss, tower, arena, soloRaid, unionRaid, interception });

const commonSources = [nikkeSources.prydwenCharacters, tierListSource];

export const batch05ReviewPatches: Record<string, Batch05Patch> = {
  crown: {
    aliases: ["크라운", "crown", "필그림 왕관"],
    roles: ["공버프", "실드", "도발", "탱커", "유지력", "범용", "필그림"],
    goodFor: ["story", "boss", "tower", "soloRaid", "unionRaid", "interception", "arena"],
    skillPriority: "1스킬 > 버스트 > 2스킬. 범용 B2 축으로 쓰면 세 스킬 모두 투자 가치가 높습니다.",
    gearPriority: "주력 범용 서포터라 생존과 버프 유지가 중요합니다. 자주 쓰는 계정이면 장비 투자 우선순위가 높습니다.",
    overloadPriority: "생존 안정성과 버프 유지를 우선 확인하고, 여유가 있으면 장탄/명중 보조 옵션을 봅니다.",
    cubeRecommendation: "생존 보조 큐브 또는 재장전/장탄 보조 큐브를 우선 검토합니다.",
    collectionPriority: "스토리와 레이드 모두 쓰는 핵심 B2라 소장품 투자 우선순위가 높습니다.",
    notes: "범용성이 높은 B2 보호/버프 축입니다. 스토리, 보스전, 레이드에서 조합 안정성을 크게 올려 추천 알고리즘 우선도를 높게 둡니다.",
    contentScores: score(97, 95, 96, 82, 95, 94, 94),
    sourceStatus: "communityChecked",
    sourceUrls: commonSources
  },
  "scarlet-black-shadow": {
    aliases: ["흑련", "홍련흑영", "scarlet black shadow", "sbs"],
    roles: ["메인딜러", "보스딜", "지속딜", "광역딜", "풍압딜", "필그림", "고투자"],
    goodFor: ["story", "boss", "tower", "soloRaid", "unionRaid", "interception"],
    skillPriority: "버스트 > 1스킬 > 2스킬. 메인 딜러로 쓸수록 버스트와 1스킬 투자가 중요합니다.",
    gearPriority: "주력 딜러 장비를 우선 배정합니다. 공격 장비와 기업 장비 투자의 효율이 높습니다.",
    overloadPriority: "공격력, 우월 코드, 장탄/명중 계열을 우선 검토합니다.",
    cubeRecommendation: "장탄 보조 또는 재장전 보조 큐브를 우선 검토합니다.",
    collectionPriority: "보스/레이드 주력 딜러로 사용한다면 높은 우선순위로 투자합니다.",
    notes: "보스전과 레이드에서 강한 지속 딜러입니다. 고투자 효율이 높아 성장 추천에서 메인 딜러로 우선 반영합니다.",
    contentScores: score(95, 96, 94, 68, 97, 96, 94),
    sourceStatus: "communityChecked",
    sourceUrls: commonSources
  },
  tia: {
    aliases: ["티아", "tia", "나가티아"],
    roles: ["도발", "실드", "탱커", "유지력", "버스트충전"],
    goodFor: ["story", "boss", "tower", "arena", "soloRaid", "unionRaid"],
    skillPriority: "1스킬 > 2스킬 > 버스트. 보호막과 도발 안정성을 먼저 봅니다.",
    gearPriority: "생존 장비를 우선 맞추고, 나가와 함께 쓸 때는 전투 유지력을 우선합니다.",
    overloadPriority: "체력/방어 생존 옵션과 명중 보조를 우선 검토합니다.",
    cubeRecommendation: "생존 보조 큐브를 우선 사용하고, 버스트 회전이 필요하면 충전 보조를 검토합니다.",
    collectionPriority: "나가 조합을 자주 쓰면 중상 이상 투자 가치가 있습니다.",
    notes: "도발과 실드로 조합 안정성을 보강하는 B1 방어형입니다. 나가와 함께 쓰는 구성에서 가치가 특히 커집니다.",
    contentScores: score(86, 82, 86, 80, 78, 78, 80),
    sourceStatus: "communityChecked",
    sourceUrls: commonSources
  },
  drake: {
    aliases: ["드레이크", "drake"],
    roles: ["서브딜러", "공버프", "보스딜", "지속딜"],
    goodFor: ["story", "boss", "interception", "tower"],
    skillPriority: "1스킬 > 버스트 > 2스킬. 샷건 화력과 보조 버프를 먼저 봅니다.",
    gearPriority: "보조 딜러로 쓰면 공격 장비를 중간 우선순위로 투자합니다.",
    overloadPriority: "공격력, 명중, 장탄 옵션을 우선 검토합니다.",
    cubeRecommendation: "명중/재장전 보조 큐브를 우선 검토합니다.",
    collectionPriority: "샷건 보스전 대체 딜러로 자주 쓰면 중간 우선순위입니다.",
    notes: "샷건 딜과 공격 보조를 함께 제공하는 B3 서브 딜러입니다. 보스전 대체 딜러로 계산되도록 역할을 정리했습니다.",
    contentScores: score(74, 76, 74, 58, 76, 75, 80),
    sourceStatus: "communityChecked",
    sourceUrls: commonSources
  },
  laplace: {
    aliases: ["라플라스", "laplace"],
    roles: ["메인딜러", "보스딜", "파츠딜", "관통딜"],
    goodFor: ["boss", "interception", "tower", "soloRaid", "unionRaid"],
    skillPriority: "버스트 > 1스킬 > 2스킬. 파츠가 있는 보스전에 쓸 때 버스트 투자가 우선입니다.",
    gearPriority: "파츠 딜러로 기용할 때 공격 장비 투자 효율이 있습니다.",
    overloadPriority: "공격력, 우월 코드, 차지/명중 관련 옵션을 검토합니다.",
    cubeRecommendation: "차지 보조 또는 재장전 보조 큐브를 상황에 따라 사용합니다.",
    collectionPriority: "보스 파츠 대체 딜러로 쓰면 중간 이상 투자 가치가 있습니다.",
    notes: "파츠가 있는 보스전에서 가치가 있는 B3 딜러입니다. 스토리보다는 보스/요격 점수에 더 반영했습니다.",
    contentScores: score(74, 82, 78, 54, 82, 82, 86),
    sourceStatus: "communityChecked",
    sourceUrls: commonSources
  },
  "d-killer-wife": {
    aliases: ["킬러 와이프 D", "킬러와이프", "DKW", "D Killer Wife"],
    roles: ["쿨감", "공버프", "차지버프", "버퍼", "범용"],
    goodFor: ["boss", "soloRaid", "unionRaid", "interception", "story"],
    skillPriority: "버스트 > 2스킬 > 1스킬. 쿨감과 차지 딜러 보조 성능을 우선합니다.",
    gearPriority: "B1 쿨감 서포터라 생존과 스킬 레벨 투자가 장비보다 우선입니다.",
    overloadPriority: "생존 안정성과 명중 보조 옵션을 우선 검토합니다. 딜 옵션 우선도는 낮습니다.",
    cubeRecommendation: "생존 보조 큐브 또는 재장전 보조 큐브를 사용합니다.",
    collectionPriority: "레이드 쿨감 축으로 자주 쓰면 높은 우선순위입니다.",
    notes: "쿨감과 공격 보조를 제공하는 B1 지원형입니다. 보스전과 레이드 추천에서 B1 핵심 축으로 반영합니다.",
    contentScores: score(84, 91, 84, 62, 93, 92, 90),
    sourceStatus: "communityChecked",
    sourceUrls: commonSources
  },
  biscuit: {
    aliases: ["비스킷", "biscuit", "강아지"],
    roles: ["무적", "버퍼", "힐러", "유지력", "아레나방어"],
    goodFor: ["arena", "story", "tower"],
    skillPriority: "2스킬 > 버스트 > 1스킬. 아레나/생존 보조 용도라면 보호 성능을 우선합니다.",
    gearPriority: "아레나 방어와 생존 보조 목적이면 생존 장비를 우선합니다.",
    overloadPriority: "생존 옵션 중심으로 검토합니다. 딜 옵션 우선도는 낮습니다.",
    cubeRecommendation: "생존 보조 큐브가 무난합니다.",
    collectionPriority: "아레나에서 자주 쓰면 중간 이상, PVE만 보면 낮게 둡니다.",
    notes: "아레나 생존 보조와 일부 스토리 안정화에 쓰이는 B2 지원형입니다. 범용 딜 추천보다는 방어/유지력 역할로 반영합니다.",
    contentScores: score(72, 58, 70, 86, 56, 56, 56),
    sourceStatus: "communityChecked",
    sourceUrls: commonSources
  },
  marciana: {
    aliases: ["마르차나", "marciana", "학교 힐러"],
    roles: ["힐러", "회복", "실드", "유지력"],
    goodFor: ["story", "tower", "interception", "boss"],
    skillPriority: "1스킬 > 버스트 > 2스킬. 회복 안정성을 먼저 올립니다.",
    gearPriority: "20초 B2 힐러라 생존 장비와 스킬 투자가 우선입니다.",
    overloadPriority: "생존 옵션을 우선 검토합니다.",
    cubeRecommendation: "생존 보조 큐브를 우선 사용합니다.",
    collectionPriority: "초중반 안정화 용도로 자주 쓰면 중간 우선순위입니다.",
    notes: "20초 B2 힐러라 보유 풀이 좁을 때 조합 안정성을 크게 올립니다. 추천에서는 유지력 보강 역할로 반영합니다.",
    contentScores: score(80, 72, 78, 66, 72, 72, 76),
    sourceStatus: "communityChecked",
    sourceUrls: commonSources
  },
  elegg: {
    aliases: ["일레그", "elegg"],
    roles: ["전격딜", "버퍼", "저지보조", "디버퍼"],
    goodFor: ["boss", "soloRaid", "interception", "unionRaid"],
    skillPriority: "1스킬 > 버스트 > 2스킬. 전격 보조와 저지 기여를 먼저 봅니다.",
    gearPriority: "전격 파티 보조로 쓰면 스킬 투자가 장비보다 우선입니다.",
    overloadPriority: "생존과 명중 보조 옵션을 우선 검토합니다.",
    cubeRecommendation: "재장전 보조 또는 생존 보조 큐브를 사용합니다.",
    collectionPriority: "전격 보조 역할로 자주 쓰면 중간 우선순위입니다.",
    notes: "전격 파티와 저지 보조에 기여하는 B2 지원형입니다. 레이드/요격 쪽 보조 점수를 기존보다 선명하게 반영했습니다.",
    contentScores: score(74, 82, 76, 56, 84, 82, 82),
    sourceStatus: "communityChecked",
    sourceUrls: commonSources
  },
  "2b": {
    aliases: ["2B", "요르하 2호 B형", "니어 2B"],
    roles: ["메인딜러", "보스딜", "지속딜", "콜라보", "고투자"],
    goodFor: ["boss", "soloRaid", "unionRaid", "story"],
    skillPriority: "버스트 > 1스킬 > 2스킬. 주력 딜러로 쓰면 버스트 투자가 우선입니다.",
    gearPriority: "보스전 주력 딜러로 쓸 때 공격 장비 투자 가치가 있습니다.",
    overloadPriority: "공격력, 우월 코드, 장탄/명중 옵션을 우선 검토합니다.",
    cubeRecommendation: "장탄 보조 또는 재장전 보조 큐브를 검토합니다.",
    collectionPriority: "콜라보 보유 계정에서 주력 딜러로 쓰면 중상 우선순위입니다.",
    notes: "NieR 콜라보 B3 지속 딜러입니다. 현재 접근성은 낮지만 보유 계정에서는 보스전 딜러 후보로 반영합니다.",
    contentScores: score(78, 84, 78, 58, 86, 84, 80),
    sourceStatus: "communityChecked",
    sourceUrls: commonSources
  },
  a2: {
    aliases: ["A2", "니어 A2"],
    roles: ["메인딜러", "광역딜", "보스딜", "콜라보"],
    goodFor: ["story", "boss", "soloRaid", "tower"],
    skillPriority: "버스트 > 1스킬 > 2스킬. 광역 딜러로 쓸 때 버스트 투자를 먼저 봅니다.",
    gearPriority: "주력 딜러로 쓰면 공격 장비를 우선합니다.",
    overloadPriority: "공격력, 우월 코드, 장탄/명중 옵션을 검토합니다.",
    cubeRecommendation: "재장전 보조 또는 장탄 보조 큐브를 검토합니다.",
    collectionPriority: "스토리/광역 딜러로 쓰는 계정이면 중상 우선순위입니다.",
    notes: "광역 처리와 보스 보조가 가능한 NieR 콜라보 B3 딜러입니다. 보유자 한정 대체 딜러로 점수를 정리했습니다.",
    contentScores: score(84, 84, 82, 60, 86, 82, 82),
    sourceStatus: "communityChecked",
    sourceUrls: commonSources
  },
  helm: {
    aliases: ["헬름", "helm"],
    roles: ["서브딜러", "힐러", "공버프", "보스딜", "유지력"],
    goodFor: ["boss", "interception", "tower"],
    skillPriority: "버스트 > 1스킬 > 2스킬. 회복과 공격 보조를 함께 봅니다.",
    gearPriority: "보스전 보조 딜러로 쓰면 공격 장비를 중간 우선순위로 투자합니다.",
    overloadPriority: "공격력, 우월 코드, 명중 옵션을 검토합니다.",
    cubeRecommendation: "차지 보조 또는 재장전 보조 큐브를 검토합니다.",
    collectionPriority: "보스전 대체 힐/딜 역할로 자주 쓰면 중간 우선순위입니다.",
    notes: "공격 보조와 회복을 겸하는 B3 서브 딜러입니다. 보스전 안정화와 딜 보조 쪽으로 추천 가중치를 조정했습니다.",
    contentScores: score(74, 80, 76, 54, 78, 78, 82),
    sourceStatus: "communityChecked",
    sourceUrls: commonSources
  },
  pepper: {
    aliases: ["페퍼", "pepper"],
    roles: ["힐러", "회복", "서브딜러", "유지력", "뉴비추천"],
    goodFor: ["story", "tower", "interception"],
    skillPriority: "1스킬 > 버스트 > 2스킬. 초중반 힐 안정성을 먼저 봅니다.",
    gearPriority: "초중반 주력 힐러라면 생존과 명중 보조를 우선합니다.",
    overloadPriority: "생존 옵션을 우선하고, 딜 보조를 원하면 공격/명중을 검토합니다.",
    cubeRecommendation: "재장전 보조 또는 생존 보조 큐브를 사용합니다.",
    collectionPriority: "초중반 주력 힐러로 쓰면 중간 우선순위입니다.",
    notes: "B1 힐러 겸 보조 딜러입니다. 초중반 진행 안정성을 올리는 역할로 성장 추천에 반영합니다.",
    contentScores: score(76, 68, 74, 56, 62, 62, 70),
    sourceStatus: "communityChecked",
    sourceUrls: commonSources
  },
  novel: {
    aliases: ["노벨", "novel"],
    roles: ["방깎", "받피증", "디버퍼", "보스딜"],
    goodFor: ["boss", "soloRaid", "unionRaid", "interception"],
    skillPriority: "버스트 > 1스킬 > 2스킬. 보스 디버프 기여를 우선합니다.",
    gearPriority: "디버퍼라 장비보다 스킬 투자 우선도가 높습니다.",
    overloadPriority: "생존과 명중 보조 옵션을 우선 검토합니다.",
    cubeRecommendation: "생존 보조 또는 재장전 보조 큐브를 사용합니다.",
    collectionPriority: "보스 디버퍼 대체재로 쓰면 중간 우선순위입니다.",
    notes: "보스전 디버프용 B2 방어형입니다. 범용성은 낮지만 레이드 대체 디버퍼로 추천에 반영합니다.",
    contentScores: score(68, 82, 70, 58, 82, 83, 80),
    sourceStatus: "communityChecked",
    sourceUrls: commonSources
  },
  poli: {
    aliases: ["폴리", "poli"],
    roles: ["실드", "공버프", "탱커", "버퍼", "유지력"],
    goodFor: ["story", "arena", "tower", "boss"],
    skillPriority: "버스트 > 1스킬 > 2스킬. 실드와 공격 보조를 먼저 봅니다.",
    gearPriority: "보호형 B2로 쓰면 생존 장비를 우선합니다.",
    overloadPriority: "생존 옵션과 명중 보조를 우선 검토합니다.",
    cubeRecommendation: "생존 보조 큐브가 무난합니다.",
    collectionPriority: "보유 풀이 좁을 때 B2 버퍼로 쓰면 중간 우선순위입니다.",
    notes: "실드와 공격 보조를 제공하는 B2 방어형입니다. 스토리/아레나 안정화 역할로 반영합니다.",
    contentScores: score(78, 70, 78, 76, 68, 68, 70),
    sourceStatus: "communityChecked",
    sourceUrls: commonSources
  },
  mast: {
    aliases: ["마스트", "mast"],
    roles: ["크리버프", "공버프", "버퍼"],
    goodFor: ["boss", "soloRaid", "unionRaid"],
    skillPriority: "1스킬 > 버스트 > 2스킬. 크리/공격 보조 효율을 먼저 봅니다.",
    gearPriority: "버퍼라 스킬 투자가 우선이며 장비는 생존 위주로 맞춥니다.",
    overloadPriority: "생존 안정성과 명중 보조 옵션을 검토합니다.",
    cubeRecommendation: "생존 보조 또는 재장전 보조 큐브를 사용합니다.",
    collectionPriority: "특정 보스 조합에서 쓰면 중간 우선순위입니다.",
    notes: "크리티컬 기반 조합을 보조하는 B2 버퍼입니다. 레이드 보조 역할로 점수를 정리했습니다.",
    contentScores: score(70, 78, 72, 56, 80, 80, 76),
    sourceStatus: "communityChecked",
    sourceUrls: commonSources
  },
  "privaty-unkind-maid": {
    aliases: ["메프바티", "메이드 프리바티", "maid privaty", "언카인드 메이드"],
    roles: ["메인딜러", "보스딜", "지속딜", "고투자"],
    goodFor: ["boss", "soloRaid", "interception", "unionRaid"],
    skillPriority: "버스트 > 1스킬 > 2스킬. 보스 딜러로 쓰면 딜 스킬을 우선합니다.",
    gearPriority: "주력 보스 딜러로 쓰면 공격 장비 투자 우선순위가 높습니다.",
    overloadPriority: "공격력, 우월 코드, 장탄/명중 옵션을 우선 검토합니다.",
    cubeRecommendation: "장탄 보조 또는 재장전 보조 큐브를 검토합니다.",
    collectionPriority: "보스 딜러로 자주 쓰면 높은 우선순위입니다.",
    notes: "보스전 중심의 B3 딜러입니다. 성장 추천에서 오버로드/소장품 투자 후보로 잘 올라오도록 보정했습니다.",
    contentScores: score(78, 88, 78, 60, 90, 86, 88),
    sourceStatus: "communityChecked",
    sourceUrls: commonSources
  },
  "alice-wonderland-bunny": {
    aliases: ["바니 앨리스", "앨바니", "alice bunny", "원더랜드 바니"],
    roles: ["힐러", "회복", "장탄버프", "버스트충전", "유지력", "버퍼"],
    goodFor: ["story", "boss", "tower", "soloRaid", "unionRaid"],
    skillPriority: "1스킬 > 버스트 > 2스킬. 유지력과 장탄 보조를 먼저 봅니다.",
    gearPriority: "지원형이라 생존 장비와 스킬 투자를 우선합니다.",
    overloadPriority: "생존 안정성과 명중 보조 옵션을 검토합니다.",
    cubeRecommendation: "생존 보조 또는 재장전 보조 큐브를 사용합니다.",
    collectionPriority: "B1 지원 축으로 자주 쓰면 중상 우선순위입니다.",
    notes: "회복과 장탄 보조를 제공하는 B1 지원형입니다. 스토리와 보스전 안정화에 기여하도록 역할을 보강했습니다.",
    contentScores: score(82, 80, 82, 64, 82, 80, 78),
    sourceStatus: "communityChecked",
    sourceUrls: commonSources
  },
  "anchor-innocent-maid": {
    aliases: ["메이드 앵커", "앵커 메이드", "maid anchor", "이노센트 메이드"],
    roles: ["버퍼", "유지력", "힐러", "공버프"],
    goodFor: ["boss", "soloRaid", "unionRaid", "arena", "story"],
    skillPriority: "1스킬 > 버스트 > 2스킬. 지원 효과 안정성을 우선합니다.",
    gearPriority: "B2 지원형이라 스킬 투자와 생존 장비를 우선합니다.",
    overloadPriority: "생존 안정성과 명중 보조 옵션을 검토합니다.",
    cubeRecommendation: "생존 보조 또는 재장전 보조 큐브를 사용합니다.",
    collectionPriority: "레이드 보조로 자주 쓰면 중상 우선순위입니다.",
    notes: "B2 지원형으로 보스전과 레이드 보조 가치가 있습니다. 최신 조합 검수 여지는 남기되 추천 점수를 상향 정리했습니다.",
    contentScores: score(80, 84, 80, 72, 86, 84, 82),
    sourceStatus: "communityChecked",
    sourceUrls: commonSources
  },
  "anis-star": {
    aliases: ["스타 아니스", "아니스 스타", "anis star"],
    roles: ["탱커", "생존", "버스트충전", "전격딜"],
    goodFor: ["story", "boss", "soloRaid", "unionRaid", "tower"],
    skillPriority: "1스킬 > 버스트 > 2스킬. 안정성과 버스트 회전을 먼저 봅니다.",
    gearPriority: "생존 장비를 우선하고, 보스 조합에서 쓰면 스킬 투자를 병행합니다.",
    overloadPriority: "생존 옵션과 명중 보조를 우선 검토합니다.",
    cubeRecommendation: "생존 보조 또는 버스트 충전 보조 큐브를 검토합니다.",
    collectionPriority: "핵심 B1로 쓰는 경우 중상 이상 투자 가치가 있습니다.",
    notes: "B1 안정화와 전격 보조를 겸하는 캐릭터입니다. 스토리 상위권 참고를 반영하되 최신성 때문에 communityChecked로 둡니다.",
    contentScores: score(94, 88, 92, 74, 88, 86, 86),
    sourceStatus: "communityChecked",
    sourceUrls: commonSources
  },
  bready: {
    aliases: ["브레디", "bready"],
    roles: ["서브딜러", "보스딜", "지속딜"],
    goodFor: ["boss", "soloRaid", "unionRaid", "story"],
    skillPriority: "버스트 > 1스킬 > 2스킬. 보스 딜러로 쓰면 딜 스킬 우선입니다.",
    gearPriority: "보스 보조 딜러로 쓸 때 공격 장비를 투자합니다.",
    overloadPriority: "공격력, 우월 코드, 장탄/명중 옵션을 검토합니다.",
    cubeRecommendation: "장탄 보조 또는 재장전 보조 큐브를 검토합니다.",
    collectionPriority: "보스 딜러 후보로 쓰면 중상 우선순위입니다.",
    notes: "보스전 보조 딜러로 가치가 있는 B3 화력형입니다. 추천에서는 레이드 대체 딜러로 반영합니다.",
    contentScores: score(80, 84, 80, 58, 86, 84, 82),
    sourceStatus: "communityChecked",
    sourceUrls: commonSources
  },
  "laplace-treasure": {
    aliases: ["라플라스 보물", "라플라스 트레저", "laplace treasure"],
    roles: ["메인딜러", "보스딜", "파츠딜", "관통딜", "고투자"],
    goodFor: ["boss", "soloRaid", "unionRaid", "interception", "tower"],
    skillPriority: "버스트 > 1스킬 > 2스킬. Treasure 적용 후 보스 딜 기여를 우선합니다.",
    gearPriority: "보스 주력 딜러로 쓰면 공격 장비 투자 우선순위가 높습니다.",
    overloadPriority: "공격력, 우월 코드, 차지/명중 옵션을 우선 검토합니다.",
    cubeRecommendation: "차지 보조 또는 재장전 보조 큐브를 검토합니다.",
    collectionPriority: "Treasure 운용 전제라 소장품 투자 우선순위가 높습니다.",
    notes: "Treasure 적용 후 보스/파츠 딜러 가치가 커지는 라플라스 변형입니다. 보스전 성장 추천에서 우선 후보로 반영합니다.",
    contentScores: score(82, 88, 84, 56, 90, 88, 88),
    sourceStatus: "communityChecked",
    sourceUrls: commonSources
  },
  phantom: {
    aliases: ["팬텀", "phantom"],
    roles: ["서브딜러", "보스딜", "지속딜"],
    goodFor: ["boss", "soloRaid", "unionRaid", "story"],
    skillPriority: "버스트 > 1스킬 > 2스킬. 딜러로 쓸 때 버스트 우선입니다.",
    gearPriority: "보스전 보조 딜러라 공격 장비를 중간 이상으로 투자합니다.",
    overloadPriority: "공격력, 우월 코드, 장탄/명중 옵션을 검토합니다.",
    cubeRecommendation: "장탄 보조 또는 재장전 보조 큐브를 검토합니다.",
    collectionPriority: "보스 대체 딜러로 쓰면 중간 이상 우선순위입니다.",
    notes: "B3 보스 보조 딜러로 추천에 들어갈 수 있는 니케입니다. 최신 레이드 세부 평가는 남겨두고 기본 점수를 보강했습니다.",
    contentScores: score(78, 84, 78, 56, 86, 84, 82),
    sourceStatus: "communityChecked",
    sourceUrls: commonSources
  },
  "dorothy-serendipity": {
    aliases: ["도로시 세렌디피티", "세렌디피티 도로시", "dorothy serendipity"],
    roles: ["서브딜러", "보스딜", "필그림", "지속딜"],
    goodFor: ["boss", "soloRaid", "unionRaid", "story"],
    skillPriority: "버스트 > 1스킬 > 2스킬. 보스 딜 기여를 우선합니다.",
    gearPriority: "필그림 보조 딜러로 쓰면 공격 장비를 우선 검토합니다.",
    overloadPriority: "공격력, 우월 코드, 장탄/명중 옵션을 검토합니다.",
    cubeRecommendation: "장탄 보조 또는 재장전 보조 큐브를 검토합니다.",
    collectionPriority: "레이드 보조 딜러로 쓰면 중상 우선순위입니다.",
    notes: "필그림 B3 보조 딜러로 보스전 점수를 보강했습니다. 세부 최신 메타는 추가 확인이 필요합니다.",
    contentScores: score(82, 86, 82, 58, 88, 86, 84),
    sourceStatus: "communityChecked",
    sourceUrls: commonSources
  },
  "helm-aquamarine": {
    aliases: ["수헬름", "수영복 헬름", "아쿠아마린 헬름", "helm aquamarine"],
    roles: ["쿨감", "보스딜", "한정", "버퍼"],
    goodFor: ["boss", "soloRaid", "unionRaid", "interception"],
    skillPriority: "버스트 > 1스킬 > 2스킬. 보스전 쿨감/보조 용도라면 버스트 우선입니다.",
    gearPriority: "한정 B2 보조라 스킬 투자 우선, 장비는 생존 위주로 봅니다.",
    overloadPriority: "생존 안정성과 명중 보조 옵션을 검토합니다.",
    cubeRecommendation: "생존 보조 또는 재장전 보조 큐브를 사용합니다.",
    collectionPriority: "보스전 B2 대체재로 자주 쓰면 중간 우선순위입니다.",
    notes: "보스전에서 쿨감 축으로 사용할 수 있는 한정 B2입니다. 접근성 때문에 needsReview는 유지하지만 추천 점수는 보스 쪽으로 정리했습니다.",
    contentScores: score(74, 84, 74, 56, 86, 84, 80),
    sourceStatus: "needsReview",
    sourceUrls: commonSources
  },
  "anis-sparkling-summer": {
    aliases: ["수니스", "수영복 아니스", "아니스 수영복", "anis sparkling summer"],
    roles: ["전격딜", "서브딜러", "장탄버프", "한정", "보스딜"],
    goodFor: ["boss", "soloRaid", "unionRaid", "story"],
    skillPriority: "1스킬 > 버스트 > 2스킬. 전격/장탄 보조 조합이면 1스킬 우선입니다.",
    gearPriority: "전격 파티 보조 딜러로 쓰면 공격 장비 투자를 검토합니다.",
    overloadPriority: "공격력, 우월 코드, 장탄/명중 옵션을 우선 검토합니다.",
    cubeRecommendation: "장탄 보조 큐브를 우선 검토합니다.",
    collectionPriority: "전격 레이드 조합에서 쓰면 중상 우선순위입니다.",
    notes: "전격/장탄 보조 성격의 한정 B3입니다. 최신 조합 의존도가 있어 needsReview로 남기고 점수만 보강했습니다.",
    contentScores: score(78, 86, 78, 62, 88, 86, 82),
    sourceStatus: "needsReview",
    sourceUrls: commonSources
  },
  "mari-makinami": {
    aliases: ["마리 마키나미", "mari", "mari makinami illustrious"],
    roles: ["콜라보", "버퍼", "유지력", "전격딜"],
    goodFor: ["story", "boss", "soloRaid", "unionRaid", "tower"],
    skillPriority: "1스킬 > 버스트 > 2스킬. 지원 효과와 유지력을 먼저 봅니다.",
    gearPriority: "콜라보 B2 지원형이라 스킬 투자와 생존 장비를 우선합니다.",
    overloadPriority: "생존 안정성과 명중 보조 옵션을 검토합니다.",
    cubeRecommendation: "생존 보조 또는 재장전 보조 큐브를 사용합니다.",
    collectionPriority: "보유 계정에서 B2 보조로 자주 쓰면 중간 우선순위입니다.",
    notes: "에반게리온 콜라보 B2 지원형입니다. 상위권 참고는 있지만 최신 조합 검수 여지가 있어 needsReview를 유지합니다.",
    contentScores: score(80, 84, 80, 60, 86, 84, 80),
    sourceStatus: "needsReview",
    sourceUrls: commonSources
  },
  "rei-ayanami": {
    aliases: ["아야나미 레이", "레이", "rei ayanami"],
    roles: ["콜라보", "작열딜", "서브딜러", "보스딜"],
    goodFor: ["story", "boss", "soloRaid", "unionRaid", "tower"],
    skillPriority: "버스트 > 1스킬 > 2스킬. 딜러로 쓸 때 버스트 우선입니다.",
    gearPriority: "콜라보 보조 딜러로 쓰면 공격 장비를 중간 이상으로 검토합니다.",
    overloadPriority: "공격력, 우월 코드, 장탄/명중 옵션을 검토합니다.",
    cubeRecommendation: "장탄 보조 또는 재장전 보조 큐브를 사용합니다.",
    collectionPriority: "보유 계정에서 작열 딜러로 쓰면 중간 우선순위입니다.",
    notes: "에반게리온 콜라보 B3 작열 딜러입니다. 접근성/최신 조합 의존도가 있어 needsReview로 두고 기본 추천만 보강했습니다.",
    contentScores: score(80, 82, 78, 58, 84, 82, 80),
    sourceStatus: "needsReview",
    sourceUrls: commonSources
  },
  "ada-wong": {
    aliases: ["에이다", "ada", "ada wong"],
    roles: ["메인딜러", "서브딜러", "보스딜", "콜라보"],
    goodFor: ["story", "boss", "soloRaid", "unionRaid", "arena"],
    skillPriority: "버스트 > 1스킬 > 2스킬. 딜러로 쓸 때 버스트와 1스킬을 먼저 검토합니다.",
    gearPriority: "콜라보 딜러라 보유 계정에서는 공격 장비 투자 우선순위가 높을 수 있습니다.",
    overloadPriority: "공격력, 우월 코드, 장탄/명중 옵션을 검토합니다.",
    cubeRecommendation: "장탄 보조 또는 재장전 보조 큐브를 우선 검토합니다.",
    collectionPriority: "보유 계정에서 주력 딜러로 쓰면 중상 우선순위입니다.",
    notes: "최근 티어 참고상 스토리 상위권으로 잡히지만 콜라보/최신성 때문에 needsReview를 유지합니다. 추천 알고리즘에는 강한 딜러 후보로 반영합니다.",
    contentScores: score(92, 86, 90, 78, 86, 84, 84),
    sourceStatus: "needsReview",
    sourceUrls: commonSources
  },
  asuka: {
    aliases: ["아스카", "asuka"],
    roles: ["메인딜러", "작열딜", "콜라보", "보스딜"],
    goodFor: ["story", "boss", "soloRaid", "unionRaid"],
    skillPriority: "버스트 > 1스킬 > 2스킬. 작열 딜러로 쓰면 딜 스킬 우선입니다.",
    gearPriority: "콜라보 주력 딜러라 보유 계정에서는 공격 장비 투자를 검토합니다.",
    overloadPriority: "공격력, 우월 코드, 장탄/명중 옵션을 검토합니다.",
    cubeRecommendation: "장탄 보조 또는 재장전 보조 큐브를 사용합니다.",
    collectionPriority: "작열 딜러로 쓰는 경우 중상 우선순위입니다.",
    notes: "에반게리온 콜라보 B3 작열 딜러입니다. 최신 조합 검수가 필요해 needsReview를 유지합니다.",
    contentScores: score(82, 84, 80, 60, 86, 84, 80),
    sourceStatus: "needsReview",
    sourceUrls: commonSources
  },
  rem: {
    aliases: ["렘", "rem", "rezero rem"],
    roles: ["힐러", "공버프", "버퍼", "콜라보", "유지력"],
    goodFor: ["story", "boss", "soloRaid", "unionRaid", "tower"],
    skillPriority: "1스킬 > 버스트 > 2스킬. 회복과 공격 보조를 먼저 봅니다.",
    gearPriority: "콜라보 B2 지원형이라 스킬 투자와 생존 장비를 우선합니다.",
    overloadPriority: "생존 안정성과 명중 보조 옵션을 검토합니다.",
    cubeRecommendation: "생존 보조 또는 재장전 보조 큐브를 사용합니다.",
    collectionPriority: "보유 계정에서 B2 보조로 자주 쓰면 중간 우선순위입니다.",
    notes: "Re:ZERO 콜라보 B2 지원형입니다. 힐과 공격 보조를 반영하되 최신성 때문에 needsReview로 유지합니다.",
    contentScores: score(82, 82, 80, 68, 84, 82, 80),
    sourceStatus: "needsReview",
    sourceUrls: commonSources
  },
  emilia: {
    aliases: ["에밀리아", "emilia", "rezero emilia"],
    roles: ["메인딜러", "광역딜", "아레나광역", "콜라보"],
    goodFor: ["story", "arena", "tower", "boss"],
    skillPriority: "버스트 > 1스킬 > 2스킬. 광역 딜 기여를 우선합니다.",
    gearPriority: "광역 딜러로 쓰면 공격 장비를 검토합니다.",
    overloadPriority: "공격력, 우월 코드, 장탄/명중 옵션을 검토합니다.",
    cubeRecommendation: "장탄 보조 또는 재장전 보조 큐브를 사용합니다.",
    collectionPriority: "아레나/스토리 광역 딜러로 쓰면 중간 우선순위입니다.",
    notes: "Re:ZERO 콜라보 광역 딜러입니다. 아레나와 스토리 쪽 점수를 반영하되 needsReview를 유지합니다.",
    contentScores: score(84, 74, 82, 86, 74, 72, 72),
    sourceStatus: "needsReview",
    sourceUrls: commonSources
  },
  "jill-valentine": {
    aliases: ["질", "jill", "jill valentine"],
    roles: ["서브딜러", "보스딜", "콜라보", "전격딜"],
    goodFor: ["boss", "soloRaid", "unionRaid", "story"],
    skillPriority: "버스트 > 1스킬 > 2스킬. 보스 딜러로 쓰면 딜 스킬 우선입니다.",
    gearPriority: "콜라보 보조 딜러로 쓰면 공격 장비를 검토합니다.",
    overloadPriority: "공격력, 우월 코드, 장탄/명중 옵션을 검토합니다.",
    cubeRecommendation: "장탄 보조 또는 재장전 보조 큐브를 사용합니다.",
    collectionPriority: "보유 계정에서 보스 딜러로 쓰면 중간 우선순위입니다.",
    notes: "바이오하자드 콜라보 B3 전격 딜러입니다. 최신성 때문에 needsReview로 유지하고 보스전 점수만 보강했습니다.",
    contentScores: score(78, 82, 78, 58, 84, 82, 80),
    sourceStatus: "needsReview",
    sourceUrls: commonSources
  },
  "asuka-shikinami-langley-wille": {
    aliases: ["빌레 아스카", "시키나미 아스카", "asuka wille"],
    roles: ["서브딜러", "보스딜", "콜라보", "작열딜"],
    goodFor: ["story", "boss", "soloRaid", "unionRaid"],
    skillPriority: "버스트 > 1스킬 > 2스킬. 보스 딜 기여를 우선합니다.",
    gearPriority: "콜라보 딜러라 보유 계정에서는 공격 장비를 검토합니다.",
    overloadPriority: "공격력, 우월 코드, 장탄/명중 옵션을 검토합니다.",
    cubeRecommendation: "장탄 보조 또는 재장전 보조 큐브를 사용합니다.",
    collectionPriority: "보유 계정에서 작열 딜러로 쓰면 중간 우선순위입니다.",
    notes: "에반게리온 콜라보 B3 보조 딜러입니다. 최신 조합 검수 전까지 needsReview를 유지합니다.",
    contentScores: score(80, 82, 78, 58, 84, 82, 80),
    sourceStatus: "needsReview",
    sourceUrls: commonSources
  },
  "quency-escape-queen": {
    aliases: ["퀀시 이스케이프 퀸", "퀀시 탈출퀸", "escape queen"],
    roles: ["서브딜러", "보스딜", "지속딜"],
    goodFor: ["boss", "soloRaid", "unionRaid", "story"],
    skillPriority: "버스트 > 1스킬 > 2스킬. 딜러로 쓰면 버스트 우선입니다.",
    gearPriority: "보스 보조 딜러로 쓰면 공격 장비를 검토합니다.",
    overloadPriority: "공격력, 우월 코드, 장탄/명중 옵션을 검토합니다.",
    cubeRecommendation: "장탄 보조 또는 재장전 보조 큐브를 사용합니다.",
    collectionPriority: "보스 대체 딜러로 쓰면 중간 우선순위입니다.",
    notes: "B3 보스 보조 딜러 후보입니다. 최신 세부 평가는 남겨두고 추천 점수와 역할을 보강했습니다.",
    contentScores: score(78, 84, 78, 58, 86, 84, 82),
    sourceStatus: "needsReview",
    sourceUrls: commonSources
  },
  "e-h": {
    aliases: ["E.H.", "이 에이치", "eh"],
    roles: ["서브딜러", "보스딜", "철갑딜"],
    goodFor: ["story", "boss", "tower"],
    skillPriority: "버스트 > 1스킬 > 2스킬. 보조 딜러로 쓸 때 딜 스킬을 우선합니다.",
    gearPriority: "보스 대체 딜러로 쓰면 공격 장비를 중간 우선순위로 검토합니다.",
    overloadPriority: "공격력, 우월 코드, 장탄/명중 옵션을 검토합니다.",
    cubeRecommendation: "장탄 보조 또는 재장전 보조 큐브를 사용합니다.",
    collectionPriority: "보유 풀이 좁을 때 중간 우선순위입니다.",
    notes: "철갑 B3 보조 딜러입니다. 상위권 고정 픽으로 보지는 않고 대체 딜러 범위에서 추천되도록 정리했습니다.",
    contentScores: score(74, 78, 74, 54, 78, 76, 76),
    sourceStatus: "needsReview",
    sourceUrls: commonSources
  },
  "snow-white-innocent-days": {
    aliases: ["스화 이노센트", "스노우 화이트 이노센트 데이즈", "smol white", "innocent days"],
    roles: ["서브딜러", "보스딜", "필그림", "뉴비추천"],
    goodFor: ["story", "boss", "tower", "interception"],
    skillPriority: "버스트 > 1스킬 > 2스킬. 초중반 딜러로 쓰면 버스트 우선입니다.",
    gearPriority: "초중반 딜러로 쓰면 공격 장비를 중간 우선순위로 투자합니다.",
    overloadPriority: "공격력, 우월 코드, 명중 옵션을 검토합니다.",
    cubeRecommendation: "재장전 보조 또는 장탄 보조 큐브를 사용합니다.",
    collectionPriority: "초중반 주력 딜러라면 중간 우선순위입니다.",
    notes: "배포형 필그림 B3 딜러로 초중반 활용도가 있습니다. 최상위 딜러와는 구분해 대체 딜러 점수로 정리했습니다.",
    contentScores: score(78, 76, 78, 58, 76, 74, 76),
    sourceStatus: "needsReview",
    sourceUrls: commonSources
  },
  "neon-blue-ocean": {
    aliases: ["수네온", "수영복 네온", "blue ocean"],
    roles: ["수냉딜", "광역딜", "한정", "서브딜러"],
    goodFor: ["story", "tower"],
    skillPriority: "버스트 > 1스킬 > 2스킬. 광역 딜러로 쓸 때 버스트 우선입니다.",
    gearPriority: "한정 대체 딜러라 장비 투자는 낮은 우선순위로 둡니다.",
    overloadPriority: "공격력과 명중 옵션을 검토하되 우선도는 낮습니다.",
    cubeRecommendation: "재장전 보조 또는 장탄 보조 큐브를 사용합니다.",
    collectionPriority: "애정/보유 상황에 따라 낮게 투자합니다.",
    notes: "수냉 광역 딜러지만 현재 범용 추천 우선도는 낮습니다. 한정 캐릭터라 needsReview를 유지합니다.",
    contentScores: score(68, 58, 66, 52, 58, 58, 58),
    sourceStatus: "needsReview",
    sourceUrls: commonSources
  }
};

export const batch05ReviewedIds = Object.keys(batch05ReviewPatches);

export const applyBatch05Review = (items: Nikke[]): Nikke[] =>
  items.map((nikke) => {
    const patch = batch05ReviewPatches[nikke.id];
    if (!patch) {
      return nikke;
    }

    return {
      ...nikke,
      ...patch,
      aliases: patch.aliases ? Array.from(new Set([...nikke.aliases, ...patch.aliases])) : nikke.aliases,
      contentScores: patch.contentScores ? { ...nikke.contentScores, ...patch.contentScores } : nikke.contentScores,
      sourceUrls: patch.sourceUrls ? Array.from(new Set([...(nikke.sourceUrls ?? []), ...patch.sourceUrls])) : nikke.sourceUrls,
      lastReviewedAt: patch.lastReviewedAt ?? reviewedAt
    };
  });
