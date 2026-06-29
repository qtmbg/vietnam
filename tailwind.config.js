/** @type {import('tailwindcss').Config} */
// ============================================================
// DESIGN TOKENS — "Apple / Liquid Glass" art direction. Named BY ROLE.
//   ink     — neutral gray → near-black (text + neutrals, Apple label scale)
//   surface — white → light gray surfaces (the "paper", pure white)
//   jade    — systemGreen (paid / online / positive)
//   accent  — systemBlue, the single accent (links, active tab, figures)
// One accent only. Glass material lives in index.css; crew tints in theme.ts.
// ============================================================
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Apple system stack (SF Pro on Apple devices), system-ui elsewhere.
        sans: ["-apple-system", "BlinkMacSystemFont", "SF Pro Text", "system-ui", "sans-serif"],
        display: ["-apple-system", "BlinkMacSystemFont", "SF Pro Display", "system-ui", "sans-serif"],
      },
      colors: {
        // ink — neutral gray scale → near-black (Apple labels/separators)
        ink: {
          50: "#f5f5f7", 100: "#ececee", 200: "#e3e3e6", 300: "#d2d2d7", 400: "#aeaeb2",
          500: "#8e8e93", 600: "#6e6e73", 700: "#48484a", 800: "#2c2c2e", 900: "#1d1d1f", 950: "#000000",
        },
        // surface — white → light-gray surfaces (the "paper")
        surface: {
          50: "#ffffff", 100: "#f5f5f7", 200: "#ececee", 300: "#e3e3e6", 400: "#d2d2d7",
          500: "#aeaeb2", 600: "#8e8e93", 700: "#6e6e73", 800: "#48484a", 900: "#2c2c2e", 950: "#1d1d1f",
        },
        // jade — systemGreen (paid / online / positive)
        jade: {
          50: "#e9f9ef", 100: "#ccf0d8", 200: "#9fe3b5", 300: "#5fd089", 400: "#34c759",
          500: "#28a745", 600: "#1f8c3a", 700: "#1a7331", 800: "#185f2b", 900: "#144d24", 950: "#0a2e15",
        },
        // accent — systemBlue, the single accent
        accent: {
          50: "#eaf3ff", 100: "#d6e9ff", 200: "#aed2ff", 300: "#6db8ff", 400: "#2e9bff",
          500: "#0a84ff", 600: "#0071e3", 700: "#0062c4", 800: "#0050a0", 900: "#003f7e", 950: "#002a55",
        },
      },
      backgroundImage: {
        // Clean white ground with a whisper of colour so the glass has something to refract.
        app: "radial-gradient(58% 46% at 12% 2%,rgba(10,132,255,0.06) 0%,transparent 58%),radial-gradient(54% 44% at 100% 10%,rgba(52,199,89,0.06) 0%,transparent 56%),radial-gradient(120% 95% at 50% 100%,#f5f5f7 0%,#ffffff 52%)",
      },
      // Apple radii — generous, soft.
      borderRadius: { card: "1.25rem", hero: "1.5rem" },
      boxShadow: {
        // Neutral, soft — Apple depth.
        soft: "0 1px 2px rgba(0,0,0,.04),0 1px 3px rgba(0,0,0,.06)",
        card: "0 10px 30px -12px rgba(0,0,0,.16)",
        float: "0 24px 60px -20px rgba(0,0,0,.30)",
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
