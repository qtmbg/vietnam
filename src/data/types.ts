// ============================================================
// DOMAIN TYPES — shared across data, lib, components and views.
// ============================================================
import type { CrewId } from "../theme";

export type Mood = "fatigue" | "normal" | "energy";
export type View = "home" | "itinerary" | "hotels" | "flights" | "activities" | "guide" | "tips" | "budget";
export type StatusTag = "CONFIRMED" | "ESTIMATE";

export type Money = { us: number; claudine: number; currency: "USD" };

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
};
export type FlightLeg = { title: string; sub: string; paid: boolean; segs: FlightSeg[] };

// ---- Food guide ----
export type Dish = { name: string; vi: string; desc: string; where?: string };
export type FoodCity = { city: string; emoji: string; dishes: Dish[] };

// ---- Family / crew ----
export type FamilyMember = { id: CrewId; name: string; desc: string; src: string; fallback: string };
