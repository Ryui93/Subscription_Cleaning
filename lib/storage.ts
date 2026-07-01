"use client";

import { useMemo, useSyncExternalStore } from "react";
import { normalizeEquipmentState } from "./equipmentUtils";
import type { OwnedNikkeState } from "@/types/owned";

export const OWNED_STORAGE_KEY = "nikke-all-in-one-owned";
const LEGACY_OWNED_STORAGE_KEY = "nikke-everything-owned-v1";
const OWNED_STORAGE_EVENT = "nikke-everything-owned-changed";

const normalizeOwnedState = (item: Partial<OwnedNikkeState> & { id: string }): OwnedNikkeState => ({
  id: item.id,
  owned: item.owned ?? true,
  level: item.level,
  limitBreak: item.limitBreak,
  coreEnhancement: item.coreEnhancement,
  skill1: item.skill1,
  skill2: item.skill2,
  burstSkill: item.burstSkill,
  overloadCount: item.overloadCount,
  collectionOwned: item.collectionOwned,
  collectionLevel: item.collectionLevel,
  collectionMemo: item.collectionMemo,
  equipment: item.equipment ? normalizeEquipmentState(item.id, item.equipment) : undefined,
  overclockMemo: item.overclockMemo,
  isFavorite: item.isFavorite,
  memo: item.memo
});

const parseOwnedStates = (raw: string | null): OwnedNikkeState[] => {
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    if (parsed.every((item) => typeof item === "string")) {
      return parsed.map((id) => ({ id, owned: true }));
    }

    return parsed
      .filter((item): item is Partial<OwnedNikkeState> & { id: string } => Boolean(item) && typeof item === "object" && typeof item.id === "string")
      .map(normalizeOwnedState);
  } catch {
    return [];
  }
};

const emitOwnedStorageChange = () => {
  window.dispatchEvent(new Event(OWNED_STORAGE_EVENT));
};

const getOwnedSnapshot = () => {
  if (typeof window === "undefined") {
    return "[]";
  }

  const current = window.localStorage.getItem(OWNED_STORAGE_KEY);
  if (current) {
    return current;
  }

  const legacy = window.localStorage.getItem(LEGACY_OWNED_STORAGE_KEY);
  if (!legacy) {
    return "[]";
  }

  return JSON.stringify(parseOwnedStates(legacy));
};

const subscribeToOwnedIds = (callback: () => void) => {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  window.addEventListener("storage", callback);
  window.addEventListener(OWNED_STORAGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(OWNED_STORAGE_EVENT, callback);
  };
};

export const getStoredOwnedIds = (): string[] => {
  return parseOwnedStates(getOwnedSnapshot())
    .filter((item) => item.owned)
    .map((item) => item.id);
};

export const useOwnedIds = () => {
  const snapshot = useSyncExternalStore(subscribeToOwnedIds, getOwnedSnapshot, () => "[]");
  return useMemo(
    () =>
      parseOwnedStates(snapshot)
        .filter((item) => item.owned)
        .map((item) => item.id),
    [snapshot]
  );
};

export const useOwnedNikkeStates = () => {
  const snapshot = useSyncExternalStore(subscribeToOwnedIds, getOwnedSnapshot, () => "[]");
  return useMemo(() => parseOwnedStates(snapshot), [snapshot]);
};

export const storeOwnedStates = (states: OwnedNikkeState[]) => {
  if (typeof window === "undefined") {
    return;
  }

  const unique = Array.from(new Map(states.map((state) => [state.id, normalizeOwnedState(state)])).values());
  window.localStorage.setItem(OWNED_STORAGE_KEY, JSON.stringify(unique));
  emitOwnedStorageChange();
};

export const storeOwnedIds = (ids: string[]) => {
  storeOwnedStates(Array.from(new Set(ids)).map((id) => ({ id, owned: true })));
};

export const updateOwnedState = (id: string, patch: Partial<OwnedNikkeState>) => {
  const states = parseOwnedStates(getOwnedSnapshot());
  const index = states.findIndex((state) => state.id === id);

  if (index >= 0) {
    states[index] = normalizeOwnedState({ ...states[index], ...patch, id });
  } else {
    states.push(normalizeOwnedState({ id, owned: true, ...patch }));
  }

  storeOwnedStates(states);
};

export const clearStoredOwnedIds = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(OWNED_STORAGE_KEY);
  window.localStorage.removeItem(LEGACY_OWNED_STORAGE_KEY);
  emitOwnedStorageChange();
};
