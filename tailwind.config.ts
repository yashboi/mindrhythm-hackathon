import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#183033",
        muted: "#587276",
        mist: "#f4faf8",
        sea: "#147c7b",
        aqua: "#d9f2ee",
        sage: "#e7f3e8",
        coral: "#e87561"
      },
      boxShadow: {
        soft: "0 16px 50px rgba(24, 48, 51, 0.08)"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
