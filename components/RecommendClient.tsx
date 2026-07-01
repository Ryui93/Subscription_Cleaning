"use client";

import { useEffect, useMemo, useState } from "react";
import { nikkes } from "@/data/nikkes";
import { sampleOwnedIds } from "@/data/sampleOwned";
import { analyzeRosterForTeamBuild, buildTeamRecommendations } from "@/lib/teamBuilder";
import { useAccountGrowthState } from "@/lib/accountGrowthStorage";
import { storeOwnedIds, useOwnedIds, useOwnedNikkeStates } from "@/lib/storage";
import { contentDescriptions, contentLabels, type ContentType } from "@/types/content";
import { ContentSelector } from "./ContentSelector";
import { EmptyState } from "./EmptyState";
import { TeamResultCard } from "./TeamResultCard";
import { WarningBox } from "./WarningBox";

const manufacturers = ["all", ...Array.from(new Set(nikkes.map((nikke) => nikke.manufacturer))).sort((a, b) => a.localeCompare(b, "ko"))];

export function RecommendClient() {
  const ownedIds = useOwnedIds();
  const ownedStates = useOwnedNikkeStates();
  const accountGrowth = useAccountGrowthState();
  const [content, setContent] = useState<ContentType>("story");
  const [manufacturer, setManufacturer] = useState("all");
  const [recommendations, setRecommendations] = useState<ReturnType<typeof buildTeamRecommendations>>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  const owned = useMemo(() => nikkes.filter((nikke) => ownedIds.includes(nikke.id)), [ownedIds]);
  const rosterIssue = useMemo(() => analyzeRosterForTeamBuild(owned, { manufacturer }), [manufacturer, owned]);

  useEffect(() => {
    if (owned.length < 5) {
      return;
    }

    let computeTimer: number | undefined;
    const timer = window.setTimeout(() => {
      setIsCalculating(true);
      computeTimer = window.setTimeout(() => {
        setRecommendations(buildTeamRecommendations(owned, content, { manufacturer, accountGrowth, ownedStates }));
        setIsCalculating(false);
      }, 0);
    }, 0);

    return () => {
      window.clearTimeout(timer);
      if (computeTimer !== undefined) {
        window.clearTimeout(computeTimer);
      }
    };
  }, [accountGrowth, content, manufacturer, owned, ownedStates]);

  const loadSample = () => {
    storeOwnedIds(sampleOwnedIds);
  };

  return (
    <div className="space-y-5">
      <section className="hud-panel p-5">
        <p className="text-sm font-black uppercase text-magenta">Squad Builder · 보유 {owned.length}명 기준</p>
        <h1 className="mt-2 text-2xl font-black text-white">콘텐츠별 조합 추천</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">{contentDescriptions[content]}</p>
        <div className="mt-5">
          <ContentSelector value={content} onChange={setContent} />
        </div>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex flex-col gap-2 text-sm text-slate-400 sm:w-72">
            타워 기업 필터 준비
            <select value={manufacturer} onChange={(event) => setManufacturer(event.target.value)} className="input">
              {manufacturers.map((item) => (
                <option key={item} value={item}>
                  {item === "all" ? "전체 기업" : item}
                </option>
              ))}
            </select>
          </label>
          {owned.length < 5 ? (
            <button type="button" onClick={loadSample} className="btn-secondary w-fit">
              샘플 보유 불러오기
            </button>
          ) : null}
        </div>
      </section>

      {owned.length === 0 ? (
        <EmptyState title="보유 니케를 먼저 선택하세요" description="로스터가 비어 있으면 스쿼드 추천을 계산할 수 없습니다." actionHref="/owned" actionLabel="보유 니케 선택" />
      ) : owned.length < 5 ? (
        <WarningBox title="보유 니케가 부족합니다">{rosterIssue.message}</WarningBox>
      ) : null}

      {owned.length >= 5 && isCalculating ? (
        <section className="hud-card p-5 text-sm leading-6 text-slate-400">
          조합 추천을 계산 중입니다. 화면은 먼저 열어두고 계산만 뒤에서 처리합니다.
        </section>
      ) : null}

      {owned.length >= 5 && !isCalculating && recommendations.length === 0 ? (
        <EmptyState title="조합을 만들 수 없습니다" description={rosterIssue.message} actionHref="/owned" actionLabel="로스터 보강" />
      ) : null}

      {owned.length >= 5 && !isCalculating && recommendations.length > 0 && rosterIssue.missingBursts.length > 0 ? (
        <WarningBox title="버스트 루프 경고">{rosterIssue.message}</WarningBox>
      ) : null}

      <section className="space-y-4">
        {owned.length >= 5 && !isCalculating ? recommendations.map((team) => (
          <TeamResultCard key={team.id} team={team} />
        )) : null}
      </section>

      {recommendations.length > 0 ? (
        <p className="text-sm leading-6 text-slate-500">
          {contentLabels[content]} 추천은 샘플 데이터 기반 계산입니다. 실제 메타는 패치, 보스 기믹, 장비 상태에 따라 달라질 수 있습니다.
        </p>
      ) : null}
    </div>
  );
}
