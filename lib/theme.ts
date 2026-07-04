/**
 * Centralized design tokens for Birthday Rewards.
 *
 * This file is the single source of truth for the app's visual language —
 * colors, radius, shadows, typography, spacing, and motion.
 * `tailwind.config.ts` imports these values directly, so a future UI change
 * (e.g. a new accent color, a softer shadow) should only require editing
 * this file — not hunting through components for hardcoded values.
 *
 * Light mode only. See docs/AI_RULES.md: "Do NOT add Dark Mode."
 *
 * These values are a 1:1 mirror of what `tailwind.config.ts` previously
 * defined inline — moving them here does not change any rendered color,
 * spacing, radius, or shadow.
 */

export const colors = {
  bg: "#FAF8F4",
  surface: "#FFFFFF",
  ink: "#555555",
  muted: "#8A817C",
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
  border: "#EAE6DD",
} as const;

export const borderRadius = {
  card: "14px",
  pill: "999px",
} as const;

export const boxShadow = {
  soft: "0 1px 2px rgba(0,0,0,0.04), 0 1px 8px rgba(0,0,0,0.03)",
  pop: "0 4px 24px rgba(0,0,0,0.08)",
} as const;

export const typography = {
  fontFamily: {
    sans: ["Inter", "Noto Sans TC", "system-ui", "sans-serif"],
  },
  fontSize: {
    list: ["12px", { lineHeight: "1.6" }] as [string, { lineHeight: string }],
    title: ["20px", { lineHeight: "1.3", letterSpacing: "-0.01em" }] as [
      string,
      { lineHeight: string; letterSpacing: string },
    ],
  },
} as const;

/** Transition durations used across the app's motion tokens below. */
export const transitionDuration = {
  fast: "0.18s",
  base: "0.2s",
} as const;

export const keyframes = {
  fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
  slideUp: {
    from: { opacity: "0", transform: "translateY(6px)" },
    to: { opacity: "1", transform: "translateY(0)" },
  },
} as const;

export const animation = {
  fadeIn: `fadeIn ${transitionDuration.fast} ease-out`,
  slideUp: `slideUp ${transitionDuration.base} ease-out`,
} as const;

/** Focus ring used by the global `:focus-visible` style in globals.css. */
export const focusRing = {
  color: "#8CA3B5",
  offset: "2px",
  radius: "4px",
} as const;
