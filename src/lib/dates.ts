// ============================================================
// DATES — ISO helpers + French date labels.
// ============================================================
export const MS_DAY = 86400000;

export const toISO = (d: Date) => d.toISOString().slice(0, 10);

export const safeDateLabel = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });
