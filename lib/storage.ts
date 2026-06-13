"use client";

import { CheckIn, NightlySleepMetrics } from "@/types/health";

const SLEEP_KEY = "mindrhythm.nightlyMetrics";
const CHECKIN_KEY = "mindrhythm.checkIns";

export function loadNightlyMetrics(): NightlySleepMetrics[] {
  return readJson<NightlySleepMetrics[]>(SLEEP_KEY, []);
}

export function saveNightlyMetrics(metrics: NightlySleepMetrics[]) {
  localStorage.setItem(SLEEP_KEY, JSON.stringify(metrics));
}

export function loadCheckIns(): CheckIn[] {
  return readJson<CheckIn[]>(CHECKIN_KEY, []);
}

export function saveCheckIns(checkIns: CheckIn[]) {
  localStorage.setItem(CHECKIN_KEY, JSON.stringify(checkIns));
}

export function clearMindRhythmData() {
  localStorage.removeItem(SLEEP_KEY);
  localStorage.removeItem(CHECKIN_KEY);
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}
