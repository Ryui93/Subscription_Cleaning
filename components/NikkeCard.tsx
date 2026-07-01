"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import {
  createDefaultEquipmentState,
  equipmentManufacturerBonusLabels,
  equipmentSlotLabels,
  equipmentSlots,
  equipmentTierLabels,
  getAverageEquipmentLevel,
  getOverloadCount,
  overloadOptionLabels
} from "@/lib/equipmentUtils";
import type { EquipmentManufacturerBonus, EquipmentSlot, EquipmentTier, OverloadOptionType } from "@/types/equipment";
import type { Nikke } from "@/types/nikke";
import { roleLabels } from "@/types/nikke";
import type { OwnedNikkeState } from "@/types/owned";

type NikkeCardProps = {
  nikke: Nikke;
  selected?: boolean;
  ownedState?: OwnedNikkeState;
  bondLevel?: number;
  onToggle?: (id: string) => void;
  onOwnedStateChange?: (id: string, patch: Partial<OwnedNikkeState>) => void;
  onBondLevelChange?: (id: string, bondLevel?: number) => void;
};

const toOptionalNumber = (value: string) => {
  if (value === "") {
    return undefined;
  }

  return Number(value);
};

const sourceStatusLabels: Record<Nikke["sourceStatus"], string> = {
  verified: "검수 완료",
  communityChecked: "커뮤니티 확인",
  needsReview: "검수 필요",
  placeholder: "임시 데이터"
};

const sourceStatusClassNames: Record<Nikke["sourceStatus"], string> = {
  verified: "border-signal/35 bg-signal/10 text-signal",
  communityChecked: "border-amber/35 bg-amber/10 text-amber",
  needsReview: "border-magenta/35 bg-magenta/10 text-magenta",
  placeholder: "border-slate-600 bg-slate-800/60 text-slate-400"
};

