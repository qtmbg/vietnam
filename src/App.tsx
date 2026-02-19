import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Banknote,
  BatteryCharging,
  BookOpen,
  Calendar,
  CheckSquare,
  Heart,
  Hotel,
  Info,
  Landmark,
  Languages,
  Lightbulb,
  MapPin,
  Navigation,
  Plane,
  Printer,
  Sparkles,
  Smartphone,
  Star,
  Utensils,
  Wallet,
  X,
  ChevronRight,
  ChevronLeft,
  Flame,
  Moon,
  Shield,
  Search,
} from "lucide-react";

// ------------------------------------------------------------
// ASSET URL (Vite) — works locally + Vercel + base path
// Put your files in /public/covers/... and /public/family/...
// ------------------------------------------------------------
const assetUrl = (path: string) => {
  const base = (import.meta as any)?.env?.BASE_URL ?? "/";
  const cleanBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
};

// Helper to build public paths safely
const P = (p: string) => assetUrl(p);

// ------------------------------------------------------------
// ASSETS (public/)
// ------------------------------------------------------------
const ASSETS = {
  // Family (public/family/)
  family: {
    marilyne: P("/family/marilyne.jpg"),
    claudine: P("/family/claudine.jpg"),
    nizzar: P("/family/nizzar.jpg"),
    aydann: P("/family/aydann.jpg"),
    milann: P("/family/milann.jpg"),
  },
  // Covers (public/covers/)
  covers: {
    sections: {
      home: P("/covers/cities/hanoi.jpg"),
      itinerary: P("/covers/moments/train.jpg"),
      hotels: P("/covers/cities/hoi-an.jpg"),
      guide: P("/covers/moments/streetfood.png"),
      tips: P("/covers/moments/market.png"),
      budget: P("/covers/cities/hcmc.jpg"),
    },
    cities: {
      hanoi: P("/covers/cities/hanoi.jpg"),
      ninh_binh: P("/covers/cities/ninh-binh.jpg"),
      ha_long: P("/covers/cities/ha-long.jpg"),
      hoi_an: P("/covers/cities/hoi-an.jpg"),
      da_nang: P("/covers/cities/da-nang.jpg"),
      hcmc: P("/covers/cities/hcmc.jpg"),
      whale_island: P("/covers/cities/whale-island.jpg"),
    },
    moments: {
      arrival: P("/covers/moments/arrival.jpg"),
      transfer: P("/covers/moments/transfer.jpg"),
      airport: P("/covers/moments/airport.jpg"),
      plane: P("/covers/moments/plane.jpg"),
      train: P("/covers/moments/train.jpg"),
      night: P("/covers/moments/night.jpg"),
      beach: P("/covers/moments/beach.jpg"),
      boat: P("/covers/moments/boat.jpg"),
      market: P("/covers/moments/market.jpg"),
      coffee: P("/covers/moments/coffee.jpg"),
      streetfood: P("/covers/moments/streetfood.jpg"),
      museum: P("/covers/moments/museum.jpg"),
      temple: P("/covers/moments/temple.jpg"),
      massage: P("/covers/moments/massage.jpg"),
      love: P("/covers/moments/love.jpg"),
      family: P("/covers/moments/family.jpg"),
      // spécifiques (si présents)
      hanoi_train_street: P("/covers/moments/hanoi-train-street.jpg"),
      hanoi_lan_ong: P("/covers/moments/hanoi-lan-ong.jpg"),
      hanoi_hoan_kiem: P("/covers/moments/hanoi-hoan-kiem.jpg"),
      hanoi_temple_of_literature: P("/covers/moments/hanoi-temple-of-literature.jpg"),
      ninhbinh_hang_mua: P("/covers/moments/ninhbinh-hang-mua.jpg"),
      ninh_binh_trang_an: P("/covers/moments/ninh-binh-trang-an.jpg"),
      ninh_binh_tam_coc: P("/covers/moments/ninh-binh-tam-coc.jpg"),
      ha_long_sunset: P("/covers/moments/ha-long-sunset.jpg"),
      ha_long_cruise: P("/covers/moments/ha-long-cruise.jpg"),
      hoi_an_an_bang: P("/covers/moments/hoi-an-an-bang.jpg"),
      hoi_an_old_town_night: P("/covers/moments/hoi-an-old-town-night.jpg"),
      hcmc_war_museum: P("/covers/moments/hcmc-war-museum.jpg"),
      hcmc_ben_thanh: P("/covers/moments/hcmc-ben-thanh.jpg"),
      hcmc_central_post_office: P("/covers/moments/hcmc-central-post-office.jpg"),
      whale_island_ponton: P("/covers/moments/whale-island-ponton.jpg"),
      pont_dragon_da_nang: P("/covers/moments/pont-dragon-da-nang.jpg"),
    },
    // Hotels (public/covers/hotels/)
    hotels: {
      hanoi_ja_cosmo: P("/covers/hotels/hanoi-ja-cosmo.jpg"),
      ninh_binh_tam_coc_golden_fields: P("/covers/hotels/ninh-binh-tam-coc-golden-fields.jpg"),
      ha_long_wyndham_legend: P("/covers/hotels/ha-long-wyndham-legend.jpg"),
      ha_long_renea_cruise: P("/covers/hotels/ha-long-rc-cruise.jpg (Renea).jpg"),
      hoi_an_palm_garden: P("/covers/hotels/hoi-an-palm-garden.png"),
      da_nang_seahorse_signature: P("/covers/hotels/da-nang-seahorse-signature.jpg"),
      whale_island_resort: P("/covers/hotels/whale-island-resort.jpg"),
      hcmc_alagon_spa: P("/covers/hotels/hcmc-alagon-spa.jpg"),
    },
  },
} as const;

const cityCoverFromLabel = (label?: string) => {
  const s = (label ?? "").toLowerCase();
  if (s.includes("hanoi")) return ASSETS.covers.cities.hanoi;
  if (s.includes("ninh")) return ASSETS.covers.cities.ninh_binh;
  if (s.includes("ha long") || s.includes("halong")) return ASSETS.covers.cities.ha_long;
  if (s.includes("hoi an") || s.includes("hoian")) return ASSETS.covers.cities.hoi_an;
  if (s.includes("da nang") || s.includes("danang")) return ASSETS.covers.cities.da_nang;
  if (s.includes("ho chi minh") || s.includes("hcmc") || s.includes("saigon")) return ASSETS.covers.cities.hcmc;
  if (s.includes("whale")) return ASSETS.covers.cities.whale_island;
  return ASSETS.covers.sections.home;
};

// ------------------------------------------------------------
// TYPES
// ------------------------------------------------------------
type Mood = "fatigue" | "normal" | "energy";
type View = "home" | "itinerary" | "hotels" | "culture" | "guide" | "tips" | "budget";
type Money = { us: number; claudine: number; currency: "USD"; };

type HotelItem = {
  city: string;
  name: string;
  dates: string;
  budget: Money;
  booking_url?: string;
  official_url?: string;
  why: string;
  note?: string;
  imageKey?: string; // (on garde simple; éviter typeof TRIP_DATA dans les types)
  cover?: string;
};

type LinkItem = { name: string; url: string };
type CultureLinks = Record<string, LinkItem[]>;

type FlightItem = {
  route: string;
  time: string;
  group_cost_usd: number;
};

type TransferItem = {
  name: string;
  cost_usd: number;
};

type DayBlock = {
  label: string;
  plan: string;
  links?: string[];
};

type ItineraryDay = {
  date: string; // ISO YYYY-MM-DD
  city: string;
  theme: string[];
  blocks: DayBlock[];
};

type GlossaryItem = { term: string; note: string };
type FoodByRegion = Record<string, string[]>;

type ActivityCost = {
  currency: "VND";
  adult_vnd: number;
  child_vnd?: number;
  notes?: string;
};

type Activity = {
  id: string;
  city: string;
  name: string;
  link?: string;
  cost?: ActivityCost;
  tags?: string[];
  when?: string;
};

type AirportGlossaryItem = {
  code: string;
  city: string;
  airport: string;
  fromHotel: string;
  eta: string;
  note?: string;
};

type PhraseItem = { fr: string; vi: string; phon: string };

interface TripData {
  meta: {
    title: string;
    travelers: string;
    travelers_count: { adults: number; kids: number; kids_ages: number[] };
    vibe: string[];
    flights: {
      outbound: { from: string; date: string; time: string };
      arrive_hanoi: { date: string; time: string };
      return_depart_hanoi: { date: string; time: string };
      return_arrive_marrakech: { date: string; time: string };
    };
  };
  hero_images: Record<string, { src: string; source: string }>;
  hotels: HotelItem[];
  culture_links: CultureLinks;
  internal_flights: FlightItem[];
  ground_transfers: TransferItem[];
  itinerary_days: ItineraryDay[];
  glossary: GlossaryItem[];
  food: FoodByRegion;
  activities: Activity[];
}

