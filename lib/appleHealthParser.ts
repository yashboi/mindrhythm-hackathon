import { NightlySleepMetrics, SleepRecord, SleepValue } from "@/types/health";

const valueMap: Record<string, SleepValue> = {
  HKCategoryValueSleepAnalysisInBed: "inBed",
  HKCategoryValueSleepAnalysisAsleep: "asleep",
  HKCategoryValueSleepAnalysisAsleepUnspecified: "asleepUnspecified",
  HKCategoryValueSleepAnalysisAsleepCore: "core",
  HKCategoryValueSleepAnalysisAsleepDeep: "deep",
  HKCategoryValueSleepAnalysisAsleepREM: "rem",
  HKCategoryValueSleepAnalysisAwake: "awake"
};

export function parseAppleHealthXml(xml: string): SleepRecord[] {
  const document = new DOMParser().parseFromString(xml, "text/xml");
  const records = Array.from(document.querySelectorAll("Record[type='HKCategoryTypeIdentifierSleepAnalysis']"));

  return records
    .map((node) => {
      const startDate = node.getAttribute("startDate") || "";
      const endDate = node.getAttribute("endDate") || "";
      const value = valueMap[node.getAttribute("value") || ""];
      const sourceName = node.getAttribute("sourceName") || "Unknown source";
      const durationMinutes = (parseAppleDate(endDate).getTime() - parseAppleDate(startDate).getTime()) / 60000;
      if (!startDate || !endDate || !value || durationMinutes <= 0) return null;
      return { startDate, endDate, value, sourceName, durationMinutes };
    })
    .filter(Boolean) as SleepRecord[];
}

export function calculateNightlyMetrics(records: SleepRecord[]): NightlySleepMetrics[] {
  const nights = new Map<string, SleepRecord[]>();

  for (const record of records) {
    const key = sleepNightKey(record.startDate);
    nights.set(key, [...(nights.get(key) || []), record]);
  }

  return Array.from(nights.entries())
    .map(([date, nightRecords]) => summarizeNight(date, nightRecords))
    .sort((a, b) => a.date.localeCompare(b.date));
}

function summarizeNight(date: string, records: SleepRecord[]): NightlySleepMetrics {
  const total = (values: SleepValue[]) =>
    records.filter((record) => values.includes(record.value)).reduce((sum, record) => sum + record.durationMinutes, 0);
  const sourceNames = Array.from(new Set(records.map((record) => record.sourceName)));
  const totalInBedMinutes = total(["inBed"]);
  const stageAsleep = total(["asleep", "asleepUnspecified", "core", "deep", "rem"]);
  const fallbackAsleep = stageAsleep || totalInBedMinutes;
  const awakeMinutes = total(["awake"]);
  const startTimes = records.map((record) => parseAppleDate(record.startDate).getTime());
  const endTimes = records.map((record) => parseAppleDate(record.endDate).getTime());
  const richnessScore = calculateDataRichnessFromRecords(records);
  const denominator = totalInBedMinutes || fallbackAsleep + awakeMinutes;

  return {
    date,
    sourceNames,
    totalInBedMinutes,
    totalAsleepMinutes: fallbackAsleep,
    awakeMinutes,
    remMinutes: total(["rem"]),
    deepMinutes: total(["deep"]),
    coreMinutes: total(["core"]),
    sleepEfficiency: denominator ? fallbackAsleep / denominator : 0,
    bedtime: new Date(Math.min(...startTimes)).toISOString(),
    wakeTime: new Date(Math.max(...endTimes)).toISOString(),
    awakeInterruptions: records.filter((record) => record.value === "awake").length,
    richnessScore,
    usedInBedAsSleep: !stageAsleep && totalInBedMinutes > 0
  };
}

export function calculateDataRichness(metrics: NightlySleepMetrics[]) {
  const averageRichness = metrics.reduce((sum, night) => sum + night.richnessScore, 0) / Math.max(metrics.length, 1);
  if (averageRichness >= 80) return { label: "Rich" as const, description: "Rich Apple Watch-style data detected: Core, Deep, REM, and Awake records were found." };
  if (averageRichness >= 45) return { label: "Moderate" as const, description: "Moderate data detected: asleep records and awake interruptions are available." };
  if (averageRichness > 0) return { label: "Basic" as const, description: "Basic data detected: mostly in-bed or broad asleep duration." };
  return { label: "Manual" as const, description: "Manual or limited data detected. Forecast confidence will improve with more nights and check-ins." };
}

function calculateDataRichnessFromRecords(records: SleepRecord[]) {
  const values = new Set(records.map((record) => record.value));
  if (values.has("rem") && values.has("deep") && values.has("core") && values.has("awake")) return 100;
  if ((values.has("asleep") || values.has("asleepUnspecified")) && values.has("awake")) return 60;
  if (values.has("asleep") || values.has("asleepUnspecified") || values.has("inBed")) return 30;
  return 0;
}

function sleepNightKey(dateString: string) {
  const date = parseAppleDate(dateString);
  if (date.getHours() < 12) date.setDate(date.getDate() - 1);
  return date.toISOString().slice(0, 10);
}

function parseAppleDate(value: string) {
  const normalized = value.replace(/^(\d{4}-\d{2}-\d{2}) /, "$1T").replace(/ ([+-]\d{2})(\d{2})$/, "$1:$2");
  return new Date(normalized);
}
