"use client";

import { useMemo, useState } from "react";
import { communitySignals } from "@/data/communitySignals";
import { EmptyState } from "@/components/EmptyState";
import { MetaSignalCard } from "@/components/MetaSignalCard";
import { WarningBox } from "@/components/WarningBox";
import { contentLabels, contentTypes, type ContentType } from "@/types/content";
import { communitySourceLabels, type CommunitySignalSource } from "@/types/meta";

const sources: Array<"all" | CommunitySignalSource> = ["all", ...(Object.keys(communitySourceLabels) as CommunitySignalSource[])];
type VerifiedFilter = "all" | "verified" | "unverified";
const sentiments = ["all", "positive", "negative", "mixed", "neutral"] as const;

const sentimentLabels: Record<(typeof sentiments)[number], string> = {
  all: "반응 전체",
  positive: "긍정",
  negative: "부정",
  mixed: "혼합",
  neutral: "중립"
};

export default function MetaPage() {
  const [source, setSource] = useState<"all" | CommunitySignalSource>("all");
  const [content, setContent] = useState<"all" | ContentType>("all");
  const [verified, setVerified] = useState<VerifiedFilter>("all");
  const [sentiment, setSentiment] = useState<(typeof sentiments)[number]>("all");
  const verifiedCount = communitySignals.filter((signal) => signal.adminVerified).length;

  const filteredSignals = useMemo(() => {
    return communitySignals.filter((signal) => {
      const matchesSource = source === "all" || signal.source === source;
      const matchesContent = content === "all" || signal.contentTypes.includes(content);
      const matchesVerified =
        verified === "all" ||
        (verified === "verified" && signal.adminVerified) ||
        (verified === "unverified" && !signal.adminVerified);
      const matchesSentiment = sentiment === "all" || signal.sentiment === sentiment;

      return matchesSource && matchesContent && matchesVerified && matchesSentiment;
    });
  }, [content, sentiment, source, verified]);

  return (
    <div className="space-y-5">
      <section className="hud-panel p-5">
        <p className="text-sm font-black uppercase text-magenta">Meta Signal Control</p>
        <h1 className="mt-2 text-2xl font-black text-white">메타 참고</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
          커뮤니티 원문은 저장하지 않고 제목, URL, 요약, 태그, 신뢰도, 관리자 검수 여부만 관리합니다.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <select value={source} onChange={(event) => setSource(event.target.value as "all" | CommunitySignalSource)} className="input">
            {sources.map((item) => (
              <option key={item} value={item}>
                {item === "all" ? "출처 전체" : communitySourceLabels[item]}
              </option>
            ))}
          </select>
          <select value={content} onChange={(event) => setContent(event.target.value as "all" | ContentType)} className="input">
            <option value="all">콘텐츠 전체</option>
            {contentTypes.map((item) => (
              <option key={item} value={item}>
                {contentLabels[item]}
              </option>
            ))}
          </select>
          <select value={verified} onChange={(event) => setVerified(event.target.value as VerifiedFilter)} className="input">
            <option value="all">검수 전체</option>
            <option value="verified">검수 완료</option>
            <option value="unverified">참고 전용</option>
          </select>
          <select value={sentiment} onChange={(event) => setSentiment(event.target.value as (typeof sentiments)[number])} className="input">
            {sentiments.map((item) => (
              <option key={item} value={item}>
                {sentimentLabels[item]}
              </option>
            ))}
          </select>
        </div>
      </section>
      <WarningBox title="추천 반영 기준">
        관리자 검수 완료 데이터만 추천 점수에 강하게 반영됩니다. 검수 전 데이터는 참고 카드로 표시하되 추천에는 약하게 반영됩니다.
      </WarningBox>
      <section>
        <div className="mb-3">
          <p className="text-sm font-black uppercase text-magenta">{verifiedCount}개 검수 완료</p>
          <h2 className="text-xl font-black text-white">참고 신호</h2>
        </div>
        {filteredSignals.length === 0 ? (
          <EmptyState title="메타 참고 데이터가 없습니다" description="필터 조건을 바꾸거나 관리자 데이터에 새 참고 신호를 추가하세요." />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {filteredSignals.map((signal) => (
              <MetaSignalCard key={signal.id} signal={signal} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
