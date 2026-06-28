/** @type {import('tailwindcss').Config} */
// ============================================================
// DESIGN TOKENS — "Carnet éditorial" art direction.
// Earthy, warm, magazine palette (Cereal / Kinfolk / Monocle):
//   ink   — warm charcoal / espresso (text + neutrals), NOT cool slate
//   sand  — the dominant warm paper / oat surface + page ground
//   jade  — muted forest / sage (calm editorial green)
//   clay  — terracotta, the single warm accent (used sparingly)
// brand (indigo) and sun (amber) are kept defined for views not yet
// reworked, but DEMOTED — indigo is at most a discreet accent now.
// theme.ts mirrors these values; keep both in sync. Zero non-token colour.
// ============================================================
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        display: ["Fraunces", "Georgia", "serif"],
      },
      colors: {
        // ink — warm charcoal / espresso
        ink: {
          50: "#f7f3ec", 100: "#efe9dd", 200: "#e4dccd", 300: "#cdc3b2", 400: "#a99e8a",
          500: "#847a68", 600: "#635a4b", 700: "#4a4236", 800: "#332d24", 900: "#221d16", 950: "#14110c",
        },
        // sand — warm paper / oat, the dominant surface
        sand: {
          50: "#faf7f1", 100: "#f3ecdf", 200: "#eadeca", 300: "#dccdb0", 400: "#cab68f",
          500: "#b59e74", 600: "#9c835a", 700: "#7e6948", 800: "#65543c", 900: "#534633", 950: "#2f2619",
        },
        // jade — muted forest / sage
        jade: {
          50: "#eef1ec", 100: "#dae2d4", 200: "#bccdb1", 300: "#97ad88", 400: "#6f8a5e",
          500: "#526e43", 600: "#405737", 700: "#344629", 800: "#2b3a23", 900: "#1f2b1a", 950: "#111a0f",
        },
        // clay — terracotta accent
        clay: {
          50: "#fbf0e9", 100: "#f5ddd0", 200: "#e9bda4", 300: "#db9876", 400: "#cd744d",
          500: "#bd5a34", 600: "#a4472a", 700: "#863824", 800: "#6d3022", 900: "#5a2a20", 950: "#311510",
        },
        // brand — indigo, DEMOTED (kept for not-yet-reworked views)
        brand: {
          50: "#eef2ff", 100: "#e0e7ff", 200: "#c7d2fe", 300: "#a5b4fc", 400: "#818cf8",
          500: "#6366f1", 600: "#4f46e5", 700: "#4338ca", 800: "#3730a3", 900: "#312e81", 950: "#1e1b4b",
        },
        // sun — amber, kept for not-yet-reworked views
        sun: {
          50: "#fffbeb", 100: "#fef3c7", 200: "#fde68a", 300: "#fcd34d", 400: "#fbbf24",
          500: "#f59e0b", 600: "#d97706", 700: "#b45309", 800: "#92400e", 900: "#78350f", 950: "#451a03",
        },
      },
      backgroundImage: {
        // Warm paper ground — sober, no indigo. Barely-there sand wash.
        app: "radial-gradient(130% 90% at 50% 0%,#f3ecdf 0%,#faf7f1 42%)",
      },
      // Editorial: restrained radii, thin rules carry the structure instead.
      borderRadius: { card: "0.5rem", hero: "0.75rem" },
      boxShadow: {
        // Warm, soft, minimal — editorial pages lean on rules, not float.
        soft: "0 1px 2px rgba(47,38,25,.04),0 1px 3px rgba(47,38,25,.05)",
        card: "0 12px 34px -18px rgba(47,38,25,.20)",
        float: "0 26px 60px -24px rgba(47,38,25,.30)",
      },
      keyframes: {
        fadeUp: { "0%": { opacity: "0", transform: "translateY(12px)" }, "100%": { opacity: "1", transform: "none" } },
        riseIn: { "0%": { opacity: "0", transform: "translateY(18px)" }, "100%": { opacity: "1", transform: "none" } },
        shimmer: { "100%": { transform: "translateX(100%)" } },
        floaty: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-6px)" } },
        pop: { "0%": { opacity: "0", transform: "scale(.92)" }, "100%": { opacity: "1", transform: "scale(1)" } },
        breathe: { "0%,100%": { transform: "scale(1)", opacity: "0.55" }, "50%": { transform: "scale(1.18)", opacity: "0" } },
      },
      animation: {
        "fade-up": "fadeUp .5s ease both",
        "rise-in": "riseIn .65s cubic-bezier(.2,.6,.2,1) both",
        shimmer: "shimmer 1.6s infinite",
        floaty: "floaty 6s ease-in-out infinite",
        pop: "pop .25s ease both",
        breathe: "breathe 2.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
