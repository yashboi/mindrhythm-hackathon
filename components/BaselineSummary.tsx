import { BaselineProfile, ConfidenceBreakdown, ForecastResult, NightlySleepMetrics } from "@/types/health";
import { baselineConfidenceLabel } from "@/lib/baseline";
import { formatHours } from "@/lib/utils";

export function BaselineSummary({
  baseline,
  confidence,
  current,
  metrics
}: {
  baseline: BaselineProfile;
  confidence: ConfidenceBreakdown;
  current: ForecastResult;
  metrics: NightlySleepMetrics[];
}) {
  return (
    <section className="grid gap-4 rounded-lg border border-white bg-white/90 p-5 shadow-soft md:grid-cols-4">
      <Metric label="Baseline Ready" value={`${metrics.length} nights`} />
      <Metric label="Typical sleep" value={formatHours(baseline.averageSleepMinutes)} />
      <Metric label="Forecast confidence" value={`${confidence.score}%`} detail={baselineConfidenceLabel(metrics.length)} />
      <Metric label="Current status" value={current.label} />
    </section>
  );
}

function Metric({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-ink">{value}</p>
      {detail ? <p className="mt-1 text-sm text-muted">{detail}</p> : null}
    </div>
  );
}
