import { ButtonLink } from "@/components/ButtonLink";
import { DemoDataButton } from "@/components/DemoDataButton";

export default function OnboardingPage() {
  return (
    <main className="mx-auto max-w-5xl px-5 py-12">
      <h1 className="text-4xl font-semibold text-ink">Create your baseline</h1>
      <p className="mt-3 max-w-2xl text-muted">Start with Apple Health XML, demo data, or a manual check-in. Your baseline is never final; each new night and check-in updates the model.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Choice title="Upload Apple Health XML" text="Parse sleep records locally in your browser." action={<ButtonLink href="/upload">Upload XML</ButtonLink>} />
        <Choice title="Use demo data" text="Load 21 synthetic nights with a clear baseline and trend." action={<DemoDataButton />} />
        <Choice title="Manual check-in" text="Add mood, stress, workload, and energy without a file." action={<ButtonLink href="/check-in" variant="secondary">Start Check-In</ButtonLink>} />
      </div>
    </main>
  );
}

function Choice({ title, text, action }: { title: string; text: string; action: React.ReactNode }) {
  return (
    <article className="rounded-lg border border-white bg-white/90 p-5 shadow-soft">
      <h2 className="text-xl font-semibold text-ink">{title}</h2>
      <p className="mb-5 mt-3 text-sm leading-6 text-muted">{text}</p>
      {action}
    </article>
  );
}
