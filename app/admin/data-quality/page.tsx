"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { nikkes } from "@/data/nikkes";
import {
  availabilityLabels,
  getAverageContentScore,
  getNikkeQualityIssues,
  isReviewRequired,
  sourceStatusLabels
} from "@/lib/dataQuality";
import { getScoreAuditOverview } from "@/lib/contentScoreAudit";
import { contentLabels, contentTypes, type ContentType } from "@/types/content";
import type { Nikke, NikkeAvailability, NikkeRarity, NikkeSourceStatus } from "@/types/nikke";

type ToggleFilter = "all" | "yes" | "no";

const byName = (a: Nikke, b: Nikke) => a.name.localeCompare(b.name, "ko");

const uniqueValues = (getter: (nikke: Nikke) => string) =>
  Array.from(new Set(nikkes.map(getter))).sort((a, b) => a.localeCompare(b, "ko"));

const matchesToggle = (value: boolean | undefined, filter: ToggleFilter) =>
  filter === "all" || (filter === "yes" && Boolean(value)) || (filter === "no" && !value);

const statusClassNames: Record<NikkeSourceStatus, string> = {
  verified: "border-signal/35 bg-signal/10 text-signal",
  communityChecked: "border-amber/35 bg-amber/10 text-amber",
  needsReview: "border-magenta/35 bg-magenta/10 text-magenta",
  placeholder: "border-slate-600 bg-slate-800/70 text-slate-300"
};

