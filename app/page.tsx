import { Brain, LineChart, Moon } from "lucide-react";
import { ButtonLink } from "@/components/ButtonLink";
import { DemoDataButton } from "@/components/DemoDataButton";

export default function Home() {
  return (
    <main>
      <section className="mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-10 px-5 py-14 lg:grid-cols-[1.04fr_0.96fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-sea">Privacy-first stability forecasting</p>
          <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-[1.04] text-ink md:text-6xl">Catch routine instability before burnout hits.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
            MindRhythm learns your personal sleep and stress baseline, then forecasts your mental health stability for the next 24, 48, and 72 hours.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/upload">Upload Apple Health XML</ButtonLink>
            <DemoDataButton />
            <ButtonLink href="/check-in" variant="secondary">Manual Check-In</ButtonLink>
          </div>
          <p className="mt-6 max-w-xl rounded-lg bg-white/75 p-4 text-sm leading-6 text-muted">
            Your health data stays on your device. MindRhythm analyzes your file locally and does not upload raw Apple Health data.
          </p>
        </div>
        <div className="rounded-lg border border-white bg-white/85 p-5 shadow-soft">
          <div className="rounded-lg bg-mist p-5">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-ink">Today’s forecast</p>
              <span className="rounded-full bg-aqua px-3 py-1 text-xs font-semibold text-sea">Watch Zone</span>
            </div>
            <div className="mt-8 grid gap-3">
              {["24 hours", "48 hours", "72 hours"].map((window, index) => (
                <div key={window} className="flex items-center justify-between rounded-lg bg-white p-4">
                  <span className="font-medium text-ink">{window}</span>
                  <div className="h-2 w-36 overflow-hidden rounded-full bg-aqua">
                    <div className="h-full rounded-full bg-sea" style={{ width: `${42 + index * 14}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <Feature icon={<Brain />} title="Personal Baseline" text="Learns what normal looks like for you, not the average person." />
            <Feature icon={<Moon />} title="Sleep + Mood Signals" text="Combines wearable-style sleep data with quick daily check-ins." />
            <Feature icon={<LineChart />} title="24/48/72 Forecast" text="Identifies short-term instability risk and practical stabilization steps." />
          </div>
        </div>
      </section>
    </main>
  );
}

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <article className="rounded-lg bg-white p-4">
      <div className="mb-3 text-sea">{icon}</div>
      <h2 className="font-semibold text-ink">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
    </article>
  );
}
