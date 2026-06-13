import { BaselineProfile, CheckIn, ForecastResult, NightlySleepMetrics, RootCause } from "@/types/health";
import { clamp, latestByDate, minutesSinceMidnight } from "@/lib/utils";

export function calculateCurrentInstability(metrics: NightlySleepMetrics[], checkIns: CheckIn[], baseline: BaselineProfile) {
  return scoreWindow(latestByDate(metrics, 1), latestByDate(checkIns, 1), baseline, 1);
}

export function forecast24(metrics: NightlySleepMetrics[], checkIns: CheckIn[], baseline: BaselineProfile): ForecastResult {
  return toForecast("24 hours", scoreWindow(latestByDate(metrics, 1), latestByDate(checkIns, 1), baseline, 1));
}

export function forecast48(metrics: NightlySleepMetrics[], checkIns: CheckIn[], baseline: BaselineProfile): ForecastResult {
  return toForecast("48 hours", scoreWindow(latestByDate(metrics, 3), latestByDate(checkIns, 3), baseline, 1.12));
}

export function forecast72(metrics: NightlySleepMetrics[], checkIns: CheckIn[], baseline: BaselineProfile): ForecastResult {
  return toForecast("72 hours", scoreWindow(latestByDate(metrics, 7), latestByDate(checkIns, 7), baseline, 1.22));
}

// The model is intentionally explainable: each factor becomes a visible score contribution and root cause.
function scoreWindow(metrics: NightlySleepMetrics[], checkIns: CheckIn[], baseline: BaselineProfile, trendMultiplier: number) {
  const latest = metrics.at(-1);
  const recentCheckIns = latestByDate(checkIns, Math.max(1, Math.min(7, checkIns.length)));
  const avgSleep = avg(metrics.map((m) => m.totalAsleepMinutes));
  const avgEfficiency = avg(metrics.map((m) => m.sleepEfficiency));
  const avgInterruptions = avg(metrics.map((m) => m.awakeInterruptions));
  const avgBedtime = avg(metrics.map((m) => minutesSinceMidnight(m.bedtime)));
  const avgStress = avg(recentCheckIns.map((checkIn) => checkIn.stress)) || baseline.averageStress;
  const avgMood = avg(recentCheckIns.map((checkIn) => checkIn.mood)) || baseline.averageMood;
  const avgWorkload = avg(recentCheckIns.map((checkIn) => checkIn.workload)) || baseline.averageWorkload;
  const avgEnergy = avg(recentCheckIns.map((checkIn) => checkIn.energy)) || baseline.averageEnergy;
  const socialScore = avg(recentCheckIns.map((checkIn) => checkIn.socialConnection === "low" ? 1 : checkIn.socialConnection === "medium" ? 0.35 : 0));
  const sleepDrop = baseline.averageSleepMinutes ? clamp((baseline.averageSleepMinutes - avgSleep) / baseline.averageSleepMinutes, 0, 1) : 0;
  const bedtimeShift = Math.abs(avgBedtime - baseline.averageBedtimeMinutes);
  const efficiencyDrop = baseline.averageSleepEfficiency ? clamp((baseline.averageSleepEfficiency - avgEfficiency) / baseline.averageSleepEfficiency, 0, 1) : 0;
  const interruptionIncrease = baseline.averageAwakeInterruptions ? clamp((avgInterruptions - baseline.averageAwakeInterruptions) / Math.max(baseline.averageAwakeInterruptions, 1), 0, 1) : 0;
  const stressSpike = clamp((avgStress - baseline.averageStress) / 6, 0, 1);
  const moodDrop = clamp((baseline.averageMood - avgMood) / 6, 0, 1);
  const workloadSpike = clamp((avgWorkload - baseline.averageWorkload) / 6, 0, 1);
  const energyDrop = clamp((baseline.averageEnergy - avgEnergy) / 6, 0, 1);
  const socialDrop = socialScore || 0;
  const consecutive = worseningTrend(metrics, checkIns);

  const rootCauses: RootCause[] = [
    { label: "Sleep duration", detail: `Sleep is ${Math.round(sleepDrop * 100)}% below baseline.`, impact: sleepDrop * 25 },
    { label: "Bedtime shift", detail: `Bedtime shifted ${Math.round(bedtimeShift)} minutes from baseline.`, impact: clamp(bedtimeShift / 120, 0, 1) * 15 },
    { label: "Sleep efficiency", detail: `Efficiency is ${Math.round(efficiencyDrop * 100)}% below baseline with more interruptions.`, impact: (efficiencyDrop * 0.65 + interruptionIncrease * 0.35) * 15 },
    { label: "Stress", detail: `Recent stress average is ${Math.max(0, avgStress - baseline.averageStress).toFixed(1)} points above baseline.`, impact: stressSpike * 15 },
    { label: "Mood", detail: `Recent mood average is ${Math.max(0, baseline.averageMood - avgMood).toFixed(1)} points below baseline.`, impact: moodDrop * 15 },
    { label: "Workload", detail: `Workload pressure is trending above normal.`, impact: workloadSpike * 10 },
    { label: "Energy and connection", detail: `Recent energy and social connection are below the baseline pattern.`, impact: (energyDrop * 0.7 + socialDrop * 0.3) * 5 },
    { label: "Consecutive pattern", detail: `Recent days show ${consecutive ? "a sustained worsening pattern" : "mixed movement"}.`, impact: consecutive ? 8 : 0 }
  ].filter((cause) => cause.impact > 1);

  const score = clamp(rootCauses.reduce((sum, cause) => sum + cause.impact, 0) * trendMultiplier, 0, 100);
  return { score, rootCauses: rootCauses.sort((a, b) => b.impact - a.impact), latest };
}

function toForecast(window: ForecastResult["window"], result: ReturnType<typeof scoreWindow>): ForecastResult {
  const score = Math.round(result.score);
  const label = score >= 75 ? "High Instability" : score >= 52 ? "Elevated Instability" : score >= 28 ? "Watch Zone" : "Stable";
  const top = result.rootCauses[0];
  return {
    window,
    score,
    label,
    explanation: top ? `${top.detail} This raises the ${window} stability forecast.` : "Recent data is close to your baseline.",
    rootCauses: result.rootCauses
  };
}

function worseningTrend(metrics: NightlySleepMetrics[], checkIns: CheckIn[]) {
  const recentNights = latestByDate(metrics, 3);
  const recentCheckIns = latestByDate(checkIns, 3);
  const sleepFalling = recentNights.length === 3 && recentNights[0].totalAsleepMinutes > recentNights[2].totalAsleepMinutes;
  const stressRising = recentCheckIns.length === 3 && recentCheckIns[0].stress < recentCheckIns[2].stress;
  const moodFalling = recentCheckIns.length === 3 && recentCheckIns[0].mood > recentCheckIns[2].mood;
  return [sleepFalling, stressRising, moodFalling].filter(Boolean).length >= 2;
}

function avg(values: number[]) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}
