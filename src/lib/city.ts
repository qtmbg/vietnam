// ============================================================
// CITY — city-list ordering + per-city accent colour resolution.
// ============================================================
import type { ItineraryDay } from "../data/types";
import { accentCity } from "../theme";

// Normalise a city label for loose matching: lowercase, drop "(…)" and trim.
export const normCity = (s: string) => s.toLowerCase().replace(/\(.*?\)/g, "").trim();

// Two city labels relate if either normalised form contains the other.
export const cityMatches = (a: string, b: string) => {
  const na = normCity(a);
  const nb = normCity(b);
  if (!na || !nb) return false;
  return na === nb || na.includes(nb) || nb.includes(na);
};

// Unique base cities in itinerary order (first token of "A → B").
export const uniqCitiesByOrder = (days: ItineraryDay[]) => {
  const out: string[] = [];
  for (const d of days) {
    const base = d.city.split("→").map((s) => s.trim())[0];
    if (!out.includes(base)) out.push(base);
  }
  return out;
};

// Every distinct city token in itinerary order ("A → B → C" contributes A, B, C).
// Used by the map view so pass-through cities (e.g. Da Nang) get their own group.
export const uniqCityTokensByOrder = (days: ItineraryDay[]) => {
  const out: string[] = [];
  for (const d of days) {
    for (const tok of d.city.split("→").map((s) => s.trim())) {
      if (tok && !out.includes(tok)) out.push(tok);
    }
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
