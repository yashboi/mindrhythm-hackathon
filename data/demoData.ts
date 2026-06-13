import { CheckIn, NightlySleepMetrics } from "@/types/health";

const today = new Date();

export function createDemoData(burnout = false): { metrics: NightlySleepMetrics[]; checkIns: CheckIn[] } {
  const metrics: NightlySleepMetrics[] = [];
  const checkIns: CheckIn[] = [];

  for (let i = 20; i >= 0; i--) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);
    const date = day.toISOString().slice(0, 10);
    const phase = 20 - i;
    const worsening = phase >= 14;
    const boost = burnout && worsening ? 1.45 : 1;
    const sleep = worsening ? 455 - (phase - 14) * 24 * boost : 470 + Math.sin(phase) * 12;
    const awake = worsening ? 22 + (phase - 14) * 7 * boost : 12 + (phase % 3) * 2;
    const bedtimeHour = worsening ? 23.2 + (phase - 14) * 0.22 * boost : 22.7 + Math.sin(phase) * 0.1;
    const bedtime = new Date(`${date}T00:00:00`);
    bedtime.setHours(Math.floor(bedtimeHour), Math.round((bedtimeHour % 1) * 60));
    const wake = new Date(bedtime.getTime() + (sleep + awake) * 60000);

    metrics.push({
      date,
      sourceNames: ["MindRhythm Demo Watch"],
      totalInBedMinutes: sleep + awake + 18,
      totalAsleepMinutes: Math.round(sleep),
      awakeMinutes: Math.round(awake),
      remMinutes: Math.round(sleep * 0.22),
      deepMinutes: Math.round(sleep * (worsening ? 0.11 : 0.16)),
      coreMinutes: Math.round(sleep * 0.55),
      sleepEfficiency: sleep / (sleep + awake + 18),
      bedtime: bedtime.toISOString(),
      wakeTime: wake.toISOString(),
      awakeInterruptions: Math.round(worsening ? 2 + (phase - 14) * 0.7 * boost : 1 + (phase % 2)),
      richnessScore: 100,
      usedInBedAsSleep: false
    });

    checkIns.push({
      id: `demo-${date}`,
      date,
      mood: Math.round(worsening ? Math.max(2, 7 - (phase - 14) * 0.55 * boost) : 7 + Math.sin(phase) * 0.6),
      stress: Math.round(worsening ? Math.min(10, 4 + (phase - 14) * 0.7 * boost) : 4 + (phase % 2)),
      workload: Math.round(worsening ? Math.min(10, 5 + (phase - 14) * 0.55 * boost) : 5),
      energy: Math.round(worsening ? Math.max(2, 7 - (phase - 14) * 0.6 * boost) : 7),
      socialConnection: worsening && phase > 17 ? "low" : worsening ? "medium" : "high",
      overwhelmed: worsening && phase > 17,
      note: worsening ? "Demo pattern: routine pressure is building." : "Demo baseline day."
    });
  }

  return { metrics, checkIns };
}
