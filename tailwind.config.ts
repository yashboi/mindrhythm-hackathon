import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#020617",
        foreground: "#f8fafc",
        primary: "#22d3ee",
        "primary-foreground": "#020617",
        accent: "#0f172a",
        "accent-foreground": "#f8fafc",
        destructive: "#ef4444",
        "destructive-foreground": "#f8fafc",
        border: "rgba(148, 163, 184, 0.16)",
        input: "rgba(148, 163, 184, 0.20)",
        ring: "#22d3ee",
        secondary: "#1e293b",
        "secondary-foreground": "#f8fafc",
      },
      fontFamily: {
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas"],
      },
    },
  },
  plugins: [],
};

export default config;