export default function DataQualityPage() {
  const [query, setQuery] = useState("");
  const [sourceStatus, setSourceStatus] = useState<NikkeSourceStatus | "all">("all");
  const [rarity, setRarity] = useState<NikkeRarity | "all">("all");
  const [manufacturer, setManufacturer] = useState("all");
  const [availability, setAvailability] = useState<NikkeAvailability | "all">("all");
  const [limited, setLimited] = useState<ToggleFilter>("all");
  const [collab, setCollab] = useState<ToggleFilter>("all");
  const [pilgrim, setPilgrim] = useState<ToggleFilter>("all");
  const [placeholderOnly, setPlaceholderOnly] = useState(false);
  const [needsReviewOnly, setNeedsReviewOnly] = useState(false);
  const [auditContent, setAuditContent] = useState<ContentType | "all">("all");
  const [auditSourceStatus, setAuditSourceStatus] = useState<NikkeSourceStatus | "all">("all");
  const [highScoreOnly, setHighScoreOnly] = useState(false);
  const [suspiciousOnly, setSuspiciousOnly] = useState(false);

  const manufacturers = useMemo(() => uniqueValues((nikke) => nikke.manufacturer), []);
  const scoreAudit = useMemo(() => getScoreAuditOverview(nikkes), []);
  const suspiciousIds = useMemo(() => new Set(scoreAudit.suspiciousPatterns.map((issue) => issue.nikke.id)), [scoreAudit.suspiciousPatterns]);
  const auditRows = useMemo(
    () =>
      [...nikkes]
        .filter((nikke) => auditSourceStatus === "all" || nikke.sourceStatus === auditSourceStatus)
        .filter((nikke) => auditContent === "all" || (highScoreOnly ? nikke.contentScores[auditContent] >= 90 : true))
        .filter((nikke) => !suspiciousOnly || suspiciousIds.has(nikke.id))
        .sort((a, b) => {
          const left = auditContent === "all" ? getAverageContentScore(a) : a.contentScores[auditContent];
          const right = auditContent === "all" ? getAverageContentScore(b) : b.contentScores[auditContent];
          return right - left || a.name.localeCompare(b.name, "ko");
        })
        .slice(0, 30),
    [auditContent, auditSourceStatus, highScoreOnly, suspiciousIds, suspiciousOnly]
  );

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("ko-KR");

    return [...nikkes]
      .filter((nikke) => {
        const matchesQuery =
          normalizedQuery.length === 0 ||
          nikke.name.toLocaleLowerCase("ko-KR").includes(normalizedQuery) ||
          nikke.nameKo.toLocaleLowerCase("ko-KR").includes(normalizedQuery) ||
          nikke.nameEn?.toLocaleLowerCase("ko-KR").includes(normalizedQuery) ||
          nikke.aliases.some((alias) => alias.toLocaleLowerCase("ko-KR").includes(normalizedQuery)) ||
          nikke.roles.some((role) => role.toLocaleLowerCase("ko-KR").includes(normalizedQuery));

        return (
          matchesQuery &&
          (sourceStatus === "all" || nikke.sourceStatus === sourceStatus) &&
          (rarity === "all" || nikke.rarity === rarity) &&
          (manufacturer === "all" || nikke.manufacturer === manufacturer) &&
          (availability === "all" || nikke.availability === availability) &&
          matchesToggle(nikke.isLimited || nikke.availability === "limited", limited) &&
          matchesToggle(nikke.isCollab || nikke.availability === "collab", collab) &&
          matchesToggle(nikke.isPilgrim || nikke.manufacturer === "필그림", pilgrim) &&
          (!placeholderOnly || nikke.sourceStatus === "placeholder") &&
          (!needsReviewOnly || nikke.sourceStatus === "needsReview")
        );
      })
      .sort(byName);
  }, [availability, collab, limited, manufacturer, needsReviewOnly, pilgrim, placeholderOnly, query, rarity, sourceStatus]);

  return (
    <div className="space-y-5">
      <section className="hud-panel p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase text-magenta">Data Quality Console</p>
            <h1 className="mt-2 text-2xl font-black text-white">니케 데이터 품질 표</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
              전체 209명 로스터를 검색/필터링하며 검수 필요 여부, 별칭 수, 역할 수, 콘텐츠 점수 평균을 확인합니다.
            </p>
          </div>
          <Link href="/admin" className="btn-secondary w-fit">
            대시보드로 돌아가기
          </Link>
        </div>
      </section>

      <section className="hud-panel p-4">
        <p className="text-sm font-black uppercase text-magenta">Account Growth System</p>
        <h2 className="mt-1 text-xl font-black text-white">계정 성장 시스템 안내</h2>
        <div className="mt-3 grid gap-3 text-sm leading-6 text-slate-400 md:grid-cols-2 xl:grid-cols-5">
          <p className="rounded-md border border-line bg-black/25 p-3">호감도는 사용자 입력 데이터입니다.</p>
          <p className="rounded-md border border-line bg-black/25 p-3">싱크로 디바이스는 사용자 입력 데이터입니다.</p>
          <p className="rounded-md border border-line bg-black/25 p-3">리사이클룸은 사용자 입력 데이터입니다.</p>
          <p className="rounded-md border border-line bg-black/25 p-3">택틱 아카데미는 사용자 입력/메모 기반입니다.</p>
          <p className="rounded-md border border-line bg-black/25 p-3">이 값들은 로스터 검수 데이터가 아니라 개인 계정 추천 보정값입니다.</p>
        </div>
      </section>

      <section className="hud-panel p-4">
        <p className="text-sm font-black uppercase text-magenta">Equipment Data System</p>
        <h2 className="mt-1 text-xl font-black text-white">장비 데이터 안내</h2>
        <div className="mt-3 grid gap-3 text-sm leading-6 text-slate-400 md:grid-cols-2 xl:grid-cols-4">
          <p className="rounded-md border border-line bg-black/25 p-3">장비 상태는 로스터 공통 데이터가 아니라 사용자 계정 데이터입니다.</p>
          <p className="rounded-md border border-line bg-black/25 p-3">장비 강화/오버로드는 추천 점수에 소폭 보정으로 반영됩니다.</p>
          <p className="rounded-md border border-line bg-black/25 p-3">미입력 상태에서는 기본 추천 점수를 사용하고 경고만 표시합니다.</p>
          <p className="rounded-md border border-line bg-black/25 p-3">솔로레이드 5덱 분배에서는 장비 정보가 중요한 보정값으로 사용될 예정입니다.</p>
        </div>
      </section>

      <section className="hud-panel p-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <label className="relative block xl:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden />
            <input value={query} onChange={(event) => setQuery(event.target.value)} className="input pl-9" placeholder="이름, 별칭, 역할 검색" />
          </label>
          <select value={sourceStatus} onChange={(event) => setSourceStatus(event.target.value as NikkeSourceStatus | "all")} className="input">
            <option value="all">검수 상태 전체</option>
            {Object.entries(sourceStatusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <select value={rarity} onChange={(event) => setRarity(event.target.value as NikkeRarity | "all")} className="input">
            <option value="all">등급 전체</option>
            <option value="SSR">SSR</option>
            <option value="SR">SR</option>
            <option value="R">R</option>
          </select>
          <select value={manufacturer} onChange={(event) => setManufacturer(event.target.value)} className="input">
            <option value="all">제조사 전체</option>
            {manufacturers.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select value={availability} onChange={(event) => setAvailability(event.target.value as NikkeAvailability | "all")} className="input">
            <option value="all">획득/분류 전체</option>
            {Object.entries(availabilityLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <select value={limited} onChange={(event) => setLimited(event.target.value as ToggleFilter)} className="input">
            <option value="all">한정 전체</option>
            <option value="yes">한정만</option>
            <option value="no">한정 제외</option>
          </select>
          <select value={collab} onChange={(event) => setCollab(event.target.value as ToggleFilter)} className="input">
            <option value="all">콜라보 전체</option>
            <option value="yes">콜라보만</option>
            <option value="no">콜라보 제외</option>
          </select>
          <select value={pilgrim} onChange={(event) => setPilgrim(event.target.value as ToggleFilter)} className="input">
            <option value="all">필그림 전체</option>
            <option value="yes">필그림만</option>
            <option value="no">필그림 제외</option>
          </select>
          <label className="flex h-11 items-center gap-2 rounded-md border border-line bg-black/30 px-3 text-sm font-bold text-slate-300">
            <input type="checkbox" checked={placeholderOnly} onChange={(event) => setPlaceholderOnly(event.target.checked)} className="h-4 w-4 accent-signal" />
            placeholder만
          </label>
          <label className="flex h-11 items-center gap-2 rounded-md border border-line bg-black/30 px-3 text-sm font-bold text-slate-300">
            <input type="checkbox" checked={needsReviewOnly} onChange={(event) => setNeedsReviewOnly(event.target.checked)} className="h-4 w-4 accent-signal" />
            needsReview만
          </label>
        </div>
        <p className="mt-4 text-sm text-slate-400">필터 결과 {filtered.length}명</p>
      </section>

      <section className="hud-panel p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase text-magenta">Content Score Audit</p>
            <h2 className="mt-1 text-xl font-black text-white">콘텐츠 점수 진단</h2>
          </div>
          <div className="grid gap-2 sm:grid-cols-4">
            <select value={auditContent} onChange={(event) => setAuditContent(event.target.value as ContentType | "all")} className="input">
              <option value="all">콘텐츠 전체</option>
              {contentTypes.map((content) => (
                <option key={content} value={content}>
                  {contentLabels[content]}
                </option>
              ))}
            </select>
            <select value={auditSourceStatus} onChange={(event) => setAuditSourceStatus(event.target.value as NikkeSourceStatus | "all")} className="input">
              <option value="all">상태 전체</option>
              {Object.entries(sourceStatusLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <label className="flex h-11 items-center gap-2 rounded-md border border-line bg-black/30 px-3 text-sm font-bold text-slate-300">
              <input type="checkbox" checked={highScoreOnly} onChange={(event) => setHighScoreOnly(event.target.checked)} className="h-4 w-4 accent-signal" />
              90점 이상
            </label>
            <label className="flex h-11 items-center gap-2 rounded-md border border-line bg-black/30 px-3 text-sm font-bold text-slate-300">
              <input type="checkbox" checked={suspiciousOnly} onChange={(event) => setSuspiciousOnly(event.target.checked)} className="h-4 w-4 accent-signal" />
              의심 패턴
            </label>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-7">
          {scoreAudit.stats.map((stat) => (
            <div key={stat.content} className="hud-card p-3">
              <p className="text-[10px] font-black uppercase text-slate-500">{stat.label}</p>
              <p className="mt-1 text-2xl font-black text-white">{stat.average}</p>
              <p className="mt-1 text-xs text-slate-400">90+ {stat.highScoreCount}명 / 70미만 {stat.lowScoreCount}명</p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          <div className="hud-card p-3">
            <p className="text-xs font-black uppercase text-magenta">All-rounder</p>
            <p className="mt-1 text-2xl font-black text-white">{scoreAudit.allRounderCandidates.length}</p>
            <p className="mt-1 text-xs text-slate-400">모든 콘텐츠 85점 이상 후보</p>
          </div>
          <div className="hud-card p-3">
            <p className="text-xs font-black uppercase text-magenta">NeedsReview High</p>
            <p className="mt-1 text-2xl font-black text-white">{scoreAudit.needsReviewHighScoreCandidates.length}</p>
            <p className="mt-1 text-xs text-slate-400">needsReview인데 90점 이상 3개 이상</p>
          </div>
          <div className="hud-card p-3">
            <p className="text-xs font-black uppercase text-magenta">Suspicious</p>
            <p className="mt-1 text-2xl font-black text-white">{scoreAudit.suspiciousPatterns.length}</p>
            <p className="mt-1 text-xs text-slate-400">역할 근거/점수 패턴 확인 필요</p>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto rounded-md border border-white/10">
          <table className="min-w-[860px] w-full border-collapse text-left text-sm">
            <thead className="border-b border-white/10 bg-white/[0.03] text-xs uppercase text-slate-400">
              <tr>
                {["니케", "상태", "평균", "스토리", "보스", "아레나", "솔로", "진단"].map((label) => (
                  <th key={label} className="px-3 py-3 font-black">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {auditRows.map((nikke) => {
                const issue = scoreAudit.suspiciousPatterns.find((item) => item.nikke.id === nikke.id);
                return (
                  <tr key={nikke.id} className="border-b border-white/10 text-slate-300">
                    <td className="px-3 py-3">
                      <p className="font-black text-white">{nikke.name}</p>
                      <p className="text-xs text-slate-500">{nikke.id}</p>
                    </td>
                    <td className="px-3 py-3">{sourceStatusLabels[nikke.sourceStatus]}</td>
                    <td className="px-3 py-3">{getAverageContentScore(nikke)}</td>
                    <td className="px-3 py-3">{nikke.contentScores.story}</td>
                    <td className="px-3 py-3">{nikke.contentScores.boss}</td>
                    <td className="px-3 py-3">{nikke.contentScores.arena}</td>
                    <td className="px-3 py-3">{nikke.contentScores.soloRaid}</td>
                    <td className="px-3 py-3 text-xs text-amber">{issue?.message ?? "진단 경고 없음"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="hud-panel overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="min-w-[1180px] w-full border-collapse text-left text-sm">
            <thead className="border-b border-white/10 bg-white/[0.03] text-xs uppercase text-slate-400">
              <tr>
                {["이름", "등급", "버스트", "클래스", "제조사", "속성", "무기", "sourceStatus", "availability", "역할", "별칭", "평균", "검수"].map((label) => (
                  <th key={label} className="px-3 py-3 font-black">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((nikke) => {
                const average = getAverageContentScore(nikke);
                const issues = getNikkeQualityIssues(nikke);
                const reviewRequired = isReviewRequired(nikke);

                return (
                  <tr key={nikke.id} className="border-b border-white/10 text-slate-300">
                    <td className="px-3 py-3">
                      <p className="font-black text-white">{nikke.name}</p>
                      <p className="text-xs text-slate-500">{nikke.id}</p>
                    </td>
                    <td className="px-3 py-3">{nikke.rarity}</td>
                    <td className="px-3 py-3">{nikke.burst === "none" ? "B-" : `B${nikke.burst}`}</td>
                    <td className="px-3 py-3">{nikke.classType}</td>
                    <td className="px-3 py-3">{nikke.manufacturer}</td>
                    <td className="px-3 py-3">{nikke.element}</td>
                    <td className="px-3 py-3">{nikke.weapon}</td>
                    <td className="px-3 py-3">
                      <span className={`rounded-md border px-2 py-1 text-xs font-bold ${statusClassNames[nikke.sourceStatus]}`}>
                        {sourceStatusLabels[nikke.sourceStatus]}
                      </span>
                    </td>
                    <td className="px-3 py-3">{availabilityLabels[nikke.availability]}</td>
                    <td className="px-3 py-3">{nikke.roles.length}</td>
                    <td className="px-3 py-3">{nikke.aliases.length}</td>
                    <td className="px-3 py-3">{average}</td>
                    <td className="px-3 py-3">
                      {reviewRequired ? (
                        <span title={issues.join(" / ")} className="rounded-md border border-magenta/35 bg-magenta/10 px-2 py-1 text-xs font-bold text-magenta">
                          검수 필요
                        </span>
                      ) : (
                        <span className="rounded-md border border-signal/35 bg-signal/10 px-2 py-1 text-xs font-bold text-signal">정상</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
