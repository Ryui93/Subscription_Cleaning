import { contentTypes } from "@/types/content";
import { allowedRoles, type Nikke } from "@/types/nikke";

const allowedManufacturers = ["엘리시온", "미실리스", "테트라", "필그림", "어브노멀", "기타"];
const allowedElements = ["작열", "수냉", "전격", "철갑", "풍압", "없음", "미확인"];
const allowedClassTypes = ["화력형", "방어형", "지원형"];
const allowedWeapons = ["소총", "기관단총", "샷건", "저격소총", "로켓런처", "머신건", "미확인"];
const allowedSourceStatuses = ["verified", "communityChecked", "needsReview", "placeholder"];
const allowedRarities = ["SSR", "SR", "R"];

export type NikkeValidationResult = {
  errors: string[];
  warnings: string[];
};

const findDuplicates = (values: string[]) => {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  values.forEach((value) => {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  });

  return Array.from(duplicates);
};

export const validateNikkes = (nikkes: Nikke[]): NikkeValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const roleSet = new Set<string>(allowedRoles);

  findDuplicates(nikkes.map((nikke) => nikke.id)).forEach((id) => errors.push(`중복 id: ${id}`));
  findDuplicates(nikkes.map((nikke) => nikke.name)).forEach((name) => warnings.push(`중복 name 확인 필요: ${name}`));

  nikkes.forEach((nikke) => {
    const label = `${nikke.id}(${nikke.name})`;

    if (!allowedRarities.includes(nikke.rarity)) errors.push(`${label}: rarity 값 오류`);
    if (!allowedManufacturers.includes(nikke.manufacturer)) errors.push(`${label}: manufacturer 허용값 아님 - ${nikke.manufacturer}`);
    if (!allowedElements.includes(nikke.element)) errors.push(`${label}: element 허용값 아님 - ${nikke.element}`);
    if (!allowedClassTypes.includes(nikke.classType)) errors.push(`${label}: classType 허용값 아님 - ${nikke.classType}`);
    if (!allowedWeapons.includes(nikke.weapon)) errors.push(`${label}: weapon 허용값 아님 - ${nikke.weapon}`);
    if (!allowedSourceStatuses.includes(nikke.sourceStatus)) errors.push(`${label}: sourceStatus 허용값 아님`);
    if (!Array.isArray(nikke.aliases)) errors.push(`${label}: aliases는 배열이어야 함`);

    nikke.roles.forEach((role) => {
      if (!roleSet.has(role)) errors.push(`${label}: roles 허용 태그 아님 - ${role}`);
    });

    contentTypes.forEach((content) => {
      const score = nikke.contentScores[content];
      if (typeof score !== "number") {
        errors.push(`${label}: contentScores.${content} 누락`);
      } else if (score < 0 || score > 100) {
        errors.push(`${label}: contentScores.${content} 범위 오류 - ${score}`);
      }
    });

    if (nikke.burst === "none" && nikke.cooldown !== null) {
      warnings.push(`${label}: burst none인데 cooldown이 null이 아님`);
    }

    if (nikke.burst !== "none" && nikke.cooldown !== null && typeof nikke.cooldown !== "number") {
      errors.push(`${label}: cooldown은 number 또는 null이어야 함`);
    }

    if (nikke.sourceStatus === "placeholder") {
      warnings.push(`${label}: 임시 데이터`);
    }
  });

  return { errors, warnings };
};
