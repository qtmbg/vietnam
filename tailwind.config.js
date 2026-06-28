/** @type {import('tailwindcss').Config} */
// ============================================================
// DESIGN TOKENS — utility-class side of the system.
// The four families below are the single source of truth for
// every Tailwind colour class in the app:
//   ink   ≡ slate   (neutral / text / surfaces)
//   brand ≡ indigo  (primary actions, links)
//   jade  ≡ emerald (success / confirmed / nature)
//   sun   ≡ amber   (warnings / estimates / warmth)
// Hex values are the exact Tailwind v3 scales, so migrating a raw
// `slate-700` → `ink-700` (etc.) is pixel-identical.
// Role-named accent/crew colours that DON'T fold into these four
// live in src/theme.ts (applied via inline style). Keep both in sync.
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
        // brand ≡ indigo
        brand: {
          50: "#eef2ff", 100: "#e0e7ff", 200: "#c7d2fe", 300: "#a5b4fc", 400: "#818cf8",
          500: "#6366f1", 600: "#4f46e5", 700: "#4338ca", 800: "#3730a3", 900: "#312e81", 950: "#1e1b4b",
        },
        // jade ≡ emerald
        jade: {
          50: "#ecfdf5", 100: "#d1fae5", 200: "#a7f3d0", 300: "#6ee7b7", 400: "#34d399",
          500: "#10b981", 600: "#059669", 700: "#047857", 800: "#065f46", 900: "#064e3b", 950: "#022c22",
        },
        // sun ≡ amber
        sun: {
          50: "#fffbeb", 100: "#fef3c7", 200: "#fde68a", 300: "#fcd34d", 400: "#fbbf24",
          500: "#f59e0b", 600: "#d97706", 700: "#b45309", 800: "#92400e", 900: "#78350f", 950: "#451a03",
        },
        // ink ≡ slate
        ink: {
          50: "#f8fafc", 100: "#f1f5f9", 200: "#e2e8f0", 300: "#cbd5e1", 400: "#94a3b8",
          500: "#64748b", 600: "#475569", 700: "#334155", 800: "#1e293b", 900: "#0f172a", 950: "#020617",
        },
      },
      backgroundImage: {
        // App page background. Stops are token-equivalent: brand-50 / ink-50 / ink-100.
        app: "radial-gradient(120% 80% at 50% -10%,#eef2ff 0%,#f8fafc 45%,#f1f5f9 100%)",
      },
      borderRadius: { card: "1.75rem", hero: "2.5rem" },
      boxShadow: {
        soft: "0 1px 2px rgba(15,23,42,.04),0 2px 8px rgba(15,23,42,.05)",
        card: "0 8px 24px -8px rgba(15,23,42,.12)",
        float: "0 20px 50px -16px rgba(15,23,42,.28)",
      },
      keyframes: {
        fadeUp: { "0%": { opacity: "0", transform: "translateY(12px)" }, "100%": { opacity: "1", transform: "none" } },
        shimmer: { "100%": { transform: "translateX(100%)" } },
        floaty: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-6px)" } },
        pop: { "0%": { opacity: "0", transform: "scale(.92)" }, "100%": { opacity: "1", transform: "scale(1)" } },
        breathe: { "0%,100%": { transform: "scale(1)", opacity: "0.55" }, "50%": { transform: "scale(1.18)", opacity: "0" } },
      },
      animation: {
        "fade-up": "fadeUp .5s ease both",
        shimmer: "shimmer 1.6s infinite",
        floaty: "floaty 6s ease-in-out infinite",
        pop: "pop .25s ease both",
        breathe: "breathe 2.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
