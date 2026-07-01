"use client";

import { ACCOUNT_GROWTH_STORAGE_KEY, clearAccountGrowthState, parseAccountGrowthState, storeAccountGrowthState } from "./accountGrowthStorage";
import { clearStoredOwnedIds, OWNED_STORAGE_KEY, storeOwnedStates } from "./storage";
import type { AccountGrowthState } from "@/types/accountGrowth";
import type { OwnedNikkeState } from "@/types/owned";

export type AccountProfileExport = {
  version: 1;
  exportedAt: string;
  ownedNikkeState: OwnedNikkeState[];
  accountGrowthState: AccountGrowthState;
};

const readOwnedState = (): OwnedNikkeState[] => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const parsed = JSON.parse(window.localStorage.getItem(OWNED_STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const exportAccountProfile = () => {
  if (typeof window === "undefined") {
    return "";
  }

  const profile: AccountProfileExport = {
    version: 1,
    exportedAt: new Date().toISOString(),
    ownedNikkeState: readOwnedState(),
    accountGrowthState: parseAccountGrowthState(window.localStorage.getItem(ACCOUNT_GROWTH_STORAGE_KEY))
  };

  return JSON.stringify(profile, null, 2);
};

export const importAccountProfile = (raw: string) => {
  const parsed = JSON.parse(raw) as Partial<AccountProfileExport>;
  if (!Array.isArray(parsed.ownedNikkeState) || !parsed.accountGrowthState) {
    throw new Error("Invalid account profile export");
  }

  storeOwnedStates(parsed.ownedNikkeState);
  storeAccountGrowthState(parsed.accountGrowthState);
};

export const clearAccountProfile = () => {
  clearStoredOwnedIds();
  clearAccountGrowthState();
};
