"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { loadCheckIns, saveCheckIns } from "@/lib/storage";
import { CheckIn } from "@/types/health";

export function CheckInForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    mood: 7,
    stress: 4,
    workload: 5,
    energy: 7,
    socialConnection: "medium" as CheckIn["socialConnection"],
    overwhelmed: false,
    note: ""
  });

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <form
      className="rounded-lg border border-white bg-white/90 p-5 shadow-soft"
      onSubmit={(event) => {
        event.preventDefault();
        const date = new Date().toISOString().slice(0, 10);
        const checkIn: CheckIn = { id: crypto.randomUUID(), date, ...form };
        saveCheckIns([...loadCheckIns(), checkIn]);
        router.push("/dashboard");
      }}
    >
      <h1 className="text-3xl font-semibold text-ink">How are you doing today?</h1>
      <p className="mt-2 text-muted">A quick, non-clinical check-in helps MindRhythm understand today’s pattern.</p>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <Slider label="Mood" value={form.mood} onChange={(value) => update("mood", value)} />
        <Slider label="Stress" value={form.stress} onChange={(value) => update("stress", value)} />
        <Slider label="Workload" value={form.workload} onChange={(value) => update("workload", value)} />
        <Slider label="Energy" value={form.energy} onChange={(value) => update("energy", value)} />
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="text-sm font-semibold text-ink">
          Social connection
          <select className="focus-ring mt-2 w-full rounded-lg border border-sea/20 bg-white px-3 py-3" value={form.socialConnection} onChange={(e) => update("socialConnection", e.target.value as CheckIn["socialConnection"])}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
        <label className="flex items-center gap-3 rounded-lg bg-mist px-4 py-3 text-sm font-semibold text-ink">
          <input type="checkbox" checked={form.overwhelmed} onChange={(e) => update("overwhelmed", e.target.checked)} />
          Overwhelmed today
        </label>
      </div>
      <label className="mt-6 block text-sm font-semibold text-ink">
        Optional note
        <textarea className="focus-ring mt-2 min-h-28 w-full rounded-lg border border-sea/20 bg-white px-3 py-3" value={form.note} onChange={(e) => update("note", e.target.value)} placeholder="What did today feel like?" />
      </label>
      <button className="focus-ring mt-6 rounded-lg bg-sea px-5 py-3 text-sm font-semibold text-white hover:bg-ink" type="submit">Save check-in</button>
    </form>
  );
}

function Slider({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="text-sm font-semibold text-ink">
      <span className="flex justify-between"><span>{label}</span><span>{value}/10</span></span>
      <input className="mt-3 w-full accent-sea" type="range" min={1} max={10} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  );
}
