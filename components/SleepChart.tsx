"use client";

import { BaselineProfile, CheckIn, ForecastResult, NightlySleepMetrics } from "@/types/health";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  BarChart
} from "recharts";

export function SleepChart({ metrics, baseline }: { metrics: NightlySleepMetrics[]; baseline: BaselineProfile }) {
  const data = metrics.map((night) => ({
    date: night.date.slice(5),
    sleep: Math.round(night.totalAsleepMinutes / 60 * 10) / 10,
    baseline: Math.round(baseline.averageSleepMinutes / 60 * 10) / 10,
    efficiency: Math.round(night.sleepEfficiency * 100)
  }));
  return (
    <ChartShell title="Sleep duration">
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <CartesianGrid stroke="#dcebe8" vertical={false} />
          <XAxis dataKey="date" tick={{ fill: "#587276", fontSize: 12 }} />
          <YAxis tick={{ fill: "#587276", fontSize: 12 }} />
          <Tooltip />
          <Area dataKey="sleep" name="Sleep hours" stroke="#147c7b" fill="#d9f2ee" strokeWidth={2} />
          <Line dataKey="baseline" name="Baseline" stroke="#e87561" strokeDasharray="4 4" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

export function MoodStressChart({ checkIns }: { checkIns: CheckIn[] }) {
  const data = checkIns.map((checkIn) => ({ date: checkIn.date.slice(5), mood: checkIn.mood, stress: checkIn.stress }));
  return (
    <ChartShell title="Mood and stress">
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid stroke="#dcebe8" vertical={false} />
          <XAxis dataKey="date" tick={{ fill: "#587276", fontSize: 12 }} />
          <YAxis domain={[0, 10]} tick={{ fill: "#587276", fontSize: 12 }} />
          <Tooltip />
          <Line dataKey="mood" stroke="#147c7b" strokeWidth={2} />
          <Line dataKey="stress" stroke="#e87561" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

export function ForecastChart({ forecasts }: { forecasts: ForecastResult[] }) {
  return (
    <ChartShell title="Forecast risk">
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={forecasts.map((forecast) => ({ window: forecast.window, score: forecast.score }))}>
          <CartesianGrid stroke="#dcebe8" vertical={false} />
          <XAxis dataKey="window" tick={{ fill: "#587276", fontSize: 12 }} />
          <YAxis domain={[0, 100]} tick={{ fill: "#587276", fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="score" fill="#147c7b" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

function ChartShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-white bg-white/90 p-5 shadow-soft">
      <h2 className="mb-4 text-lg font-semibold text-ink">{title}</h2>
      {children}
    </section>
  );
}
