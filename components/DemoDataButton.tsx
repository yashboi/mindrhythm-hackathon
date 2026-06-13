"use client";

import { useRouter } from "next/navigation";
import { createDemoData } from "@/data/demoData";
import { saveCheckIns, saveNightlyMetrics } from "@/lib/storage";

export function DemoDataButton({ burnout = false, label = "Try Demo Data" }: { burnout?: boolean; label?: string }) {
  const router = useRouter();

  return (
    <button
      className="focus-ring inline-flex items-center justify-center rounded-lg bg-sea px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-ink"
      onClick={() => {
        const data = createDemoData(burnout);
        saveNightlyMetrics(data.metrics);
        saveCheckIns(data.checkIns);
        router.push("/dashboard");
      }}
    >
      {label}
    </button>
  );
}
