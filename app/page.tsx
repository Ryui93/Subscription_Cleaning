"use client";

import Link from "next/link";
import { ArrowRight, Crosshair, Database, Radar, Sparkles, TrendingUp, Users, Wrench } from "lucide-react";
import { communitySignals } from "@/data/communitySignals";
import { externalTools } from "@/data/externalTools";
import { MetaSignalCard } from "@/components/MetaSignalCard";
import { useOwnedIds } from "@/lib/storage";

const features = [
  { title: "로스터 동기화", text: "보유 니케를 체크하면 브라우저에 저장되고 추천 계산에 즉시 반영됩니다.", icon: Users },
  { title: "스쿼드 편성", text: "버스트 순환, 쿨타임, 딜러 수, 역할 밸런스, 콘텐츠 점수를 합산합니다.", icon: Sparkles },
  { title: "육성 지령", text: "누구부터 스킬작/오버로드/큐브 투자를 할지 우선순위를 보여줍니다.", icon: TrendingUp },
  { title: "외부 단말", text: "ENIKK, Nikke Tools, Nikke Deck 같은 참고 도구로 바로 이동합니다.", icon: Wrench },
  { title: "메타 신호", text: "공식/도구/커뮤니티 출처와 관리자 검수 여부를 분리해서 다룹니다.", icon: Database }
];

const squadPreview = ["B1", "B2", "B3", "SUB", "SUP"];

export default function HomePage() {
  const ownedIds = useOwnedIds();
  const recentSignals = communitySignals.slice(0, 2);
  const verifiedMetaCount = communitySignals.filter((signal) => signal.adminVerified).length;

  return (
    <div className="space-y-8">
      <section className="grid min-h-[58vh] items-center gap-8 py-4 lg:grid-cols-[1fr_1fr]">
        <div className="hud-panel p-5 md:p-7">
          <div className="mb-5 flex items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <p className="text-xs font-black uppercase text-magenta">Commander Console</p>
              <h1 className="mt-2 break-keep text-4xl font-black text-white md:text-6xl">니케의 모든 것</h1>
            </div>
            <div className="hidden rounded-md border border-amber/40 bg-black/35 px-3 py-2 text-xs font-black text-amber md:block">
              MVP-01
            </div>
          </div>
          <p className="max-w-2xl break-keep text-base leading-8 text-slate-300">
            보유 니케 기준으로 작전 콘텐츠에 맞는 스쿼드를 편성하고, 부족한 역할과 다음 육성 대상을 한 번에 확인하는 비공식 전술 단말입니다.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/owned" className="btn-primary">
              로스터 선택
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link href="/recommend" className="btn-secondary">
              스쿼드 추천
            </Link>
            <Link href="/tools" className="btn-secondary">
              외부 단말
            </Link>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-md border border-signal/25 bg-black/30 p-3">
              <p className="text-[10px] font-black uppercase text-signal">Owned</p>
              <p className="mt-1 text-2xl font-black text-white">{ownedIds.length}</p>
            </div>
            <div className="rounded-md border border-magenta/25 bg-black/30 p-3">
              <p className="text-[10px] font-black uppercase text-magenta">External Tools</p>
              <p className="mt-1 text-2xl font-black text-white">{externalTools.length}</p>
            </div>
            <div className="rounded-md border border-amber/30 bg-black/30 p-3">
              <p className="text-[10px] font-black uppercase text-amber">Verified Meta</p>
              <p className="mt-1 text-2xl font-black text-white">{verifiedMetaCount}</p>
            </div>
          </div>
        </div>

        <div className="hud-panel min-h-96 p-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <p className="text-xs font-black uppercase text-magenta">Operation Briefing</p>
              <h2 className="mt-1 text-2xl font-black text-white">스쿼드 시뮬레이터</h2>
            </div>
            <Radar className="h-7 w-7 text-signal" aria-hidden />
          </div>

          <div className="scanline mt-5 rounded-md border border-white/10 bg-black/35 p-4">
            <div className="grid gap-3 sm:grid-cols-5">
              {squadPreview.map((slot, index) => (
                <div key={slot} className="hud-card min-h-28 p-3">
                  <p className="text-[10px] font-black text-amber">SLOT {index + 1}</p>
                  <div className="operator-portrait mx-auto mt-3 h-14 w-12 text-xs">
                    <span>{slot}</span>
                  </div>
                  <p className="mt-3 text-center text-xs font-black text-white">{slot}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-md border border-signal/25 bg-signal/10 p-3">
              <p className="text-[10px] font-black uppercase text-signal">Burst Loop</p>
              <p className="mt-1 text-xl font-black text-white">B1-B2-B3</p>
            </div>
            <div className="rounded-md border border-magenta/25 bg-magenta/10 p-3">
              <p className="text-[10px] font-black uppercase text-magenta">Role Check</p>
              <p className="mt-1 text-xl font-black text-white">DPS/SUP</p>
            </div>
            <div className="rounded-md border border-amber/30 bg-amber/10 p-3">
              <p className="text-[10px] font-black uppercase text-amber">Meta Signal</p>
              <p className="mt-1 text-xl font-black text-white">Verified</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center gap-2">
          <Crosshair className="h-5 w-5 text-signal" aria-hidden />
          <div>
            <p className="text-sm font-black uppercase text-magenta">Meta Signal</p>
            <h2 className="text-xl font-black text-white">최근 메타 참고</h2>
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {recentSignals.map((signal) => (
            <MetaSignalCard key={signal.id} signal={signal} />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3">
          <p className="text-sm font-black uppercase text-magenta">System Modules</p>
          <h2 className="text-xl font-black text-white">작전 모듈</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article key={feature.title} className="hud-card p-4">
                <Icon className="h-5 w-5 text-signal" aria-hidden />
                <h3 className="mt-3 break-keep text-base font-black text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{feature.text}</p>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
