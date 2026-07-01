import type { ExternalTool } from "@/types/tool";

export const externalTools: ExternalTool[] = [
  {
    id: "blablalink",
    name: "블라블라링크",
    category: "official",
    url: "https://www.blablalink.com",
    description: "쿠폰 입력, 유니온 검색, 계정 관련 정보를 확인하는 공식 성격의 링크입니다.",
    recommendedUse: "쿠폰 입력, 유니온 검색, 니케 스펙 확인, 출석 보상 관련",
    useInApp: "directLink",
    trustLevel: 5
  },
  {
    id: "official-discord",
    name: "니케 공식 디스코드",
    category: "official",
    url: "https://discord.gg/nikke-en",
    description: "공식 디스코드 공지와 이벤트 정보를 확인합니다.",
    recommendedUse: "공식 디코, 쿠폰, 출석 이벤트, 공지 확인",
    useInApp: "directLink",
    trustLevel: 5
  },
  {
    id: "gamewith-lost-relic",
    name: "GameWith 니케 유실물",
    category: "lostRelic",
    url: "https://gamewith.jp/nikke/article/show/370147",
    description: "챕터별 유실물 위치를 빠르게 찾아볼 수 있는 외부 문서입니다.",
    recommendedUse: "챕터별 유실물 위치 확인",
    useInApp: "directLink",
    trustLevel: 4
  },
  {
    id: "enikk-soloraid",
    name: "ENIKK 솔로레이드",
    category: "soloRaid",
    url: "https://enikk.app/soloraid",
    description: "솔로레이드 덱과 랭커 구성을 참고할 수 있는 도구 사이트입니다.",
    recommendedUse: "솔로레이드 전섭 랭커 덱 확인, 카카시덱 참고, 덱 구성 참고",
    useInApp: "referenceOnly",
    trustLevel: 4
  },
  {
    id: "nikke-tools",
    name: "Nikke Tools",
    category: "soloRaid",
    url: "https://nikke-tools.netlify.app",
    description: "덱 구성과 패키지 효율 등 여러 계산을 보조합니다.",
    recommendedUse: "덱 구성, 패키지 효율, 각종 계산 참고",
    useInApp: "referenceOnly",
    trustLevel: 4
  },
  {
    id: "nikke-deck-ko",
    name: "Nikke Deck 한국어",
    category: "arena",
    url: "https://nikke-deck.com/ko/",
    description: "아레나 버스트 충전과 스쿼드 구성을 계산합니다.",
    recommendedUse: "직관적 버스트 충전 계산, 스쿼드 메이커, 아레나 덱 구성",
    useInApp: "referenceOnly",
    trustLevel: 4
  },
  {
    id: "nikke-deck-old",
    name: "Nikke Deck 구버전",
    category: "arena",
    url: "https://nikke-deck.web.app",
    description: "이전 버전의 아레나 버충 계산 도구입니다.",
    recommendedUse: "아레나 버충 계산",
    useInApp: "referenceOnly",
    trustLevel: 3
  },
  {
    id: "dotgg-outpost",
    name: "DotGG 전초기지 계산기",
    category: "outpost",
    url: "https://dotgg.gg/nikke/tools/outpost",
    description: "전초기지 재화 수급량과 누락 스테이지를 확인합니다.",
    recommendedUse: "전초기지 재화 수급량, 빼먹은 스테이지 확인",
    useInApp: "referenceOnly",
    trustLevel: 4
  },
  {
    id: "nikke-skill-search",
    name: "Nikke SSR Skill Search",
    category: "skillSearch",
    url: "https://nikkesearch.glide.page/dl/da19fa",
    description: "특정 스킬 기믹이나 키워드로 니케를 찾는 색인 도구입니다.",
    recommendedUse: "특정 스킬 기믹 색인, 니케 스킬 검색",
    useInApp: "referenceOnly",
    trustLevel: 3
  },
  {
    id: "fandom-wiki",
    name: "니케 팬덤 위키",
    category: "wiki",
    url: "https://nikke-goddess-of-victory-international.fandom.com/wiki/Home",
    description: "영문 위키와 캐릭터 기본 정보를 참고합니다.",
    recommendedUse: "인게임 원본 이미지, 영문 위키, 캐릭터 이미지 참고",
    useInApp: "manualDataSource",
    trustLevel: 2
  },
  {
    id: "nibung-gacha",
    name: "가챠 시뮬레이터",
    category: "simulator",
    url: "https://nibung.kr/gacha",
    description: "픽업 뽑기 감각을 시험해보는 시뮬레이터입니다.",
    recommendedUse: "픽업 가챠 시뮬레이션",
    useInApp: "directLink",
    trustLevel: 3
  },
  {
    id: "module-simulator",
    name: "니케 모듈작 시뮬레이터",
    category: "simulator",
    url: "https://nikkemodule.vercel.app",
    description: "모듈작 결과를 실험해볼 수 있는 외부 도구입니다.",
    recommendedUse: "모듈작 시뮬레이션",
    useInApp: "referenceOnly",
    trustLevel: 3
  },
  {
    id: "collectibles",
    name: "소장품 강화 최적화 시뮬레이터",
    category: "simulator",
    url: "https://changjoeconomy.github.io/collectibles/",
    description: "소장품 강화 평균값과 효율을 계산합니다.",
    recommendedUse: "소장품 강화 평균값, 강화 효율 계산",
    useInApp: "referenceOnly",
    trustLevel: 3
  },
  {
    id: "mimir-nikke",
    name: "Mimir Nikke",
    category: "simulator",
    url: "https://mimir-nikke.netlify.app/",
    description: "덱 빌딩과 니케 관련 계산을 돕는 보조 도구입니다.",
    recommendedUse: "덱 빌딩 및 니케 관련 보조 도구",
    useInApp: "referenceOnly",
    trustLevel: 3
  },
  {
    id: "syuen-love",
    name: "Syuen Love",
    category: "simulator",
    url: "https://syuen.love/",
    description: "오버로드 옵션작 계산과 최적화를 보조합니다.",
    recommendedUse: "오버로드 옵션작 계산기 및 최적화",
    useInApp: "referenceOnly",
    trustLevel: 3
  },
  {
    id: "nibung",
    name: "Nibung",
    category: "simulator",
    url: "https://nibung.kr/",
    description: "뽑기와 여러 니케 관련 시뮬레이터를 모아둔 사이트입니다.",
    recommendedUse: "니케 뽑기, 대리 도파민, 시뮬레이터",
    useInApp: "directLink",
    trustLevel: 3
  }
];
