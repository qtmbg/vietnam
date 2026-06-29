// ============================================================
// MOMENTS — derive a glanceable day summary from the itinerary blocks.
//   • dayEssence(day)  → one short line ("Ha Long · UNESCO & Croisière")
//   • dayMoments(day)  → ≤3 moments (Matin / Après-midi / Soir), each a
//     constant pictogram KIND + a ≤5-word label, so a 6-year-old reads the
//     day by icons alone. Nothing is invented — derived from existing blocks.
// ============================================================
import type { ItineraryDay } from "../data/types";

export type MomentKind =
  | "sleep" | "eat" | "boat" | "transfer" | "flight"
  | "beach" | "culture" | "nature" | "market" | "show" | "walk" | "coffee";

export type DaySlot = "matin" | "aprem" | "soir";
export type Moment = { slot: DaySlot; kind: MomentKind; label: string };

export const SLOT_LABEL: Record<DaySlot, string> = {
  matin: "Matin",
  aprem: "Après-midi",
  soir: "Soir",
};

// One constant ≤5-word label per kind (the pictogram carries the meaning).
const KIND_LABEL: Record<MomentKind, string> = {
  sleep: "Repos & installation",
  eat: "Cuisine locale",
  boat: "Croisière / barque",
  transfer: "Route en van",
  flight: "Vol intérieur",
  beach: "Plage & piscine",
  culture: "Visite culturelle",
  nature: "Nature & paysages",
  market: "Marché local",
  show: "Spectacle du soir",
  walk: "Balade & découverte",
  coffee: "Pause café",
};

const slotOf = (label: string): DaySlot => {
  const l = label.toLowerCase();
  if (l.includes("soir")) return "soir";
  if (l.includes("matin") || l.includes("tôt") || l.includes("tot")) return "matin";
  return "aprem"; // midi, aprem, jour…
};

// Derive the moment kind from the plan text (most specific cues first).
const kindOf = (plan: string): MomentKind => {
  const t = plan.toLowerCase();
  if (/(croisièr|cruise|embarqu|barque|bateau|baie)/.test(t)) return "boat";
  if (/(vol\b|avion|aéroport|aeroport|airport|vj\d|qr\d)/.test(t)) return "flight";
  if (/(plage|piscine|beach)/.test(t)) return "beach";
  if (/(rizièr|grotte|viewpoint|hang mua|trang an|montagne|marble|cocotiers|delta|tunnel)/.test(t)) return "nature";
  if (/(spectacle|marionnett|memories)/.test(t)) return "show";
  if (/(temple|musée|musee|prison|pagode|unesco|opéra|opera|sanctuaire|citadelle|my son|hoa lo|littérature|literature)/.test(t)) return "culture";
  if (/(marché|marche\b|market)/.test(t)) return "market";
  if (/(repos|détente|detente|dodo)/.test(t)) return "sleep";
  if (/(café|cafe|coffee)/.test(t)) return "coffee";
  if (/(transfert|driver|départ|depart|check-in|arrivée|arrivee|installation|\broute\b|\bvan\b)/.test(t)) return "transfer";
  if (/(street food|street-food|dîner|diner|déjeuner|dejeuner|resto|seafood|manger)/.test(t)) return "eat";
  return "walk";
};

const destCity = (label: string) => label.split("→").map((s) => s.trim()).filter(Boolean).pop() ?? label;

const THEME_FR: Record<string, string> = {
  arrivée: "Arrivée",
  culture: "Culture",
  "street-life": "Street-life",
  histoire: "Histoire",
  colonial: "Colonial",
  esthétique: "Esthétique",
  nature: "Nature",
  wow: "Paysages",
  bateau: "Bateau",
  unesco: "UNESCO",
  croisière: "Croisière",
  plage: "Plage",
  slow: "Détente",
  départ: "Départ",
  excursion: "Excursion",
};

// Short evocative line: destination city + up to two non-logistic themes.
export const dayEssence = (day: ItineraryDay): string => {
  const themes = day.theme.map((t) => THEME_FR[t]).filter(Boolean).slice(0, 2);
  const city = destCity(day.city);
  return themes.length ? `${city} · ${themes.join(" & ")}` : city;
};

// ≤3 moments, one per slot (Matin / Après-midi / Soir), in order.
export const dayMoments = (day: ItineraryDay): Moment[] => {
  const bySlot = new Map<DaySlot, Moment>();
  for (const b of day.blocks) {
    if (b.label.toLowerCase().includes("escale")) continue; // layover, not a day moment
    const slot = slotOf(b.label);
    if (bySlot.has(slot)) continue; // keep the first block of each slot
    const kind = kindOf(b.plan);
    bySlot.set(slot, { slot, kind, label: KIND_LABEL[kind] });
  }
  return (["matin", "aprem", "soir"] as DaySlot[]).filter((s) => bySlot.has(s)).map((s) => bySlot.get(s)!);
};
