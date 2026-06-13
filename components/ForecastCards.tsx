import { ForecastResult } from "@/types/health";
import { clsx } from "clsx";

export function ForecastCards({ forecasts }: { forecasts: ForecastResult[] }) {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {forecasts.map((forecast) => (
        <article key={forecast.window} className="rounded-lg border border-white bg-white/90 p-5 shadow-soft">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-muted">{forecast.window}</p>
            <span className={clsx("rounded-full px-3 py-1 text-xs font-semibold", tone(forecast.score))}>{forecast.label}</span>
          </div>
          <p className="mt-5 text-4xl font-semibold text-ink">{forecast.score}<span className="text-lg text-muted">/100</span></p>
          <p className="mt-4 text-sm leading-6 text-muted">{forecast.explanation}</p>
        </article>
      ))}
    </section>
  );
}

function tone(score: number) {
  if (score >= 75) return "bg-coral/15 text-coral";
  if (score >= 52) return "bg-amber-100 text-amber-800";
  if (score >= 28) return "bg-aqua text-sea";
  return "bg-sage text-green-800";
}
