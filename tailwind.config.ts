import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light mode base, per PRD color spec
        bg: {
          DEFAULT: "#FAF8F4",
          dark: "#1C1B19",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          dark: "#252320",
        },
        ink: {
          DEFAULT: "#555555",
          dark: "#E5E1DA",
        },
        muted: {
          DEFAULT: "#8A817C",
          dark: "#9A948C",
        },
        accent: {
          coffee: "#A9967F",
          green: "#8FA68E",
          blue: "#8CA3B5",
        },
        tag: {
          drink: "#DCEBDD",
          "drink-fg": "#4C6B52",
          food: "#F3E3D3",
          "food-fg": "#8A5A34",
          beauty: "#F5DFE6",
          "beauty-fg": "#8A4A63",
          other: "#E7E4DE",
          "other-fg": "#6B655D",
          expiring: "#F0C9A0",
          "expiring-fg": "#7A4A1D",
        },
        border: {
          DEFAULT: "#EAE6DD",
          dark: "#33312D",
        },
      },
      fontFamily: {
        sans: ["Inter", "Noto Sans TC", "system-ui", "sans-serif"],
      },
      fontSize: {
        list: ["12px", { lineHeight: "1.6" }],
        title: ["20px", { lineHeight: "1.3", letterSpacing: "-0.01em" }],
      },
      spacing: {
        // 8px grid helpers beyond Tailwind defaults are already covered by default scale
      },
      borderRadius: {
        card: "14px",
        pill: "999px",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(0,0,0,0.04), 0 1px 8px rgba(0,0,0,0.03)",
        pop: "0 4px 24px rgba(0,0,0,0.08)",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: { from: { opacity: "0", transform: "translateY(6px)" }, to: { opacity: "1", transform: "translateY(0)" } },
      },
      animation: {
        fadeIn: "fadeIn 0.18s ease-out",
        slideUp: "slideUp 0.2s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
