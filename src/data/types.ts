// ============================================================
// DOMAIN TYPES — shared across data, lib, components and views.
// ============================================================
import type { CrewId } from "../theme";

export type Mood = "fatigue" | "normal" | "energy";
export type View = "home" | "voyage" | "guide" | "carte";
export type StatusTag = "CONFIRMED" | "ESTIMATE";

// Home behaviour switches on where "today" sits vs the trip window.
export type TripMode = "prep" | "travel";

export type Money = { us: number; claudine: number; currency: "USD" };

// "À montrer au chauffeur" — the local-form name + address a Vietnamese taxi
// driver actually reads, with diacritics. address is the real drop-off point
// (a pier/station rather than the venue when relevant); note explains that.
export type DriverInfo = {
  nameVi: string; // Vietnamese name with diacritics (what you show/say)
  address: string; // full local-form address, the drop-off point
  note?: string; // short FR hint for the driver (gate, pier, landmark…)
};

export type HotelItem = {
  city: string;
  name: string;
  dates: string;
  budget: Money;
  booking_url?: string;
  official_url?: string;
  why: string;
  note?: string;
  cover?: string;
  paidBy?: "Nous" | "Claudine"; // who fronted the payment (cash flow, not the share split)
  paidNote?: string; // optional clarifier shown next to the "Payé" badge
  toPayUSD?: number; // amount still owed on this hotel (USD). absent/0 = fully paid
  driver?: DriverInfo; // "à montrer au chauffeur" hand-off
};

export type LinkItem = { name: string; url: string };
export type CultureLinks = Record<string, LinkItem[]>;

export type ItineraryDay = {
  date: string; // ISO YYYY-MM-DD
  city: string;
  theme: string[];
  blocks: { label: string; plan: string; links?: string[] }[];
};

export type GlossaryItem = { term: string; note: string };
export type FoodByRegion = Record<string, string[]>;
export type PhraseItem = { fr: string; vi: string; phon: string };

export type AirportGlossaryItem = {
  code: string;
  city: string;
  airport: string;
  fromHotel: string;
  eta: string;
  note?: string;
};

export type ExpenseCategory = "transport" | "activity";
export type ExpenseMode = "private_car_7_seater" | "limousine_or_private_van" | "flight_domestic" | "stay_or_package";
export type Operator = "Ja Cosmo" | "Other" | "Airline" | "VietJet" | "Renea" | "Whale Island";

export type PayerRule = "claudine_20pct_transport" | "split_given" | "adult_equal_split";

export type ExpenseItemUSD = {
  id: string;
  category: ExpenseCategory;
  mode: ExpenseMode;
  operator: Operator;
  operated_by_ja_cosmo: boolean;
  status: StatusTag;
  date?: string | null;
  from?: string;
  to?: string;
  title: string;
  price_total_usd: number;
  payer_rule: PayerRule;
  claudine_usd?: number;
  nous_usd?: number;
  /** true = already paid (e.g. domestic flights). Absent/false = still to settle. */
  paid?: boolean;
  notes?: string;
  tags?: string[];
};

// Planned activities (richer than “tickets”)
export type PlannedActivity = {
  id: string;
  city: string;
  window?: string; // date window text
  name: string;
  category: "culture" | "nature" | "mer" | "show" | "tour" | "histoire" | "ville";
  duration?: string; // text
  bestTime?: string; // text
  pricing: {
    currency: "VND" | "USD";
    vnd_adult?: number;
    vnd_child?: number;
    vnd_range?: [number, number];
    usd_adult?: number;
    usd_range?: [number, number];
    // computed/rounded display:
    estimatedUSD_adult?: number;
    estimatedUSD_range?: [number, number];
  };
  kidsRule?: string;
  payMode?: "sur place" | "réservation";
  cashOnly?: boolean;
  provider: string; // Officiel / GetYourGuide / Viator / Klook / etc.
  sourceUrl?: string;
  notes?: string;
  tags?: string[];
  impact?: boolean; // for mode kids
  driver?: DriverInfo; // "à montrer au chauffeur" hand-off
};

