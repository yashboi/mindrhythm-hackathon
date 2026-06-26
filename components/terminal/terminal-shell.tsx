"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  Bell,
  BookOpen,
  Briefcase,
  Bus,
  Download,
  GraduationCap,
  Home,
  Save,
  ScanLine,
  Search,
  Send,
  Share2,
  GitCompare,
} from "lucide-react";
import type { CommandResponse, MobilityLocation, MobilityReport } from "@/lib/mobility/types";
import { MobilityMap } from "./mobility-map";
import { MetricCard } from "./metric-card";
import { AIAnalystPanel } from "./ai-analyst-panel";
import { CompareView } from "./compare-view";
import { RiskScanTable } from "./risk-scan-table";
import { NeighborhoodProfile } from "./neighborhood-profile";
import { ReportView } from "./report-view";
import { CommandBar } from "./command-bar";

const nav = [
  [BarChart3, "Overview"],
  [GitCompare, "Compare"],
  [ScanLine, "Risk Scan"],
  [Home, "Housing"],
  [Briefcase, "Labor"],
  [Bus, "Transit"],
  [GraduationCap, "Education"],
  [AlertTriangle, "Displacement"],
  [BookOpen, "Reports"],
  [Bell, "Alerts"],
  [Save, "Saved Views"],
] as const;

type ActiveTab = (typeof nav)[number][1];

const focusCopy: Record<
  string,
  {
    title: string;
    metric: keyof MobilityLocation;
    definition: string;
    read: (l: MobilityLocation) => string;
  }
> = {
  Housing: {
    title: "Housing Pressure",
    metric: "housingProductionIndex",
    definition:
      "Housing output compares new homes against demand. Low output with high rents means access is being rationed by price.",
    read: (l) => `${l.housingProductionIndex}/100 housing output index with ${l.rentBurden}% rent burden`,
  },
  Labor: {
    title: "Labor Access",
    metric: "jobAccessScore",
    definition:
      "Labor access measures whether residents are connected to job centers that can raise household income.",
    read: (l) => `${l.jobAccessScore}/100 job access score and $${l.medianIncome.toLocaleString()} median income`,
  },
  Transit: {
    title: "Transit And Commute",
    metric: "transitAccessScore",
    definition:
      "Transit access matters when it shortens the trip between households, schools, and high-wage jobs.",
    read: (l) => `${l.transitAccessScore}/100 transit score with ${l.commuteBurdenMinutes} minutes commute burden`,
  },
  Education: {
    title: "Education Access",
    metric: "schoolAccessScore",
    definition:
      "Education access is part of mobility yield because school quality and youth pathways affect long-term earnings.",
    read: (l) => `${l.schoolAccessScore}/100 education access score`,
  },
  Displacement: {
    title: "Displacement Risk",
    metric: "displacementRiskScore",
    definition:
      "Displacement risk estimates the chance that rising costs, redevelopment, or income mismatch push existing residents out.",
    read: (l) => `${l.displacementRiskScore}/100 displacement risk score`,
  },
};

