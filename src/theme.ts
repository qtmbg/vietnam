// ============================================================
// THEME — the single home for design tokens (TS side).
//
// The PRIMARY palette (ink / brand / jade / sun) is generated as
// Tailwind utility classes from tailwind.config.js — that file and
// this one are kept in sync (same hex). Everything in JSX goes
// through those four families.
//
// The colours below are ROLE-NAMED accents that don't fold into the
// four families. They keep their exact current hex so the rendering
// is unchanged, and they're applied via inline `style` at their (few)
// usage sites. To re-map an accent later, edit it HERE only — no
// component renaming required.
// ============================================================

// ---- Primary palette reference (mirror of tailwind.config.js) ----
// Exposed for any TS code that needs a raw hex; classes remain the
// normal way to use these in JSX.
export const palette = {
  ink: {
    50: "#f8fafc", 100: "#f1f5f9", 200: "#e2e8f0", 300: "#cbd5e1", 400: "#94a3b8",
    500: "#64748b", 600: "#475569", 700: "#334155", 800: "#1e293b", 900: "#0f172a", 950: "#020617",
  },
  brand: {
    50: "#eef2ff", 100: "#e0e7ff", 200: "#c7d2fe", 300: "#a5b4fc", 400: "#818cf8",
    500: "#6366f1", 600: "#4f46e5", 700: "#4338ca", 800: "#3730a3", 900: "#312e81", 950: "#1e1b4b",
  },
  jade: {
    50: "#ecfdf5", 100: "#d1fae5", 200: "#a7f3d0", 300: "#6ee7b7", 400: "#34d399",
    500: "#10b981", 600: "#059669", 700: "#047857", 800: "#065f46", 900: "#064e3b", 950: "#022c22",
  },
  sun: {
    50: "#fffbeb", 100: "#fef3c7", 200: "#fde68a", 300: "#fcd34d", 400: "#fbbf24",
    500: "#f59e0b", 600: "#d97706", 700: "#b45309", 800: "#92400e", 900: "#78350f", 950: "#451a03",
  },
} as const;

// ---- Per-city chapter accent (used on the hero "Focus" chip + day
// calendar icon). Role-named: each entry keeps its current hue. ----
export const accentCity = {
  hanoi: "#a5b4fc", // (was indigo-300)
  ninhBinh: "#6ee7b7", // (was emerald-300)
  haLong: "#5eead4", // (was teal-300)
  hoiAn: "#fcd34d", // (was amber-300)
  hcmc: "#fda4af", // (was rose-300)
  whaleIsland: "#7dd3fc", // (was sky-300)
} as const;
export type CityAccentKey = keyof typeof accentCity;

// ---- Per-crew-member dot colour (family strip). Role-named by the
// member's id. Keeps the current hue for each person. ----
export const crew = {
  marilyne: "#fce7f3", // (was pink-100)
  claudine: "#e0e7ff", // (was indigo-100)
  nizzar: "#f1f5f9", // (was slate-100)
  aydann: "#dbeafe", // (was blue-100)
  milann: "#ffedd5", // (was orange-100)
} as const;
export type CrewId = keyof typeof crew;

// ---- Non-colour tokens (mirror of tailwind.config.js) ----
export const radius = { card: "1.75rem", hero: "2.5rem" } as const;
export const shadow = {
  soft: "0 1px 2px rgba(15,23,42,.04),0 2px 8px rgba(15,23,42,.05)",
  card: "0 8px 24px -8px rgba(15,23,42,.12)",
  float: "0 20px 50px -16px rgba(15,23,42,.28)",
} as const;
export const font = {
  sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
  display: ["Fraunces", "Georgia", "serif"],
} as const;

// App page background gradient (token-equivalent to brand-50 / ink-50 / ink-100).
export const pageGradient = "radial-gradient(120% 80% at 50% -10%,#eef2ff 0%,#f8fafc 45%,#f1f5f9 100%)";
