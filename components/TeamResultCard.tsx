import { AlertTriangle, CircleGauge, Replace } from "lucide-react";
import type { TeamRecommendation, TeamSlotKey } from "@/types/team";
import { roleLabels } from "@/types/nikke";
import { sourceStatusLabels } from "@/lib/dataQuality";

const slotLabels: Record<TeamSlotKey, string> = {
  burst1: "버스트1",
  burst2: "버스트2",
  burst3: "버스트3",
  subDps: "서브 딜러",
  support: "서포터"
};

type TeamResultCardProps = {
  team: TeamRecommendation;
};

export function TeamResultCard({ team }: TeamResultCardProps) {
  const needsReviewMembers = team.members.filter((nikke) => nikke.sourceStatus === "needsReview" || nikke.sourceStatus === "placeholder");
  const confidenceClassName =
    team.confidence.level === "높음"
      ? "border-signal/45 bg-signal/10 text-signal"
      : team.confidence.level === "보통"
        ? "border-amber/45 bg-amber/10 text-amber"
        : "border-magenta/45 bg-magenta/10 text-magenta";

  return (
    <article className="hud-panel p-5">
      <div className="flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase text-magenta">Squad Formation</p>
          <h2 className="mt-2 break-keep text-2xl font-black text-white">{team.name}</h2>
          <p className="mt-2 break-keep text-sm font-semibold text-slate-300">{team.members.map((nikke) => nikke.name).join(" / ")}</p>
          {needsReviewMembers.length > 0 ? (
            <p className="mt-2 text-xs font-bold text-magenta">
              이 조합에는 검수 필요 데이터가 포함되어 있습니다. 실제 성능과 추천 우선순위는 최신 메타와 다를 수 있습니다.
            </p>
          ) : null}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {needsReviewMembers.map((nikke) => (
              <span key={nikke.id} className="rounded-md border border-magenta/35 bg-magenta/10 px-2 py-1 text-[11px] font-bold text-magenta">
                {nikke.name} · {sourceStatusLabels[nikke.sourceStatus]}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="inline-flex w-fit items-center gap-2 rounded-md border border-signal/45 bg-black/40 px-4 py-3 text-signal shadow-glow">
            <CircleGauge className="h-4 w-4" aria-hidden />
            <span className="text-xs font-black uppercase">Sync</span>
            <span className="text-2xl font-black">{team.score}</span>
          </div>
          <div className={`w-fit rounded-md border px-4 py-2 text-xs font-bold ${confidenceClassName}`}>
            추천 신뢰도: {team.confidence.level} · 검수 {team.confidence.verifiedCount} / 검수필요 {team.confidence.needsReviewCount} / 임시 {team.confidence.placeholderCount}
          </div>
        </div>
      </div>

      <p className="mt-3 rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm leading-6 text-slate-300">{team.confidence.message}</p>

      <details className="mt-3 rounded-md border border-white/10 bg-black/25 px-3 py-2 text-sm text-slate-300">
        <summary className="cursor-pointer text-xs font-black uppercase text-signal">점수 근거 보기</summary>
        <div className="mt-3 grid gap-2 sm:grid-cols-5">
          <div>
            <p className="text-[10px] uppercase text-slate-500">기본 점수</p>
            <p className="font-black text-white">{team.scoreDetails.baseAverage}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase text-slate-500">역할 점수</p>
            <p className="font-black text-white">{team.scoreDetails.roleScore}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase text-slate-500">역할 적합도</p>
            <p className="font-black text-white">{team.scoreDetails.roleFitScore}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase text-slate-500">팀 시너지</p>
            <p className="font-black text-white">{team.scoreDetails.teamSynergyScore}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase text-slate-500">신뢰도 보정</p>
            <p className="font-black text-white">{team.scoreDetails.sourcePenalty}</p>
          </div>
        </div>
      </details>

      <details className="mt-3 rounded-md border border-white/10 bg-black/25 px-3 py-2 text-sm text-slate-300">
        <summary className="cursor-pointer text-xs font-black uppercase text-signal">계정 성장 반영</summary>
        {team.accountGrowthNotes.length > 0 ? (
          <ul className="mt-3 space-y-1 leading-6">
            {team.accountGrowthNotes.slice(0, 10).map((note) => (
              <li key={note}>- {note}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-slate-400">계정 성장 정보가 입력되지 않아 기본 추천 점수만 사용했습니다.</p>
        )}
        {team.accountGrowthWarnings.length > 0 ? (
          <div className="mt-3 space-y-1 text-xs text-amber">
            {team.accountGrowthWarnings.slice(0, 3).map((warning) => (
              <p key={warning}>- {warning}</p>
            ))}
          </div>
        ) : null}
      </details>

      <details className="mt-3 rounded-md border border-white/10 bg-black/25 px-3 py-2 text-sm text-slate-300">
        <summary className="cursor-pointer text-xs font-black uppercase text-signal">장비 보정</summary>
        {team.equipmentNotes.length > 0 ? (
          <ul className="mt-3 space-y-1 leading-6">
            {team.equipmentNotes.slice(0, 10).map((note) => (
              <li key={note}>- {note}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-slate-400">장비 정보가 입력되지 않아 장비 보정 없이 계산했습니다.</p>
        )}
        {team.equipmentWarnings.length > 0 ? (
          <div className="mt-3 space-y-1 text-xs text-amber">
            {team.equipmentWarnings.slice(0, 5).map((warning) => (
              <p key={warning}>- {warning}</p>
            ))}
          </div>
        ) : null}
      </details>

      <div className="mt-4 grid gap-2 md:grid-cols-5">
        {(Object.keys(slotLabels) as TeamSlotKey[]).map((slot) => (
          <div key={slot} className="hud-card min-h-24 p-3">
            <p className="text-[10px] font-black uppercase text-amber">{slotLabels[slot]}</p>
            <div className="mt-3 flex items-center gap-2">
              <div className="operator-portrait h-11 w-10 text-xs">
                <span>{team.slots[slot]?.name.slice(0, 2) ?? "--"}</span>
              </div>
              <p className="break-keep text-sm font-black text-white">{team.slots[slot]?.name ?? "미배치"}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <section>
          <h3 className="section-title">추천 이유</h3>
          <ul className="space-y-2 text-sm leading-6 text-slate-300">
            {team.reasons.map((reason) => (
              <li key={reason}>· {reason}</li>
            ))}
          </ul>
        </section>
        <section>
          <h3 className="section-title">부족한 역할</h3>
          {team.missingRoles.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {team.missingRoles.map((role) => (
              <span key={role} className="rounded-md border border-amber/35 bg-amber/10 px-2 py-1 text-xs font-bold text-amber">
                  {roleLabels[role]}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-300">핵심 역할이 고르게 확보되었습니다.</p>
          )}
          {team.warnings.map((warning) => (
            <p key={warning} className="mt-2 flex gap-2 text-sm text-amber">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              {warning}
            </p>
          ))}
        </section>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <section>
          <h3 className="section-title">육성 우선순위</h3>
          <ol className="space-y-2 text-sm text-slate-300">
            {team.growthOrder.map((nikke, index) => (
              <li key={nikke.id}>
                {index + 1}. {nikke.name}
              </li>
            ))}
          </ol>
        </section>
        <section>
          <h3 className="section-title">대체 니케</h3>
          <div className="space-y-2">
            {team.alternatives.map((alternative) => (
            <div key={alternative.nikke.id} className="flex items-center justify-between gap-2 rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm">
                <span className="text-white">{alternative.nikke.name}</span>
                <span className={alternative.available ? "text-signal" : "text-slate-500"}>
                  {alternative.available ? "보유" : "미보유"} · {alternative.reason}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-3">
        <section>
          <h3 className="section-title">스킬작</h3>
          <ul className="space-y-1 text-sm leading-6 text-slate-400">
            {team.skillOrder.slice(0, 5).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section>
          <h3 className="section-title">장비/오버로드</h3>
          <ul className="space-y-1 text-sm leading-6 text-slate-400">
            {team.gearOrder.slice(0, 5).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section>
          <h3 className="section-title">큐브와 운용</h3>
          <ul className="space-y-1 text-sm leading-6 text-slate-400">
            {team.cubeNotes.slice(0, 3).map((item) => (
              <li key={item}>{item}</li>
            ))}
            {team.operationNotes.slice(0, 2).map((item) => (
              <li key={item} className="flex gap-2 text-slate-300">
                <Replace className="mt-1 h-3.5 w-3.5 shrink-0 text-signal" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  );
}