export function TerminalShell() {
  const [locations, setLocations] = useState<MobilityLocation[]>([]);
  const [selected, setSelected] = useState<MobilityLocation | null>(null);
  const [report, setReport] = useState<MobilityReport | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>("Overview");
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    fetch("/api/locations")
      .then((r) => r.json())
      .then((d: MobilityLocation[]) => {
        setLocations(d);
        setSelected(d.find((l) => l.id === "east-san-jose") || d[0]);
      })
      .catch(() => {});
  }, []);

  const rankedByRisk = useMemo(
    () => [...locations].sort((a, b) => b.displacementRiskScore - a.displacementRiskScore),
    [locations],
  );

  function commandResult(r: CommandResponse) {
    setNotice(r.response || "");
    if (r.locations?.[0]) setSelected(r.locations[0] as MobilityLocation);
    if (r.intent === "compare") setActiveTab("Compare");
    if (r.intent === "scan" || r.intent === "rank") setActiveTab("Risk Scan");
    if (r.intent === "report") setActiveTab("Reports");
  }

  async function runSearch() {
    if (!query.trim()) return;
    const r = await fetch("/api/command", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ command: query }),
    });
    const data: CommandResponse = await r.json();
    commandResult(data);
    setQuery("");
  }

  function handleReport(nextReport: MobilityReport) {
    setReport(nextReport);
    setActiveTab("Reports");
    setNotice(`Generated ${nextReport.title}.`);
  }

  if (!selected) {
    return <div className="min-h-screen bg-[#020617] p-8 text-cyan-300">NO DATA SIGNAL FOUND</div>;
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100">
      <header className="sticky top-0 z-20 border-b border-slate-700/60 bg-[#020617]/95 px-4 py-3 backdrop-blur">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="font-mono text-lg font-bold tracking-wider text-cyan-200">MOBILITY TERMINAL</div>
            <div className="text-xs text-slate-400">Bay Area Opportunity Intelligence / Last updated: 2026</div>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); runSearch(); }} className="flex min-h-12 flex-1 items-center gap-2 border border-slate-700 bg-slate-950 px-3">
            <Search className="h-4 w-4 text-slate-500" />
            <label className="sr-only" htmlFor="top-search">Search or command</label>
            <input
              id="top-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try: compare East San Jose and Mountain View"
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-600"
            />
            <button className="inline-flex h-9 items-center gap-2 border border-cyan-300/40 px-3 text-xs text-cyan-200" type="submit">
              <Send className="h-3.5 w-3.5" />
              Run
            </button>
          </form>
          <div className="grid grid-cols-3 gap-2 text-xs sm:flex">
            <button onClick={() => setNotice("Export prepared: use Generate report first, then Export text in Reports.")} className="inline-flex h-11 items-center justify-center gap-2 border border-slate-700 px-4 text-slate-200 hover:border-cyan-300/50">
              <Download className="h-4 w-4" />
              Export
            </button>
            <button onClick={() => setNotice(`Share view: ${selected.name} / ${activeTab}`)} className="inline-flex h-11 items-center justify-center gap-2 border border-slate-700 px-4 text-slate-200 hover:border-cyan-300/50">
              <Share2 className="h-4 w-4" />
              Share
            </button>
            <button onClick={() => setActiveTab("Alerts")} className="inline-flex h-11 items-center justify-center gap-2 border border-slate-700 px-4 text-slate-200 hover:border-cyan-300/50">
              <Bell className="h-4 w-4" />
              Alerts
            </button>
          </div>
        </div>
        <div className="mt-3 border border-amber-300/20 bg-amber-950/20 px-3 py-2 text-sm text-amber-100">
          City income and commute facts use U.S. Census QuickFacts 2020-2024 where available. Mobility yield, displacement risk, job access, housing output, and rent burden are prototype indices until real formulas and source feeds are wired.
        </div>
        {notice && <div className="mt-2 border border-cyan-300/20 bg-cyan-950/20 px-3 py-2 text-sm text-cyan-100">{notice}</div>}
      </header>

      <div className="grid lg:grid-cols-[260px_minmax(0,1fr)_360px]">
        <nav className="border-r border-slate-700/60 bg-slate-950/50 p-3 lg:min-h-[calc(100vh-76px)]">
          <div className="flex gap-2 overflow-x-auto lg:block">
            {nav.map(([Icon, label]) => (
              <button
                key={label}
                onClick={() => setActiveTab(label)}
                className={`mb-1 flex h-12 w-full min-w-max items-center gap-3 px-3 text-left text-sm transition ${
                  activeTab === label
                    ? "border border-cyan-300/30 bg-cyan-400/10 text-cyan-100"
                    : "text-slate-300 hover:bg-cyan-400/10 hover:text-cyan-200"
                }`}
              >
                <Icon className="h-5 w-5" />
                {label}
              </button>
            ))}
          </div>
        </nav>

        <main className="space-y-4 p-4 pb-28">
          {activeTab === "Overview" && (
            <>
              <MobilityMap locations={locations} selectedId={selected.id} onSelect={setSelected} />
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {selected.metrics.map(({ key, ...metric }) => (
                  <MetricCard key={key} metricKey={key} {...metric} />
                ))}
              </div>
              <NeighborhoodProfile location={selected} />
            </>
          )}

          {activeTab === "Compare" && <CompareView selected={selected} locations={locations} />}
          {activeTab === "Risk Scan" && <RiskScanTable locations={locations} onSelect={setSelected} />}
          {["Housing", "Labor", "Transit", "Education", "Displacement"].includes(activeTab) && (
            <FocusView location={selected} tab={activeTab} peers={rankedByRisk} />
          )}
          {activeTab === "Reports" && <ReportView report={report} location={selected} onReport={handleReport} />}
          {activeTab === "Alerts" && <AlertsView selected={selected} locations={rankedByRisk} />}
          {activeTab === "Saved Views" && <SavedViewsView selected={selected} onSelect={setSelected} locations={locations} />}
        </main>

        <div className="p-4 pb-28">
          <AIAnalystPanel location={selected} onReport={handleReport} />
        </div>
      </div>
      <CommandBar onResult={commandResult} />
    </div>
  );
}

