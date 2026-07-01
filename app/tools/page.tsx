"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { externalTools } from "@/data/externalTools";
import { EmptyState } from "@/components/EmptyState";
import { ExternalToolCard } from "@/components/ExternalToolCard";
import { externalToolCategoryLabels, type ExternalToolCategory } from "@/types/tool";

const categories: Array<"all" | ExternalToolCategory> = ["all", ...(Object.keys(externalToolCategoryLabels) as ExternalToolCategory[])];

export default function ToolsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | ExternalToolCategory>("all");

  const filteredTools = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("ko-KR");

    return externalTools.filter((tool) => {
      const matchesCategory = category === "all" || tool.category === category;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        tool.name.toLocaleLowerCase("ko-KR").includes(normalizedQuery) ||
        tool.description.toLocaleLowerCase("ko-KR").includes(normalizedQuery) ||
        tool.recommendedUse.toLocaleLowerCase("ko-KR").includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  return (
    <div className="space-y-5">
      <section className="hud-panel p-5">
        <p className="text-sm font-black uppercase text-magenta">External Terminal</p>
        <h1 className="mt-2 text-2xl font-black text-white">외부 도구 모음</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
          외부 사이트의 내용을 저장하지 않고, 사이트명과 링크, 짧은 추천 용도만 제공합니다.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_260px]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden />
            <input value={query} onChange={(event) => setQuery(event.target.value)} className="input pl-9" placeholder="도구 이름, 용도 검색" />
          </label>
          <select value={category} onChange={(event) => setCategory(event.target.value as "all" | ExternalToolCategory)} className="input" aria-label="카테고리 필터">
            {categories.map((item) => (
              <option key={item} value={item}>
                {item === "all" ? "카테고리 전체" : externalToolCategoryLabels[item]}
              </option>
            ))}
          </select>
        </div>
      </section>
      {filteredTools.length === 0 ? (
        <EmptyState title="검색 결과가 없습니다" description="검색어를 줄이거나 카테고리 필터를 전체로 바꿔보세요." />
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredTools.map((tool) => (
            <ExternalToolCard key={tool.id} tool={tool} />
          ))}
        </section>
      )}
      <section className="hud-card p-4 text-sm leading-6 text-slate-400">
        분류: {Object.values(externalToolCategoryLabels).join(" / ")}
      </section>
    </div>
  );
}
