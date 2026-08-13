import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Deep monsoon-night ink (not pure black — has a green/teal undertone)
        ink: {
          DEFAULT: "#0B1512",
          soft: "#101F1A",
          line: "#25352F",
        },
        // Warm, slightly yellowed paper — the "poster stock"
        paper: {
          DEFAULT: "#F3EEDD",
          dim: "#E7DFC6",
        },
        // Laterite / terracotta — Goan earth, deeper & rustier than the
        // generic AI-orange
        laterite: {
          DEFAULT: "#B84A2A",
          dark: "#8F3A21",
          light: "#D97B4F",
        },
        // Tropical foliage green
        foliage: {
          DEFAULT: "#3E6B4E",
          dark: "#2A4A36",
        },
        // Ocean blue
        ocean: {
          DEFAULT: "#1D4E5E",
          dark: "#123641",
        },
        // Sun-washed yellow — used sparingly, as a stamp/accent color only
        sun: {
          DEFAULT: "#E8B23D",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        body: ["var(--font-body)", "sans-serif"],
      },
      backgroundImage: {
        grain: "url('/grain.svg')",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(var(--r, 0deg))" },
          "50%": { transform: "translateY(-14px) rotate(var(--r, 0deg))" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        marquee: "marquee 22s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
