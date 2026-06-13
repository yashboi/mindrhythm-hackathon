import Link from "next/link";
import { clsx } from "clsx";

export function ButtonLink({ href, children, variant = "primary" }: { href: string; children: React.ReactNode; variant?: "primary" | "secondary" }) {
  return (
    <Link
      href={href}
      className={clsx(
        "focus-ring inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold transition",
        variant === "primary" ? "bg-sea text-white shadow-soft hover:bg-ink" : "border border-sea/20 bg-white text-sea hover:bg-aqua"
      )}
    >
      {children}
    </Link>
  );
}
