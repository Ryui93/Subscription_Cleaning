"use client";

import { RotateCcw, Search, Save } from "lucide-react";
import { useMemo, useState } from "react";
import { nikkes } from "@/data/nikkes";
import {
  clearAccountGrowthState,
  updateAccountGrowthState,
  updateBondLevel,
  useAccountGrowthState
} from "@/lib/accountGrowthStorage";
import { useOwnedIds } from "@/lib/storage";
import type { AccountGrowthState } from "@/types/accountGrowth";

const INITIAL_BOND_VISIBLE_COUNT = 24;
const BOND_VISIBLE_STEP = 24;

const toOptionalNumber = (value: string) => (value === "" ? undefined : Number(value));

type NumberFieldProps = {
  label: string;
  value?: number;
  min?: number;
  max?: number;
  onChange: (value?: number) => void;
};

function NumberField({ label, value, min = 0, max, onChange }: NumberFieldProps) {
  return (
    <label className="text-xs font-bold text-slate-400">
      {label}
      <input
        type="number"
        min={min}
        max={max}
        value={value ?? ""}
        onChange={(event) => onChange(toOptionalNumber(event.target.value))}
        className="input mt-1 h-10 px-3"
      />
    </label>
  );
}

type MemoFieldProps = {
  label: string;
  value?: string;
  placeholder?: string;
  onChange: (value: string) => void;
};

function MemoField({ label, value, placeholder, onChange }: MemoFieldProps) {
  return (
    <label className="text-xs font-bold text-slate-400">
      {label}
      <textarea
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        className="input mt-1 min-h-24 resize-y px-3 py-2 leading-6"
        placeholder={placeholder}
      />
    </label>
  );
}

