"use client";

import { useState } from "react";
import type { CommandResponse } from "@/lib/mobility/types";

export function CommandBar({ onResult }: { onResult: (r: CommandResponse) => void }) {
  const [command, setCommand] = useState("");
  const [res, setRes] = useState("");

  async function run(c = command) {
    if (!c.trim()) return;
    const r = await fetch("/api/command", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ command: c }),
    });
    const data: CommandResponse = await r.json();
    setRes(data.response || "NO DATA SIGNAL FOUND");
    onResult(data);
  }

  const examples = [
    "COMPARE East San Jose Mountain View",
    "SCAN Bay Area for displacement risk",
    "RANK cities by mobility yield",
    "REPORT East San Jose",
  ];

  return (
    <div className="sticky bottom-0 z-30 border-t border-cyan-300/20 bg-[#020617]/95 p-3 backdrop-blur">
      <div className="mb-2 flex flex-wrap gap-2">
        {examples.map((e) => (
          <button key={e} onClick={() => run(e)} className="min-h-9 border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:text-cyan-300">
            {e}
          </button>
        ))}
      </div>
      {res && <div className="mb-2 border border-slate-700 bg-slate-950 p-2 text-xs leading-5 text-slate-300">{res}</div>}
      <form onSubmit={(e) => { e.preventDefault(); run(); }} className="flex items-center gap-2">
        <span className="font-mono text-cyan-300">&gt;</span>
        <label className="sr-only" htmlFor="terminal-command">Command</label>
        <input
          id="terminal-command"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="scan cities where rent burden is rising and housing permits are low"
          className="h-10 w-full bg-transparent font-mono text-sm outline-none placeholder:text-slate-600"
        />
        <button className="h-10 border border-cyan-300/30 px-4 text-xs text-cyan-200">RUN</button>
      </form>
    </div>
  );
}
