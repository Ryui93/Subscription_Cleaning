"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { nikkes } from "@/data/nikkes";
import { sampleOwnedIds } from "@/data/sampleOwned";
import { equipmentSlots, getOverloadCount } from "@/lib/equipmentUtils";
import { defaultNikkeFilters, filterNikkes, uniqueValues, type NikkeFilterState } from "@/lib/filters";
import { updateBondLevel, useAccountGrowthState } from "@/lib/accountGrowthStorage";
import { clearStoredOwnedIds, storeOwnedIds, updateOwnedState, useOwnedIds, useOwnedNikkeStates } from "@/lib/storage";
import type { OwnedNikkeState } from "@/types/owned";
import type { OverloadOptionType } from "@/types/equipment";
import type { BurstType, ClassType, NikkeRarity, NikkeSourceStatus } from "@/types/nikke";
import { allowedRoles } from "@/types/nikke";
import { NikkeCard } from "./NikkeCard";

const INITIAL_VISIBLE_COUNT = 48;
const VISIBLE_STEP = 48;

const toBurstFilter = (value: string): NikkeFilterState["burst"] => {
  if (value === "1" || value === "2" || value === "3") {
    return Number(value) as BurstType;
  }

  if (value === "none") {
    return "none";
  }

  return "all";
};

type EquipmentFilter =
  | "all"
  | "overloaded"
  | "fullOverload"
  | "missingEquipment"
  | "manufacturerMatched"
  | "attackOption"
  | "ammoOption"
  | "elementOption";

