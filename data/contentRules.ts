import type { ContentType } from "@/types/content";
import type { RoleId } from "@/types/nikke";

export type ContentRule = {
  content: ContentType;
  preferredRoles: RoleId[];
  roleWeights: Partial<Record<RoleId, number>>;
  operationNotes: string[];
};

export const contentRules: Record<ContentType, ContentRule> = {
  story: {
    content: "story",
    preferredRoles: ["쿨감", "메인딜러", "광역딜", "지속딜", "유지력", "공버프"],
    roleWeights: {
      쿨감: 12,
      메인딜러: 12,
      광역딜: 10,
      지속딜: 9,
      힐러: 8,
      회복: 8,
      유지력: 8,
      실드: 7,
      공버프: 8,
      장탄버프: 5,
      자동전투: 6,
      뉴비추천: 6
    },
    operationNotes: [
      "캠페인 진행은 버스트 순환과 광역 처리 안정성이 가장 중요합니다.",
      "자동전투 위주라면 힐, 실드, 장탄 보조 역할의 가치를 조금 더 높게 보세요."
    ]
  },
  boss: {
    content: "boss",
    preferredRoles: ["메인딜러", "보스딜", "공버프", "방깎", "받피증", "파츠딜"],
    roleWeights: {
      메인딜러: 13,
      보스딜: 12,
      공버프: 10,
      버퍼: 8,
      방깎: 10,
      받피증: 10,
      관통딜: 8,
      파츠딜: 8,
      힐러: 4,
      유지력: 5
    },
    operationNotes: [
      "보스전은 단일 대상 화력, 방깎, 받피증, 파츠 처리 가능성을 우선합니다.",
      "보스별 기믹 데이터가 추가되면 이 계산식 위에 별도 보정값을 얹을 수 있습니다."
    ]
  },
  tower: {
    content: "tower",
    preferredRoles: ["쿨감", "메인딜러", "공버프", "유지력", "기업타워"],
    roleWeights: {
      쿨감: 10,
      메인딜러: 11,
      공버프: 9,
      힐러: 7,
      유지력: 7,
      실드: 7,
      광역딜: 7,
      보스딜: 7,
      기업타워: 6
    },
    operationNotes: [
      "MVP에서는 전체 보유 니케 기준으로 계산합니다.",
      "기업 타워 확장을 위해 추천 화면에 기업 필터 슬롯을 준비했습니다."
    ]
  },
  arena: {
    content: "arena",
    preferredRoles: ["버스트충전", "선버스트", "도발", "무적", "부활", "아레나광역"],
    roleWeights: {
      버스트충전: 15,
      선버스트: 12,
      도발: 10,
      무적: 9,
      부활: 8,
      광역딜: 9,
      아레나광역: 10,
      피해분배: 8,
      실드: 7,
      아레나방어: 8,
      생존: 6
    },
    operationNotes: [
      "아레나는 PVE 점수와 별도로 빠른 버스트 충전과 제어기를 우선합니다.",
      "상대 조합 카운터 기능은 이후 상대 덱 입력 구조를 붙여 확장할 수 있습니다."
    ]
  },
  soloRaid: {
    content: "soloRaid",
    preferredRoles: ["메인딜러", "보스딜", "공버프", "방깎", "쿨감", "유지력"],
    roleWeights: {
      메인딜러: 13,
      보스딜: 13,
      공버프: 11,
      방깎: 10,
      받피증: 10,
      쿨감: 9,
      힐러: 6,
      차지버프: 7,
      관통딜: 7,
      고투자: 5
    },
    operationNotes: [
      "솔로 레이드는 5덱 분배를 염두에 둔 구조지만, MVP에서는 최상위 덱과 대체 조합을 보여줍니다.",
      "한 덱에 핵심 버퍼가 과하게 몰리면 이후 덱 분배 단계에서 손해가 날 수 있습니다."
    ]
  },
  unionRaid: {
    content: "unionRaid",
    preferredRoles: ["메인딜러", "보스딜", "공버프", "방깎", "서브딜러", "유지력"],
    roleWeights: {
      메인딜러: 12,
      보스딜: 12,
      공버프: 10,
      방깎: 10,
      받피증: 9,
      서브딜러: 8,
      힐러: 5,
      파츠딜: 7
    },
    operationNotes: [
      "유니온 레이드는 보스전 기준에 대체 딜러와 덱 재사용 가능성을 더해 봅니다.",
      "대체 니케 목록을 같이 확인해 보스 속성이나 패턴에 맞춰 교체하세요."
    ]
  },
  interception: {
    content: "interception",
    preferredRoles: ["메인딜러", "보스딜", "공버프", "방깎", "파츠딜", "실드"],
    roleWeights: {
      메인딜러: 12,
      보스딜: 12,
      공버프: 9,
      방깎: 9,
      파츠딜: 9,
      실드: 7,
      힐러: 5,
      저지보조: 8
    },
    operationNotes: [
      "특수요격/개인요격은 보스별 기믹 데이터가 들어오기 전까지 범용 보스전 기준을 사용합니다.",
      "엄폐 관리나 파츠 타이밍이 중요한 보스는 외부 계산 도구와 함께 확인하세요."
    ]
  }
};