export function NikkeCard({
  nikke,
  selected = false,
  ownedState,
  bondLevel,
  onToggle,
  onOwnedStateChange,
  onBondLevelChange
}: NikkeCardProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const burstLabel = nikke.burst === "none" ? "B-" : `B${nikke.burst}`;
  const cooldownLabel = nikke.cooldown === null ? "미확인" : `${nikke.cooldown}초`;
  const equipment = ownedState?.equipment ?? createDefaultEquipmentState(nikke.id);
  const overloadCount = getOverloadCount(equipment) || ownedState?.overloadCount || 0;
  const matchedManufacturerCount = equipmentSlots.filter((slot) => equipment.slots[slot].manufacturerBonus === "matched").length;
  const mainOptions = Array.from(new Set(equipmentSlots.flatMap((slot) => equipment.slots[slot].overloadOptions ?? []))).filter(
    (option) => option !== "검수필요"
  );

  const updateEquipmentSlot = (slot: EquipmentSlot, patch: Partial<(typeof equipment.slots)[EquipmentSlot]>) => {
    if (!onOwnedStateChange) return;
    const nextEquipment = {
      ...equipment,
      slots: {
        ...equipment.slots,
        [slot]: {
          ...equipment.slots[slot],
          ...patch
        }
      }
    };
    onOwnedStateChange(nikke.id, { equipment: nextEquipment, overloadCount: getOverloadCount(nextEquipment) });
  };

  const updateEquipmentMemo = (equipmentMemo: string) => {
    onOwnedStateChange?.(nikke.id, { equipment: { ...equipment, equipmentMemo } });
  };

  const toggleOverloadOption = (slot: EquipmentSlot, option: OverloadOptionType) => {
    const currentOptions = equipment.slots[slot].overloadOptions ?? [];
    const nextOptions = currentOptions.includes(option) ? currentOptions.filter((item) => item !== option) : [...currentOptions, option];
    updateEquipmentSlot(slot, { overloadOptions: nextOptions });
  };

  return (
    <article
      className={`group hud-card p-4 transition ${
        selected ? "border-signal/70 bg-signal/10 shadow-glow" : "hover:border-signal/45"
      } ${selected ? "max-h-[calc(100vh-7rem)] overflow-y-auto overscroll-contain pr-3" : ""}`}
    >
      <div className="mb-3 flex items-center justify-between gap-3 border-b border-white/10 pb-3">
        <span className="text-[11px] font-black uppercase text-magenta">{nikke.rarity} Roster</span>
        <span className="burst-badge">{burstLabel}</span>
      </div>
      <div className="flex items-start gap-3">
        <div className="operator-portrait h-16 w-14 text-sm">
          <span>{nikke.name.slice(0, 2)}</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="break-keep text-lg font-black text-white">{nikke.name}</h3>
              <p className="mt-1 text-xs text-slate-400">
                {nikke.manufacturer} · {nikke.classType} · {nikke.weapon} · {nikke.element}
              </p>
              <p className="mt-1 text-xs font-bold text-amber">쿨타임 {cooldownLabel}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <span className={`rounded-md border px-2 py-1 text-[11px] font-bold ${sourceStatusClassNames[nikke.sourceStatus]}`}>
                  {sourceStatusLabels[nikke.sourceStatus]}
                </span>
                {nikke.isPilgrim ? <span className="rounded-md border border-amber/30 bg-amber/10 px-2 py-1 text-[11px] font-bold text-amber">필그림</span> : null}
                {nikke.isLimited ? <span className="rounded-md border border-magenta/30 bg-magenta/10 px-2 py-1 text-[11px] font-bold text-magenta">한정</span> : null}
                {nikke.isCollab ? <span className="rounded-md border border-signal/30 bg-signal/10 px-2 py-1 text-[11px] font-bold text-signal">콜라보</span> : null}
              </div>
            </div>
            {onToggle ? (
              <button
                type="button"
                onClick={() => onToggle(nikke.id)}
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-md border transition ${
                  selected
                    ? "border-signal bg-signal text-shell shadow-glow"
                    : "border-line bg-black/35 text-slate-300 hover:border-signal/60 hover:text-signal"
                }`}
                aria-label={`${nikke.name} 보유 선택`}
                title={`${nikke.name} 보유 선택`}
              >
                <CheckCircle2 className="h-5 w-5" aria-hidden />
              </button>
            ) : null}
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {nikke.roles.slice(0, 4).map((role) => (
              <span key={role} className="hud-chip">
                {roleLabels[role]}
              </span>
            ))}
          </div>
        </div>
      </div>
      <p className={`mt-3 border-t border-white/10 pt-3 text-sm leading-6 text-slate-400 ${selected ? "" : "line-clamp-2"}`}>
        {nikke.notes}
      </p>
      {selected && onOwnedStateChange ? (
        <div className="mt-4 border-t border-white/10 pt-3">
          <div className="flex flex-col gap-3 rounded-md border border-line bg-black/25 p-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="grid gap-1 text-xs text-slate-400 sm:grid-cols-2 sm:gap-x-4">
              <span>레벨 {ownedState?.level ?? "-"}</span>
              <span>호감도 {bondLevel ?? "-"}</span>
              <span>스킬 {ownedState?.skill1 ?? "-"}/{ownedState?.skill2 ?? "-"}/{ownedState?.burstSkill ?? "-"}</span>
              <span>오버로드 {overloadCount}/4</span>
            </div>
            <button
              type="button"
              onClick={() => setIsDetailsOpen((current) => !current)}
              className="btn-secondary h-9 w-fit"
              aria-expanded={isDetailsOpen}
            >
              {isDetailsOpen ? "접기" : "열기"}
            </button>
          </div>
          {isDetailsOpen ? (
            <>
          <div className="mb-3 mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <label className="text-xs text-slate-400">
              레벨
              <input
                type="number"
                min={1}
                max={400}
                value={ownedState?.level ?? ""}
                onChange={(event) => onOwnedStateChange(nikke.id, { level: toOptionalNumber(event.target.value) })}
                className="input mt-1 h-9 px-2"
              />
            </label>
            <label className="text-xs text-slate-400">
              한계돌파
              <input
                type="number"
                min={0}
                max={3}
                value={ownedState?.limitBreak ?? ""}
                onChange={(event) => onOwnedStateChange(nikke.id, { limitBreak: toOptionalNumber(event.target.value) })}
                className="input mt-1 h-9 px-2"
              />
            </label>
            <label className="text-xs text-slate-400">
              코어강화
              <input
                type="number"
                min={0}
                max={7}
                value={ownedState?.coreEnhancement ?? ""}
                onChange={(event) => onOwnedStateChange(nikke.id, { coreEnhancement: toOptionalNumber(event.target.value) })}
                className="input mt-1 h-9 px-2"
              />
            </label>
            <label className="text-xs text-slate-400">
              호감도
              <input
                type="number"
                min={0}
                max={100}
                value={bondLevel ?? ""}
                onChange={(event) => onBondLevelChange?.(nikke.id, toOptionalNumber(event.target.value))}
                className="input mt-1 h-9 px-2"
              />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <label className="text-xs text-slate-400">
              스킬1
              <input
                type="number"
                min={1}
                max={10}
                value={ownedState?.skill1 ?? ""}
                onChange={(event) => onOwnedStateChange(nikke.id, { skill1: toOptionalNumber(event.target.value) })}
                className="input mt-1 h-9 px-2"
              />
            </label>
            <label className="text-xs text-slate-400">
              스킬2
              <input
                type="number"
                min={1}
                max={10}
                value={ownedState?.skill2 ?? ""}
                onChange={(event) => onOwnedStateChange(nikke.id, { skill2: toOptionalNumber(event.target.value) })}
                className="input mt-1 h-9 px-2"
              />
            </label>
            <label className="text-xs text-slate-400">
              버스트
              <input
                type="number"
                min={1}
                max={10}
                value={ownedState?.burstSkill ?? ""}
                onChange={(event) => onOwnedStateChange(nikke.id, { burstSkill: toOptionalNumber(event.target.value) })}
                className="input mt-1 h-9 px-2"
              />
            </label>
            <label className="text-xs text-slate-400">
              오버로드
              <input
                type="number"
                min={0}
                max={4}
                value={ownedState?.overloadCount ?? ""}
                onChange={(event) => onOwnedStateChange(nikke.id, { overloadCount: toOptionalNumber(event.target.value) })}
                className="input mt-1 h-9 px-2"
              />
            </label>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <input
              id={`${nikke.id}-favorite`}
              type="checkbox"
              checked={ownedState?.isFavorite ?? false}
              onChange={(event) => onOwnedStateChange(nikke.id, { isFavorite: event.target.checked })}
              className="h-4 w-4 accent-signal"
            />
            <label htmlFor={`${nikke.id}-favorite`} className="text-xs font-bold text-signal">
              주력 니케
            </label>
          </div>
          <div className="mt-3 rounded-md border border-line bg-black/25 p-3">
            <div className="flex items-center gap-2">
              <input
                id={`${nikke.id}-collection`}
                type="checkbox"
                checked={ownedState?.collectionOwned ?? false}
                onChange={(event) => onOwnedStateChange(nikke.id, { collectionOwned: event.target.checked })}
                className="h-4 w-4 accent-signal"
              />
              <label htmlFor={`${nikke.id}-collection`} className="text-xs font-bold text-signal">
                애장품/소장품 보유
              </label>
            </div>
            <div className="mt-2 grid gap-2 sm:grid-cols-[120px_minmax(0,1fr)]">
              <label className="text-xs text-slate-400">
                단계
                <input
                  type="number"
                  min={0}
                  max={15}
                  value={ownedState?.collectionLevel ?? ""}
                  onChange={(event) => onOwnedStateChange(nikke.id, { collectionLevel: toOptionalNumber(event.target.value) })}
                  className="input mt-1 h-9 px-2"
                />
              </label>
              <label className="text-xs text-slate-400">
                메모
                <input
                  value={ownedState?.collectionMemo ?? ""}
                  onChange={(event) => onOwnedStateChange(nikke.id, { collectionMemo: event.target.value })}
                  className="input mt-1 h-9 px-2"
                  placeholder="애장품/소장품 검수 메모"
                />
              </label>
            </div>
          </div>
          <details className="mt-3 rounded-md border border-line bg-black/25 p-3">
            <summary className="cursor-pointer text-xs font-black text-signal">장비 / 오버로드</summary>
            <div className="mt-3 grid gap-2 text-xs text-slate-400 sm:grid-cols-2">
              <span>오버로드 {overloadCount}/4</span>
              <span>평균 강화 {getAverageEquipmentLevel(equipment)}</span>
              <span>기업 장비 일치 {matchedManufacturerCount}/4</span>
              <span>주요 옵션 {mainOptions.length > 0 ? mainOptions.slice(0, 3).join(" / ") : "미입력"}</span>
            </div>
            <div className="mt-3 space-y-3">
              {equipmentSlots.map((slot) => {
                const slotState = equipment.slots[slot];
                return (
                  <div key={slot} className="rounded-md border border-white/10 bg-black/25 p-3">
                    <p className="text-xs font-black text-white">{equipmentSlotLabels[slot]}</p>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      <label className="text-xs text-slate-400">
                        장비 티어
                        <select
                          value={slotState.tier}
                          onChange={(event) => updateEquipmentSlot(slot, { tier: event.target.value as EquipmentTier })}
                          className="input mt-1 h-9 px-2"
                        >
                          {Object.entries(equipmentTierLabels).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="text-xs text-slate-400">
                        강화 레벨
                        <input
                          type="number"
                          min={0}
                          max={5}
                          value={slotState.level ?? ""}
                          onChange={(event) => updateEquipmentSlot(slot, { level: toOptionalNumber(event.target.value) })}
                          className="input mt-1 h-9 px-2"
                        />
                      </label>
                      <label className="text-xs text-slate-400">
                        기업 장비
                        <select
                          value={slotState.manufacturerBonus ?? "none"}
                          onChange={(event) => updateEquipmentSlot(slot, { manufacturerBonus: event.target.value as EquipmentManufacturerBonus })}
                          className="input mt-1 h-9 px-2"
                        >
                          {Object.entries(equipmentManufacturerBonusLabels).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="mt-5 flex items-center gap-2 text-xs font-bold text-signal">
                        <input
                          type="checkbox"
                          checked={slotState.isOverloaded ?? false}
                          onChange={(event) =>
                            updateEquipmentSlot(slot, {
                              isOverloaded: event.target.checked,
                              tier: event.target.checked && slotState.tier !== "OL" ? "OL" : slotState.tier
                            })
                          }
                          className="h-4 w-4 accent-signal"
                        />
                        오버로드
                      </label>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {overloadOptionLabels.map((option) => (
                        <label
                          key={option}
                          className={`rounded-md border px-2 py-1 text-[11px] font-bold ${
                            slotState.overloadOptions?.includes(option)
                              ? "border-signal/45 bg-signal/15 text-signal"
                              : "border-line bg-black/25 text-slate-400"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={slotState.overloadOptions?.includes(option) ?? false}
                            onChange={() => toggleOverloadOption(slot, option)}
                            className="sr-only"
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                    <input
                      value={slotState.memo ?? ""}
                      onChange={(event) => updateEquipmentSlot(slot, { memo: event.target.value })}
                      className="input mt-2 h-9 px-2"
                      placeholder={`${equipmentSlotLabels[slot]} 장비 메모`}
                    />
                  </div>
                );
              })}
            </div>
            <input
              value={equipment.equipmentMemo ?? ""}
              onChange={(event) => updateEquipmentMemo(event.target.value)}
              className="input mt-3 h-9 px-2"
              placeholder="장비 메모 / 오버로드 조건 메모"
            />
            <input
              value={ownedState?.overclockMemo ?? ""}
              onChange={(event) => onOwnedStateChange(nikke.id, { overclockMemo: event.target.value })}
              className="input mt-2 h-9 px-2"
              placeholder="니케별 오버클럭 조건 메모"
            />
          </details>
          <input
            value={ownedState?.memo ?? ""}
            onChange={(event) => onOwnedStateChange(nikke.id, { memo: event.target.value })}
            className="input mt-3 h-9 px-2"
            placeholder="큐브 메모 / 운용 메모"
          />
            </>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
