import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // EDUBA palette — warm, crafty, editorial
        cream: {
          DEFAULT: "#FEFBF6",   // primary background
          warm: "#F9ECDF",       // lighter peach — coach message bg
          sand: "#EFE3D7",       // beige — card / user message bg
          dusty: "#D8BFC1",      // dusty pink — borders / accents
        },
        wine: {
          DEFAULT: "#5D3136",    // primary dark — headers, borders, buttons
          deep: "#4A2C2A",       // text primary (dark brown)
          muted: "#7B5A5C",      // text secondary
          soft: "#A2777A",       // text tertiary
        },
        accent: {
          warn: "#A14A38",       // terracotta — cope warnings (warm, not red)
          ok: "#5A7A4E",         // olive — success/commit
          drill: "#C89F4B",      // mustard — drill phase
        },
      },
      fontFamily: {
        mono: ['"IBM Plex Mono"', "JetBrains Mono", "Consolas", "Menlo", "monospace"],
        sans: ['"Inter"', "Diatype", "system-ui", "sans-serif"],
        display: ['"IBM Plex Mono"', "JetBrains Mono", "monospace"],
      },
      boxShadow: {
        // Warm chunky shadows — paper feel
        craft: "4px 4px 0px 0px rgba(93, 49, 54, 0.9)",
        "craft-sm": "2px 2px 0px 0px rgba(93, 49, 54, 0.9)",
        "craft-lift": "6px 6px 0px 0px rgba(93, 49, 54, 0.9)",
        "craft-soft": "0px 4px 12px rgba(93, 49, 54, 0.15)",
      },
      borderWidth: {
        "3": "3px",
      },
      letterSpacing: {
        tightest: "-0.04em",
        "display": "-0.05em",
      },
    },
  },
  plugins: [],
};

export default config;
