import type { GrowthPriorityItem } from "@/types/team";

type GrowthPriorityCardProps = {
  item: GrowthPriorityItem;
  rank: number;
  compact?: boolean;
};

export function GrowthPriorityCard({ item, rank, compact = false }: GrowthPriorityCardProps) {
  return (
    <article className="hud-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase text-magenta">Priority #{rank} · {item.priority}</p>
          <h3 className="mt-1 break-keep text-lg font-black text-white">{item.nikke.name}</h3>
          <p className="mt-1 text-xs text-slate-500">
            B{item.nikke.burst} · {item.nikke.classType} · {item.nikke.manufacturer}
          </p>
        </div>
        <div className="rounded-md border border-signal/40 bg-signal/10 px-2.5 py-1.5 text-sm font-black text-signal">{item.score}</div>
      </div>
      {!compact ? (
        <ul className="mt-3 space-y-1 text-sm leading-6 text-slate-400">
          {item.reasons.slice(0, 3).map((reason) => (
            <li key={reason}>· {reason}</li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