// ------------------------------------------------------------
// DATA
// ------------------------------------------------------------
const TRIP_DATA: TripData = {
  meta: {
    title: "Vietnam 2026 — Family Trip",
    travelers: "3 adultes + 2 enfants (12 et 6) + Claudine (70, active)",
    travelers_count: { adults: 4, kids: 2, kids_ages: [12, 6] },
    vibe: ["culture", "histoire", "art", "nature", "bonne bouffe 🍲", "moments d’amour"],
    flights: {
      outbound: { from: "Marrakech", date: "2026-07-24", time: "18:55" },
      arrive_hanoi: { date: "2026-07-25", time: "19:30" },
      return_depart_hanoi: { date: "2026-08-17", time: "19:30" },
      return_arrive_marrakech: { date: "2026-08-18", time: "09:20" },
    },
  },
  hero_images: {
    Hanoi: {
      src: "https://images.unsplash.com/photo-1528127269322-81bef729b60c?auto=format&fit=crop&w=1600&q=80",
      source: "Unsplash - Huc Bridge",
    },
    NinhBinh_TrangAn: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Tour_boats_at_Trang_An_Landscape_Complex%2C_Ninh_Binh_Province%2C_Vietnam%2C_20240202_1446_5308.jpg/1600px-Tour_boats_at_Trang_An_Landscape_Complex%2C_Ninh_Binh_Province%2C_Vietnam%2C_20240202_1446_5308.jpg",
      source: "Wikimedia",
    },
    HaLong: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/The_karsts_stretch_as_far_as_the_eye_can_see_%2831263636870%29.jpg/1600px-The_karsts_stretch_as_far_as_the_eye_can_see_%2831263636870%29.jpg",
      source: "Wikimedia",
    },
    HoiAn: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Lanterns_in_Hoi_An_4.jpg/1600px-Lanterns_in_Hoi_An_4.jpg",
      source: "Wikimedia",
    },
    DaNang: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Museum_of_Cham_Sculpture.jpg/1600px-Museum_of_Cham_Sculpture.jpg",
      source: "Wikimedia",
    },
    HCMC: {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Saigon_Central_Post_Office_2025.jpg/1600px-Saigon_Central_Post_Office_2025.jpg",
      source: "Wikimedia",
    },
  },
  hotels: [
    {
      city: "Hanoi",
      name: "Ja Cosmo Hotel and Spa",
      dates: "25 Jul → 28 Jul, puis 15 Aug → 17 Aug",
      budget: { us: 180, claudine: 110, currency: "USD" },
      booking_url: "https://www.booking.com/hotel/vn/ja-cosmo-and-spa.html",
      why: "Central pour ruelles, cafés, culture; simple avec kids + Claudine.",
      imageKey: "Hanoi",
      cover: "/covers/hotels/hanoi-ja-cosmo.jpg",
    },
    {
      city: "Ninh Binh (Tam Coc)",
      name: "Tam Coc Golden Fields Homestay",
      dates: "28 Jul → 30 Jul",
      budget: { us: 140, claudine: 110, currency: "USD" },
      booking_url: "https://www.booking.com/hotel/vn/tam-coc-golden-fields-homestay.html",
      why: "Base rizières + liberté; parfait pour le ‘wow’ Trang An sans galère.",
      imageKey: "NinhBinh_TrangAn",
      cover: "/covers/hotels/ninh-binh-tam-coc-golden-fields.jpg",
    },
    {
      city: "Ha Long",
      name: "Wyndham Legend Halong",
      dates: "30 Jul → 31 Jul",
      budget: { us: 130, claudine: 80, currency: "USD" },
      booking_url: "https://www.booking.com/hotel/vn/wyndham-legend-halong-bai-chay5.html",
      why: "Transition confortable avant croisière, logistique simple.",
      imageKey: "HaLong",
      cover: "/covers/hotels/ha-long-wyndham-legend.jpg",
    },
    {
      city: "Ha Long (Cruise)",
      name: "Renea Cruises Halong",
      dates: "31 Jul → 01 Aug",
      budget: { us: 330, claudine: 300, currency: "USD" },
      booking_url: "https://www.booking.com/hotel/vn/renea-cruises-halong-ha-long.html",
      note: "Départ : Halong International Cruise Port",
      why: "Le cœur ‘cinéma’ du voyage: karsts, baie, expérience famille.",
      imageKey: "HaLong",
      cover: "/covers/hotels/ha-long-rc-cruise.jpg (Renea).jpg",
    },
    {
      city: "Hoi An (Cua Dai Beach)",
      name: "Palm Garden Beach Resort & Spa",
      dates: "01 Aug → 06 Aug",
      budget: { us: 680, claudine: 620, currency: "USD" },
      booking_url: "https://www.booking.com/hotel/vn/palm-garden-beach-resort-spa-510.html",
      why: "Grand resort 5* avec plage privée, jardins tropicaux et immense piscine. Le top pour se détendre en famille.",
      imageKey: "HoiAn",
      cover: "/covers/hotels/hoi-an-palm-garden.png",
    },
    {
      city: "Da Nang",
      name: "Seahorse Signature Danang Hotel by Haviland",
      dates: "06 Aug → 08 Aug",
      budget: { us: 129, claudine: 92, currency: "USD" },
      booking_url: "https://www.booking.com/hotel/vn/seahorse-signature-danang-by-haviland.html",
      why: "Base urbaine efficace pour culture + musées + ponts.",
      imageKey: "DaNang",
      cover: "/covers/hotels/da-nang-seahorse-signature.jpg",
    },
    {
      city: "Whale Island (Hon Ong)",
      name: "Whale Island Resort",
      dates: "08 Aug → 12 Aug",
      budget: { us: 415, claudine: 415, currency: "USD" },
      official_url: "https://whaleislandresort.com/",
      why: "Déconnexion nature pure, rythme famille, mer & ciel.",
      imageKey: "DaNang",
      cover: "/covers/hotels/whale-island-resort.jpg",
    },
    {
      city: "Ho Chi Minh City",
      name: "Alagon Saigon Hotel & Spa",
      dates: "12 Aug → 15 Aug",
      budget: { us: 275, claudine: 211, currency: "USD" },
      booking_url: "https://www.booking.com/hotel/vn/alagon-saigon.html",
      why: "Très central pour histoire, colonial, street life.",
      imageKey: "HCMC",
      cover: "/covers/hotels/hcmc-alagon-spa.jpg",
    },
  ],
  culture_links: {
    UNESCO: [
      { name: "Trang An Landscape Complex (Ninh Binh)", url: "https://whc.unesco.org/en/list/1438/" },
      { name: "Ha Long Bay - Cat Ba Archipelago", url: "https://whc.unesco.org/en/list/672/" },
      { name: "Hoi An Ancient Town", url: "https://whc.unesco.org/en/list/948/" },
    ],
    Hanoi: [
      { name: "Hoa Lo Prison Relic (site)", url: "https://hoalo.vn/EN" },
      { name: "Thang Long Water Puppet Theatre (tickets)", url: "https://nhahatmuaroithanglong.vn/en/ticket-book/" },
    ],
    DaNang: [
      { name: "Da Nang Museum of Cham Sculpture", url: "https://chammuseum.vn/" },
      { name: "Marble Mountains guide (Vietnam Tourism)", url: "https://vietnam.travel/things-to-do/around-marble-mountains" },
    ],
    HoChiMinh: [
      { name: "War Remnants Museum (EN)", url: "https://baotangchungtichchientranh.vn/en" },
      { name: "Independence Palace (visiting hours)", url: "https://dinhdoclap.gov.vn/en/visiting-hours/" },
    ],
  },
  internal_flights: [
    { route: "HPH → DAD", time: "19:00", group_cost_usd: 200 },
    { route: "DAD → CXR", time: "06:00", group_cost_usd: 250 },
    { route: "CXR → SGN", time: "16:00", group_cost_usd: 300 },
    { route: "SGN → HAN", time: "11:00", group_cost_usd: 250 },
  ],
  ground_transfers: [
    { name: "HAN airport → Ja Cosmo", cost_usd: 20 },
    { name: "Hanoi → Ninh Binh (limousine)", cost_usd: 60 },
    { name: "Ninh Binh → Ha Long", cost_usd: 70 },
    { name: "Ha Long → Hai Phong airport", cost_usd: 50 },
    { name: "Da Nang airport → Hoi An", cost_usd: 20 },
    { name: "Hoi An → Da Nang", cost_usd: 30 },
    { name: "Da Nang → Da Nang airport", cost_usd: 20 },
    { name: "CXR airport + port + bateau → Whale Island", cost_usd: 80 },
    { name: "Whale Island → port + CXR airport", cost_usd: 80 },
    { name: "SGN airport → Alagon", cost_usd: 20 },
    { name: "Alagon → SGN airport", cost_usd: 20 },
    { name: "HAN airport → Ja Cosmo", cost_usd: 20 },
    { name: "Ja Cosmo → HAN airport", cost_usd: 15 },
  ],
  itinerary_days: [
    {
      date: "2026-07-25",
      city: "Hanoi",
      theme: ["arrivée", "dîner", "repos"],
      blocks: [{ label: "Soir", plan: "Arrivée 19:30, transfert, check-in, dîner simple local, dodo." }],
    },
    {
      date: "2026-07-26",
      city: "Hanoi",
      theme: ["culture", "street-life", "kids"],
      blocks: [
        { label: "Matin", plan: "Old Quarter + lac + cafés." },
        { label: "Aprem", plan: "Sieste / recharge kids." },
        { label: "Soir", plan: "Street food + Water Puppet show (ludique & culturel).", links: ["https://nhahatmuaroithanglong.vn/en/ticket-book/"] },
      ],
    },
    {
      date: "2026-07-27",
      city: "Hanoi",
      theme: ["histoire", "colonial", "esthétique"],
      blocks: [
        { label: "Matin", plan: "Temple of Literature (beau, symbolique)." },
        { label: "Aprem", plan: "Quartier colonial + Opéra (extérieur / zone)." },
        { label: "Soir", plan: "Dîner calme, balade." },
      ],
    },
    {
      date: "2026-07-28",
      city: "Hanoi → Ninh Binh",
      theme: ["histoire", "transfert"],
      blocks: [
        { label: "Matin", plan: "Hoa Lo Prison (fort, bien fait).", links: ["https://hoalo.vn/EN"] },
        { label: "Midi", plan: "Départ limousine vers Ninh Binh + check-in." },
        { label: "Soir", plan: "Rizières au coucher, dîner au calme." },
      ],
    },
    {
      date: "2026-07-29",
      city: "Ninh Binh",
      theme: ["nature", "wow", "boat"],
      blocks: [
        { label: "Matin", plan: "Trang An boat tour (spectaculaire UNESCO).", links: ["https://whc.unesco.org/en/list/1438/"] },
        { label: "Aprem", plan: "Repos + vélo doux si énergie." },
        { label: "Soir", plan: "Dîner local." },
      ],
    },
    {
      date: "2026-07-30",
      city: "Ninh Binh → Ha Long",
      theme: ["nature", "transfert"],
      blocks: [
        { label: "Matin", plan: "Balade courte + café, départ vers Ha Long." },
        { label: "Aprem", plan: "Check-in Wyndham, repos." },
        { label: "Soir", plan: "Seafood + promenade." },
      ],
    },
    {
      date: "2026-07-31",
      city: "Ha Long",
      theme: ["unesco", "cruise"],
      blocks: [
        { label: "Matin", plan: "Transition douce + port." },
        { label: "Midi/Soir", plan: "Embarquement Renea Cruise (Baie / karsts).", links: ["https://whc.unesco.org/en/list/672/"] },
      ],
    },
    {
      date: "2026-08-01",
      city: "Ha Long → Da Nang → Hoi An",
      theme: ["transit", "buffer"],
      blocks: [
        { label: "Matin", plan: "Fin croisière + transfert HPH." },
        { label: "Soir", plan: "Vol HPH 19:00 → DAD, transfert Hoi An, dodo." },
      ],
    },
    {
      date: "2026-08-02",
      city: "Hoi An",
      theme: ["plage", "slow", "night"],
      blocks: [
        { label: "Matin", plan: "Installation + repos." },
        { label: "Aprem", plan: "Plage An Bang." },
        { label: "Soir", plan: "Old Town lanterns + food + flânerie.", links: ["https://whc.unesco.org/en/list/948/"] },
      ],
    },
    {
      date: "2026-08-03",
      city: "Hoi An",
      theme: ["culture", "plage"],
      blocks: [
        { label: "Matin", plan: "Old Town tôt (avant chaleur)." },
        { label: "Aprem", plan: "Plage + sieste." },
        { label: "Soir", plan: "Marché de nuit, desserts." },
      ],
    },
    {
      date: "2026-08-04",
      city: "Hoi An",
      theme: ["local", "cuisine", "kids"],
      blocks: [
        { label: "Matin", plan: "Campagne + cuisine simple (Tra Que vibe)." },
        { label: "Aprem", plan: "Plage." },
        { label: "Soir", plan: "Lanternes + slow." },
      ],
    },
    {
      date: "2026-08-05",
      city: "Hoi An",
      theme: ["libre", "famille"],
      blocks: [{ label: "Journée", plan: "Journée libre: plage, massages, shopping ciblé, repos." }],
    },
    {
      date: "2026-08-06",
      city: "Hoi An → Da Nang",
      theme: ["transfert", "city"],
      blocks: [
        { label: "Matin", plan: "Plage courte, départ." },
        { label: "Aprem", plan: "Check-in Da Nang." },
        { label: "Soir", plan: "Rivière / ponts + dinner." },
      ],
    },
    {
      date: "2026-08-07",
      city: "Da Nang",
      theme: ["culture", "art", "histoire"],
      blocks: [
        { label: "Matin", plan: "Cham Museum (immanquable).", links: ["https://chammuseum.vn/"] },
        { label: "Aprem", plan: "Option Marble Mountains ou repos selon énergie." },
        { label: "Soir", plan: "Seafood + balade." },
      ],
    },
    {
      date: "2026-08-08",
      city: "Da Nang → Whale Island",
      theme: ["early", "nature"],
      blocks: [
        { label: "Très tôt", plan: "Départ aéroport, vol 06:00 DAD→CXR." },
        { label: "Jour", plan: "Transfert port + bateau vers Whale Island, installation." },
      ],
    },
    {
      date: "2026-08-09",
      city: "Whale Island",
      theme: ["nature", "déconnexion"],
      blocks: [{ label: "Journée", plan: "Baignade / snorkeling doux, sieste, coucher de soleil." }],
    },
    {
      date: "2026-08-10",
      city: "Whale Island",
      theme: ["nature", "slow"],
      blocks: [{ label: "Journée", plan: "Marche, plage, lecture, ciel étoilé." }],
    },
    {
      date: "2026-08-11",
      city: "Whale Island",
      theme: ["slow", "famille"],
      blocks: [{ label: "Journée", plan: "Dernier jour complet: photos, repos, mer." }],
    },
    {
      date: "2026-08-12",
      city: "Whale Island → Ho Chi Minh City",
      theme: ["transit"],
      blocks: [{ label: "Jour", plan: "Bateau + transfert CXR, vol 16:00 vers SGN, check-in Alagon." }],
    },
    {
      date: "2026-08-13",
      city: "Ho Chi Minh City",
      theme: ["colonial", "histoire", "fr-vibe"],
      blocks: [
        { label: "Matin", plan: "Post Office + zone coloniale (balade)." },
        { label: "Aprem", plan: "Independence Palace.", links: ["https://dinhdoclap.gov.vn/en/visiting-hours/"] },
        { label: "Soir", plan: "Street food + marche." },
      ],
    },
    {
      date: "2026-08-14",
      city: "Ho Chi Minh City",
      theme: ["histoire", "culture"],
      blocks: [
        { label: "Matin", plan: "War Remnants Museum (à faire si kids OK).", links: ["https://baotangchungtichchientranh.vn/en"] },
        { label: "Aprem", plan: "Cholon / temples / ruelles (incarné)." },
        { label: "Soir", plan: "Dîner simple + retour tôt." },
      ],
    },
    {
      date: "2026-08-15",
      city: "Ho Chi Minh City → Hanoi",
      theme: ["transit"],
      blocks: [
        { label: "Matin", plan: "Vol 11:00 SGN→HAN, check-in Ja Cosmo." },
        { label: "Soir", plan: "Balade douce, shopping ciblé, cafés." },
      ],
    },
    {
      date: "2026-08-16",
      city: "Hanoi",
      theme: ["best-of", "libre"],
      blocks: [{ label: "Journée", plan: "Best-of selon mood: ruelles / cafés / marchés + lac." }],
    },
    {
      date: "2026-08-17",
      city: "Hanoi",
      theme: ["départ"],
      blocks: [
        { label: "Matin", plan: "Derniers cadeaux + café." },
        { label: "Aprem", plan: "Départ aéroport (tampon trafic)." },
        { label: "Soir", plan: "Vol 19:30." },
      ],
    },
  ],
  glossary: [
    { term: "Grab", note: "App voiture/taxi la plus simple. Paiement carte ou cash." },
    { term: "Cash petites coupures", note: "Street food, marchés, petits achats." },
    { term: "Temples / lieux sacrés", note: "Épaules/genoux couverts, ton calme." },
    { term: "Rythme kids", note: "Matin actif / aprem repos / soir doux. Eau + snacks." },
  ],
  food: {
    Hanoi: ["Bún chả", "Phở", "Café à l’œuf"],
    NinhBinh: ["Chèvre (dê)", "Cơm cháy (riz croustillant)"],
    HoiAn_DaNang: ["Cao lầu", "Bánh mì", "White rose", "Mì Quảng"],
    HCMC: ["Cơm tấm", "Bánh xèo", "Hủ tiếu"],
  },
  activities: [
    {
      id: "hoa-lo",
      city: "Hanoi",
      name: "Hoa Lo Prison (ticket)",
      link: "https://hoalo.vn/EN",
      cost: { currency: "VND", adult_vnd: 50000, notes: "Prix publié comme 50,000 VND/person (vérifier sur place). Enfants <15 parfois gratuits." },
      tags: ["histoire", "impact"],
    },
    {
      id: "water-puppets",
      city: "Hanoi",
      name: "Thang Long Water Puppet Show (ticket)",
      link: "https://nhahatmuaroithanglong.vn/en/ticket-book/",
      cost: { currency: "VND", adult_vnd: 150000, notes: "Fourchette souvent 100k–200k VND selon placement." },
      tags: ["culture", "kids-friendly"],
    },
    {
      id: "trang-an",
      city: "Ninh Binh",
      name: "Trang An Boat Tour (ticket)",
      link: "https://whc.unesco.org/en/list/1438/",
      cost: { currency: "VND", adult_vnd: 250000, child_vnd: 120000, notes: "Enfant 1m–1.3m: 120k; >1.3m plein tarif; <1m gratuit." },
      tags: ["nature", "wow"],
    },
    {
      id: "hoi-an-old-town",
      city: "Hoi An",
      name: "Hoi An Ancient Town (ticket)",
      link: "https://whc.unesco.org/en/list/948/",
      cost: { currency: "VND", adult_vnd: 120000, child_vnd: 50000, notes: "Ticket international souvent 120k VND; enfants 1–1.4m 50k (selon barème local)." },
      tags: ["unesco", "lanternes"],
    },
    {
      id: "cham-museum",
      city: "Da Nang",
      name: "Da Nang Museum of Cham Sculpture (ticket)",
      link: "https://chammuseum.vn/",
      cost: { currency: "VND", adult_vnd: 60000, child_vnd: 10000, notes: "Souvent 60k adulte, 10k enfant." },
      tags: ["art", "histoire"],
    },
    {
      id: "marble-mountains",
      city: "Da Nang",
      name: "Marble Mountains (ticket)",
      link: "https://vietnam.travel/things-to-do/around-marble-mountains",
      cost: { currency: "VND", adult_vnd: 40000, notes: "Entrée ~40k; ascenseur ~15k si utilisé." },
      tags: ["nature", "temples"],
    },
    {
      id: "war-remnants",
      city: "Ho Chi Minh City",
      name: "War Remnants Museum (ticket)",
      link: "https://baotangchungtichchientranh.vn/en",
      cost: { currency: "VND", adult_vnd: 40000, child_vnd: 20000, notes: "Adultes 40k; enfants (souvent 6–16) 20k; <6 gratuit (variable)." },
      tags: ["histoire", "impact"],
    },
    {
      id: "independence-palace",
      city: "Ho Chi Minh City",
      name: "Independence Palace (ticket)",
      link: "https://dinhdoclap.gov.vn/en/visiting-hours/",
      cost: { currency: "VND", adult_vnd: 80000, child_vnd: 20000, notes: "Billet général publié (exhibit + palace): adultes 80k; enfants 20k." },
      tags: ["colonial", "histoire"],
    },
  ],
};