function FocusView({ location, tab, peers }: { location: MobilityLocation; tab: ActiveTab; peers: MobilityLocation[] }) {
  const config = focusCopy[tab];
  if (!config) return null;
  const value = Number(location[config.metric]);
  const max = Math.max(...peers.map((l) => Number(l[config.metric])), 100);

  return (
    <section className="border border-slate-500/20 bg-slate-900/60 p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{config.title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">{config.definition}</p>
        </div>
        <div className="border border-cyan-300/20 bg-slate-950/70 p-4 text-right">
          <div className="font-mono text-4xl text-cyan-200">{value}</div>
          <div className="text-xs uppercase text-slate-400">{location.name}</div>
        </div>
      </div>
      <div className="mt-6 grid gap-3">
        {peers.slice(0, 8).map((peer) => {
          const peerValue = Number(peer[config.metric]);
          return (
            <button key={peer.id} className="grid grid-cols-[180px_1fr_64px] items-center gap-3 text-left text-sm" type="button">
              <span className="text-slate-300">{peer.name}</span>
              <span className="h-3 bg-slate-800">
                <span className="block h-3 bg-cyan-300/70" style={{ width: `${Math.max(8, (peerValue / max) * 100)}%` }} />
              </span>
              <span className="text-right font-mono text-slate-100">{peerValue}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-5 border-l border-cyan-300/40 pl-4 text-sm text-slate-300">{config.read(location)}.</p>
    </section>
  );
}

function AlertsView({ selected, locations }: { selected: MobilityLocation; locations: MobilityLocation[] }) {
  return (
    <section className="border border-slate-500/20 bg-slate-900/60 p-5">
      <h2 className="text-2xl font-semibold">Alerts</h2>
      <p className="mt-2 text-sm text-slate-300">Active watchlist triggers for places with fast-rising risk or weak housing response.</p>
      <div className="mt-5 grid gap-3">
        {[selected, ...locations.filter((l) => l.id !== selected.id).slice(0, 3)].map((l) => (
          <div key={l.id} className="border border-slate-700 bg-slate-950/60 p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="font-semibold">{l.name}</span>
              <span className="font-mono text-red-200">{l.displacementRiskScore}/100 derived risk</span>
            </div>
            <p className="mt-2 text-sm text-slate-400">
              Alert when displacement risk rises above {Math.min(98, l.displacementRiskScore + 3)} or housing output falls below {Math.max(20, l.housingProductionIndex - 5)}.
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function SavedViewsView({
  selected,
  locations,
  onSelect,
}: {
  selected: MobilityLocation;
  locations: MobilityLocation[];
  onSelect: (l: MobilityLocation) => void;
}) {
  const saved = [
    "Critical displacement districts",
    "High job access / low housing output",
    "Long commute burden watchlist",
  ];
  return (
    <section className="border border-slate-500/20 bg-slate-900/60 p-5">
      <h2 className="text-2xl font-semibold">Saved Views</h2>
      <p className="mt-2 text-sm text-slate-300">Reusable analysis cuts for presentations, reports, and policy memos.</p>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {saved.map((view, i) => (
          <button key={view} onClick={() => onSelect(locations[i] ?? selected)} className="min-h-28 border border-slate-700 bg-slate-950/60 p-4 text-left hover:border-cyan-300/40">
            <div className="font-semibold text-cyan-100">{view}</div>
            <div className="mt-3 text-xs text-slate-400">Open with {locations[i]?.name ?? selected.name}</div>
          </button>
        ))}
      </div>
    </section>
  );
}
