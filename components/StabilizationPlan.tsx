import { ShieldCheck } from "lucide-react";

export function StabilizationPlan({ actions }: { actions: string[] }) {
  return (
    <section className="rounded-lg border border-white bg-white/90 p-5 shadow-soft">
      <div className="flex items-center gap-2">
        <ShieldCheck className="text-sea" size={20} aria-hidden />
        <p className="text-sm font-semibold text-muted">Supportive Recommendations</p>
      </div>
      <h2 className="mt-2 text-2xl font-semibold text-ink">Stabilization plan</h2>
      <ul className="mt-5 space-y-3">
        {actions.map((action) => (
          <li key={action} className="rounded-lg bg-sage px-4 py-3 text-sm leading-6 text-ink">{action}</li>
        ))}
      </ul>
      <p className="mt-5 rounded-lg border border-coral/25 bg-coral/10 p-4 text-sm leading-6 text-ink">
        MindRhythm is not a diagnosis tool. If you feel unsafe or in crisis, contact emergency services, 988 in the U.S., or a trusted adult immediately.
      </p>
    </section>
  );
}
