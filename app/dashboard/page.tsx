"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BaselineSummary } from "@/components/BaselineSummary";
import { DataRichnessCard } from "@/components/DataRichnessCard";
import { DemoDataButton } from "@/components/DemoDataButton";
import { ForecastCards } from "@/components/ForecastCards";
import { ForecastChart, MoodStressChart, SleepChart } from "@/components/SleepChart";
import { RootCauseExplainer } from "@/components/RootCauseExplainer";
import { StabilizationPlan } from "@/components/StabilizationPlan";
import { calculateBaseline } from "@/lib/baseline";
import { calculateConfidenceScore } from "@/lib/confidence";
import { forecast24, forecast48, forecast72 } from "@/lib/forecast";
import { createManualMetricsFromCheckIns } from "@/lib/manualBaseline";
import { generateActionPlan, generateRootCauseExplanation } from "@/lib/recommendations";
import { clearMindRhythmData, loadCheckIns, loadNightlyMetrics } from "@/lib/storage";
import { CheckIn, NightlySleepMetrics } from "@/types/health";

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<NightlySleepMetrics[]>([]);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setMetrics(loadNightlyMetrics());
    setCheckIns(loadCheckIns());
    setReady(true);
  }, []);

  const analysis = useMemo(() => {
    const effectiveMetrics = metrics.length ? metrics : createManualMetricsFromCheckIns(checkIns);
    if (!effectiveMetrics.length) return null;
    const baseline = calculateBaseline(effectiveMetrics, checkIns);
    const confidence = calculateConfidenceScore(effectiveMetrics, checkIns);
    const forecasts = [forecast24(effectiveMetrics, checkIns, baseline), forecast48(effectiveMetrics, checkIns, baseline), forecast72(effectiveMetrics, checkIns, baseline)];
    const causes = generateRootCauseExplanation(forecasts[2].rootCauses);
    const actions = generateActionPlan(causes);
    return { baseline, confidence, forecasts, causes, actions };
  }, [metrics, checkIns]);

  if (!ready) return null;

  if (!analysis) {
    return (
      <main className="mx-auto max-w-4xl px-5 py-12">
        <section className="rounded-lg border border-white bg-white/90 p-8 text-center shadow-soft">
          <h1 className="text-3xl font-semibold text-ink">Start with your first signal</h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted">Start by uploading Apple Health XML, trying demo data, or entering a manual check-in.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link className="focus-ring rounded-lg border border-sea/20 bg-white px-5 py-3 text-sm font-semibold text-sea hover:bg-aqua" href="/upload">Upload XML</Link>
            <DemoDataButton />
            <Link className="focus-ring rounded-lg border border-sea/20 bg-white px-5 py-3 text-sm font-semibold text-sea hover:bg-aqua" href="/check-in">Manual Check-In</Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-sea">Baseline ready</p>
          <h1 className="mt-2 text-4xl font-semibold text-ink">Mental Stability Forecast</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <DemoDataButton burnout label="Simulate Burnout Week" />
          <button
            className="focus-ring rounded-lg border border-sea/20 bg-white px-4 py-3 text-sm font-semibold text-sea hover:bg-aqua"
            onClick={() => {
              clearMindRhythmData();
              setMetrics([]);
              setCheckIns([]);
            }}
          >
            Clear data
          </button>
        </div>
      </div>
      <div className="grid gap-5">
        <BaselineSummary baseline={analysis.baseline} confidence={analysis.confidence} current={analysis.forecasts[0]} metrics={metrics.length ? metrics : createManualMetricsFromCheckIns(checkIns)} />
        <ForecastCards forecasts={analysis.forecasts} />
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <RootCauseExplainer causes={analysis.causes} />
          <StabilizationPlan actions={analysis.actions} />
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          <SleepChart metrics={metrics.length ? metrics : createManualMetricsFromCheckIns(checkIns)} baseline={analysis.baseline} />
          <MoodStressChart checkIns={checkIns} />
        </div>
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <DataRichnessCard metrics={metrics.length ? metrics : createManualMetricsFromCheckIns(checkIns)} confidence={analysis.confidence} />
          <ForecastChart forecasts={analysis.forecasts} />
        </div>
      </div>
    </main>
  );
}