// ------------------------------------------------------------
// FAMILY
// ------------------------------------------------------------
const FAMILY_MEMBERS = [
  {
    name: "Marilyne",
    desc: "La Boss",
    color: "bg-pink-100 text-pink-700",
    src: "/family/marilyne.jpg",
    fallback: "https://ui-avatars.com/api/?name=Marilyne&background=fce7f3&color=be185d&size=200",
  },
  {
    name: "Claudine",
    desc: "La Sage",
    color: "bg-indigo-100 text-indigo-700",
    src: "/family/claudine.jpg",
    fallback: "https://ui-avatars.com/api/?name=Claudine&background=e0e7ff&color=4338ca&size=200",
  },
  {
    name: "Nizzar",
    desc: "Le Pilote",
    color: "bg-slate-100 text-slate-700",
    src: "/family/nizzar.jpg",
    fallback: "https://ui-avatars.com/api/?name=Nizzar&background=f1f5f9&color=334155&size=200",
  },
  {
    name: "Aydann",
    desc: "L'Ado",
    color: "bg-blue-100 text-blue-700",
    src: "/family/aydann.jpg",
    fallback: "https://ui-avatars.com/api/?name=Aydann&background=dbeafe&color=1d4ed8&size=200",
  },
  {
    name: "Milann",
    desc: "La Mascotte",
    color: "bg-orange-100 text-orange-700",
    src: "/family/milann.jpg",
    fallback: "https://ui-avatars.com/api/?name=Milann&background=ffedd5&color=c2410c&size=200",
  },
];

