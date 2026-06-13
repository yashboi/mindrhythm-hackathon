import { calculateDataRichness } from "@/lib/appleHealthParser";
import { ConfidenceBreakdown, NightlySleepMetrics } from "@/types/health";

export function DataRichnessCard({ metrics, confidence }: { metrics: NightlySleepMetrics[]; confidence: ConfidenceBreakdown }) {
  const richness = calculateDataRichness(metrics);
  return (
    <section className="rounded-lg border border-white bg-white/90 p-5 shadow-soft">
      <p className="text-sm font-semibold text-muted">Data Richness</p>
      <h2 className="mt-2 text-2xl font-semibold text-ink">{richness.label}</h2>
      <p className="mt-3 text-sm leading-6 text-muted">{richness.description}</p>
      <div className="mt-5 h-3 overflow-hidden rounded-full bg-aqua">
        <div className="h-full rounded-full bg-sea" style={{ width: `${confidence.score}%` }} />
      </div>
      <p className="mt-3 text-sm text-muted">{confidence.explanation}</p>
    </section>
  );
}
