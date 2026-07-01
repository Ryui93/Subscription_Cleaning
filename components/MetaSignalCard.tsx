import { CheckCircle2, CircleSlash } from "lucide-react";
import type { CommunitySignal } from "@/types/meta";
import { communitySourceLabels } from "@/types/meta";
import { contentLabels } from "@/types/content";

type MetaSignalCardProps = {
  signal: CommunitySignal;
};

export function MetaSignalCard({ signal }: MetaSignalCardProps) {
  const sentimentLabel = {
    positive: "긍정",
    negative: "부정",
    mixed: "혼합",
    neutral: "중립"
  }[signal.sentiment];

  return (
    <article className="hud-card p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase text-magenta">{communitySourceLabels[signal.source]} · {signal.date}</p>
          <h2 className="mt-1 break-keep text-lg font-black text-white">{signal.title}</h2>
        </div>
        <span
          className={`inline-flex w-fit items-center gap-1 rounded-md border px-2 py-1 text-xs ${
            signal.adminVerified ? "border-signal/30 bg-signal/10 text-signal" : "border-slate-600 bg-slate-800/60 text-slate-400"
          }`}
        >
          {signal.adminVerified ? <CheckCircle2 className="h-3.5 w-3.5" aria-hidden /> : <CircleSlash className="h-3.5 w-3.5" aria-hidden />}
          {signal.adminVerified ? "검수 완료" : "참고 전용"}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="rounded-md border border-signal/25 bg-signal/10 px-2 py-1 text-xs font-bold text-signal">신뢰도 {signal.confidence}</span>
        <span className="rounded-md border border-amber/25 bg-amber/10 px-2 py-1 text-xs font-bold text-amber">{sentimentLabel}</span>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-400">{signal.summary}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {signal.characters.map((character) => (
          <span key={character} className="rounded-md border border-signal/20 bg-signal/10 px-2 py-1 text-xs text-signal">
            {character}
          </span>
        ))}
        {signal.contentTypes.map((content) => (
          <span key={content} className="hud-chip">
            {contentLabels[content]}
          </span>
        ))}
        {signal.keywords.map((keyword) => (
          <span key={keyword} className="rounded-md border border-magenta/20 bg-magenta/10 px-2 py-1 text-xs text-magenta">
            {keyword}
          </span>
        ))}
      </div>
      <a href={signal.url} target="_blank" rel="noreferrer" className="mt-4 inline-flex text-sm font-semibold text-signal hover:text-white">
        출처 열기
      </a>
    </article>
  );
}