// ------------------------------------------------------------
// BON A SAVOIR / ESSENTIELS (1ère personne)
// ------------------------------------------------------------
const ESSENTIALS_CHECKLIST = [
  "Passeports (validité 6 mois)",
  "Trousse pharma (Doliprane, Smecta)",
  "Adaptateur universel",
  "Crème solaire & anti-moustique (tropical)",
  "Dollars / euros (cash secours)",
  "Grab installée",
];

const QUICK_PRICES = [
  { label: "Bière locale", value: "12k–20k VND (bar) • ~50k bouteille" },
  { label: "Plat riz / nouilles", value: "~50k VND (20k–100k selon spot)" },
  { label: "Café", value: "~25k VND (souvent froid)" },
  { label: "Massage", value: "dès ~200k VND" },
  { label: "Scooter (24h)", value: "~180k VND" },
];

const MONEY_TIPS = [
  "Je change sur place (pas avant). Les bijouteries (gold shops) donnent souvent le meilleur taux.",
  "Je privilégie grosses coupures (50–100€) pour un meilleur taux.",
  "Je prévois du cash: restaurants locaux et petits commerces = liquide roi.",
  "ATM: souvent 2–4M VND par retrait + frais (~100k VND).",
  "ATM conseillés: Military Bank (MB) (fréquents et fiables).",
  "Pourboires: pas obligatoires, mais très appréciés.",
  "Marchés: je vérifie le prix avant, et je négocie (c’est attendu).",
];

const STREET_CROSSING = ["Je marche doucement et régulièrement (sans courir).", "Je garde une trajectoire stable: les scooters m’évitent."];

const FIRST_DAY_HANOI = [
  "Lac de l’Épée Restituée (balade, + animé le week-end)",
  "Rue Lan Ông (médecine douce, super photogénique)",
  "Temple de la Littérature (incontournable, ~70k VND)",
  "Rue du train (je vérifie les horaires de passage)",
];

const PRACTICAL_TIPS = [
  "Je télécharge Google Maps + Google Translate + Netflix hors ligne (WiFi parfois faible).",
  "Je prends sandales/tongs faciles: on se déchausse souvent (maisons, temples…).",
  "Je donne/reçois à deux mains (respect).",
  "On me demande mon âge souvent: normal (pour les pronoms honorifiques).",
  "Si on rit de mon accent: je le prends bien, c’est souvent ‘mignon’ et apprécié.",
  "Je me lève tôt: c’est là que la vie locale est la plus belle.",
  "Anti-moustique obligatoire surtout spots végétation (bars/restos).",
];

const AIRPORT_GLOSSARY: AirportGlossaryItem[] = [
  { code: "HAN", city: "Hanoi", airport: "Noi Bai International", fromHotel: "Ja Cosmo (Old Quarter)", eta: "35–50 min", note: "Prévoir marge trafic." },
  { code: "HPH", city: "Hai Phong", airport: "Cat Bi International", fromHotel: "Ha Long (Bai Chay)", eta: "55–75 min", note: "Selon horaire." },
  { code: "DAD", city: "Da Nang", airport: "Da Nang International", fromHotel: "Da Nang centre", eta: "10–20 min" },
  { code: "DAD", city: "Da Nang", airport: "Da Nang International", fromHotel: "Hoi An (An Bang)", eta: "45–60 min" },
  { code: "CXR", city: "Cam Ranh", airport: "Cam Ranh International", fromHotel: "Port / transfert Whale Island", eta: "45–75 min", note: "Inclut route jusqu’au port selon point exact." },
  { code: "SGN", city: "Ho Chi Minh City", airport: "Tan Son Nhat International", fromHotel: "District 1 (Alagon)", eta: "20–40 min", note: "Trafic variable (fort en fin d’aprem)." },
];

const PHRASEBOOK: PhraseItem[] = [
  { fr: "Bonjour", vi: "Xin chào", phon: "sin tcha-o" },
  { fr: "Merci", vi: "Cảm ơn", phon: "kam eune" },
  { fr: "S'il vous plaît", vi: "Làm ơn", phon: "lam eune" },
  { fr: "Oui / Non", vi: "Vâng / Không", phon: "veung / kong" },
  { fr: "Combien ça coûte ?", vi: "Bao nhiêu tiền?", phon: "bao ni-eu tiène" },
  { fr: "Trop cher", vi: "Đắt quá", phon: "dat kwa" },
  { fr: "Je veux ça", vi: "Tôi muốn cái này", phon: "toy mouon kaï naï" },
  { fr: "Addition", vi: "Tính tiền", phon: "tinh tiène" },
  { fr: "Eau", vi: "Nước", phon: "nouok" },
  { fr: "Sans piment", vi: "Không cay", phon: "kong kaï" },
  { fr: "Toilettes ?", vi: "Nhà vệ sinh ở đâu?", phon: "nia ve sin eu da-ou" },
];

