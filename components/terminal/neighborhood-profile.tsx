import type { MobilityLocation } from "@/lib/mobility/types";
import { getTrendLabel, mobilityStatus } from "@/lib/mobility/scoring";

export function NeighborhoodProfile({ location }: { location: MobilityLocation }) {
  const points = [
    location.mobilityScore - 6,
    location.mobilityScore - 3,
    location.mobilityScore - 4,
    location.mobilityScore + 2,
    location.mobilityScore,
    location.mobilityScore + 3,
    location.mobilityScore - 1,
    location.mobilityScore + 5,
    location.mobilityScore + 4,
  ].map((v) => Math.max(0, Math.min(100, v)));
  const polyline = points.map((v, i) => `${36 + i * 36},${150 - v}`).join(" ");

  return (
    <section className="border border-slate-500/20 bg-slate-900/60 p-5">
      <div className="flex flex-col gap-4 md:flex-row md:justify-between">
        <div>
          <h2 className="text-2xl">{location.name}</h2>
          <p className="text-xs uppercase text-slate-400">{location.county} / {location.type}</p>
        </div>
        <div className="text-left md:text-right">
          <div className="font-mono text-5xl text-cyan-300">{location.mobilityScore}</div>
          <div className="text-xs uppercase">{mobilityStatus(location.mobilityScore)} / {getTrendLabel(location.mobilityTrend)}</div>
        </div>
      </div>
      <p className="mt-4 text-base leading-7 text-slate-300">{location.summary}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="border border-slate-700 bg-slate-950/50 p-3">
          <div className="text-[11px] uppercase text-slate-500">Median household income</div>
          <div className="mt-1 font-mono text-xl text-slate-100">${location.medianIncome.toLocaleString()}</div>
        </div>
        <div className="border border-slate-700 bg-slate-950/50 p-3">
          <div className="text-[11px] uppercase text-slate-500">Mean commute</div>
          <div className="mt-1 font-mono text-xl text-slate-100">{location.commuteBurdenMinutes} minutes</div>
        </div>
        <div className="border border-slate-700 bg-slate-950/50 p-3">
          <div className="text-[11px] uppercase text-slate-500">Data type</div>
          <div className="mt-1 text-sm text-slate-300">{location.type === "city" ? "City fact + prototype indices" : "Prototype neighborhood scenario"}</div>
        </div>
      </div>
      <div className="mt-4 border border-slate-700 bg-slate-950/50 p-3 text-xs leading-5 text-slate-300">
        <span className="font-semibold text-slate-100">Data status: </span>
        {location.factSource}
        {location.sourceUrl && (
          <a className="ml-2 text-cyan-300 underline-offset-4 hover:underline" href={location.sourceUrl} target="_blank" rel="noreferrer">
            Open source
          </a>
        )}
      </div>
      <div className="mt-5 overflow-x-auto terminal-scroll">
        <svg viewBox="0 0 360 180" className="h-44 min-w-[360px] w-full" role="img" aria-label="Mobility score trend with y-axis from 0 to 100">
          <line x1="34" y1="24" x2="34" y2="150" stroke="rgba(148,163,184,.45)" />
          <line x1="34" y1="150" x2="340" y2="150" stroke="rgba(148,163,184,.45)" />
          {[0, 50, 100].map((tick) => (
            <g key={tick}>
              <line x1="30" y1={150 - tick} x2="340" y2={150 - tick} stroke="rgba(148,163,184,.14)" />
              <text x="4" y={154 - tick} fill="#94a3b8" fontSize="11">{tick}</text>
            </g>
          ))}
          <polyline fill="none" stroke="#22d3ee" strokeWidth="3" points={polyline} />
          <text x="34" y="170" fill="#94a3b8" fontSize="11">2018</text>
          <text x="306" y="170" fill="#94a3b8" fontSize="11">2026</text>
          <text x="126" y="174" fill="#94a3b8" fontSize="11">Mobility yield trend</text>
        </svg>
      </div>
    </section>
  );
}
