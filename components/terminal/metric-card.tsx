import { ArrowDown, ArrowRight, ArrowUp } from "lucide-react";

const metricNotes: Record<string, string> = {
  mobilityScore:
    "Mobility yield estimates how well a place converts jobs, schools, transit, housing, income, and commute time into upward opportunity for residents.",
  rentBurden:
    "Share of income pressure from rent. Higher rent burden usually means fewer households can stay near opportunity.",
  jobAccessScore:
    "Access to nearby employment centers and high-wage job networks.",
  housingProductionIndex:
    "Housing output is an index from 0 to 100. Higher means new housing is keeping up better with demand.",
  commuteBurdenMinutes:
    "Typical one-way commute time. Longer commutes reduce access to opportunity even when jobs are regionally nearby.",
  displacementRiskScore:
    "Displacement risk estimates pressure that can push existing residents out through rent, redevelopment, and income mismatch.",
};

function formatMetricValue(value: number, unit: string) {
  if (unit === "$") return `$${value.toLocaleString()}`;
  if (unit === "%") return `${value.toLocaleString()}%`;
  if (unit === "minutes") return `${value.toLocaleString()} minutes`;
  return value.toLocaleString();
}

export function MetricCard({
  metricKey,
  label,
  value,
  unit,
  delta,
  direction,
  interpretation,
}: {
  metricKey: string;
  label: string;
  value: number;
  unit: string;
  delta?: number;
  direction: string;
  interpretation: string;
}) {
  const risk =
    interpretation === "negative"
      ? "border-red-400/20 text-red-200"
      : interpretation === "positive"
        ? "border-emerald-400/20 text-emerald-200"
        : "border-cyan-400/20 text-cyan-200";
  const Icon = direction === "up" ? ArrowUp : direction === "down" ? ArrowDown : ArrowRight;

  return (
    <article className={`min-h-[180px] border bg-slate-950/60 p-4 ${risk}`}>
      <div className="flex items-start justify-between gap-3 text-[11px] uppercase tracking-wide text-slate-400">
        <span>{label}</span>
        <Icon className="h-4 w-4 shrink-0" />
      </div>
      <div className="mt-3 font-mono text-3xl text-slate-50">{formatMetricValue(value, unit)}</div>
      <p className="mt-3 min-h-[54px] text-xs leading-5 text-slate-400">
        {metricNotes[metricKey] ?? "Composite indicator used for the selected district."}
      </p>
      <div className="mt-3 flex h-7 items-end gap-1" aria-hidden>
        {[3, 8, 5, 12, 9, 15, 11].map((h, i) => (
          <span key={i} className="w-full bg-cyan-300/30" style={{ height: h + 4 }} />
        ))}
      </div>
      <div className="mt-3 text-xs text-slate-400">
        Change: <span className="font-mono text-slate-200">{delta && delta > 0 ? "+" : ""}{delta ?? 0}</span>
      </div>
    </article>
  );
}
