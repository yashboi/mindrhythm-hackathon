import { BaselineProfile, CheckIn, NightlySleepMetrics } from "@/types/health";
import { average, minutesSinceMidnight, stdDev } from "@/lib/utils";

export function calculateBaseline(metrics: NightlySleepMetrics[], checkIns: CheckIn[]): BaselineProfile {
  const sorted = [...metrics].sort((a, b) => a.date.localeCompare(b.date));
  const baselineNights = sorted.length >= 21 ? sorted.slice(0, 14) : sorted.slice(0, Math.min(sorted.length, 14));
  const baselineDates = new Set(baselineNights.map((night) => night.date));
  const baselineCheckIns = checkIns.filter((checkIn) => baselineDates.has(checkIn.date)).slice(0, 14);
  const sleepMinutes = baselineNights.map((night) => night.totalAsleepMinutes);
  const bedtimes = baselineNights.map((night) => minutesSinceMidnight(night.bedtime));

  return {
    nightsUsed: baselineNights.length,
    averageSleepMinutes: average(sleepMinutes),
    sleepStdDev: stdDev(sleepMinutes),
    averageBedtimeMinutes: average(bedtimes),
    bedtimeConsistencyMinutes: stdDev(bedtimes),
    averageWakeMinutes: average(baselineNights.map((night) => minutesSinceMidnight(night.wakeTime))),
    averageSleepEfficiency: average(baselineNights.map((night) => night.sleepEfficiency)),
    averageAwakeInterruptions: average(baselineNights.map((night) => night.awakeInterruptions)),
    averageMood: average(baselineCheckIns.map((checkIn) => checkIn.mood)) || 7,
    averageStress: average(baselineCheckIns.map((checkIn) => checkIn.stress)) || 4,
    averageWorkload: average(baselineCheckIns.map((checkIn) => checkIn.workload)) || 5,
    averageEnergy: average(baselineCheckIns.map((checkIn) => checkIn.energy)) || 7
  };
}

export function baselineConfidenceLabel(nights: number) {
  if (nights <= 2) return "Very low confidence";
  if (nights <= 6) return "Early baseline";
  if (nights <= 13) return "Moderate confidence";
  return "Strong baseline";
}
