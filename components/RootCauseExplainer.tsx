import { RootCause } from "@/types/health";

export function RootCauseExplainer({ causes }: { causes: RootCause[] }) {
  return (
    <section className="rounded-lg border border-white bg-white/90 p-5 shadow-soft">
      <p className="text-sm font-semibold text-muted">Root Cause Explainer</p>
      <h2 className="mt-2 text-2xl font-semibold text-ink">Top pattern changes</h2>
      <ol className="mt-5 space-y-3">
        {causes.slice(0, 4).map((cause, index) => (
          <li key={cause.label} className="flex gap-3 rounded-lg bg-mist p-4">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-sea text-sm font-semibold text-white">{index + 1}</span>
            <div>
              <p className="font-semibold text-ink">{cause.label}</p>
              <p className="text-sm leading-6 text-muted">{cause.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
