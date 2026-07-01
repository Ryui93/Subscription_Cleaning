import Link from "next/link";
import { AlertTriangle, BarChart3, Database, FileSearch, ShieldCheck, Sparkles } from "lucide-react";
import { missingPlaceholderNikkes, nikkes } from "@/data/nikkes";
import { getDataQualityStats, getReviewPriority, sourceStatusLabels } from "@/lib/dataQuality";

const formatPercent = (value: number) => `${value}%`;

export default function AdminPage() {
  const stats = getDataQualityStats(nikkes);
  const priority = getReviewPriority(nikkes).slice(0, 30);
  const missingPlaceholderCount = missingPlaceholderNikkes.filter((nikke) => nikke.sourceStatus === "placeholder").length;

  const statCards = [
    { label: "전체 니케", value: `${stats.total}명`, icon: Database },
    { label: "SSR", value: `${stats.byRarity.SSR}명`, icon: Sparkles },
    { label: "SR", value: `${stats.byRarity.SR}명`, icon: Sparkles },
    { label: "R", value: `${stats.byRarity.R}명`, icon: Sparkles },
    { label: sourceStatusLabels.verified, value: `${stats.bySourceStatus.verified}명`, icon: ShieldCheck },
    { label: sourceStatusLabels.communityChecked, value: `${stats.bySourceStatus.communityChecked}명`, icon: ShieldCheck },
    { label: sourceStatusLabels.needsReview, value: `${stats.bySourceStatus.needsReview}명`, icon: AlertTriangle },
    { label: "임시 데이터 전체", value: `${stats.bySourceStatus.placeholder}명`, icon: AlertTriangle },
    { label: "누락 placeholder", value: `${missingPlaceholderCount}명`, icon: AlertTriangle },
    { label: "한정", value: `${stats.limitedCount}명`, icon: BarChart3 },
    { label: "콜라보", value: `${stats.collabCount}명`, icon: BarChart3 },
    { label: "필그림", value: `${stats.pilgrimCount}명`, icon: BarChart3 },
    { label: "어브노멀", value: `${stats.abnormalCount}명`, icon: BarChart3 },
    { label: "Treasure placeholder", value: `${stats.treasurePlaceholderCount}명`, icon: FileSearch }
  ];

  return (
    <div className="space-y-5">
      <section className="hud-panel p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase text-magenta">Data Maintenance Bay</p>
            <h1 className="mt-2 text-2xl font-black text-white">데이터 검수 대시보드</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
              209명 로스터의 검수 상태, placeholder 비율, 추천 알고리즘 신뢰도 리스크를 한 화면에서 확인합니다.
            </p>
          </div>
          <Link href="/admin/data-quality" className="btn-secondary w-fit">
            데이터 품질 표 열기
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {statCards.map((card) => (
          <StatCard key={card.label} icon={card.icon} label={card.label} value={card.value} />
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <article className="hud-card p-5">
          <p className="text-xs font-black uppercase text-signal">Review Completion</p>
          <p className="mt-3 text-4xl font-black text-white">{formatPercent(stats.reviewCompleteRate)}</p>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            검수 완료율은 `verified + communityChecked`를 전체 로스터로 나눈 값입니다.
          </p>
        </article>
        <article className="hud-card p-5">
          <p className="text-xs font-black uppercase text-magenta">Placeholder Ratio</p>
          <p className="mt-3 text-4xl font-black text-white">{formatPercent(stats.placeholderRate)}</p>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            placeholder는 추천에서 제외하지 않지만 신뢰도 경고와 점수 감점이 적용됩니다.
          </p>
        </article>
        <article className="hud-card p-5">
          <p className="text-xs font-black uppercase text-amber">Algorithm Confidence</p>
          <p className="mt-3 text-2xl font-black text-white">검수 데이터 우선</p>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            조합에 placeholder가 포함되면 추천 신뢰도는 낮음으로 표시됩니다. needsReview는 보통 또는 낮음의 원인이 됩니다.
          </p>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_1.9fr]">
        <article className="hud-card p-5">
          <h2 className="text-lg font-black text-white">다음 검수 우선순위</h2>
          <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
            <p>1. SSR placeholder의 한국어명, 버스트, 무기, 속성, 제조사 확인</p>
            <p>2. 필그림/한정/콜라보 항목의 availability와 별칭 보강</p>
            <p>3. needsReview 캐릭터의 스킬작, 오버로드, 큐브 메모 검수</p>
            <p>4. contentScores 평균 0 또는 50 미만 항목의 콘텐츠별 점수 입력</p>
          </div>
        </article>

        <article className="hud-card p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-black text-white">검수 우선순위 TOP 30</h2>
            <span className="rounded-md border border-magenta/35 bg-magenta/10 px-2 py-1 text-xs font-bold text-magenta">
              {priority.length}개 항목
            </span>
          </div>
          <div className="mt-4 max-h-[560px] space-y-2 overflow-y-auto pr-1">
            {priority.map((item, index) => (
              <div key={item.nikke.id} className="rounded-md border border-white/10 bg-black/30 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-black text-amber">#{index + 1} · score {item.priorityScore}</p>
                    <p className="mt-1 font-black text-white">{item.nikke.name}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      {item.nikke.rarity} · {item.nikke.manufacturer} · {sourceStatusLabels[item.nikke.sourceStatus]}
                    </p>
                  </div>
                  <span className="rounded-md border border-signal/30 bg-signal/10 px-2 py-1 text-xs font-bold text-signal">
                    {item.suggestedAction}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-400">{item.reasons.slice(0, 4).join(" / ")}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}

type StatCardProps = {
  icon: typeof Database;
  label: string;
  value: string;
};

function StatCard({ icon: Icon, label, value }: StatCardProps) {
  return (
    <article className="hud-card p-4">
      <Icon className="h-5 w-5 text-signal" aria-hidden />
      <p className="mt-3 text-sm text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-black text-white">{value}</p>
    </article>
  );
}
