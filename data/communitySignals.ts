import type { CommunitySignal } from "@/types/meta";

export const communitySignals: CommunitySignal[] = [
  {
    id: "official-balance-sample",
    source: "official",
    title: "공식/인게임 패치 확인 필요 항목",
    url: "https://nikke-kr.com/news.html",
    date: "2026-06-20",
    characters: ["리타", "크라운", "레드후드"],
    contentTypes: ["story", "boss", "soloRaid", "unionRaid"],
    keywords: ["공식", "버스트 순환", "범용"],
    sentiment: "positive",
    confidence: 92,
    summary: "공식 정보와 인게임 수치를 먼저 확인한 뒤 범용 추천 점수에 반영하는 샘플 신호입니다.",
    adminVerified: true
  },
  {
    id: "toolsite-soloraid-sample",
    source: "toolSite",
    title: "솔로레이드 랭커 덱 참고 샘플",
    url: "https://enikk.app/soloraid",
    date: "2026-06-18",
    characters: ["도로시", "앨리스", "홍련: 흑영", "맥스웰"],
    contentTypes: ["soloRaid", "unionRaid", "boss"],
    keywords: ["솔로레이드", "보스딜", "차지 딜러"],
    sentiment: "positive",
    confidence: 86,
    summary: "도구 사이트의 덱 경향을 직접 복사하지 않고, 링크와 요약만 관리하는 샘플입니다.",
    adminVerified: true
  },
  {
    id: "arena-tool-sample",
    source: "toolSite",
    title: "아레나 버스트 충전 계산 참고",
    url: "https://nikke-deck.com/ko/",
    date: "2026-06-15",
    characters: ["센티", "노이즈", "홍련", "에밀리아"],
    contentTypes: ["arena"],
    keywords: ["버스트 충전", "아레나", "광역"],
    sentiment: "mixed",
    confidence: 78,
    summary: "아레나는 버스트 충전량과 상대 조합에 따라 변동이 크므로 별도 점수 체계로 다룹니다.",
    adminVerified: true
  },
  {
    id: "fandom-basic-sample",
    source: "fandom",
    title: "캐릭터 기본 정보 확인 샘플",
    url: "https://nikke-goddess-of-victory-international.fandom.com/wiki/Home",
    date: "2026-06-01",
    characters: ["라푼젤", "스노우 화이트"],
    contentTypes: ["story", "boss"],
    keywords: ["기본 정보", "이미지 참고", "영문 위키"],
    sentiment: "neutral",
    confidence: 50,
    summary: "위키류 정보는 기본 정보 보조용으로만 취급하고 핵심 추천 근거로 쓰지 않습니다.",
    adminVerified: false
  }
];
