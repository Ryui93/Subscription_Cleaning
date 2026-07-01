"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { AccountGrowthState, BondLevelData } from "@/types/accountGrowth";
import { defaultAccountGrowthState } from "./accountGrowthDefaults";

export const ACCOUNT_GROWTH_STORAGE_KEY = "nikke-all-in-one-account-growth";
const ACCOUNT_GROWTH_STORAGE_EVENT = "nikke-everything-account-growth-changed";

const isRecord = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === "object" && !Array.isArray(value);

const optionalNumber = (value: unknown) => (typeof value === "number" && Number.isFinite(value) ? value : undefined);

const normalizeBond = (id: string, value: unknown): BondLevelData => {
  const item = isRecord(value) ? value : {};
  return {
    nikkeId: typeof item.nikkeId === "string" ? item.nikkeId : id,
    bondLevel: optionalNumber(item.bondLevel),
    bondMemo: typeof item.bondMemo === "string" ? item.bondMemo : ""
  };
};

export const normalizeAccountGrowthState = (value: unknown): AccountGrowthState => {
  const item = isRecord(value) ? value : {};
  const synchroDevice = isRecord(item.synchroDevice) ? item.synchroDevice : {};
  const recyclingRoom = isRecord(item.recyclingRoom) ? item.recyclingRoom : {};
  const tacticsAcademy = isRecord(item.tacticsAcademy) ? item.tacticsAcademy : {};
  const overclock = isRecord(item.overclock) ? item.overclock : {};
  const rawBondLevels = isRecord(item.bondLevels) ? item.bondLevels : {};

  return {
    synchroDevice: {
      synchroLevel: optionalNumber(synchroDevice.synchroLevel),
      maxSynchroSlots: optionalNumber(synchroDevice.maxSynchroSlots),
      usedSynchroSlots: optionalNumber(synchroDevice.usedSynchroSlots),
      memo: typeof synchroDevice.memo === "string" ? synchroDevice.memo : ""
    },
    recyclingRoom: {
      attackerLevel: optionalNumber(recyclingRoom.attackerLevel),
      defenderLevel: optionalNumber(recyclingRoom.defenderLevel),
      supporterLevel: optionalNumber(recyclingRoom.supporterLevel),
      elysionLevel: optionalNumber(recyclingRoom.elysionLevel),
      missilisLevel: optionalNumber(recyclingRoom.missilisLevel),
      tetraLevel: optionalNumber(recyclingRoom.tetraLevel),
      pilgrimLevel: optionalNumber(recyclingRoom.pilgrimLevel),
      abnormalLevel: optionalNumber(recyclingRoom.abnormalLevel),
      memo: typeof recyclingRoom.memo === "string" ? recyclingRoom.memo : ""
    },
    tacticsAcademy: {
      currentClass: typeof tacticsAcademy.currentClass === "string" ? tacticsAcademy.currentClass : "",
      completedLessons: Array.isArray(tacticsAcademy.completedLessons)
        ? tacticsAcademy.completedLessons.filter((lesson): lesson is string => typeof lesson === "string")
        : [],
      memo: typeof tacticsAcademy.memo === "string" ? tacticsAcademy.memo : ""
    },
    overclock: {
      enabled: Boolean(overclock.enabled),
      level: optionalNumber(overclock.level),
      selectedOptions: Array.isArray(overclock.selectedOptions)
        ? overclock.selectedOptions.filter((option): option is string => typeof option === "string")
        : [],
      memo: typeof overclock.memo === "string" ? overclock.memo : ""
    },
    bondLevels: Object.fromEntries(Object.entries(rawBondLevels).map(([id, bond]) => [id, normalizeBond(id, bond)])),
    updatedAt: typeof item.updatedAt === "string" ? item.updatedAt : undefined
  };
};

export const parseAccountGrowthState = (raw: string | null): AccountGrowthState => {
  if (!raw) {
    return defaultAccountGrowthState;
  }

  try {
    return normalizeAccountGrowthState(JSON.parse(raw));
  } catch {
    return defaultAccountGrowthState;
  }
};

const emitAccountGrowthChange = () => {
  window.dispatchEvent(new Event(ACCOUNT_GROWTH_STORAGE_EVENT));
};

const getAccountGrowthSnapshot = () => {
  if (typeof window === "undefined") {
    return JSON.stringify(defaultAccountGrowthState);
  }

  return window.localStorage.getItem(ACCOUNT_GROWTH_STORAGE_KEY) ?? JSON.stringify(defaultAccountGrowthState);
};

const subscribeToAccountGrowth = (callback: () => void) => {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  window.addEventListener("storage", callback);
  window.addEventListener(ACCOUNT_GROWTH_STORAGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(ACCOUNT_GROWTH_STORAGE_EVENT, callback);
  };
};

export const storeAccountGrowthState = (state: AccountGrowthState) => {
  if (typeof window === "undefined") {
    return;
  }

  const normalized = normalizeAccountGrowthState({
    ...state,
    updatedAt: new Date().toISOString()
  });
  window.localStorage.setItem(ACCOUNT_GROWTH_STORAGE_KEY, JSON.stringify(normalized));
  emitAccountGrowthChange();
};

export const updateAccountGrowthState = (patch: Partial<AccountGrowthState>) => {
  const current = parseAccountGrowthState(getAccountGrowthSnapshot());
  storeAccountGrowthState({
    ...current,
    ...patch,
    synchroDevice: { ...current.synchroDevice, ...patch.synchroDevice },
    recyclingRoom: { ...current.recyclingRoom, ...patch.recyclingRoom },
    tacticsAcademy: { ...current.tacticsAcademy, ...patch.tacticsAcademy },
    overclock: { ...current.overclock, ...patch.overclock },
    bondLevels: { ...current.bondLevels, ...patch.bondLevels }
  });
};

export const updateBondLevel = (nikkeId: string, patch: Partial<BondLevelData>) => {
  const current = parseAccountGrowthState(getAccountGrowthSnapshot());
  storeAccountGrowthState({
    ...current,
    bondLevels: {
      ...current.bondLevels,
      [nikkeId]: {
        nikkeId,
        bondLevel: current.bondLevels[nikkeId]?.bondLevel,
        bondMemo: current.bondLevels[nikkeId]?.bondMemo ?? "",
        ...patch
      }
    }
  });
};

export const clearAccountGrowthState = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(ACCOUNT_GROWTH_STORAGE_KEY);
  emitAccountGrowthChange();
};

export const useAccountGrowthState = () => {
  const snapshot = useSyncExternalStore(subscribeToAccountGrowth, getAccountGrowthSnapshot, () => JSON.stringify(defaultAccountGrowthState));
  return useMemo(() => parseAccountGrowthState(snapshot), [snapshot]);
};
