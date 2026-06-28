// ============================================================
// THEME — single home for design tokens (TS side), "Apple / Liquid Glass".
//
// The PRIMARY palette (ink / sand / jade / clay + brand/sun) is generated as
// Tailwind utility classes from tailwind.config.js — kept in sync (same hex).
// Pure white surfaces, neutral grays, one blue accent. Zero raw colour in JSX.
//
// Role-named accents below are applied via inline `style` at their few usage
// sites — clean, vibrant Apple system colours.
// ============================================================

// ---- Primary palette reference (mirror of tailwind.config.js) ----
export const palette = {
  ink: {
    50: "#f5f5f7", 100: "#ececee", 200: "#e3e3e6", 300: "#d2d2d7", 400: "#aeaeb2",
    500: "#8e8e93", 600: "#6e6e73", 700: "#48484a", 800: "#2c2c2e", 900: "#1d1d1f", 950: "#000000",
  },
  sand: {
    50: "#ffffff", 100: "#f5f5f7", 200: "#ececee", 300: "#e3e3e6", 400: "#d2d2d7",
    500: "#aeaeb2", 600: "#8e8e93", 700: "#6e6e73", 800: "#48484a", 900: "#2c2c2e", 950: "#1d1d1f",
  },
  jade: {
    50: "#e9f9ef", 100: "#ccf0d8", 200: "#9fe3b5", 300: "#5fd089", 400: "#34c759",
    500: "#28a745", 600: "#1f8c3a", 700: "#1a7331", 800: "#185f2b", 900: "#144d24", 950: "#0a2e15",
  },
  clay: {
    50: "#eaf3ff", 100: "#d6e9ff", 200: "#aed2ff", 300: "#6db8ff", 400: "#2e9bff",
    500: "#0a84ff", 600: "#0071e3", 700: "#0062c4", 800: "#0050a0", 900: "#003f7e", 950: "#002a55",
  },
} as const;

// ---- Per-city chapter accent — vibrant Apple system colours. ----
export const accentCity = {
  hanoi: "#0071e3", // systemBlue
  ninhBinh: "#34c759", // systemGreen
  haLong: "#30b0c7", // systemTeal
  hoiAn: "#ff9f0a", // systemOrange
  hcmc: "#ff375f", // systemPink/Red
  whaleIsland: "#32ade6", // systemCyan
} as const;
export type CityAccentKey = keyof typeof accentCity;

// ---- Per-crew-member marker — distinct Apple system colours, by member id. ----
export const crew = {
  marilyne: "#ff375f", // pink
  claudine: "#bf5af2", // purple
  nizzar: "#0071e3", // blue
  aydann: "#30b0c7", // teal
  milann: "#ff9f0a", // orange
} as const;
export type CrewId = keyof typeof crew;

// ---- Non-colour tokens (mirror of tailwind.config.js) ----
export const radius = { card: "1.25rem", hero: "1.5rem" } as const;
export const shadow = {
  soft: "0 1px 2px rgba(0,0,0,.04),0 1px 3px rgba(0,0,0,.06)",
  card: "0 10px 30px -12px rgba(0,0,0,.16)",
  float: "0 24px 60px -20px rgba(0,0,0,.30)",
} as const;
export const font = {
  sans: ["-apple-system", "BlinkMacSystemFont", "SF Pro Text", "Inter", "system-ui", "sans-serif"],
  display: ["-apple-system", "BlinkMacSystemFont", "SF Pro Display", "Inter", "system-ui", "sans-serif"],
} as const;

// Clean white page ground (token-equivalent to the bg-app gradient).
export const pageGradient = "radial-gradient(120% 95% at 50% 100%,#f5f5f7 0%,#ffffff 52%)";
