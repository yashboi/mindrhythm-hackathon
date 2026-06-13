import { CheckIn, NightlySleepMetrics } from "@/types/health";

export function createManualMetricsFromCheckIns(checkIns: CheckIn[]): NightlySleepMetrics[] {
  return checkIns.map((checkIn) => {
    const bedtime = new Date(`${checkIn.date}T23:00:00`);
    const sleepMinutes = Math.round(390 + checkIn.energy * 12 - checkIn.stress * 8);
    const awakeMinutes = Math.max(8, Math.round(checkIn.stress * 4));
    const wake = new Date(bedtime.getTime() + (sleepMinutes + awakeMinutes) * 60000);

    return {
      date: checkIn.date,
      sourceNames: ["Manual check-in"],
      totalInBedMinutes: sleepMinutes + awakeMinutes + 20,
      totalAsleepMinutes: sleepMinutes,
      awakeMinutes,
      remMinutes: 0,
      deepMinutes: 0,
      coreMinutes: 0,
      sleepEfficiency: sleepMinutes / (sleepMinutes + awakeMinutes + 20),
      bedtime: bedtime.toISOString(),
      wakeTime: wake.toISOString(),
      awakeInterruptions: Math.max(1, Math.round(checkIn.stress / 3)),
      richnessScore: 12,
      usedInBedAsSleep: false
    };
  });
}