// ------------------------------------------------------------
// HELPERS
// ------------------------------------------------------------
const formatUSD = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const formatVND = (n: number) => n.toLocaleString("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });
const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
const safeDateLabel = (iso: string) => new Date(iso).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });
const toISO = (d: Date) => d.toISOString().slice(0, 10);
const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

const cityKeyFromName = (city: string) => {
  if (city.includes("Hanoi")) return "Hanoi";
  if (city.includes("Ninh Binh")) return "NinhBinh_TrangAn";
  if (city.includes("Ha Long")) return "HaLong";
  if (city.includes("Hoi An")) return "HoiAn";
  if (city.includes("Da Nang")) return "DaNang";
  if (city.includes("Ho Chi Minh")) return "HCMC";
  return "Hanoi";
};

// ------------------------------------------------------------
// COVERS (Focus du jour / Itinéraire)
// ------------------------------------------------------------
const MOMENT_COVERS: Record<string, string> = {
  arrival: "/covers/moments/arrival.jpg",
  transfer: "/covers/moments/transfer.jpg",
  plane: "/covers/moments/plane.jpg",
  boat: "/covers/moments/boat.jpg",
  beach: "/covers/moments/beach.jpg",
  night: "/covers/moments/night.jpg",
  market: "/covers/moments/market.jpg",
  coffee: "/covers/moments/coffee.jpg",
  streetfood: "/covers/moments/streetfood.jpg",
  museum: "/covers/moments/museum.jpg",
  temple: "/covers/moments/temple.jpg",
  massage: "/covers/moments/massage.jpg",
  family: "/covers/moments/family.jpg",
  love: "/covers/moments/love.jpg",
};

const momentCoverFromText = (text: string) => {
  const t = text.toLowerCase();
  if (t.includes("vol") || t.includes("aéroport") || t.includes("airport") || t.includes("flight")) return MOMENT_COVERS.plane;
  if (t.includes("bateau") || t.includes("croisi") || t.includes("cruise") || t.includes("boat")) return MOMENT_COVERS.boat;
  if (t.includes("plage") || t.includes("beach")) return MOMENT_COVERS.beach;
  if (t.includes("marché") || t.includes("marche") || t.includes("market")) return MOMENT_COVERS.market;
  if (t.includes("café") || t.includes("cafe") || t.includes("coffee")) return MOMENT_COVERS.coffee;
  if (t.includes("street food") || t.includes("street-food") || t.includes("streetfood") || t.includes("food") || t.includes("dîner") || t.includes("diner")) return MOMENT_COVERS.streetfood;
  if (t.includes("musée") || t.includes("musee") || t.includes("museum")) return MOMENT_COVERS.museum;
  if (t.includes("temple")) return MOMENT_COVERS.temple;
  if (t.includes("massage")) return MOMENT_COVERS.massage;
  if (t.includes("arrivée") || t.includes("arrivee") || t.includes("check-in") || t.includes("check in") || t.includes("arrival")) return MOMENT_COVERS.arrival;
  if (t.includes("transfert") || t.includes("transfer") || t.includes("limousine") || t.includes("drive")) return MOMENT_COVERS.transfer;
  if (t.includes("soir") || t.includes("night") || t.includes("lantern")) return MOMENT_COVERS.night;
  return null;
};

const dayCoverFromDay = (day: ItineraryDay) => {
  const text = (day.theme?.join(" ") ?? "") + " " + (day.blocks?.map((b) => b.plan).join(" ") ?? "");
  // Cover de ville en priorité
  const cityCover = cityCoverFromLabel(day.city);
  // Moments uniquement pour les jours de transit pur (ville contient →)
  if (day.city.includes("\u2192")) {
    const moment = momentCoverFromText(text);
    if (moment) return moment;
  }
  return cityCover;
}

const googleMapsSearchUrl = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

const uniqCitiesByOrder = (days: ItineraryDay[]) => {
  const out: string[] = [];
  for (const d of days) {
    const base = d.city.split("→").map((s) => s.trim())[0];
    if (!out.includes(base)) out.push(base);
  }
  return out;
};

// ------------------------------------------------------------
// UI ATOMS V2
// ------------------------------------------------------------
const Glass = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`backdrop-blur-xl bg-white/70 border border-white/40 shadow-xl overflow-hidden ${className}`}>
    {children}
  </div>
);

