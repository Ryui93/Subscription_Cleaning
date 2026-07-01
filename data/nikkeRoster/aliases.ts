import { nikkes } from ".";

export const nikkeAliases = Object.fromEntries(nikkes.map((nikke) => [nikke.id, nikke.aliases]));
