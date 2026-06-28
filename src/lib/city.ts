// ============================================================
// CITY — city-list ordering + loose label matching.
// ============================================================
import type { ItineraryDay } from "../data/types";

// Normalise a city label for loose matching: lowercase, drop "(…)" and trim.
const normCity = (s: string) => s.toLowerCase().replace(/\(.*?\)/g, "").trim();

// Two city labels relate if either normalised form contains the other.
export const cityMatches = (a: string, b: string) => {
  const na = normCity(a);
  const nb = normCity(b);
  if (!na || !nb) return false;
  return na === nb || na.includes(nb) || nb.includes(na);
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
