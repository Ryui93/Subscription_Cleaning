import { ssrNikkes } from "./ssr";
import { srNikkes } from "./sr";
import { rNikkes } from "./r";
import { missingPlaceholderNikkes } from "./missingPlaceholders";
import { applyBatch05Review } from "./reviewBatch05";

export { ssrNikkes } from "./ssr";
export { srNikkes } from "./sr";
export { rNikkes } from "./r";
export { missingNikkeSeeds, missingPlaceholderNikkes } from "./missingPlaceholders";

export const nikkes = applyBatch05Review([...ssrNikkes, ...srNikkes, ...rNikkes, ...missingPlaceholderNikkes]);
