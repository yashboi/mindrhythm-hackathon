import type { MobilityLocation } from "@/lib/mobility/types";

const c = {
  low: "bg-emerald-400",
  medium: "bg-amber-300",
  high: "bg-red-400",
  critical: "bg-red-700",
};

const metricLabels = [
  "Mobility score",
  "Rent burden",
  "Commute time",
  "Housing output",
  "Job access",
  "Displacement risk",
];

export function MobilityMap({
  locations,
  selectedId,
  onSelect,
}: {
  locations: MobilityLocation[];
  selectedId?: string;
  onSelect: (l: MobilityLocation) => void;
}) {
  const selected = locations.find((l) => l.id === selectedId);

  return (
    <section className="border border-slate-500/20 bg-slate-900/60 p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-semibold">Mobility Yield Map</h2>
          <p className="mt-1 text-xs text-slate-400">
            Click a place to update every panel. Dot color shows displacement risk.
          </p>
        </div>
        <span className="font-mono text-xs text-cyan-300">BAY AREA GRID</span>
      </div>

      <div className="relative mt-3 h-[420px] overflow-hidden border border-slate-700/50 bg-[#07111f]">
        <div className="absolute inset-0 opacity-55 [background-image:linear-gradient(rgba(148,163,184,.10)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,.10)_1px,transparent_1px)] [background-size:48px_48px]" />
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
          <path
            d="M9 12 C18 4 31 8 38 20 C44 31 44 45 38 57 C33 67 27 72 30 86 M44 6 C55 15 60 27 60 41 C60 54 54 68 45 81 M61 18 C73 17 83 24 88 35 C93 48 91 61 84 72"
            fill="none"
            stroke="rgba(125,211,252,.26)"
            strokeWidth="0.7"
          />
          <path
            d="M19 22 L35 30 M39 48 L53 47 M54 35 L75 34 M16 68 L32 65"
            fill="none"
            stroke="rgba(148,163,184,.22)"
            strokeWidth="0.55"
            strokeDasharray="1.8 1.8"
          />
        </svg>
        <div className="absolute left-5 top-5 text-xs uppercase tracking-wide text-slate-400">San Francisco Bay Area</div>
        <div className="absolute bottom-5 left-5 grid gap-1 text-[11px] text-slate-400">
          <span>Coastline / bay grid shown as an abstract planning map</span>
          <span>Red = higher displacement pressure, yellow = watch, green = lower</span>
        </div>

        {locations.map((l) => {
          const x = ((l.longitude + 122.52) / 1.02) * 100;
          const y = ((37.98 - l.latitude) / 1.05) * 100;
          const isSelected = selectedId === l.id;
          return (
            <button
              aria-label={`Select ${l.name}. Mobility score ${l.mobilityScore}, displacement risk ${l.displacementRiskScore}`}
              key={l.id}
              onClick={() => onSelect(l)}
              className={`group absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 shadow-lg transition ${isSelected ? "h-7 w-7 border-white" : "h-4 w-4 border-slate-950"} ${c[l.riskLevel]}`}
              style={{ left: `${Math.max(5, Math.min(92, x))}%`, top: `${Math.max(8, Math.min(90, y))}%` }}
              title={`${l.name}: mobility ${l.mobilityScore}, displacement ${l.displacementRiskScore}`}
            >
              <span className="pointer-events-none absolute left-1/2 top-7 hidden -translate-x-1/2 whitespace-nowrap border border-slate-700 bg-slate-950 px-2 py-1 text-[11px] text-slate-100 group-hover:block">
                {l.name}
              </span>
            </button>
          );
        })}

        {selected && (
          <div className="absolute right-4 top-4 w-64 border border-slate-700 bg-slate-950/90 p-3">
            <div className="text-sm font-semibold text-slate-100">{selected.name}</div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-400">
              <span>Mobility</span>
              <span className="text-right font-mono text-cyan-200">{selected.mobilityScore}</span>
              <span>Risk</span>
              <span className="text-right font-mono text-red-200">{selected.displacementRiskScore}</span>
              <span>Commute</span>
              <span className="text-right font-mono text-slate-100">{selected.commuteBurdenMinutes} minutes</span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] uppercase text-slate-400 md:grid-cols-6">
        {metricLabels.map((x) => (
          <span key={x} className="border border-slate-600/30 px-3 py-2">
            {x}
          </span>
        ))}
      </div>
    </section>
  );
}