export function AccountGrowthClient() {
  const accountGrowth = useAccountGrowthState();
  const ownedIds = useOwnedIds();
  const [query, setQuery] = useState("");
  const [visibleBondCount, setVisibleBondCount] = useState(INITIAL_BOND_VISIBLE_COUNT);

  const ownedNikkes = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("ko-KR");
    return nikkes
      .filter((nikke) => ownedIds.includes(nikke.id))
      .filter((nikke) => {
        if (!normalizedQuery) return true;
        return (
          nikke.name.toLocaleLowerCase("ko-KR").includes(normalizedQuery) ||
          nikke.nameKo.toLocaleLowerCase("ko-KR").includes(normalizedQuery) ||
          nikke.nameEn?.toLocaleLowerCase("ko-KR").includes(normalizedQuery) ||
          nikke.aliases.some((alias) => alias.toLocaleLowerCase("ko-KR").includes(normalizedQuery))
        );
      })
      .sort((a, b) => a.name.localeCompare(b.name, "ko"));
  }, [ownedIds, query]);
  const visibleBondNikkes = useMemo(() => ownedNikkes.slice(0, visibleBondCount), [ownedNikkes, visibleBondCount]);

  const updateSynchro = (patch: Partial<AccountGrowthState["synchroDevice"]>) => {
    updateAccountGrowthState({ synchroDevice: { ...accountGrowth.synchroDevice, ...patch } });
  };

  const updateRecycling = (patch: Partial<AccountGrowthState["recyclingRoom"]>) => {
    updateAccountGrowthState({ recyclingRoom: { ...accountGrowth.recyclingRoom, ...patch } });
  };

  const updateTactics = (patch: Partial<AccountGrowthState["tacticsAcademy"]>) => {
    updateAccountGrowthState({ tacticsAcademy: { ...accountGrowth.tacticsAcademy, ...patch } });
  };

  const updateOverclock = (patch: Partial<NonNullable<AccountGrowthState["overclock"]>>) => {
    updateAccountGrowthState({ overclock: { ...accountGrowth.overclock, ...patch } });
  };

  const completedLessonsText = accountGrowth.tacticsAcademy.completedLessons?.join("\n") ?? "";
  const overclockOptionsText = accountGrowth.overclock?.selectedOptions?.join("\n") ?? "";
  const savedAt = accountGrowth.updatedAt ? new Date(accountGrowth.updatedAt).toLocaleString("ko-KR") : "미저장";

  return (
    <div className="space-y-5">
      <section className="hud-panel p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase text-magenta">Account Growth Console</p>
            <h1 className="mt-2 text-2xl font-black text-white">계정 성장</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
              솔로레이드 5덱 분배 전, 계정 투자 상태를 추천 점수와 육성 우선순위에 소폭 반영하기 위한 입력 공간입니다.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex h-10 items-center gap-2 rounded-md border border-signal/35 bg-signal/10 px-3 text-xs font-bold text-signal">
              <Save className="h-4 w-4" aria-hidden />
              저장됨: {savedAt}
            </span>
            <button type="button" onClick={clearAccountGrowthState} className="btn-secondary">
              <RotateCcw className="h-4 w-4" aria-hidden />
              초기화
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-4">
        <article className="hud-card p-4">
          <p className="text-xs font-black uppercase text-magenta">Synchro Device</p>
          <h2 className="mt-1 text-lg font-black text-white">싱크로 디바이스</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <NumberField label="현재 싱크로 레벨" value={accountGrowth.synchroDevice.synchroLevel} onChange={(value) => updateSynchro({ synchroLevel: value })} />
            <NumberField label="최대 슬롯 수" value={accountGrowth.synchroDevice.maxSynchroSlots} onChange={(value) => updateSynchro({ maxSynchroSlots: value })} />
            <NumberField label="사용 중 슬롯 수" value={accountGrowth.synchroDevice.usedSynchroSlots} onChange={(value) => updateSynchro({ usedSynchroSlots: value })} />
          </div>
          <div className="mt-3">
            <MemoField label="메모" value={accountGrowth.synchroDevice.memo} onChange={(value) => updateSynchro({ memo: value })} />
          </div>
        </article>

        <article className="hud-card p-4">
          <p className="text-xs font-black uppercase text-magenta">Recycling Room</p>
          <h2 className="mt-1 text-lg font-black text-white">리사이클룸</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <NumberField label="화력형 레벨" value={accountGrowth.recyclingRoom.attackerLevel} onChange={(value) => updateRecycling({ attackerLevel: value })} />
            <NumberField label="방어형 레벨" value={accountGrowth.recyclingRoom.defenderLevel} onChange={(value) => updateRecycling({ defenderLevel: value })} />
            <NumberField label="지원형 레벨" value={accountGrowth.recyclingRoom.supporterLevel} onChange={(value) => updateRecycling({ supporterLevel: value })} />
            <NumberField label="엘리시온 레벨" value={accountGrowth.recyclingRoom.elysionLevel} onChange={(value) => updateRecycling({ elysionLevel: value })} />
            <NumberField label="미실리스 레벨" value={accountGrowth.recyclingRoom.missilisLevel} onChange={(value) => updateRecycling({ missilisLevel: value })} />
            <NumberField label="테트라 레벨" value={accountGrowth.recyclingRoom.tetraLevel} onChange={(value) => updateRecycling({ tetraLevel: value })} />
            <NumberField label="필그림 레벨" value={accountGrowth.recyclingRoom.pilgrimLevel} onChange={(value) => updateRecycling({ pilgrimLevel: value })} />
            <NumberField label="어브노멀 레벨" value={accountGrowth.recyclingRoom.abnormalLevel} onChange={(value) => updateRecycling({ abnormalLevel: value })} />
          </div>
          <div className="mt-3">
            <MemoField label="메모" value={accountGrowth.recyclingRoom.memo} onChange={(value) => updateRecycling({ memo: value })} />
          </div>
        </article>

        <article className="hud-card p-4">
          <p className="text-xs font-black uppercase text-magenta">Tactics Academy</p>
          <h2 className="mt-1 text-lg font-black text-white">택틱 아카데미</h2>
          <div className="mt-4 space-y-3">
            <label className="text-xs font-bold text-slate-400">
              현재 진행 단계
              <input
                value={accountGrowth.tacticsAcademy.currentClass ?? ""}
                onChange={(event) => updateTactics({ currentClass: event.target.value })}
                className="input mt-1 h-10 px-3"
                placeholder="예: Class 미입력"
              />
            </label>
            <label className="text-xs font-bold text-slate-400">
              완료한 수업 메모
              <textarea
                value={completedLessonsText}
                onChange={(event) =>
                  updateTactics({
                    completedLessons: event.target.value
                      .split("\n")
                      .map((lesson) => lesson.trim())
                      .filter(Boolean)
                  })
                }
                className="input mt-1 min-h-24 resize-y px-3 py-2 leading-6"
                placeholder="줄 단위로 입력"
              />
            </label>
            <MemoField label="메모" value={accountGrowth.tacticsAcademy.memo} onChange={(value) => updateTactics({ memo: value })} />
          </div>
        </article>

        <article className="hud-card p-4">
          <p className="text-xs font-black uppercase text-magenta">Overclock</p>
          <h2 className="mt-1 text-lg font-black text-white">오버클럭</h2>
          <div className="mt-4 space-y-3">
            <label className="flex h-10 items-center gap-2 rounded-md border border-line bg-black/25 px-3 text-sm font-bold text-slate-300">
              <input
                type="checkbox"
                checked={accountGrowth.overclock?.enabled ?? false}
                onChange={(event) => updateOverclock({ enabled: event.target.checked })}
                className="h-4 w-4 accent-signal"
              />
              오버클럭 사용
            </label>
            <NumberField label="오버클럭 레벨" value={accountGrowth.overclock?.level} onChange={(value) => updateOverclock({ level: value })} />
            <label className="text-xs font-bold text-slate-400">
              선택 조건 메모
              <textarea
                value={overclockOptionsText}
                onChange={(event) =>
                  updateOverclock({
                    selectedOptions: event.target.value
                      .split("\n")
                      .map((option) => option.trim())
                      .filter(Boolean)
                  })
                }
                className="input mt-1 min-h-24 resize-y px-3 py-2 leading-6"
                placeholder="줄 단위로 조건 입력"
              />
            </label>
            <MemoField label="주의 메모" value={accountGrowth.overclock?.memo} onChange={(value) => updateOverclock({ memo: value })} />
          </div>
        </article>
      </section>

      <section className="hud-panel p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase text-magenta">Bond Level</p>
            <h2 className="mt-1 text-xl font-black text-white">호감도</h2>
            <p className="mt-2 text-sm text-slate-400">보유 니케 기준으로 입력하며, 보유 니케 카드의 호감도와 같은 데이터입니다.</p>
          </div>
          <label className="relative block w-full lg:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden />
            <input
              value={query}
              onChange={(event) => {
                setVisibleBondCount(INITIAL_BOND_VISIBLE_COUNT);
                setQuery(event.target.value);
              }}
              className="input pl-9"
              placeholder="보유 니케 검색"
            />
          </label>
        </div>

        {ownedNikkes.length > 0 ? (
          <>
          <p className="mt-4 text-sm text-slate-400">검색 결과 {ownedNikkes.length}명 · 표시 {visibleBondNikkes.length}명</p>
          <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {visibleBondNikkes.map((nikke) => {
              const bond = accountGrowth.bondLevels[nikke.id];
              return (
                <article key={nikke.id} className="hud-card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-black uppercase text-magenta">{nikke.rarity} Bond</p>
                      <h3 className="mt-1 text-lg font-black text-white">{nikke.name}</h3>
                      <p className="mt-1 text-xs text-slate-500">
                        {nikke.manufacturer} · {nikke.classType}
                      </p>
                    </div>
                    <span className="rounded-md border border-signal/35 bg-signal/10 px-2 py-1 text-xs font-black text-signal">
                      호감도 {bond?.bondLevel ?? "-"}
                    </span>
                  </div>
                  <div className="mt-3 grid gap-2">
                    <NumberField
                      label="호감도 레벨"
                      value={bond?.bondLevel}
                      max={100}
                      onChange={(value) => updateBondLevel(nikke.id, { bondLevel: value })}
                    />
                    <label className="text-xs font-bold text-slate-400">
                      호감도 메모
                      <input
                        value={bond?.bondMemo ?? ""}
                        onChange={(event) => updateBondLevel(nikke.id, { bondMemo: event.target.value })}
                        className="input mt-1 h-10 px-3"
                        placeholder="선물/상담 메모"
                      />
                    </label>
                  </div>
                </article>
              );
            })}
          </div>
          {visibleBondNikkes.length < ownedNikkes.length ? (
            <div className="mt-4 flex justify-center">
              <button type="button" onClick={() => setVisibleBondCount((current) => current + BOND_VISIBLE_STEP)} className="btn-secondary">
                더 보기 {Math.min(BOND_VISIBLE_STEP, ownedNikkes.length - visibleBondNikkes.length)}명
              </button>
            </div>
          ) : null}
          </>
        ) : (
          <div className="mt-4 rounded-md border border-line bg-black/25 p-5 text-sm text-slate-400">
            보유 니케가 없거나 검색 결과가 없습니다. 먼저 내 보유 니케에서 로스터를 선택해 주세요.
          </div>
        )}
      </section>
    </div>
  );
}
