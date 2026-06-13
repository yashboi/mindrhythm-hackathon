import type { Metadata } from "next";
import Link from "next/link";
import { Activity } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  title: "MindRhythm",
  description: "Privacy-first mental health stability forecasting dashboard."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans antialiased">
        <header className="sticky top-0 z-30 border-b border-white/70 bg-white/82 backdrop-blur">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
            <Link href="/" className="flex items-center gap-2 font-semibold text-ink">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-sea text-white">
                <Activity size={19} aria-hidden />
              </span>
              MindRhythm
            </Link>
            <div className="flex items-center gap-2 text-sm text-muted">
              <Link className="rounded-md px-3 py-2 hover:bg-aqua/70 focus-ring" href="/upload">Upload</Link>
              <Link className="rounded-md px-3 py-2 hover:bg-aqua/70 focus-ring" href="/check-in">Check-In</Link>
              <Link className="rounded-md px-3 py-2 hover:bg-aqua/70 focus-ring" href="/dashboard">Dashboard</Link>
              <Link className="rounded-md px-3 py-2 hover:bg-aqua/70 focus-ring" href="/privacy">Privacy</Link>
            </div>
          </nav>
        </header>
        {children}
        <footer className="mx-auto max-w-7xl px-5 pb-8 pt-10 text-sm text-muted">
          MindRhythm is not medical advice and does not diagnose or treat mental health conditions. It helps users reflect on patterns in sleep, stress, and mood.
        </footer>
      </body>
    </html>
  );
}
