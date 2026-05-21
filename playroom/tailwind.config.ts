import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#0a0a0f",
          panel: "#13131b",
          card: "#1a1a25",
          border: "#2a2a3a",
        },
        accent: {
          coach: "#e8e8f0",
          user: "#7dd3fc",
          warn: "#f87171",
          ok: "#86efac",
          drill: "#fbbf24",
        },
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Consolas", "Menlo", "monospace"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
