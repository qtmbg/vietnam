/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        display: ["Fraunces", "Georgia", "serif"],
      },
      colors: {
        brand: { 50: "#eef2ff", 100: "#e0e7ff", 500: "#6366f1", 600: "#4f46e5", 700: "#4338ca" },
        jade: { 50: "#ecfdf5", 100: "#d1fae5", 500: "#10b981", 600: "#059669", 700: "#047857" },
        sun: { 50: "#fffbeb", 100: "#fef3c7", 500: "#f59e0b", 600: "#d97706", 700: "#b45309" },
        ink: {
          50: "#f8fafc", 100: "#f1f5f9", 200: "#e2e8f0", 400: "#94a3b8",
          500: "#64748b", 600: "#475569", 900: "#0f172a", 950: "#020617",
        },
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
