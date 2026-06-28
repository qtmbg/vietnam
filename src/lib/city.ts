// ============================================================
// CITY — city-list ordering + per-city accent colour resolution.
// ============================================================
import type { ItineraryDay } from "../data/types";
import { accentCity } from "../theme";

// Unique base cities in itinerary order (first token of "A → B").
export const uniqCitiesByOrder = (days: ItineraryDay[]) => {
  const out: string[] = [];
  for (const d of days) {
    const base = d.city.split("→").map((s) => s.trim())[0];
    if (!out.includes(base)) out.push(base);
  }
  return out;
};

// Per-city chapter accent colour (hex). Mirrors the original
// accentForCity matching; values come from the theme accentCity tokens.
export const accentColorForCity = (label?: string): string => {
  const s = (label ?? "").toLowerCase();
  if (s.includes("ninh")) return accentCity.ninhBinh;
  if (s.includes("ha long") || s.includes("halong")) return accentCity.haLong;
  if (s.includes("hoi an") || s.includes("hoian") || s.includes("da nang") || s.includes("danang")) return accentCity.hoiAn;
  if (s.includes("ho chi minh") || s.includes("hcmc") || s.includes("saigon")) return accentCity.hcmc;
  if (s.includes("whale")) return accentCity.whaleIsland;
  return accentCity.hanoi;
};
