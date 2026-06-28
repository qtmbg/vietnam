// ============================================================
// THEME (TS side) — only the role-named accents applied via inline `style`.
// The full palette / radii / shadows live in tailwind.config.js and are used
// in JSX as utility classes (bg-ink-900, shadow-card, etc.) — no JS mirror.
// ============================================================

// ---- Per-crew-member marker — distinct Apple system colours, by member id. ----
export const crew = {
  marilyne: "#ff375f", // pink
  claudine: "#bf5af2", // purple
  nizzar: "#0071e3", // blue
  aydann: "#30b0c7", // teal
  milann: "#ff9f0a", // orange
} as const;
export type CrewId = keyof typeof crew;
