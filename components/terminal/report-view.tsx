"use client";

import type { MobilityLocation, MobilityReport } from "@/lib/mobility/types";
import { SourceBadge } from "./source-badge";
import { Button } from "@/components/ui/button";

function downloadReport(report: MobilityReport) {
  const text = [
    report.title,
    "",
    report.executiveSummary,
    "",
    "Findings:",
    ...report.findings.map((f) => `- ${f}`),
    "",
    "Recommended uses:",
    ...report.recommendedUses.map((u) => `- ${u}`),
  ].join("\n");
  const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `${report.locationName.toLowerCase().replaceAll(" ", "-")}-mobility-report.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

export function ReportView({
  report,
  location,
  onReport,
}: {
  report: MobilityReport | null;
  location: MobilityLocation;
  onReport: (r: MobilityReport) => void;
}) {
  async function generate() {
    const r = await fetch("/api/report", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ locationId: location.id }),
    });
    onReport(await r.json());
  }

  if (!report) {
    return (
      <section className="border border-cyan-300/20 bg-cyan-950/20 p-5">
        <h2 className="text-2xl font-semibold">Reports</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
          Generate a plain-language mobility brief for the selected district. It explains the score, major risks, useful sources, and where the finding can be used.
        </p>
        <Button onClick={generate} className="mt-5 h-12 px-6">Generate report for {location.name}</Button>
      </section>
    );
  }

  return (
    <section className="border border-cyan-300/20 bg-cyan-950/20 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{report.title}</h2>
          <p className="mt-1 text-xs text-slate-400">Generated {new Date(report.generatedAt).toLocaleString()}</p>
        </div>
        <button onClick={() => downloadReport(report)} className="h-11 border border-cyan-300/40 px-4 text-sm text-cyan-200">
          Export text
        </button>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-300">{report.executiveSummary}</p>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {report.findings.map((f) => (
          <div key={f} className="border border-slate-700 bg-slate-950/50 p-3 text-sm text-slate-300">
            {f}
          </div>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {report.recommendedUses.map((u) => (
          <span key={u} className="border border-slate-600 px-2 py-1 text-[10px] uppercase">
            {u}
          </span>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {report.sources.slice(0, 4).map((s) => (
          <SourceBadge key={s.id} name={s.name} />
        ))}
      </div>
    </section>
  );
}
