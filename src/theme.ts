// ============================================================
// THEME — single home for design tokens (TS side), "Carnet éditorial".
//
// The PRIMARY palette (ink / sand / jade / clay + demoted brand/sun) is
// generated as Tailwind utility classes from tailwind.config.js — kept in
// sync (same hex). Everything in JSX goes through tokens; zero raw colour.
//
// Role-named accents below don't fold into the families and are applied via
// inline `style` at their few usage sites. Earthy, muted — no rainbow.
// ============================================================

// ---- Primary palette reference (mirror of tailwind.config.js) ----
export const palette = {
  ink: {
    50: "#f7f3ec", 100: "#efe9dd", 200: "#e4dccd", 300: "#cdc3b2", 400: "#a99e8a",
    500: "#847a68", 600: "#635a4b", 700: "#4a4236", 800: "#332d24", 900: "#221d16", 950: "#14110c",
  },
  sand: {
    50: "#faf7f1", 100: "#f3ecdf", 200: "#eadeca", 300: "#dccdb0", 400: "#cab68f",
    500: "#b59e74", 600: "#9c835a", 700: "#7e6948", 800: "#65543c", 900: "#534633", 950: "#2f2619",
  },
  jade: {
    50: "#eef1ec", 100: "#dae2d4", 200: "#bccdb1", 300: "#97ad88", 400: "#6f8a5e",
    500: "#526e43", 600: "#405737", 700: "#344629", 800: "#2b3a23", 900: "#1f2b1a", 950: "#111a0f",
  },
  clay: {
    50: "#fbf0e9", 100: "#f5ddd0", 200: "#e9bda4", 300: "#db9876", 400: "#cd744d",
    500: "#bd5a34", 600: "#a4472a", 700: "#863824", 800: "#6d3022", 900: "#5a2a20", 950: "#311510",
  },
} as const;

// ---- Per-city chapter accent (used on day chapters). Earthy & muted. ----
export const accentCity = {
  hanoi: "#9c835a", // sand-600
  ninhBinh: "#6f8a5e", // jade-400
  haLong: "#3f6f63", // muted pine-teal (water)
  hoiAn: "#cd744d", // clay-400 (lanterns)
  hcmc: "#a4472a", // clay-600
  whaleIsland: "#6f8a8f", // muted slate-teal (sea)
} as const;
export type CityAccentKey = keyof typeof accentCity;

// ---- Per-crew-member marker. Earthy tints, keyed by member id. ----
export const crew = {
  marilyne: "#cd744d", // clay-400
  claudine: "#9c835a", // sand-600
  nizzar: "#635a4b", // ink-600
  aydann: "#3f6f63", // pine-teal
  milann: "#b07c3e", // warm ochre
} as const;
export type CrewId = keyof typeof crew;

// ---- Non-colour tokens (mirror of tailwind.config.js) ----
export const radius = { card: "0.5rem", hero: "0.75rem" } as const;
export const shadow = {
  soft: "0 1px 2px rgba(47,38,25,.04),0 1px 3px rgba(47,38,25,.05)",
  card: "0 12px 34px -18px rgba(47,38,25,.20)",
  float: "0 26px 60px -24px rgba(47,38,25,.30)",
} as const;
export const font = {
  sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
  display: ["Fraunces", "Georgia", "serif"],
} as const;

// Warm paper page ground (token-equivalent to sand-100 → sand-50).
export const pageGradient = "radial-gradient(130% 90% at 50% 0%,#f3ecdf 0%,#faf7f1 42%)";
