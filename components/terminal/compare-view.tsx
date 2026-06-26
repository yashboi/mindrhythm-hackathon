import type { MobilityLocation } from "@/lib/mobility/types";
import { generateCompareAnalysis } from "@/lib/mobility/analyst";

const keys: Array<[string, keyof MobilityLocation, string]> = [
  ["Mobility yield", "mobilityScore", ""],
  ["Rent burden", "rentBurden", "%"],
  ["Median income", "medianIncome", "$"],
  ["Commute burden", "commuteBurdenMinutes", " minutes"],
  ["Housing output", "housingProductionIndex", ""],
  ["Job access", "jobAccessScore", ""],
  ["Displacement risk", "displacementRiskScore", ""],
];

function format(value: MobilityLocation[keyof MobilityLocation], unit: string) {
  if (typeof value !== "number") return String(value);
  if (unit === "$") return `$${value.toLocaleString()}`;
  return `${value.toLocaleString()}${unit}`;
}

export function CompareView({ selected, locations }: { selected: MobilityLocation; locations: MobilityLocation[] }) {
  const peer = locations.find((l) => l.id !== selected.id && l.id === "mountain-view") || locations.find((l) => l.id !== selected.id) || selected;

  return (
    <section className="border border-slate-500/20 bg-slate-900/60 p-5">
      <h2 className="text-2xl font-semibold">Compare Mode</h2>
      <p className="mt-2 text-sm text-slate-300">Showing {selected.name} against {peer.name}. Use search to compare another pair.</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {[selected, peer].map((l) => (
          <div key={l.id} className="border border-slate-700/50 bg-slate-950/40 p-4">
            <div className="text-lg text-cyan-300">{l.name}</div>
            <div className="mt-1 min-h-10 text-[11px] leading-5 text-slate-500">{l.factSource}</div>
            {keys.map(([label, k, unit]) => (
              <div key={label} className="flex justify-between gap-4 border-b border-slate-800 py-2 text-sm">
                <span className="text-slate-400">{label}</span>
                <span className="font-mono text-slate-100">{format(l[k], unit)}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-300">{generateCompareAnalysis(selected, peer)}</p>
    </section>
  );
}
