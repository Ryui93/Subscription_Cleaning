import { missingPlaceholderNikkes, nikkes } from "../data/nikkes";
import { validateNikkes } from "../data/nikkeRoster/validation";
import { getAverageContentScore, getDataQualityStats } from "../lib/dataQuality";
import { getScoreAuditOverview } from "../lib/contentScoreAudit";

const result = validateNikkes(nikkes);
const stats = getDataQualityStats(nikkes);
const scoreAudit = getScoreAuditOverview(nikkes);

const placeholderWarnings = nikkes.filter((nikke) => nikke.sourceStatus === "placeholder").length;
const generatedPlaceholderWarnings = missingPlaceholderNikkes.filter((nikke) => nikke.sourceStatus === "placeholder").length;
const needsReviewWarnings = nikkes.filter((nikke) => nikke.sourceStatus === "needsReview").length;
const missingSkillPriority = nikkes.filter((nikke) => nikke.skillPriority.includes("검수 필요") || nikke.skillPriority.includes("TBD")).length;
const missingOverloadPriority = nikkes.filter((nikke) => nikke.overloadPriority.includes("검수 필요") || nikke.overloadPriority.includes("TBD")).length;
const lowContentScoreConfidence = nikkes.filter((nikke) => getAverageContentScore(nikke) < 50).length;

console.log("NIKKE DATA VALIDATION");
console.log("");
console.log("Summary:");
console.log(`- Total: ${nikkes.length}`);
console.log(`- Errors: ${result.errors.length}`);
console.log(`- Warnings: ${result.warnings.length}`);
console.log(`- Generated placeholder warnings: ${generatedPlaceholderWarnings}`);
console.log(`- SourceStatus placeholder warnings: ${placeholderWarnings}`);
console.log(`- Needs review warnings: ${needsReviewWarnings}`);
console.log("");
console.log("Source Status:");
console.log(`- verified: ${stats.bySourceStatus.verified}`);
console.log(`- communityChecked: ${stats.bySourceStatus.communityChecked}`);
console.log(`- needsReview: ${stats.bySourceStatus.needsReview}`);
console.log(`- placeholder: ${stats.bySourceStatus.placeholder}`);
console.log("");
console.log("Rarity:");
console.log(`- SSR: ${stats.byRarity.SSR}`);
console.log(`- SR: ${stats.byRarity.SR}`);
console.log(`- R: ${stats.byRarity.R}`);
console.log("");
console.log("Top Warning Types:");
console.log(`- placeholder data: ${placeholderWarnings}`);
console.log(`- missing skill priority: ${missingSkillPriority}`);
console.log(`- missing overload priority: ${missingOverloadPriority}`);
console.log(`- low content score confidence: ${lowContentScoreConfidence}`);
console.log("");
console.log("Content Score Audit:");
scoreAudit.stats.forEach((stat) => {
  console.log(`- Average ${stat.content} score: ${stat.average} (90+: ${stat.highScoreCount}, <70: ${stat.lowScoreCount})`);
});
console.log(`- All-rounder candidates: ${scoreAudit.allRounderCandidates.length}`);
console.log(`- NeedsReview high-score warnings: ${scoreAudit.needsReviewHighScoreCandidates.length}`);
console.log(`- Suspicious score patterns: ${scoreAudit.suspiciousPatterns.length}`);

if (result.errors.length > 0) {
  console.log("");
  console.log("Errors:");
  result.errors.forEach((error) => console.log(`- ${error}`));
}

console.log("");
console.log("Result:");
console.log(result.errors.length > 0 ? "FAIL" : result.warnings.length > 0 ? "PASS WITH WARNINGS" : "PASS");

if (result.errors.length > 0) {
  process.exit(1);
}