const Pill = ({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: ReactNode;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-2xl text-xs font-bold transition-all ${
      active
        ? "bg-slate-900 text-white shadow-lg scale-105"
        : "bg-white text-slate-500 hover:bg-slate-100 border border-slate-200"
    }`}
  >
    {children}
  </button>
);

const Toggle = ({
  label,
  icon,
  value,
  onChange,
  hint,
}: {
  label: string;
  icon?: ReactNode;
  value: boolean;
  onChange: (v: boolean) => void;
  hint?: string;
}) => (
  <div className="flex items-center justify-between p-4 rounded-3xl bg-slate-50 border border-slate-100 shadow-sm">
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-2xl bg-white shadow-sm text-slate-600">
        {icon}
      </div>
      <div>
        <p className="text-sm font-extrabold text-slate-900">{label}</p>
        {hint && <p className="text-[10px] text-slate-500 font-medium">{hint}</p>}
      </div>
    </div>
    <button
      onClick={() => onChange(!value)}
      className={`w-12 h-7 rounded-full p-1 transition-colors ${
        value ? "bg-emerald-500" : "bg-slate-200"
      }`}
      aria-label={label}
    >
      <div
        className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
          value ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  </div>
);

const MoodSelector = ({
  currentMood,
  setMood,
}: {
  currentMood: Mood;
  setMood: (m: Mood) => void;
}) => {
  return (
    <div className="flex bg-slate-100 p-1 rounded-2xl gap-1">
      <button
        onClick={() => setMood("fatigue")}
        className={`px-3 py-1.5 rounded-full flex items-center gap-1 text-xs font-semibold transition-all ${
          currentMood === "fatigue"
            ? "bg-indigo-100 text-indigo-700 shadow-sm"
            : "text-slate-500 hover:text-slate-700"
        }`}
      >
        Repos
      </button>
      <button
        onClick={() => setMood("normal")}
        className={`px-3 py-1.5 rounded-full flex items-center gap-1 text-xs font-semibold transition-all ${
          currentMood === "normal"
            ? "bg-emerald-100 text-emerald-700 shadow-sm"
            : "text-slate-500 hover:text-slate-700"
        }`}
      >
        Normal
      </button>
      <button
        onClick={() => setMood("energy")}
        className={`px-3 py-1.5 rounded-full flex items-center gap-1 text-xs font-semibold transition-all ${
          currentMood === "energy"
            ? "bg-amber-100 text-amber-700 shadow-sm"
            : "text-slate-500 hover:text-slate-700"
        }`}
      >
        ⚡ Énergie
      </button>
    </div>
  );
};

const FamilyStrip = () => (
  <div className="flex -space-x-3 overflow-hidden p-2">
    {FAMILY_MEMBERS.map((m) => (
      <div key={m.name} className="group relative">
        <img
          src={P(m.src)}
          alt={m.name}
          className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-md transition-transform group-hover:scale-110"
          onError={(e) => {
            // fallback "safe"
            e.currentTarget.src = m.fallback;
          }}
        />
        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white flex items-center justify-center shadow-sm">
          <div className={`w-2.5 h-2.5 rounded-full ${m.color.split(" ")[0]}`} />
        </div>
      </div>
    ))}
  </div>
);

const CinemaHero = ({
  onOpenQuick,
  activeCity,
  coverSrc,
}: {
  onOpenQuick: () => void;
  activeCity: string;
  coverSrc?: string;
}) => {
  const key = cityKeyFromName(activeCity);
  const hero = TRIP_DATA.hero_images[key];
  const src = coverSrc || hero?.src;

  return (
    <div className="relative h-[80vh] w-full bg-slate-900">
      <img
        src={src}
        alt="Hero"
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-slate-900" />

      <div className="absolute top-12 left-0 right-0 px-6 flex justify-between items-start pointer-events-none">
        <div className="pointer-events-auto">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 mb-1">
            24 Juil → 18 Août
          </p>
          <h1 className="text-4xl font-black text-white leading-none">
            Vietnam <span className="text-emerald-400">2026</span>
          </h1>
        </div>
        <button
          onClick={onOpenQuick}
          className="pointer-events-auto w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white"
        >
          <Search size={20} />
        </button>
      </div>

      <div className="absolute bottom-10 left-0 right-0 px-6">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 mb-2">
          Family Trip
        </p>
        <h2 className="text-6xl font-black text-white leading-none mb-6">
          VIETNAM
        </h2>

        <div className="flex flex-wrap gap-2 mb-8">
          {TRIP_DATA.meta.vibe.map((v) => (
            <span
              key={v}
              className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white uppercase tracking-wider"
            >
              {v}
            </span>
          ))}
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-bold text-white/60 mb-1">Focus du moment :</p>
            <p className="text-2xl font-black text-white tracking-tight italic">
              {activeCity}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
             <FamilyStrip />
          </div>
        </div>
      </div>
    </div>
  );
};

const QuickSheet = ({
  open,
  onClose,
  onGoto,
}: {
  open: boolean;
  onClose: () => void;
  onGoto: (v: View) => void;
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-xl p-8 flex flex-col">
      <div className="flex justify-between items-center mb-12">
        <h3 className="text-3xl font-black text-white">Quick Actions</h3>
        <button
          onClick={onClose}
          className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white"
        >
          <X size={24} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => { onGoto("tips"); onClose(); }}
          className="p-6 rounded-3xl bg-indigo-500 text-white text-left aspect-square flex flex-col justify-between"
        >
          <Lightbulb size={32} />
          <div>
            <p className="font-black text-lg leading-tight mb-1">Bon à savoir</p>
            <p className="text-xs font-medium text-white/70">Checklist + Argent</p>
          </div>
        </button>

        <button
          onClick={() => { onGoto("guide"); onClose(); }}
          className="p-6 rounded-3xl bg-emerald-500 text-white text-left aspect-square flex flex-col justify-between"
        >
          <Utensils size={32} />
          <div>
            <p className="font-black text-lg leading-tight mb-1">Food + Logistique</p>
            <p className="text-xs font-medium text-white/70">Aéroports + Plats</p>
          </div>
        </button>

        <a
          href={googleMapsSearchUrl("Grab")}
          target="_blank"
          rel="noopener noreferrer"
          className="p-6 rounded-3xl bg-slate-100 text-slate-900 text-left aspect-square flex flex-col justify-between"
        >
          <Navigation size={32} />
          <div>
            <p className="font-black text-lg leading-tight mb-1">Grab (rappel)</p>
            <p className="text-xs font-medium text-slate-500">Taxi & Food</p>
          </div>
        </a>

        <button
          onClick={() => { onGoto("budget"); onClose(); }}
          className="p-6 rounded-3xl bg-amber-500 text-white text-left aspect-square flex flex-col justify-between"
        >
          <Wallet size={32} />
          <div>
            <p className="font-black text-lg leading-tight mb-1">Budget</p>
            <p className="text-xs font-medium text-white/70">Totaux + Tickets</p>
          </div>
        </button>
      </div>

      <div className="mt-auto">
        <p className="text-center text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">
          Vietnam Trip 2026 — Hub Mobile
        </p>
      </div>
    </div>
  );
};

const CityTimeline = ({
  cities,
  activeCity,
  onSelect,
}: {
  cities: string[];
  activeCity: string;
  onSelect: (c: string) => void;
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-4 px-6 no-scrollbar">
      {cities.map((c) => (
        <button
          key={c}
          onClick={() => onSelect(c)}
          className={`whitespace-nowrap px-6 py-3 rounded-full text-sm font-black transition-all ${
            activeCity === c
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 -rotate-2"
              : "bg-white text-slate-400 border border-slate-100"
          }`}
        >
          {c}
        </button>
      ))}
    </div>
  );
};

const DayCardMobile = ({
  day,
  coverSrc,
  mood,
  isFav,
  onFav,
  kidsMode,
}: {
  day: ItineraryDay;
  coverSrc: string;
  mood: Mood;
  isFav: boolean;
  onFav: () => void;
  kidsMode: boolean;
}) => {
  const isFatigue = mood === "fatigue";

  const shouldHideImpact = (text: string) => {
    const t = text.toLowerCase();
    return (
      t.includes("prison") ||
      t.includes("war") ||
      t.includes("remnants") ||
      t.includes("impact") ||
      t.includes("fort")
    );
  };

  return (
    <div className="group relative w-full mb-8 last:mb-0">
      <div className="relative h-64 rounded-[40px] overflow-hidden shadow-2xl">
        <img
          src={coverSrc}
          alt={day.city}
          className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110 duration-700"
          onError={(e) => {
            // fallback "safe" si un path est faux
            e.currentTarget.src = ASSETS.covers.sections.itinerary;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
        <div className="absolute bottom-8 left-8 right-8">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={12} className="text-emerald-400" />
            <p className="text-[10px] font-black text-white/80 uppercase tracking-widest">
              {safeDateLabel(day.date)}
            </p>
          </div>
          <h4 className="text-2xl font-black text-white tracking-tighter mb-4 leading-none">
            {day.city}
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {day.theme.map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[8px] font-black text-white uppercase tracking-wider"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 px-4 space-y-4">
        {day.blocks.map((b, idx) => {
          if (isFatigue && b.label === "Soir" && !b.plan.toLowerCase().includes("repos")) {
            return (
              <div key={idx} className="p-4 rounded-3xl bg-indigo-50/50 border border-indigo-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <Moon size={16} />
                </div>
                <p className="text-xs font-bold text-indigo-700 italic">
                  Repos suggéré ce soir 😴
                </p>
              </div>
            );
          }

          if (kidsMode && shouldHideImpact(b.plan)) {
            return (
               <div key={idx} className="p-4 rounded-3xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-400">
                  <Shield size={16} />
                </div>
                <p className="text-xs font-bold text-slate-500 italic">
                  Contenu masqué (Mode Kids)
                </p>
              </div>
            );
          }

          return (
            <div key={idx} className="relative pl-6 border-l-2 border-slate-100">
              <div className="absolute top-0 left-[-5px] w-2 h-2 rounded-full bg-slate-200" />
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                {b.label}
              </p>
              <p className="text-sm font-bold text-slate-800 leading-relaxed">
                {b.plan}
              </p>
              {b.links?.length ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {b.links.map((l, i) => (
                    <a
                      key={i}
                      href={l}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-[10px] font-extrabold text-slate-600"
                    >
                      <Info size={10} />
                      Info
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {mood === "energy" && (
        <div className="mt-6 mx-4 p-4 rounded-3xl bg-amber-50 border border-amber-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
            <Sparkles size={16} />
          </div>
          <p className="text-xs font-bold text-amber-800">
            Énergie au max : on explore un café caché !
          </p>
        </div>
      )}
    </div>
  );
};

const HotelCard = ({ hotel }: { hotel: HotelItem }) => {
  const link = hotel.booking_url || hotel.official_url;

  return (
    <div className="group bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden mb-8">
      <div className="relative h-48 overflow-hidden">
        {hotel.cover ? (
          <img
            src={P(hotel.cover)}
            alt={hotel.name}
            className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700"
            onError={(e) => {
               e.currentTarget.src = ASSETS.covers.sections.hotels;
            }}
          />
        ) : (
          <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
             <Hotel size={48} />
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-[10px] font-black text-white uppercase tracking-widest">
            {hotel.city}
          </span>
        </div>
      </div>

      <div className="p-8">
        <h4 className="text-2xl font-black text-slate-900 tracking-tighter mb-1">
          {hotel.name}
        </h4>
        <div className="flex items-center gap-2 text-indigo-600 mb-6">
          <Calendar size={14} />
          <p className="text-xs font-black">{hotel.dates}</p>
        </div>

        {hotel.note && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 text-[10px] font-bold text-amber-800 mb-6 leading-relaxed">
            {hotel.note}
          </div>
        )}

        <p className="text-sm font-bold text-slate-500 italic mb-8">
          “{hotel.why}”
        </p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100">
            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Famille</p>
            <p className="text-lg font-black text-slate-900 leading-none">
              {formatUSD(hotel.budget.us)}
            </p>
          </div>
          <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100">
            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Claudine</p>
            <p className="text-lg font-black text-slate-900 leading-none">
              {formatUSD(hotel.budget.claudine)}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {link ? (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-3xl bg-indigo-600 text-white text-xs font-black shadow-lg shadow-indigo-100 hover:scale-[1.02] transition-transform"
            >
              <Navigation size={14} />
              Voir Résa
            </a>
          ) : (
             <div className="flex-1 py-4 rounded-3xl bg-slate-100 text-slate-400 text-xs font-black text-center italic">
               Pas de lien
             </div>
          )}
          <a
            href={googleMapsSearchUrl(hotel.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 flex items-center justify-center rounded-3xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <MapPin size={20} />
          </a>
        </div>
      </div>
    </div>
  );
};

const TipsChecklist = () => {
  const [checked, setChecked] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("trip_tips_checklist");
    if (saved) setChecked(JSON.parse(saved));
  }, []);

  const toggle = (item: string) => {
    const next = checked.includes(item)
      ? checked.filter((i) => i !== item)
      : [...checked, item];
    setChecked(next);
    localStorage.setItem("trip_tips_checklist", JSON.stringify(next));
  };

  const progress = Math.round((checked.length / ESSENTIALS_CHECKLIST.length) * 100);

  return (
    <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl p-8">
      <div className="flex justify-between items-end mb-8">
        <h4 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">Essentiels</h4>
        <p className="text-xs font-black text-emerald-500 uppercase tracking-widest">{progress}% prêt</p>
      </div>
      <div className="space-y-3">
        {ESSENTIALS_CHECKLIST.map((item) => (
          <button
            key={item}
            onClick={() => toggle(item)}
            className="w-full flex items-center gap-4 p-4 rounded-3xl border border-slate-50 bg-slate-50/50 transition-all active:scale-95"
          >
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
              checked.includes(item) ? "bg-emerald-500 border-emerald-500" : "border-slate-200"
            }`}>
              {checked.includes(item) && <CheckSquare size={14} className="text-white" />}
            </div>
            <p className={`text-sm font-bold ${checked.includes(item) ? "text-slate-400 line-through" : "text-slate-700"}`}>
              {item}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

const SimpleListCard = ({ title, icon, items }: { title: string; icon: ReactNode; items: string[] }) => (
  <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl p-8 mb-8">
    <div className="flex items-center gap-3 mb-8">
      <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
        {icon}
      </div>
      <h4 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{title}</h4>
    </div>
    <div className="space-y-4">
      {items.map((t, i) => (
        <div key={i} className="flex gap-4">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
          <p className="text-sm font-bold text-slate-700 leading-relaxed">{t}</p>
        </div>
      ))}
    </div>
  </div>
);

const PhrasebookCard = () => (
  <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl p-8 mb-8">
    <div className="flex items-center gap-3 mb-8">
      <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
        <Languages size={24} />
      </div>
      <h4 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">Mots utiles</h4>
    </div>
    <div className="space-y-6">
      {PHRASEBOOK.map((p) => (
        <div key={p.fr}>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{p.fr}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-lg font-black text-slate-900">{p.vi}</p>
            <p className="text-xs font-bold text-emerald-500 italic">• {p.phon}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const AirportGlossary = () => (
  <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl p-8 mb-8">
    <div className="flex items-center gap-3 mb-2">
      <div className="p-3 rounded-2xl bg-amber-50 text-amber-600">
        <Plane size={24} />
      </div>
      <h4 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">Aéroports</h4>
    </div>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">Codes + trajets estimés</p>

    <div className="space-y-8">
      {AIRPORT_GLOSSARY.map((a, i) => (
        <div key={i} className="relative pl-6 border-l-2 border-slate-100">
          <div className="absolute top-0 left-[-5px] w-2 h-2 rounded-full bg-slate-200" />
          <div className="flex items-baseline gap-2 mb-1">
             <span className="text-lg font-black text-slate-900 tracking-tight">{a.code}</span>
             <span className="text-xs font-bold text-indigo-500 italic">• {a.city}</span>
          </div>
          <p className="text-xs font-bold text-slate-600 mb-2">{a.airport}</p>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Depuis hôtel</p>
            <p className="text-[10px] font-bold text-slate-700 leading-tight">{a.fromHotel}</p>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-[9px] font-black text-slate-400 uppercase">Trajet</p>
              <p className="text-xs font-black text-emerald-600 uppercase tracking-tighter">{a.eta}</p>
            </div>
            {a.note && <p className="mt-2 text-[9px] font-bold text-amber-600 italic">! {a.note}</p>}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ------------------------------------------------------------
// APP
// ------------------------------------------------------------
export default function App() {
  const [view, setView] = useState<View>("home");
  const [mood, setMood] = useState<Mood>("normal");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [kidsMode, setKidsMode] = useState(false);
  const [cinemaMode, setCinemaMode] = useState(true);
  const [quickOpen, setQuickOpen] = useState(false);
  const [vndPerUsd, setVndPerUsd] = useState(26000);
  const [includeActivities, setIncludeActivities] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");

  const cities = useMemo(() => uniqCitiesByOrder(TRIP_DATA.itinerary_days), []);
  const [activeCity, setActiveCity] = useState(cities[0] || "Hanoi");

  const todayISO = toISO(new Date());
  const tripStart = TRIP_DATA.itinerary_days[0]?.date;
  const tripEnd = TRIP_DATA.itinerary_days[TRIP_DATA.itinerary_days.length - 1]?.date;
  const isWithinTrip = tripStart && tripEnd ? (todayISO >= tripStart && todayISO <= tripEnd) : false;

  const todayIndex = useMemo(() => {
    const idx = TRIP_DATA.itinerary_days.findIndex((d) => d.date === todayISO);
    return idx >= 0 ? idx : 0;
  }, [todayISO]);

  const [focusDayIndex, setFocusDayIndex] = useState(todayIndex);

  // Sync localStorage
  useEffect(() => {
    const savedFavs = localStorage.getItem("trip_favs");
    if (savedFavs) setFavorites(JSON.parse(savedFavs));
    const savedRate = localStorage.getItem("trip_vnd_per_usd");
    if (savedRate) setVndPerUsd(Number(savedRate));
    const savedAct = localStorage.getItem("trip_activities_toggle");
    if (savedAct) setIncludeActivities(JSON.parse(savedAct));
    const savedKids = localStorage.getItem("trip_kids_mode");
    if (savedKids) setKidsMode(savedKids === "1");
    const savedCinema = localStorage.getItem("trip_cinema_mode");
    if (savedCinema) setCinemaMode(savedCinema === "1");
    const savedCity = localStorage.getItem("trip_active_city");
    if (savedCity) setActiveCity(savedCity);
    const savedFocus = localStorage.getItem("trip_focus_day");
    if (savedFocus) setFocusDayIndex(Number(savedFocus));
  }, []);

  useEffect(() => localStorage.setItem("trip_vnd_per_usd", String(vndPerUsd)), [vndPerUsd]);
  useEffect(() => localStorage.setItem("trip_activities_toggle", JSON.stringify(includeActivities)), [includeActivities]);
  useEffect(() => localStorage.setItem("trip_kids_mode", kidsMode ? "1" : "0"), [kidsMode]);
  useEffect(() => localStorage.setItem("trip_cinema_mode", cinemaMode ? "1" : "0"), [cinemaMode]);
  useEffect(() => localStorage.setItem("trip_active_city", activeCity), [activeCity]);
  useEffect(() => localStorage.setItem("trip_focus_day", String(focusDayIndex)), [focusDayIndex]);

  const toggleFavorite = (id: string) => {
    const next = favorites.includes(id) ? favorites.filter((f) => f !== id) : [...favorites, id];
    setFavorites(next);
    localStorage.setItem("trip_favs", JSON.stringify(next));
  };

  // Filters
  const filteredDays = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return TRIP_DATA.itinerary_days;
    return TRIP_DATA.itinerary_days.filter((d) => {
      const blob = (d.city + " " + d.theme.join(" ") + " " + d.blocks.map((b) => b.plan).join(" ")).toLowerCase();
      return blob.includes(q);
    });
  }, [search]);

  // Budget calculations
  const budgetSplit = useMemo(() => {
    const adults = TRIP_DATA.meta.travelers_count.adults;
    const kids = TRIP_DATA.meta.travelers_count.kids;
    
    const RATIO_FAM = 0.8;
    const RATIO_CLAU = 0.2;

    const hotelsFam = sum(TRIP_DATA.hotels.map((h) => h.budget.us));
    const hotelsClaudine = sum(TRIP_DATA.hotels.map((h) => h.budget.claudine));

    const flightsTotal = sum(TRIP_DATA.internal_flights.map((f) => f.group_cost_usd));
    const transfersTotal = sum(TRIP_DATA.ground_transfers.map((t) => t.cost_usd));

    const flightsFam = flightsTotal * RATIO_FAM;
    const flightsClaudine = flightsTotal * RATIO_CLAU;
    const transfersFam = transfersTotal * RATIO_FAM;
    const transfersClaudine = transfersTotal * RATIO_CLAU;

    const claudineActUsd = sum(
      TRIP_DATA.activities.map((a) => {
        const enabled = includeActivities[a.id] ?? true;
        if (!enabled || !a.cost) return 0;
        if (kidsMode && a.tags?.includes("impact")) return 0;
        return a.cost.adult_vnd / vndPerUsd;
      })
    );

    const famActUsd = sum(
      TRIP_DATA.activities.map((a) => {
        const enabled = includeActivities[a.id] ?? true;
        if (!enabled || !a.cost) return 0;
        if (kidsMode && a.tags?.includes("impact")) return 0;
        const famAdults = adults - 1;
        const famKids = kids;
        const childVnd = a.cost.child_vnd ?? a.cost.adult_vnd;
        const groupVnd = (a.cost.adult_vnd * famAdults) + (childVnd * famKids);
        return groupVnd / vndPerUsd;
      })
    );

    return {
      fam: {
        hotels: hotelsFam,
        flights: flightsFam,
        transfers: transfersFam,
        activities: famActUsd,
        total: hotelsFam + flightsFam + transfersFam + famActUsd,
      },
      claudine: {
        hotels: hotelsClaudine,
        flights: flightsClaudine,
        transfers: transfersClaudine,
        activities: claudineActUsd,
        total: hotelsClaudine + flightsClaudine + transfersClaudine + claudineActUsd,
      },
    };
  }, [includeActivities, vndPerUsd, kidsMode]);

  // UI Tabs
  const TabsList = [
    { id: "home", icon: Star, label: "Home" },
    { id: "itinerary", icon: Calendar, label: "Itinéraire" },
    { id: "hotels", icon: Hotel, label: "Hôtels" },
    { id: "guide", icon: Utensils, label: "Guide" },
    { id: "tips", icon: Lightbulb, label: "Tips" },
    { id: "budget", icon: Wallet, label: "Budget" },
  ] as const;

  // Home logic
  const focusDay = TRIP_DATA.itinerary_days[clamp(focusDayIndex, 0, TRIP_DATA.itinerary_days.length - 1)];

  const setCityFromFocus = () => {
    const base = focusDay.city.split("→").map((s) => s.trim())[0];
    setActiveCity(base);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-32 overflow-x-hidden select-none">
      <QuickSheet open={quickOpen} onClose={() => setQuickOpen(false)} onGoto={(v) => setView(v)} />

      {/* HOME VIEW */}
      {view === "home" && (
        <div className="animate-in fade-in duration-500">
          <CinemaHero
            onOpenQuick={() => setQuickOpen(true)}
            activeCity={activeCity}
            coverSrc={cityCoverFromLabel(activeCity)}
          />

          <div className="relative -mt-10 px-6 space-y-8">
            <Glass className="rounded-[40px] p-8 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                <p className="text-sm font-black text-slate-900 leading-none">
                  {isWithinTrip ? "Trip en cours 🇻🇳" : "En préparation 📝"}
                </p>
              </div>
              <button
                onClick={() => setView("itinerary")}
                className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg"
              >
                <ChevronRight size={24} />
              </button>
            </Glass>

            <div className="grid grid-cols-1 gap-4">
              <Toggle
                label="Mode Kids"
                icon={<Smartphone size={20} />}
                value={kidsMode}
                onChange={setKidsMode}
                hint="Masque les contenus ‘impact’."
              />
            </div>

            <div>
               <div className="flex justify-between items-end mb-6">
                <div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Équipage</h3>
                  <p className="text-xs font-bold text-slate-400 tracking-tight italic">Les aventuriers</p>
                </div>
              </div>
              <FamilyStrip />
            </div>

            <div>
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tighter leading-none mb-1">Focus Jour</h3>
                  <p className="text-xs font-bold text-slate-400 italic"> Swipe mental</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFocusDayIndex(i => clamp(i - 1, 0, TRIP_DATA.itinerary_days.length - 1))}
                    className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setFocusDayIndex(i => clamp(i + 1, 0, TRIP_DATA.itinerary_days.length - 1))}
                    className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              <div className="overflow-hidden">
                <div className="flex transition-transform duration-500">
                  <div className="w-full shrink-0">
                    <DayCardMobile
                      day={focusDay}
                      coverSrc={dayCoverFromDay(focusDay)}
                      mood={mood}
                      isFav={favorites.includes(focusDay.date)}
                      onFav={() => toggleFavorite(focusDay.date)}
                      kidsMode={kidsMode}
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={() => { setCityFromFocus(); setView("itinerary"); }}
                className="w-full py-5 rounded-[32px] bg-slate-100 text-slate-600 text-xs font-black uppercase tracking-widest mt-4"
              >
                Explorer cet itinéraire
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 pb-12">
               <button
                  onClick={() => setView("tips")}
                  className="p-6 rounded-[40px] bg-indigo-50 border border-indigo-100 text-left"
               >
                  <Lightbulb size={24} className="text-indigo-500 mb-4" />
                  <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Conseils</p>
                  <p className="text-[10px] font-bold text-indigo-400">Argent & Culture</p>
               </button>
               <button
                  onClick={() => setView("budget")}
                  className="p-6 rounded-[40px] bg-amber-50 border border-amber-100 text-left"
               >
                  <Wallet size={24} className="text-amber-500 mb-4" />
                  <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Budget</p>
                  <p className="text-[10px] font-bold text-amber-400">Totaux & Taux</p>
               </button>
            </div>
          </div>
        </div>
      )}

      {/* ITINERARY VIEW */}
      {view === "itinerary" && (
        <div className="animate-in slide-in-from-bottom duration-500 px-6 pt-12">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-1">Itinéraire</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Carte par carte</p>
            </div>
            <button
              onClick={() => setView("home")}
              className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mb-10">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-2">Filtrer par ville</p>
            <CityTimeline
              cities={cities}
              activeCity={activeCity}
              onSelect={setActiveCity}
            />
          </div>

          <div className="space-y-12 pb-20">
            {TRIP_DATA.itinerary_days
              .filter(d => d.city.toLowerCase().includes(activeCity.toLowerCase()))
              .map((day) => (
                <DayCardMobile
                  key={day.date}
                  day={day}
                  coverSrc={dayCoverFromDay(day)}
                  mood={mood}
                  isFav={favorites.includes(day.date)}
                  onFav={() => toggleFavorite(day.date)}
                  kidsMode={kidsMode}
                />
              ))}
          </div>
        </div>
      )}

      {/* HOTELS VIEW */}
      {view === "hotels" && (
        <div className="animate-in slide-in-from-bottom duration-500 px-6 pt-12">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-1">Hôtels</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Le repos du guerrier</p>
            </div>
            <button
              onClick={() => setView("home")}
              className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400"
            >
              <X size={20} />
            </button>
          </div>

          <div className="pb-20">
            {TRIP_DATA.hotels.map((h, i) => (
              <HotelCard key={i} hotel={h} />
            ))}
          </div>
        </div>
      )}

      {/* GUIDE VIEW */}
      {view === "guide" && (
        <div className="animate-in slide-in-from-bottom duration-500 px-6 pt-12">
           <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-1">Guide</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Food & Logistique</p>
            </div>
            <button
              onClick={() => setView("home")}
              className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400"
            >
              <X size={20} />
            </button>
          </div>

          <SimpleListCard
            title="Miam Miam"
            icon={<Utensils size={24} />}
            items={Object.entries(TRIP_DATA.food).map(([r, f]) => `${r}: ${f.join(", ")}`)}
          />

          <AirportGlossary />

          <SimpleListCard
            title="Transport"
            icon={<Navigation size={24} />}
            items={TRIP_DATA.internal_flights.map(f => `${f.route} • ${f.time} • $${f.group_cost_usd}`)}
          />

          <PhrasebookCard />
        </div>
      )}

      {/* TIPS VIEW */}
      {view === "tips" && (
        <div className="animate-in slide-in-from-bottom duration-500 px-6 pt-12">
           <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-1">Conseils</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Argent & Culture</p>
            </div>
            <button
              onClick={() => setView("home")}
              className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400"
            >
              <X size={20} />
            </button>
          </div>

          <TipsChecklist />
          <div className="h-8" />
          <SimpleListCard title="Argent" icon={<Wallet size={24} />} items={MONEY_TIPS} />
          <SimpleListCard title="Culture" icon={<Info size={24} />} items={PRACTICAL_TIPS} />
        </div>
      )}

      {/* BUDGET VIEW */}
      {view === "budget" && (
        <div className="animate-in slide-in-from-bottom duration-500 px-6 pt-12">
           <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-1">Budget</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Vietnam 2026</p>
            </div>
            <button
              onClick={() => setView("home")}
              className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6 pb-20">
             <Glass className="rounded-[40px] p-8">
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Total Famille</p>
                <p className="text-5xl font-black text-slate-900 tracking-tighter mb-4">
                  {formatUSD(budgetSplit.fam.total)}
                </p>
                <div className="grid grid-cols-2 gap-y-4">
                   <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase">Hôtels</p>
                      <p className="text-sm font-black text-slate-800">{formatUSD(budgetSplit.fam.hotels)}</p>
                   </div>
                   <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase">Vols</p>
                      <p className="text-sm font-black text-slate-800">{formatUSD(budgetSplit.fam.flights)}</p>
                   </div>
                   <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase">Transferts</p>
                      <p className="text-sm font-black text-slate-800">{formatUSD(budgetSplit.fam.transfers)}</p>
                   </div>
                </div>
             </Glass>

             <Glass className="rounded-[40px] p-8 border-indigo-100 bg-indigo-50/30">
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Total Claudine</p>
                <p className="text-4xl font-black text-slate-900 tracking-tighter mb-4">
                  {formatUSD(budgetSplit.claudine.total)}
                </p>
             </Glass>

             <div className="p-8 rounded-[40px] bg-slate-100 border border-slate-200">
                <p className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                   <Banknote size={16} /> Taux de change
                </p>
                <div className="flex items-center gap-4">
                   <input
                      type="number"
                      value={vndPerUsd}
                      onChange={(e) => setVndPerUsd(Number(e.target.value))}
                      className="bg-white px-6 py-4 rounded-3xl border border-slate-200 w-full text-lg font-black text-slate-900 shadow-sm"
                   />
                   <span className="text-xs font-black text-slate-400 uppercase shrink-0">VND / 1$</span>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* MOBILE NAV BAR */}
      <div className="fixed bottom-6 left-6 right-6 z-[90]">
        <div className="backdrop-blur-2xl bg-slate-900/90 rounded-[40px] border border-white/10 p-2 flex items-center justify-between shadow-2xl">
          {TabsList.map((tab) => {
            const Icon = tab.icon;
            const active = view === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setView(tab.id as View)}
                className={`flex-1 flex flex-col items-center justify-center py-4 rounded-3xl transition-all ${
                  active ? "bg-white text-slate-900 scale-105 shadow-xl" : "text-white/40"
                }`}
              >
                <Icon size={18} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
