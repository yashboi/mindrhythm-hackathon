export type SleepValue =
  | "inBed"
  | "asleep"
  | "asleepUnspecified"
  | "core"
  | "deep"
  | "rem"
  | "awake";

export interface SleepRecord {
  startDate: string;
  endDate: string;
  value: SleepValue;
  sourceName: string;
  durationMinutes: number;
}

export interface NightlySleepMetrics {
  date: string;
  sourceNames: string[];
  totalInBedMinutes: number;
  totalAsleepMinutes: number;
  awakeMinutes: number;
  remMinutes: number;
  deepMinutes: number;
  coreMinutes: number;
  sleepEfficiency: number;
  bedtime: string;
  wakeTime: string;
  awakeInterruptions: number;
  richnessScore: number;
  usedInBedAsSleep: boolean;
}

export interface CheckIn {
  id: string;
  date: string;
  mood: number;
  stress: number;
  workload: number;
  energy: number;
  socialConnection: "low" | "medium" | "high";
  overwhelmed: boolean;
  note?: string;
}

export interface BaselineProfile {
  nightsUsed: number;
  averageSleepMinutes: number;
  sleepStdDev: number;
  averageBedtimeMinutes: number;
  bedtimeConsistencyMinutes: number;
  averageWakeMinutes: number;
  averageSleepEfficiency: number;
  averageAwakeInterruptions: number;
  averageMood: number;
  averageStress: number;
  averageWorkload: number;
  averageEnergy: number;
}

export interface ConfidenceBreakdown {
  score: number;
  label: string;
  sleepNights: number;
  richnessLabel: "Manual" | "Basic" | "Moderate" | "Rich";
  explanation: string;
  parts: {
    sleepNights: number;
    richness: number;
    checkIns: number;
    recency: number;
    consistency: number;
  };
}

export interface RootCause {
  label: string;
  detail: string;
  impact: number;
}

export interface ForecastResult {
  window: "24 hours" | "48 hours" | "72 hours";
  score: number;
  label: "Stable" | "Watch Zone" | "Elevated Instability" | "High Instability";
  explanation: string;
  rootCauses: RootCause[];
}
