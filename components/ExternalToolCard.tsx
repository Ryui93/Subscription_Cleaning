import { ExternalLink } from "lucide-react";
import type { ExternalTool } from "@/types/tool";
import { externalToolCategoryLabels } from "@/types/tool";

type ExternalToolCardProps = {
  tool: ExternalTool;
};

export function ExternalToolCard({ tool }: ExternalToolCardProps) {
  return (
    <article className="hud-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase text-magenta">{externalToolCategoryLabels[tool.category]}</p>
          <h2 className="mt-1 text-lg font-black text-white">{tool.name}</h2>
        </div>
        <span className="hud-chip">신뢰도 {tool.trustLevel}</span>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-400">{tool.description}</p>
      <p className="mt-3 text-sm leading-6 text-slate-300">{tool.recommendedUse}</p>
      <a href={tool.url} target="_blank" rel="noreferrer" className="btn-primary mt-4 w-full justify-center">
        사이트 열기
        <ExternalLink className="h-4 w-4" aria-hidden />
      </a>
    </article>
  );
}
