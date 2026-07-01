import type { BurstType, ClassType, Nikke, RoleId } from "@/types/nikke";
import type { NikkeRarity, NikkeSourceStatus } from "@/types/nikke";

export type NikkeFilterState = {
  query: string;
  burst: "all" | BurstType;
  classType: "all" | ClassType;
  weapon: "all" | string;
  element: "all" | string;
  manufacturer: "all" | string;
  rarity: "all" | NikkeRarity;
  role: "all" | string;
  limited: "all" | "limited" | "notLimited";
  collab: "all" | "collab" | "notCollab";
  pilgrim: "all" | "pilgrim" | "notPilgrim";
  sourceStatus: "all" | NikkeSourceStatus;
};

export const defaultNikkeFilters: NikkeFilterState = {
  query: "",
  burst: "all",
  classType: "all",
  weapon: "all",
  element: "all",
  manufacturer: "all",
  rarity: "all",
  role: "all",
  limited: "all",
  collab: "all",
  pilgrim: "all",
  sourceStatus: "all"
};

export const uniqueValues = (nikkes: Nikke[], getter: (nikke: Nikke) => string) =>
  Array.from(new Set(nikkes.map(getter))).sort((a, b) => a.localeCompare(b, "ko"));

export const filterNikkes = (nikkes: Nikke[], filters: NikkeFilterState) => {
  const query = filters.query.trim().toLocaleLowerCase("ko-KR");

  return nikkes.filter((nikke) => {
    const matchesQuery =
      query.length === 0 ||
      nikke.name.toLocaleLowerCase("ko-KR").includes(query) ||
      nikke.nameKo.toLocaleLowerCase("ko-KR").includes(query) ||
      nikke.nameEn?.toLocaleLowerCase("ko-KR").includes(query) ||
      nikke.nameJp?.toLocaleLowerCase("ko-KR").includes(query) ||
      nikke.aliases.some((alias) => alias.toLocaleLowerCase("ko-KR").includes(query)) ||
      nikke.manufacturer.toLocaleLowerCase("ko-KR").includes(query) ||
      nikke.squad?.toLocaleLowerCase("ko-KR").includes(query) ||
      nikke.roles.some((role) => role.toLocaleLowerCase("ko-KR").includes(query)) ||
      nikke.weapon.toLocaleLowerCase("ko-KR").includes(query) ||
      nikke.element.toLocaleLowerCase("ko-KR").includes(query);

    const matchesBurst = filters.burst === "all" || nikke.burst === filters.burst;
    const matchesClass = filters.classType === "all" || nikke.classType === filters.classType;
    const matchesWeapon = filters.weapon === "all" || nikke.weapon === filters.weapon;
    const matchesElement = filters.element === "all" || nikke.element === filters.element;
    const matchesManufacturer = filters.manufacturer === "all" || nikke.manufacturer === filters.manufacturer;
    const matchesRarity = filters.rarity === "all" || nikke.rarity === filters.rarity;
    const matchesRole = filters.role === "all" || nikke.roles.includes(filters.role as RoleId);
    const matchesLimited =
      filters.limited === "all" ||
      (filters.limited === "limited" && nikke.isLimited) ||
      (filters.limited === "notLimited" && !nikke.isLimited);
    const matchesCollab =
      filters.collab === "all" ||
      (filters.collab === "collab" && nikke.isCollab) ||
      (filters.collab === "notCollab" && !nikke.isCollab);
    const matchesPilgrim =
      filters.pilgrim === "all" ||
      (filters.pilgrim === "pilgrim" && nikke.isPilgrim) ||
      (filters.pilgrim === "notPilgrim" && !nikke.isPilgrim);
    const matchesSourceStatus = filters.sourceStatus === "all" || nikke.sourceStatus === filters.sourceStatus;

    return (
      matchesQuery &&
      matchesBurst &&
      matchesClass &&
      matchesWeapon &&
      matchesElement &&
      matchesManufacturer &&
      matchesRarity &&
      matchesRole &&
      matchesLimited &&
      matchesCollab &&
      matchesPilgrim &&
      matchesSourceStatus
    );
  });
};
