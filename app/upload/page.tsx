"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { calculateNightlyMetrics, parseAppleHealthXml } from "@/lib/appleHealthParser";
import { saveNightlyMetrics } from "@/lib/storage";
import { DemoDataButton } from "@/components/DemoDataButton";

export default function UploadPage() {
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  async function handleFile(file?: File) {
    if (!file) return;
    setError("");
    setStatus("Reading XML locally...");
    const text = await file.text();
    setStatus("Parsing sleep records...");
    const records = parseAppleHealthXml(text);
    if (!records.length) {
      setStatus("");
      setError("Couldn’t find Apple Health sleep records in this file. Make sure you uploaded export.xml from Apple Health.");
      return;
    }
    const metrics = calculateNightlyMetrics(records);
    saveNightlyMetrics(metrics);
    setStatus(`Baseline ready. We found ${metrics.length} nights with enough data to make an initial assessment.`);
    router.push("/dashboard");
  }

  return (
    <main className="mx-auto max-w-4xl px-5 py-12">
      <section className="rounded-lg border border-white bg-white/90 p-6 shadow-soft">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-aqua text-sea"><Upload size={21} aria-hidden /></span>
          <div>
            <h1 className="text-3xl font-semibold text-ink">Upload Apple Health XML</h1>
            <p className="mt-1 text-muted">Your file is parsed locally in the browser. Raw health data is not uploaded.</p>
          </div>
        </div>
        <label className="focus-within:ring-sea mt-8 grid cursor-pointer place-items-center rounded-lg border-2 border-dashed border-sea/30 bg-mist p-10 text-center">
          <input className="sr-only" type="file" accept=".xml,text/xml" onChange={(event) => handleFile(event.target.files?.[0])} />
          <span className="font-semibold text-ink">Choose export.xml</span>
          <span className="mt-2 text-sm text-muted">Large files may take a moment; MindRhythm will show progress instead of freezing the UI.</span>
        </label>
        {status ? <p className="mt-5 rounded-lg bg-sage p-4 text-sm text-ink">{status} More data will improve confidence over time.</p> : null}
        {error ? <p className="mt-5 rounded-lg bg-coral/10 p-4 text-sm text-ink">{error}</p> : null}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <DemoDataButton />
          <DemoDataButton burnout label="Simulate Burnout Week" />
        </div>
      </section>
    </main>
  );
}
