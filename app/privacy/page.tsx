export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-12">
      <section className="rounded-lg border border-white bg-white/90 p-6 shadow-soft">
        <h1 className="text-4xl font-semibold text-ink">Privacy and safety</h1>
        <p className="mt-4 text-lg leading-8 text-muted">
          Your health data stays on your device. MindRhythm analyzes your file locally and does not upload raw Apple Health data.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Info title="Local-first" text="Apple Health XML is parsed with browser DOMParser. Summarized nightly metrics and check-ins are saved in localStorage." />
          <Info title="Non-diagnostic" text="MindRhythm forecasts stability, burnout risk, and routine instability. It does not diagnose depression, anxiety, or any condition." />
          <Info title="Transparent scoring" text="The dashboard shows the root causes behind each score so users can understand the forecast." />
          <Info title="Crisis-safe" text="If you feel unsafe or in crisis, contact emergency services, 988 in the U.S., or a trusted adult immediately." />
        </div>
      </section>
    </main>
  );
}

function Info({ title, text }: { title: string; text: string }) {
  return (
    <article className="rounded-lg bg-mist p-5">
      <h2 className="font-semibold text-ink">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
    </article>
  );
}
