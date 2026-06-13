import { calculateDataRichness } from "@/lib/appleHealthParser";
import { CheckIn, ConfidenceBreakdown, NightlySleepMetrics } from "@/types/health";
import { clamp, stdDev } from "@/lib/utils";

export function calculateConfidenceScore(metrics: NightlySleepMetrics[], checkIns: CheckIn[]): ConfidenceBreakdown {
  const richness = calculateDataRichness(metrics);
  const sleepNights = clamp((metrics.length / 21) * 35, 0, 35);
  const richnessPoints = richness.label === "Rich" ? 20 : richness.label === "Moderate" ? 14 : richness.label === "Basic" ? 9 : 5;
  const checkInPoints = clamp((checkIns.length / 7) * 20, 0, 20);
  const recencyPoints = recencyScore(metrics, checkIns) * 15;
  const consistencyPenalty = clamp(stdDev(metrics.slice(-7).map((night) => night.totalAsleepMinutes)) / 120, 0, 1);
  const consistencyPoints = (1 - consistencyPenalty) * 10;
  const score = Math.round(sleepNights + richnessPoints + checkInPoints + recencyPoints + consistencyPoints);

  return {
    score,
    label: score >= 75 ? "High" : score >= 55 ? "Moderate" : "Early",
    sleepNights: metrics.length,
    richnessLabel: richness.label,
    explanation: `Confidence is based on ${metrics.length} nights of sleep data, ${richness.description.toLowerCase()}, and ${checkIns.length} mood check-ins.`,
    parts: {
      sleepNights: Math.round(sleepNights),
      richness: Math.round(richnessPoints),
      checkIns: Math.round(checkInPoints),
      recency: Math.round(recencyPoints),
      consistency: Math.round(consistencyPoints)
    }
  };
}

function recencyScore(metrics: NightlySleepMetrics[], checkIns: CheckIn[]) {
  const latest = [...metrics.map((m) => m.date), ...checkIns.map((c) => c.date)].sort().at(-1);
  if (!latest) return 0;
  const daysOld = (Date.now() - new Date(`${latest}T12:00:00`).getTime()) / 86400000;
  if (daysOld <= 2) return 1;
  if (daysOld <= 7) return 0.75;
  if (daysOld <= 14) return 0.45;
  return 0.2;
}