export function NikkeSelector() {
  const ownedIds = useOwnedIds();
  const ownedStates = useOwnedNikkeStates();
  const accountGrowth = useAccountGrowthState();
  const [filters, setFilters] = useState<NikkeFilterState>(defaultNikkeFilters);
  const [hidePlaceholders, setHidePlaceholders] = useState(false);
  const [equipmentFilter, setEquipmentFilter] = useState<EquipmentFilter>("all");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const weapons = useMemo(() => uniqueValues(nikkes, (nikke) => nikke.weapon), []);
  const elements = useMemo(() => uniqueValues(nikkes, (nikke) => nikke.element), []);
  const manufacturers = useMemo(() => uniqueValues(nikkes, (nikke) => nikke.manufacturer), []);
  const roles = useMemo(() => allowedRoles.filter((role) => nikkes.some((nikke) => nikke.roles.includes(role))), []);
  const ownedStateById = useMemo(() => new Map(ownedStates.map((state) => [state.id, state])), [ownedStates]);
  const filtered = useMemo(() => {
    const normalizedQuery = filters.query.trim().toLocaleLowerCase("ko-KR");
    const filteredNikkes = filterNikkes(nikkes, { ...filters, query: "" })
      .filter((nikke) => {
        const ownedState = ownedStateById.get(nikke.id);
        const equipment = ownedState?.equipment;
        const options = equipment ? equipmentSlots.flatMap((slot) => equipment.slots[slot]?.overloadOptions ?? []) : [];
        const equipmentText = [
          ownedState?.memo,
          ownedState?.overclockMemo,
          equipment?.equipmentMemo,
          ...equipmentSlots.map((slot) => equipment?.slots[slot]?.memo),
          ...options
        ]
          .filter(Boolean)
          .join(" ")
          .toLocaleLowerCase("ko-KR");

        const matchesQuery =
          !normalizedQuery ||
          nikke.name.toLocaleLowerCase("ko-KR").includes(normalizedQuery) ||
          nikke.nameKo.toLocaleLowerCase("ko-KR").includes(normalizedQuery) ||
          nikke.nameEn?.toLocaleLowerCase("ko-KR").includes(normalizedQuery) ||
          nikke.aliases.some((alias) => alias.toLocaleLowerCase("ko-KR").includes(normalizedQuery)) ||
          nikke.roles.some((role) => role.toLocaleLowerCase("ko-KR").includes(normalizedQuery)) ||
          equipmentText.includes(normalizedQuery);

        const overloadCount = equipment ? getOverloadCount(equipment) : ownedState?.overloadCount ?? 0;
        const hasMatchedManufacturer = equipment ? equipmentSlots.some((slot) => equipment.slots[slot]?.manufacturerBonus === "matched") : false;
        const hasOption = (option: OverloadOptionType) => options.includes(option);
        const matchesEquipmentFilter =
          equipmentFilter === "all" ||
          (equipmentFilter === "overloaded" && overloadCount > 0) ||
          (equipmentFilter === "fullOverload" && overloadCount >= 4) ||
          (equipmentFilter === "missingEquipment" && !equipment) ||
          (equipmentFilter === "manufacturerMatched" && hasMatchedManufacturer) ||
          (equipmentFilter === "attackOption" && hasOption("공격력")) ||
          (equipmentFilter === "ammoOption" && hasOption("최대장탄수")) ||
          (equipmentFilter === "elementOption" && hasOption("우월코드"));

        return matchesQuery && matchesEquipmentFilter;
      });
    return hidePlaceholders ? filteredNikkes.filter((nikke) => nikke.sourceStatus !== "placeholder") : filteredNikkes;
  }, [equipmentFilter, filters, hidePlaceholders, ownedStateById]);
  const visibleNikkes = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount]);

  const updateFilterState = (patch: Partial<NikkeFilterState>) => {
    setVisibleCount(INITIAL_VISIBLE_COUNT);
    setFilters((current) => ({ ...current, ...patch }));
  };

  const updateOwned = (nextIds: string[]) => {
    storeOwnedIds(nextIds);
  };

  const toggleOwned = (id: string) => {
    const current = ownedStateById.get(id);
    updateOwnedState(id, current ? { ...current, owned: !ownedIds.includes(id) } : { owned: true });
  };

  const updateDetails = (id: string, patch: Partial<OwnedNikkeState>) => {
    const current = ownedStateById.get(id);
    updateOwnedState(id, current ? { ...current, ...patch, owned: true } : { ...patch, owned: true });
  };

  const updateBond = (id: string, bondLevel?: number) => {
    updateBondLevel(id, { bondLevel });
  };

  const loadSample = () => updateOwned(sampleOwnedIds);

  const clearOwned = () => {
    clearStoredOwnedIds();
  };

  return (
    <div className="space-y-5">
      <section className="hud-panel p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase text-magenta">Roster Sync · 보유 {ownedIds.length}명</p>
            <h1 className="mt-1 text-2xl font-black text-white">내 보유 니케</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={loadSample} className="btn-secondary">
              샘플 선택
            </button>
            <button type="button" onClick={clearOwned} className="btn-secondary">
              전체 선택 해제
            </button>
          </div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden />
            <input
              value={filters.query}
              onChange={(event) => updateFilterState({ query: event.target.value })}
              className="input pl-9"
              placeholder="니케 검색"
            />
          </label>
          <select
            value={filters.rarity}
            onChange={(event) => updateFilterState({ rarity: event.target.value as NikkeRarity | "all" })}
            className="input"
            aria-label="등급 필터"
          >
            <option value="all">등급 전체</option>
            <option value="SSR">SSR</option>
            <option value="SR">SR</option>
            <option value="R">R</option>
          </select>
          <select
            value={String(filters.burst)}
            onChange={(event) => updateFilterState({ burst: toBurstFilter(event.target.value) })}
            className="input"
            aria-label="버스트 필터"
          >
            <option value="all">버스트 전체</option>
            <option value="1">B1</option>
            <option value="2">B2</option>
            <option value="3">B3</option>
            <option value="none">기타</option>
          </select>
          <select
            value={filters.classType}
            onChange={(event) => updateFilterState({ classType: event.target.value as ClassType | "all" })}
            className="input"
            aria-label="클래스 필터"
          >
            <option value="all">클래스 전체</option>
            <option value="화력형">화력형</option>
            <option value="방어형">방어형</option>
            <option value="지원형">지원형</option>
          </select>
          <select
            value={filters.weapon}
            onChange={(event) => updateFilterState({ weapon: event.target.value })}
            className="input"
            aria-label="무기 필터"
          >
            <option value="all">무기 전체</option>
            {weapons.map((weapon) => (
              <option key={weapon} value={weapon}>
                {weapon}
              </option>
            ))}
          </select>
          <select
            value={filters.element}
            onChange={(event) => updateFilterState({ element: event.target.value })}
            className="input"
            aria-label="속성 필터"
          >
            <option value="all">속성 전체</option>
            {elements.map((element) => (
              <option key={element} value={element}>
                {element}
              </option>
            ))}
          </select>
          <select
            value={filters.manufacturer}
            onChange={(event) => updateFilterState({ manufacturer: event.target.value })}
            className="input"
            aria-label="제조사 필터"
          >
            <option value="all">제조사 전체</option>
            {manufacturers.map((manufacturer) => (
              <option key={manufacturer} value={manufacturer}>
                {manufacturer}
              </option>
            ))}
          </select>
          <select
            value={filters.role}
            onChange={(event) => updateFilterState({ role: event.target.value })}
            className="input"
            aria-label="역할 필터"
          >
            <option value="all">역할 전체</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          <select
            value={filters.pilgrim}
            onChange={(event) => updateFilterState({ pilgrim: event.target.value as NikkeFilterState["pilgrim"] })}
            className="input"
            aria-label="필그림 필터"
          >
            <option value="all">필그림 전체</option>
            <option value="pilgrim">필그림</option>
            <option value="notPilgrim">비필그림</option>
          </select>
          <select
            value={filters.limited}
            onChange={(event) => updateFilterState({ limited: event.target.value as NikkeFilterState["limited"] })}
            className="input"
            aria-label="한정 필터"
          >
            <option value="all">한정 전체</option>
            <option value="limited">한정</option>
            <option value="notLimited">상시/기타</option>
          </select>
          <select
            value={filters.collab}
            onChange={(event) => updateFilterState({ collab: event.target.value as NikkeFilterState["collab"] })}
            className="input"
            aria-label="콜라보 필터"
          >
            <option value="all">콜라보 전체</option>
            <option value="collab">콜라보</option>
            <option value="notCollab">비콜라보</option>
          </select>
          <select
            value={filters.sourceStatus}
            onChange={(event) => updateFilterState({ sourceStatus: event.target.value as NikkeSourceStatus | "all" })}
            className="input"
            aria-label="검수 상태 필터"
          >
            <option value="all">검수 상태 전체</option>
            <option value="verified">검수 완료</option>
            <option value="communityChecked">커뮤니티 확인</option>
            <option value="needsReview">검수 필요</option>
            <option value="placeholder">임시 데이터</option>
          </select>
          <select
            value={equipmentFilter}
            onChange={(event) => {
              setVisibleCount(INITIAL_VISIBLE_COUNT);
              setEquipmentFilter(event.target.value as EquipmentFilter);
            }}
            className="input"
            aria-label="장비 필터"
          >
            <option value="all">장비 전체</option>
            <option value="overloaded">오버로드 보유</option>
            <option value="fullOverload">4오버로드</option>
            <option value="missingEquipment">장비 미입력</option>
            <option value="manufacturerMatched">기업 장비 일치 있음</option>
            <option value="attackOption">공격력 옵션 있음</option>
            <option value="ammoOption">장탄 옵션 있음</option>
            <option value="elementOption">우월코드 옵션 있음</option>
          </select>
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
          <SlidersHorizontal className="h-4 w-4 text-signal" aria-hidden />
          필터 결과 {filtered.length}명 · 표시 {visibleNikkes.length}명
        </div>
        <label className="mt-3 flex w-fit items-center gap-2 rounded-md border border-line bg-black/30 px-3 py-2 text-sm font-bold text-slate-300">
          <input
            type="checkbox"
            checked={hidePlaceholders}
            onChange={(event) => {
              setVisibleCount(INITIAL_VISIBLE_COUNT);
              setHidePlaceholders(event.target.checked);
            }}
            className="h-4 w-4 accent-signal"
          />
          임시 데이터 숨기기
        </label>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {visibleNikkes.map((nikke) => (
          <NikkeCard
            key={nikke.id}
            nikke={nikke}
            selected={ownedIds.includes(nikke.id)}
            ownedState={ownedStateById.get(nikke.id)}
            bondLevel={accountGrowth.bondLevels[nikke.id]?.bondLevel}
            onToggle={toggleOwned}
            onOwnedStateChange={updateDetails}
            onBondLevelChange={updateBond}
          />
        ))}
      </section>
      {visibleNikkes.length < filtered.length ? (
        <div className="flex justify-center">
          <button type="button" onClick={() => setVisibleCount((current) => current + VISIBLE_STEP)} className="btn-secondary">
            더 보기 {Math.min(VISIBLE_STEP, filtered.length - visibleNikkes.length)}명
          </button>
        </div>
      ) : null}
    </div>
  );
}
