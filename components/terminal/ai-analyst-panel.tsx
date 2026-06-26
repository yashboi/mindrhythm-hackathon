"use client";

import type { MobilityLocation, MobilityReport } from "@/lib/mobility/types";
import { generateLocationAnalysis } from "@/lib/mobility/analyst";
import { SourceBadge } from "./source-badge";
import { Button } from "@/components/ui/button";

export function AIAnalystPanel({
  location,
  onReport,
}: {
  location: MobilityLocation;
  onReport: (r: MobilityReport) => void;
}) {
  async function gen() {
    const r = await fetch("/api/report", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ locationId: location.id }),
    });
    onReport(await r.json());
  }

  return (
    <aside className="border border-slate-500/20 bg-slate-900/70 p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Data Provenance</h2>
        <span className="text-[10px] text-cyan-300">SOURCE CHECK</span>
      </div>
      <h3 className="mt-4 text-xl">{location.name}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-300">
        {location.id === "east-san-jose"
          ? "East San Jose has high proximity to regional wealth, but rent burden, commute pressure, and uneven transit access weaken the conversion from nearby opportunity into household mobility."
          : generateLocationAnalysis(location)}
      </p>
      <div className="mt-4 border border-slate-700 bg-slate-950/50 p-3 text-xs leading-5 text-slate-300">
        <strong className="text-slate-100">Fact source</strong>: {location.factSource}
        {location.sourceUrl && (
          <>
            <br />
            <a className="text-cyan-300 underline-offset-4 hover:underline" href={location.sourceUrl} target="_blank" rel="noreferrer">
              Open Census QuickFacts
            </a>
          </>
        )}
      </div>
      <div className="mt-3 border border-slate-700 bg-slate-950/50 p-3 text-xs leading-5 text-slate-300">
        <strong className="text-slate-100">Mobility yield</strong> is not a happiness score. It asks whether local conditions turn regional growth into resident advancement.
        <br />
        <strong className="text-slate-100">Displacement risk</strong> estimates whether the people who need the opportunity can remain in place long enough to benefit from it.
      </div>
      <div className="mt-4 space-y-2">
        {location.primaryDrivers.map((d) => (
          <div key={d} className="border-l border-cyan-300/40 pl-3 text-xs text-slate-300">{d}</div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {["Census ACS", "Opportunity Atlas", "MTC Open Data", "California HCD APR"].map((s) => (
          <SourceBadge key={s} name={s} />
        ))}
      </div>
      <Button onClick={gen} className="mt-5 h-12 w-full text-sm" aria-label="Generate report">
        Generate report
      </Button>
      <button onClick={gen} className="mt-3 h-10 w-full border border-slate-700 text-xs text-cyan-300" type="button">
        Open evidence trail
      </button>
    </aside>
  );
}