export interface TripData {
  meta: {
    title: string;
    travelers: string;
    travelers_count: { adults_total: number; kids_total: number; kids_ages: number[]; adults_core_family: number; adults_claudine: number };
    vibe: string[];
    flights: {
      outbound: { from: string; date: string; time: string };
      arrive_hanoi: { date: string; time: string };
      return_depart_hanoi: { date: string; time: string };
      return_arrive_marrakech: { date: string; time: string };
    };
  };
  hotels: HotelItem[];
  culture_links: CultureLinks;
  itinerary_days: ItineraryDay[];
  glossary: GlossaryItem[];
  food: FoodByRegion;
  phrasebook: PhraseItem[];
  airport_glossary: AirportGlossaryItem[];
  expenses_usd: ExpenseItemUSD[];
  planned_activities: PlannedActivity[];
}

// ---- Flights ----
export type FlightSeg = {
  code: string;
  carrier: string;
  fromCode: string;
  fromCity: string;
  toCode: string;
  toCity: string;
  dep: string;
  arr: string;
  resa?: string;
  note?: string;
  doc?: string; // URL to the e-ticket PDF for this segment (served from /public/docs)
};
export type FlightLeg = { title: string; sub: string; paid: boolean; segs: FlightSeg[] };

// ---- Travel documents (PDFs served from /public/docs, opened in a new tab) ----
export type TravelDoc = {
  label: string; // what / who
  sub?: string; // route, dates, reference…
  file: string; // resolved public URL
};

// ---- Food guide ----
export type Dish = { name: string; vi: string; desc: string; where?: string; img?: string };
export type FoodCity = { city: string; emoji: string; dishes: Dish[] };

// ---- Family / crew ----
export type FamilyMember = { id: CrewId; name: string; desc: string; src: string; fallback: string };

// ---- Restaurants (Time Out-style "où manger" guide) ----
export type PriceTier = "€" | "€€" | "€€€";
export type Restaurant = {
  name: string;
  cuisine: string; // "Bún chả · grillades au charbon"
  area: string; // neighbourhood / repère
  price: PriceTier;
  signature: string; // the dish to order
  why: string; // one-line hook
  kids?: boolean; // comfortable with Aydann & Milann
  veg?: boolean; // solid vegetarian options
  mapsQuery?: string; // overrides the default "name + city" Maps search
  must?: boolean; // incontournable — the table you don't skip in this city
  img?: string; // photo (typically the signature dish), shown for incontournables
  michelin?: string; // Michelin Guide distinction, e.g. "Bib Gourmand", "Sélection"
  timeout?: boolean; // recommended by Time Out (timeout.com)
};
export type RestaurantCity = { city: string; emoji: string; blurb?: string; spots: Restaurant[] };

// ---- Carte ideas (per city, rated 1–5 stars by "must-do" importance) ----
export type CityIdea = {
  name: string;
  kind: string; // "Culture", "Nature", "Plage", "Vue"…
  stars: 1 | 2 | 3 | 4 | 5; // importance : 5 = à ne surtout pas rater
  why: string; // one-line hook
  mapsQuery?: string; // overrides the default "name + city" Maps search
};
export type CityIdeasGroup = { city: string; ideas: CityIdea[] };

// ---- Things to do (per city, with kid-friendly flags for Aydann 12 & Milann 6) ----
export type Thing = {
  name: string;
  kind: string; // "Culture", "Nature", "Plage", "Parc", "Atelier", "Vue"…
  why: string;
  forKids?: boolean; // a highlight for the kids
  ages?: string; // "tous", "6+", "ado", "petits"…
  duration?: string;
  bookUrl?: string; // official / booking link
  mapsQuery?: string; // overrides the default "name + city" Maps search
};
export type ThingsCity = { city: string; emoji: string; spots: Thing[] };
