"use client";

import { useEffect, useMemo, useState } from "react";
import { nikkes } from "@/data/nikkes";
import { useAccountGrowthState } from "@/lib/accountGrowthStorage";
import { sampleOwnedIds } from "@/data/sampleOwned";
import { getGrowthRecommendations } from "@/lib/growthRecommender";
import { storeOwnedIds, useOwnedIds, useOwnedNikkeStates } from "@/lib/storage";
import { contentLabels, contentTypes, type ContentType } from "@/types/content";
import { ContentSelector } from "./ContentSelector";
import { EmptyState } from "./EmptyState";
import { GrowthPriorityCard } from "./GrowthPriorityCard";

export function GrowthClient() {
  const ownedIds = useOwnedIds();
  const ownedStates = useOwnedNikkeStates();
  const accountGrowth = useAccountGrowthState();
  const [content, setContent] = useState<ContentType>("story");
  const [recommendations, setRecommendations] = useState<ReturnType<typeof getGrowthRecommendations> | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const owned = useMemo(() => nikkes.filter((nikke) => ownedIds.includes(nikke.id)), [ownedIds]);

  useEffect(() => {
    if (owned.length === 0) {
      return;
    }

    let computeTimer: number | undefined;
    const timer = window.setTimeout(() => {
      setIsCalculating(true);
      computeTimer = window.setTimeout(() => {
        setRecommendations(getGrowthRecommendations(owned, ownedStates, accountGrowth));
        setIsCalculating(false);
      }, 0);
    }, 0);

    return () => {
      window.clearTimeout(timer);
      if (computeTimer !== undefined) {
        window.clearTimeout(computeTimer);
      }
    };
  }, [accountGrowth, owned, ownedStates]);

  const loadSample = () => {
    storeOwnedIds(sampleOwnedIds);
  };

  return (
    <div className="space-y-5">
      <section className="hud-panel p-5">
        <p className="text-sm font-black uppercase text-magenta">Growth Order · 보유 {owned.length}명 기준</p>
        <h1 className="mt-2 text-2xl font-black text-white">육성 추천</h1>
        <div className="mt-5">
          <ContentSelector value={content} onChange={setContent} />
        </div>
        {owned.length === 0 ? (
          <button type="button" onClick={loadSample} className="btn-secondary mt-4">
            샘플 보유 불러오기
          </button>
        ) : null}
      </section>

      {owned.length === 0 ? (
        <EmptyState title="보유 니케를 먼저 선택하세요" description="내 보유 니케를 선택하면 전체, 스토리, 보스전, 아레나, 솔로레이드 우선순위가 계산됩니다." actionHref="/owned" actionLabel="보유 니케 선택" />
      ) : isCalculating || !recommendations ? (
        <section className="hud-card p-5 text-sm leading-6 text-slate-400">
          육성 추천을 계산 중입니다. 탭 이동을 먼저 처리한 뒤 추천 목록을 채웁니다.
        </section>
      ) : (
        <>
          <section>
            <div className="mb-3 flex items-end justify-between gap-3">
              <div>
                <p className="text-sm font-black uppercase text-magenta">TOP 10</p>
                <h2 className="text-xl font-black text-white">전체 육성 우선순위</h2>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {recommendations.overall.map((item, index) => (
                <GrowthPriorityCard key={item.nikke.id} item={item} rank={index + 1} />
              ))}
            </div>
          </section>

          <section>
            <p className="text-sm font-black uppercase text-magenta">{contentLabels[content]}</p>
            <h2 className="mt-1 text-xl font-black text-white">선택 콘텐츠 우선 육성</h2>
            <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
              {recommendations.byContent[content].map((item, index) => (
                <GrowthPriorityCard key={item.nikke.id} item={item} rank={index + 1} compact />
              ))}
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-4">
            <PriorityList title="스킬작 추천" items={recommendations.skill.slice(0, 5)} getDetail={(item) => item.skillPlan} />
            <PriorityList title="오버로드 추천" items={recommendations.overload.slice(0, 5)} getDetail={(item) => item.overloadPlan} />
            <PriorityList title="큐브 추천" items={recommendations.cube.slice(0, 5)} getDetail={(item) => item.cubePlan} />
            <PriorityList title="소장품 추천" items={recommendations.collection.slice(0, 5)} getDetail={(item) => item.collectionPlan} />
          </section>

          <section className="grid gap-4 xl:grid-cols-3">
            <EquipmentPriorityList title="장비 강화 우선순위 TOP 10" items={recommendations.equipment} />
            <EquipmentPriorityList title="오버로드 우선순위 TOP 10" items={recommendations.overloadEquipment} />
            <EquipmentPriorityList title="오버로드 옵션 검수 필요" items={recommendations.overloadOptionReview} />
          </section>

          <section>
            <p className="text-sm font-black uppercase text-magenta">Content Summary</p>
            <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {contentTypes.map((type) => (
                  <div key={type} className="hud-card p-4">
                  <h3 className="text-sm font-black text-white">{contentLabels[type]}</h3>
                  <p className="mt-2 text-sm text-slate-400">
                    {recommendations.byContent[type]
                      .slice(0, 3)
                      .map((item) => item.nikke.name)
                      .join(" / ")}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

type PriorityListProps = {
  title: string;
  items: ReturnType<typeof getGrowthRecommendations>["overall"];
  getDetail: (item: ReturnType<typeof getGrowthRecommendations>["overall"][number]) => string;
};

function PriorityList({ title, items, getDetail }: PriorityListProps) {
  return (
    <article className="hud-card p-4">
      <h2 className="text-base font-black text-white">{title}</h2>
      <ol className="mt-3 space-y-3 text-sm">
        {items.map((item, index) => (
          <li key={item.nikke.id} className="text-slate-300">
            <span className="font-black text-signal">{index + 1}. {item.nikke.name}</span>
            <span className="mt-1 block leading-6 text-slate-500">{getDetail(item)}</span>
          </li>
        ))}
      </ol>
    </article>
  );
}

type EquipmentPriorityListProps = {
  title: string;
  items: ReturnType<typeof getGrowthRecommendations>["equipment"];
};

function EquipmentPriorityList({ title, items }: EquipmentPriorityListProps) {
  return (
    <article className="hud-card p-4">
      <h2 className="text-base font-black text-white">{title}</h2>
      {items.length > 0 ? (
        <ol className="mt-3 space-y-3 text-sm">
          {items.map((item, index) => (
            <li key={`${item.category}-${item.nikke.id}`} className="text-slate-300">
              <span className="font-black text-signal">
                {index + 1}. {item.nikke.name} · {item.priority} · {item.score}
              </span>
              <span className="mt-1 block leading-6 text-slate-500">{item.currentStateSummary}</span>
              <span className="mt-1 block leading-6 text-slate-400">{item.recommendedAction}</span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-3 text-sm leading-6 text-slate-500">입력된 장비 정보 기준으로 표시할 항목이 없습니다.</p>
      )}
    </article>
  );
}
