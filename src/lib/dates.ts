// ============================================================
// DATES — ISO helpers + French date labels.
// ============================================================
export const MS_DAY = 86400000;

export const toISO = (d: Date) => d.toISOString().slice(0, 10);

export const safeDateLabel = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });

// "26 juillet" — reads naturally inside a sentence (e.g. a prefilled question).
export const longDateLabel = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
