import { useEffect, useMemo, useState } from "react";
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
// ASSETS (public/)
// ------------------------------------------------------------
const ASSETS = {
  // Family (public/family/)
  family: {
    marilyne: "/family/marilyne.jpg",
    claudine: "/family/claudine.jpg",
    nizzar: "/family/nizzar.jpg",
    aydann: "/family/aydann.jpg",
    milann: "/family/milann.jpg",
  },

  // Covers (public/covers/)
  covers: {
    sections: {
      home: "/covers/sections/cover-home.jpg",
      itinerary: "/covers/sections/cover-itinerary.jpg",
      hotels: "/covers/sections/cover-hotels.jpg",
      guide: "/covers/sections/cover-guide.jpg",
      tips: "/covers/sections/cover-tips.jpg",
      budget: "/covers/sections/cover-budget.jpg",
    },

    cities: {
      hanoi: "/covers/cities/hanoi.jpg",
      ninh_binh: "/covers/cities/ninh-binh.jpg",
      ha_long: "/covers/cities/ha-long.jpg",
      hoi_an: "/covers/cities/hoi-an.jpg",
      da_nang: "/covers/cities/da-nang.jpg",
      hcmc: "/covers/cities/hcmc.jpg",
      whale_island: "/covers/cities/whale-island.jpg",
    },

    moments: {
      arrival: "/covers/moments/arrival.jpg",
      transfer: "/covers/moments/transfer.jpg",
      airport: "/covers/moments/airport.jpg",
      plane: "/covers/moments/plane.jpg",
      train: "/covers/moments/train.jpg",
      night: "/covers/moments/night.jpg",
      beach: "/covers/moments/beach.jpg",
      boat: "/covers/moments/boat.jpg",
      market: "/covers/moments/market.jpg",
      coffee: "/covers/moments/coffee.jpg",
      streetfood: "/covers/moments/streetfood.jpg",
      museum: "/covers/moments/museum.jpg",
      temple: "/covers/moments/temple.jpg",
      massage: "/covers/moments/massage.jpg",
      love: "/covers/moments/love.jpg",
      family: "/covers/moments/family.jpg",

      // exemples spécifiques (si tu les gardes)
      hanoi_train_street: "/covers/moments/hanoi-train-street.jpg",
      hanoi_lan_ong: "/covers/moments/hanoi-lan-ong.jpg",
      hanoi_hoan_kiem: "/covers/moments/hanoi-hoan-kiem.jpg",
      hanoi_temple_of_literature: "/covers/moments/hanoi-temple-of-literature.jpg",

      ninhbinh_hang_mua: "/covers/moments/ninhbinh-hang-mua.jpg",
      ninh_binh_trang_an: "/covers/moments/ninh-binh-trang-an.jpg",
      ninh_binh_tam_coc: "/covers/moments/ninh-binh-tam-coc.jpg",

      ha_long_sunset: "/covers/moments/ha-long-sunset.jpg",
      ha_long_cruise: "/covers/moments/ha-long-cruise.jpg",

      hoi_an_an_bang: "/covers/moments/hoi-an-an-bang.jpg",
      hoi_an_old_town_night: "/covers/moments/hoi-an-old-town-night.jpg",

      hcmc_war_museum: "/covers/moments/hcmc-war-museum.jpg",
      hcmc_ben_thanh: "/covers/moments/hcmc-ben-thanh.jpg",
      hcmc_central_post_office: "/covers/moments/hcmc-central-post-office.jpg",

      whale_island_ponton: "/covers/moments/whale-island-ponton.jpg",
      pont_dragon_da_nang: "/covers/moments/pont-dragon-da-nang.jpg",
    },
const cityCoverFromLabel = (label: string) => {
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

    // Hotels (public/covers/hotels/)
    hotels: {
      hanoi_ja_cosmo: "/covers/hotels/hanoi-ja-cosmo.jpg",
      ninh_binh_tam_coc_golden_fields: "/covers/hotels/ninh-binh-tam-coc-golden-fields.jpg",
      ha_long_wyndham_legend: "/covers/hotels/ha-long-wyndham-legend.jpg",
      ha_long_renea_cruise: "/covers/hotels/ha-long-renea-cruise.jpg",
      hoi_an_sea_la_vie: "/covers/hotels/hoi-an-sea-la-vie.jpg",
      da_nang_seahorse_signature: "/covers/hotels/da-nang-seahorse-signature.jpg",
      whale_island_resort: "/covers/hotels/whale-island-resort.jpg",
      hcmc_alagon_spa: "/covers/hotels/hcmc-alagon-spa.jpg",
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
  if (s.includes("ho chi minh") || s.includes("hcmc") || s.includes("saigon"))
    return ASSETS.covers.cities.hcmc;
  if (s.includes("whale")) return ASSETS.covers.cities.whale_island;

  return ASSETS.covers.sections.home;
};
const cityCoverFromLabel = (label?: string) => {
  const s = (label ?? "").toLowerCase();

  if (s.includes("hanoi")) return ASSETS.covers.cities.hanoi;
  if (s.includes("ninh")) return ASSETS.covers.cities.ninh_binh;
  if (s.includes("ha long") || s.includes("halong")) return ASSETS.covers.cities.ha_long;
  if (s.includes("hoi an") || s.includes("hoian")) return ASSETS.covers.cities.hoi_an;
  if (s.includes("da nang") || s.includes("danang")) return ASSETS.covers.cities.da_nang;
  if (s.includes("ho chi minh") || s.includes("hcmc") || s.includes("saigon"))
    return ASSETS.covers.cities.hcmc;
  if (s.includes("whale")) return ASSETS.covers.cities.whale_island;

  return ASSETS.covers.sections.home;
};

// Hotels (public/covers/hotels/)
// (tu peux laisser tes mappings dans ASSETS.covers.hotels, ici c’est juste un repère)

// ------------------------------------------------------------
// TYPES
// ------------------------------------------------------------

// ------------------------------------------------------------
// TYPES
// ------------------------------------------------------------
type Mood = "fatigue" | "normal" | "energy";
type View = "home" | "itinerary" | "hotels" | "culture" | "guide" | "tips" | "budget";

type Money = {
  us: number;
  claudine: number;
  currency: "USD";
};

type HotelItem = {
  city: string;
  name: string;
  dates: string;
  budget: Money;
  booking_url?: string;
  official_url?: string;
  why: string;
  note?: string;
  imageKey?: keyof typeof TRIP_DATA.hero_images;
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
// DATA (inchangé, on garde TOUT)
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
      cover: "/covers/hanoi-ja-cosmo.jpg",
    },
    {
      city: "Ninh Binh (Tam Coc)",
      name: "Tam Coc Golden Fields Homestay",
      dates: "28 Jul → 30 Jul",
      budget: { us: 140, claudine: 110, currency: "USD" },
      booking_url: "https://www.booking.com/hotel/vn/tam-coc-golden-fields-homestay.html",
      why: "Base rizières + liberté; parfait pour le ‘wow’ Trang An sans galère.",
      imageKey: "NinhBinh_TrangAn",
      cover: "/covers/ninh-binh-tam-coc-golden-fields.jpg",
    },
    {
      city: "Ha Long",
      name: "Wyndham Legend Halong",
      dates: "30 Jul → 31 Jul",
      budget: { us: 130, claudine: 80, currency: "USD" },
      booking_url: "https://www.booking.com/hotel/vn/wyndham-legend-halong-bai-chay5.html",
      why: "Transition confortable avant croisière, logistique simple.",
      imageKey: "HaLong",
      cover: "/covers/ha-long-wyndham-legend.jpg",
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
      cover: "/covers/ha-long-renea-cruise.jpg",
    },
    {
      city: "Hoi An (An Bang Beach)",
      name: "Sea Lavie Boutique Resort & Spa",
      dates: "01 Aug → 06 Aug",
      budget: { us: 530, claudine: 350, currency: "USD" },
      booking_url: "https://www.booking.com/hotel/vn/sea-39-lavie-boutique-resort.html",
      why: "Plage + slow nights Old Town; bon équilibre famille/ambiance.",
      note: "À surveiller: selon saison, certains accès plage peuvent changer.",
      imageKey: "HoiAn",
      cover: "/covers/hoi-an-sea-la-vie.jpg",
    },
    {
      city: "Da Nang",
      name: "Seahorse Signature Danang Hotel by Haviland",
      dates: "06 Aug → 08 Aug",
      budget: { us: 129, claudine: 92, currency: "USD" },
      booking_url: "https://www.booking.com/hotel/vn/seahorse-signature-danang-by-haviland.html",
      why: "Base urbaine efficace pour culture + musées + ponts.",
      imageKey: "DaNang",
      cover: "/covers/da-nang-seahorse-signature.jpg",
    },
    {
      city: "Whale Island (Hon Ong)",
      name: "Whale Island Resort",
      dates: "08 Aug → 12 Aug",
      budget: { us: 415, claudine: 415, currency: "USD" },
      official_url: "https://whaleislandresort.com/",
      why: "Déconnexion nature pure, rythme famille, mer & ciel.",
      imageKey: "DaNang",
      cover: "/covers/whale-island-resort.jpg",
    },
    {
      city: "Ho Chi Minh City",
      name: "Alagon Saigon Hotel & Spa",
      dates: "12 Aug → 15 Aug",
      budget: { us: 275, claudine: 211, currency: "USD" },
      booking_url: "https://www.booking.com/hotel/vn/alagon-saigon.html",
      why: "Très central pour histoire, colonial, street life.",
      imageKey: "HCMC",
      cover: "/covers/hcmc-alagon-spa.jpg",
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
    { date: "2026-07-25", city: "Hanoi", theme: ["arrivée", "dîner", "repos"], blocks: [{ label: "Soir", plan: "Arrivée 19:30, transfert, check-in, dîner simple local, dodo." }] },
    { date: "2026-07-26", city: "Hanoi", theme: ["culture", "street-life", "kids"], blocks: [
      { label: "Matin", plan: "Old Quarter + lac + cafés." },
      { label: "Aprem", plan: "Sieste / recharge kids." },
      { label: "Soir", plan: "Street food + Water Puppet show (ludique & culturel).", links: ["https://nhahatmuaroithanglong.vn/en/ticket-book/"] },
    ]},
    { date: "2026-07-27", city: "Hanoi", theme: ["histoire", "colonial", "esthétique"], blocks: [
      { label: "Matin", plan: "Temple of Literature (beau, symbolique)." },
      { label: "Aprem", plan: "Quartier colonial + Opéra (extérieur / zone)." },
      { label: "Soir", plan: "Dîner calme, balade." },
    ]},
    { date: "2026-07-28", city: "Hanoi → Ninh Binh", theme: ["histoire", "transfert"], blocks: [
      { label: "Matin", plan: "Hoa Lo Prison (fort, bien fait).", links: ["https://hoalo.vn/EN"] },
      { label: "Midi", plan: "Départ limousine vers Ninh Binh + check-in." },
      { label: "Soir", plan: "Rizières au coucher, dîner au calme." },
    ]},
    { date: "2026-07-29", city: "Ninh Binh", theme: ["nature", "wow", "boat"], blocks: [
      { label: "Matin", plan: "Trang An boat tour (spectaculaire UNESCO).", links: ["https://whc.unesco.org/en/list/1438/"] },
      { label: "Aprem", plan: "Repos + vélo doux si énergie." },
      { label: "Soir", plan: "Dîner local." },
    ]},
    { date: "2026-07-30", city: "Ninh Binh → Ha Long", theme: ["nature", "transfert"], blocks: [
      { label: "Matin", plan: "Balade courte + café, départ vers Ha Long." },
      { label: "Aprem", plan: "Check-in Wyndham, repos." },
      { label: "Soir", plan: "Seafood + promenade." },
    ]},
    { date: "2026-07-31", city: "Ha Long", theme: ["unesco", "cruise"], blocks: [
      { label: "Matin", plan: "Transition douce + port." },
      { label: "Midi/Soir", plan: "Embarquement Renea Cruise (Baie / karsts).", links: ["https://whc.unesco.org/en/list/672/"] },
    ]},
    { date: "2026-08-01", city: "Ha Long → Da Nang → Hoi An", theme: ["transit", "buffer"], blocks: [
      { label: "Matin", plan: "Fin croisière + transfert HPH." },
      { label: "Soir", plan: "Vol HPH 19:00 → DAD, transfert Hoi An, dodo." },
    ]},
    { date: "2026-08-02", city: "Hoi An", theme: ["plage", "slow", "night"], blocks: [
      { label: "Matin", plan: "Installation + repos." },
      { label: "Aprem", plan: "Plage An Bang." },
      { label: "Soir", plan: "Old Town lanterns + food + flânerie.", links: ["https://whc.unesco.org/en/list/948/"] },
    ]},
    { date: "2026-08-03", city: "Hoi An", theme: ["culture", "plage"], blocks: [
      { label: "Matin", plan: "Old Town tôt (avant chaleur)." },
      { label: "Aprem", plan: "Plage + sieste." },
      { label: "Soir", plan: "Marché de nuit, desserts." },
    ]},
    { date: "2026-08-04", city: "Hoi An", theme: ["local", "cuisine", "kids"], blocks: [
      { label: "Matin", plan: "Campagne + cuisine simple (Tra Que vibe)." },
      { label: "Aprem", plan: "Plage." },
      { label: "Soir", plan: "Lanternes + slow." },
    ]},
    { date: "2026-08-05", city: "Hoi An", theme: ["libre", "famille"], blocks: [{ label: "Journée", plan: "Journée libre: plage, massages, shopping ciblé, repos." }]},
    { date: "2026-08-06", city: "Hoi An → Da Nang", theme: ["transfert", "city"], blocks: [
      { label: "Matin", plan: "Plage courte, départ." },
      { label: "Aprem", plan: "Check-in Da Nang." },
      { label: "Soir", plan: "Rivière / ponts + dinner." },
    ]},
    { date: "2026-08-07", city: "Da Nang", theme: ["culture", "art", "histoire"], blocks: [
      { label: "Matin", plan: "Cham Museum (immanquable).", links: ["https://chammuseum.vn/"] },
      { label: "Aprem", plan: "Option Marble Mountains ou repos selon énergie." },
      { label: "Soir", plan: "Seafood + balade." },
    ]},
    { date: "2026-08-08", city: "Da Nang → Whale Island", theme: ["early", "nature"], blocks: [
      { label: "Très tôt", plan: "Départ aéroport, vol 06:00 DAD→CXR." },
      { label: "Jour", plan: "Transfert port + bateau vers Whale Island, installation." },
    ]},
    { date: "2026-08-09", city: "Whale Island", theme: ["nature", "déconnexion"], blocks: [{ label: "Journée", plan: "Baignade / snorkeling doux, sieste, coucher de soleil." }]},
    { date: "2026-08-10", city: "Whale Island", theme: ["nature", "slow"], blocks: [{ label: "Journée", plan: "Marche, plage, lecture, ciel étoilé." }]},
    { date: "2026-08-11", city: "Whale Island", theme: ["slow", "famille"], blocks: [{ label: "Journée", plan: "Dernier jour complet: photos, repos, mer." }]},
    { date: "2026-08-12", city: "Whale Island → Ho Chi Minh City", theme: ["transit"], blocks: [{ label: "Jour", plan: "Bateau + transfert CXR, vol 16:00 vers SGN, check-in Alagon." }]},
    { date: "2026-08-13", city: "Ho Chi Minh City", theme: ["colonial", "histoire", "fr-vibe"], blocks: [
      { label: "Matin", plan: "Post Office + zone coloniale (balade)." },
      { label: "Aprem", plan: "Independence Palace.", links: ["https://dinhdoclap.gov.vn/en/visiting-hours/"] },
      { label: "Soir", plan: "Street food + marche." },
    ]},
    { date: "2026-08-14", city: "Ho Chi Minh City", theme: ["histoire", "culture"], blocks: [
      { label: "Matin", plan: "War Remnants Museum (à faire si kids OK).", links: ["https://baotangchungtichchientranh.vn/en"] },
      { label: "Aprem", plan: "Cholon / temples / ruelles (incarné)." },
      { label: "Soir", plan: "Dîner simple + retour tôt." },
    ]},
    { date: "2026-08-15", city: "Ho Chi Minh City → Hanoi", theme: ["transit"], blocks: [
      { label: "Matin", plan: "Vol 11:00 SGN→HAN, check-in Ja Cosmo." },
      { label: "Soir", plan: "Balade douce, shopping ciblé, cafés." },
    ]},
    { date: "2026-08-16", city: "Hanoi", theme: ["best-of", "libre"], blocks: [{ label: "Journée", plan: "Best-of selon mood: ruelles / cafés / marchés + lac." }]},
    { date: "2026-08-17", city: "Hanoi", theme: ["départ"], blocks: [
      { label: "Matin", plan: "Derniers cadeaux + café." },
      { label: "Aprem", plan: "Départ aéroport (tampon trafic)." },
      { label: "Soir", plan: "Vol 19:30." },
    ]},
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
    { id: "hoa-lo", city: "Hanoi", name: "Hoa Lo Prison (ticket)", link: "https://hoalo.vn/EN", cost: { currency: "VND", adult_vnd: 50000, notes: "Prix publié comme 50,000 VND/person (vérifier sur place). Enfants <15 parfois gratuits." }, tags: ["histoire", "impact"] },
    { id: "water-puppets", city: "Hanoi", name: "Thang Long Water Puppet Show (ticket)", link: "https://nhahatmuaroithanglong.vn/en/ticket-book/", cost: { currency: "VND", adult_vnd: 150000, notes: "Fourchette souvent 100k–200k VND selon placement." }, tags: ["culture", "kids-friendly"] },
    { id: "trang-an", city: "Ninh Binh", name: "Trang An Boat Tour (ticket)", link: "https://whc.unesco.org/en/list/1438/", cost: { currency: "VND", adult_vnd: 250000, child_vnd: 120000, notes: "Enfant 1m–1.3m: 120k; >1.3m plein tarif; <1m gratuit." }, tags: ["nature", "wow"] },
    { id: "hoi-an-old-town", city: "Hoi An", name: "Hoi An Ancient Town (ticket)", link: "https://whc.unesco.org/en/list/948/", cost: { currency: "VND", adult_vnd: 120000, child_vnd: 50000, notes: "Ticket international souvent 120k VND; enfants 1–1.4m 50k (selon barème local)." }, tags: ["unesco", "lanternes"] },
    { id: "cham-museum", city: "Da Nang", name: "Da Nang Museum of Cham Sculpture (ticket)", link: "https://chammuseum.vn/", cost: { currency: "VND", adult_vnd: 60000, child_vnd: 10000, notes: "Souvent 60k adulte, 10k enfant." }, tags: ["art", "histoire"] },
    { id: "marble-mountains", city: "Da Nang", name: "Marble Mountains (ticket)", link: "https://vietnam.travel/things-to-do/around-marble-mountains", cost: { currency: "VND", adult_vnd: 40000, notes: "Entrée ~40k; ascenseur ~15k si utilisé." }, tags: ["nature", "temples"] },
    { id: "war-remnants", city: "Ho Chi Minh City", name: "War Remnants Museum (ticket)", link: "https://baotangchungtichchientranh.vn/en", cost: { currency: "VND", adult_vnd: 40000, child_vnd: 20000, notes: "Adultes 40k; enfants (souvent 6–16) 20k; <6 gratuit (variable)." }, tags: ["histoire", "impact"] },
    { id: "independence-palace", city: "Ho Chi Minh City", name: "Independence Palace (ticket)", link: "https://dinhdoclap.gov.vn/en/visiting-hours/", cost: { currency: "VND", adult_vnd: 80000, child_vnd: 20000, notes: "Billet général publié (exhibit + palace): adultes 80k; enfants 20k." }, tags: ["colonial", "histoire"] },
  ],
};
// ------------------------------------------------------------
// FAMILY
// ------------------------------------------------------------
const FAMILY_MEMBERS = [
  { name: "Marilyne", desc: "La Boss", color: "bg-pink-100 text-pink-700", src: "/family/public:family:marilyne.jpg", fallback: "https://ui-avatars.com/api/?name=Marilyne&background=fce7f3&color=be185d&size=200" },
  { name: "Claudine", desc: "La Sage", color: "bg-indigo-100 text-indigo-700", src: "/family/public:family:claudine.jpg", fallback: "https://ui-avatars.com/api/?name=Claudine&background=e0e7ff&color=4338ca&size=200" },
  { name: "Nizzar", desc: "Le Pilote", color: "bg-slate-100 text-slate-700", src: "/family/public:family:nizzar.jpg", fallback: "https://ui-avatars.com/api/?name=Nizzar&background=f1f5f9&color=334155&size=200" },
  { name: "Aydann", desc: "L'Ado", color: "bg-blue-100 text-blue-700", src: "/family/public:family:aydann.jpg", fallback: "https://ui-avatars.com/api/?name=Aydann&background=dbeafe&color=1d4ed8&size=200" },
  { name: "Milann", desc: "La Mascotte", color: "bg-orange-100 text-orange-700", src: "/family/public:family:milann.jpg", fallback: "https://ui-avatars.com/api/?name=Milann&background=ffedd5&color=c2410c&size=200" },
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

const STREET_CROSSING = [
  "Je marche doucement et régulièrement (sans courir).",
  "Je garde une trajectoire stable: les scooters m’évitent.",
];

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

const safeDateLabel = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });

const toISO = (d: Date) => d.toISOString().slice(0, 10);

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

const cityKeyFromName = (city: string): keyof typeof TRIP_DATA.hero_images => {
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
const CITY_COVERS: Record<string, string> = {
  "Hanoi": "/covers/cities/hanoi.jpg",
  "Ninh Binh": "/covers/cities/ninh-binh.jpg",
  "Ha Long": "/covers/cities/ha-long.jpg",
  "Hoi An": "/covers/cities/hoi-an.jpg",
  "Da Nang": "/covers/cities/da-nang.jpg",
  "Whale Island": "/covers/cities/whale-island.jpg",
  "Ho Chi Minh City": "/covers/cities/ho-chi-minh.jpg",
};

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

const getBaseCity = (raw: string) => {
  const first = raw.split("→")[0].trim();
  // normalise
  if (first.toLowerCase().includes("ninh binh")) return "Ninh Binh";
  if (first.toLowerCase().includes("ha long")) return "Ha Long";
  if (first.toLowerCase().includes("hoi an")) return "Hoi An";
  if (first.toLowerCase().includes("da nang")) return "Da Nang";
  if (first.toLowerCase().includes("whale")) return "Whale Island";
  if (first.toLowerCase().includes("ho chi minh")) return "Ho Chi Minh City";
  if (first.toLowerCase().includes("hanoi")) return "Hanoi";
  return first;
};

// 👉 la fonction que tu veux
const dayCoverFromDay = (day: { city: string; theme: string[]; blocks: { plan: string }[] }) => {
  const city = getBaseCity(day.city);
  const cityCover = CITY_COVERS[city];

  const text = (day.theme.join(" ") + " " + day.blocks.map(b => b.plan).join(" ")).toLowerCase();

  // priorité aux “moments”
  if (text.includes("vol") || text.includes("aéroport") || text.includes("flight")) return MOMENT_COVERS.plane;
  if (text.includes("bateau") || text.includes("cruise") || text.includes("boat")) return MOMENT_COVERS.boat;
  if (text.includes("plage") || text.includes("beach")) return MOMENT_COVERS.beach;
  if (text.includes("marché") || text.includes("market")) return MOMENT_COVERS.market;
  if (text.includes("café") || text.includes("coffee")) return MOMENT_COVERS.coffee;
  if (text.includes("street food") || text.includes("food") || text.includes("dîner")) return MOMENT_COVERS.streetfood;
  if (text.includes("musée") || text.includes("museum")) return MOMENT_COVERS.museum;
  if (text.includes("temple")) return MOMENT_COVERS.temple;
  if (text.includes("massage")) return MOMENT_COVERS.massage;
  if (text.includes("arrivée") || text.includes("check-in")) return MOMENT_COVERS.arrival;
  if (text.includes("transfert") || text.includes("limousine") || text.includes("drive")) return MOMENT_COVERS.transfer;
  if (text.includes("soir") || text.includes("lantern") || text.includes("night")) return MOMENT_COVERS.night;

  // fallback ville
  return cityCover || MOMENT_COVERS.family;
};

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
const Glass = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white/80 backdrop-blur-md border border-white/60 shadow-sm ${className}`}>{children}</div>
);

const Pill = ({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
      active
        ? "bg-emerald-600 text-white border-emerald-600 shadow"
        : "bg-white/70 text-slate-600 border-slate-200 hover:bg-white"
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
  icon?: React.ReactNode;
  value: boolean;
  onChange: (v: boolean) => void;
  hint?: string;
}) => (
  <div className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
    <div className="min-w-0">
      <div className="flex items-center gap-2">
        {icon}
        <div className="font-bold text-slate-800">{label}</div>
      </div>
      {hint && <div className="text-xs text-slate-500 mt-1">{hint}</div>}
    </div>
    <button
      onClick={() => onChange(!value)}
      className={`w-12 h-7 rounded-full p-1 transition-colors ${value ? "bg-emerald-500" : "bg-slate-200"}`}
      aria-label={label}
    >
      <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${value ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  </div>
);
const MoodSelector = ({ currentMood, setMood }: { currentMood: Mood; setMood: (m: Mood) => void }) => {
  return (
    <div className="flex bg-white/70 backdrop-blur-md rounded-full p-1 border border-white shadow-sm">
      <button
        onClick={() => setMood("fatigue")}
        className={`px-3 py-1.5 rounded-full flex items-center gap-1 text-xs font-semibold transition-all ${
          currentMood === "fatigue" ? "bg-indigo-100 text-indigo-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
        }`}
      >
        <Moon className="w-4 h-4" /> <span className="hidden sm:inline">Repos</span>
      </button>
      <button
        onClick={() => setMood("normal")}
        className={`px-3 py-1.5 rounded-full flex items-center gap-1 text-xs font-semibold transition-all ${
          currentMood === "normal" ? "bg-emerald-100 text-emerald-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
        }`}
      >
        <BatteryCharging className="w-4 h-4" /> <span className="hidden sm:inline">Normal</span>
      </button>
      <button
        onClick={() => setMood("energy")}
        className={`px-3 py-1.5 rounded-full flex items-center gap-1 text-xs font-semibold transition-all ${
          currentMood === "energy" ? "bg-amber-100 text-amber-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
        }`}
      >
        <Flame className="w-4 h-4" /> <span className="hidden sm:inline">Énergie</span>
      </button>
    </div>
  );
};

const FamilyStrip = () => (
  <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
    {FAMILY_MEMBERS.map((m) => (
      <div key={m.name} className="shrink-0 flex items-center gap-3 bg-white rounded-2xl border border-slate-100 px-3 py-2 shadow-sm">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 ring-2 ring-white">
          <img
            src={m.src}
            alt={m.name}
            className="w-full h-full object-cover"
            onError={(e) => (e.currentTarget.src = m.fallback)}
          />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-bold text-slate-800">{m.name}</div>
          <div className={`text-[11px] font-semibold inline-block px-2 py-0.5 rounded-full ${m.color}`}>{m.desc}</div>
        </div>
      </div>
    ))}
  </div>
);

const CinemaHero = ({
  onOpenQuick,
  activeCity,
}: {
  onOpenQuick: () => void;
  activeCity: string;
}) => {
  const key = cityKeyFromName(activeCity);
  const hero = TRIP_DATA.hero_images[key];

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-xl">
      <div className="absolute inset-0">
        <img src={hero.src} alt="Hero" className="w-full h-full object-cover scale-[1.02]" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,#34d399_0%,transparent_45%),radial-gradient(circle_at_80%_30%,#818cf8_0%,transparent_40%),radial-gradient(circle_at_55%_85%,#fbbf24_0%,transparent_35%)]" />
      </div>

      <div className="relative z-10 p-6 sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-white/15 border border-white/25 text-xs font-semibold text-white">
              24 Juil → 18 Août
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/80 border border-emerald-300/30 text-xs font-semibold text-white">
              Vietnam 2026
            </span>
          </div>

          <button
            onClick={onOpenQuick}
            className="px-3 py-2 rounded-2xl bg-white/15 border border-white/25 text-white text-xs font-bold flex items-center gap-2 hover:bg-white/20"
          >
            <Sparkles size={14} /> Quick
          </button>
        </div>

        <div className="mt-6">
          <div className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-[0.95]">
            VIETNAM
            <span className="block text-emerald-200 font-light mt-2">Family Trip</span>
          </div>
          <p className="mt-3 text-white/90 text-base sm:text-lg">
            Culture, histoire, art, nature, bonne bouffe 🍲 — et moments d&apos;amour.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {TRIP_DATA.meta.vibe.map((v) => (
              <span key={v} className="text-[11px] px-2 py-1 rounded bg-black/20 border border-white/15 text-white/90">
                {v}
              </span>
            ))}
          </div>

          <div className="mt-4 text-xs text-white/60">
            Focus du moment : <span className="font-semibold text-white/85">{activeCity}</span>
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
    <div className="fixed inset-0 z-[80]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl p-5 pb-7">
        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Sparkles size={18} className="text-emerald-600" />
            Quick Actions
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-slate-100 text-slate-700">
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => (onGoto("tips"), onClose())} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 text-left">
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <Lightbulb size={16} className="text-emerald-600" /> Bon à savoir
            </div>
            <div className="text-xs text-slate-500 mt-1">Checklist + argent + règles street</div>
          </button>

          <button onClick={() => (onGoto("guide"), onClose())} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 text-left">
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <Utensils size={16} className="text-orange-600" /> Food + logistique
            </div>
            <div className="text-xs text-slate-500 mt-1">Plats cultes + transferts</div>
          </button>

          <a href={googleMapsSearchUrl("Grab Vietnam")} target="_blank" rel="noreferrer" className="p-4 rounded-2xl border border-slate-200 bg-slate-50 text-left">
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <Smartphone size={16} className="text-indigo-600" /> Grab (rappel)
            </div>
            <div className="text-xs text-slate-500 mt-1">Au besoin: recherche rapide</div>
          </a>

          <button onClick={() => (onGoto("budget"), onClose())} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 text-left">
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <Wallet size={16} className="text-slate-800" /> Budget
            </div>
            <div className="text-xs text-slate-500 mt-1">Totaux + activités</div>
          </button>
        </div>

        <div className="mt-4 text-xs text-slate-500">
          Astuce: sur mobile, l’écran “Home” sert de hub. Tout le reste = navigation.
        </div>
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
    <div className="mt-5">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-extrabold text-slate-900">Timeline</div>
        <div className="text-xs text-slate-500">Swipe →</div>
      </div>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
        {cities.map((c) => (
          <Pill key={c} active={c === activeCity} onClick={() => onSelect(c)}>
            {c}
          </Pill>
        ))}
      </div>
    </div>
  );
};

const DayCardMobile = ({
  day,
  mood,
  isFav,
  onFav,
  kidsMode,
}: {
  day: ItineraryDay;
  mood: Mood;
  isFav: boolean;
  onFav: () => void;
  kidsMode: boolean;
}) => {
  const isFatigue = mood === "fatigue";
  const coverKey = cityKeyFromName(day.city);
  const cover = TRIP_DATA.hero_images[coverKey].src;

  // kidsMode: on masque les blocs “impact” si repérable par mot-clé
  const shouldHideImpact = (text: string) => {
    const t = text.toLowerCase();
    return t.includes("prison") || t.includes("war") || t.includes("remnants") || t.includes("impact") || t.includes("fort");
  };

  return (
    <div className="relative bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="relative h-28">
        <img src={cover} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-black/20" />
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-3">
          <div>
            <div className="text-xs text-slate-600 font-semibold">{safeDateLabel(day.date)}</div>
            <div className="text-lg font-extrabold text-slate-900 leading-tight">{day.city}</div>
          </div>
          <button onClick={onFav} className="p-2 rounded-2xl bg-white/80 border border-white shadow">
            <Heart size={18} className={isFav ? "text-amber-500" : "text-slate-400"} fill={isFav ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex flex-wrap gap-2 mb-3">
          {day.theme.map((t) => (
            <span key={t} className="text-[10px] uppercase tracking-wide text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
              {t}
            </span>
          ))}
        </div>

        <div className="space-y-3">
          {day.blocks.map((b, idx) => {
            if (isFatigue && b.label === "Soir" && !b.plan.toLowerCase().includes("repos")) {
              return (
                <div key={idx} className="text-sm text-slate-400 italic">
                  Soir: repos suggéré (activité masquée)
                </div>
              );
            }
            if (kidsMode && shouldHideImpact(b.plan)) {
              return (
                <div key={idx} className="text-sm text-slate-400 italic">
                  {b.label}: (Masqué en mode kids)
                </div>
              );
            }
            return (
              <div key={idx} className="rounded-2xl bg-slate-50 border border-slate-100 p-3">
                <div className="text-[11px] font-extrabold uppercase tracking-wide text-slate-500 mb-1">{b.label}</div>
                <div className="text-sm text-slate-800 leading-relaxed">{b.plan}</div>
                {b.links?.length ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {b.links.map((l, i) => (
                      <a key={i} href={l} target="_blank" rel="noreferrer" className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-xl">
                        Lien
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        {mood === "energy" && (
          <div className="mt-3 text-xs text-amber-700 font-semibold flex items-center gap-2">
            <Flame size={14} /> Bonus énergie: marche 30 min + “café trouvé à l’instinct”.
          </div>
        )}
      </div>
    </div>
  );
};

const HotelCard = ({ hotel }: { hotel: HotelItem }) => {
  const link = hotel.booking_url || hotel.official_url;
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition-shadow">
      <div className="relative h-40">
        {hotel.cover ? (
          <img src={hotel.cover} alt={hotel.name} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="absolute inset-0 bg-slate-100" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/25 to-black/10" />
        <div className="absolute bottom-3 left-4 right-4">
          <div className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
            <MapPin size={12} /> {hotel.city}
          </div>
          <div className="text-lg font-extrabold text-slate-900 leading-tight">{hotel.name}</div>
          <div className="text-xs text-slate-500">{hotel.dates}</div>
        </div>
      </div>

      <div className="p-4">
        {hotel.note && (
          <div className="text-xs text-slate-600 bg-slate-50 border border-slate-100 rounded-2xl p-3 mb-3 flex gap-2">
            <Info size={14} className="mt-0.5 text-slate-400" />
            <div>{hotel.note}</div>
          </div>
        )}

        <div className="text-sm text-slate-700 italic mb-3">“{hotel.why}”</div>

        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 mb-3">
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Famille</span>
            <span className="font-extrabold text-slate-900">${hotel.budget.us}</span>
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span className="text-slate-500">Claudine</span>
            <span className="font-extrabold text-slate-900">${hotel.budget.claudine}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {link ? (
            <a href={link} target="_blank" rel="noreferrer" className="py-2 rounded-2xl bg-indigo-600 text-white text-xs font-extrabold text-center">
              Voir
            </a>
          ) : (
            <div className="py-2 rounded-2xl bg-slate-200 text-slate-500 text-xs font-extrabold text-center">—</div>
          )}

          <a
            href={googleMapsSearchUrl(hotel.name + " " + hotel.city)}
            target="_blank"
            rel="noreferrer"
            className="py-2 rounded-2xl bg-white border border-slate-200 text-slate-800 text-xs font-extrabold text-center"
          >
            Maps
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
    const next = checked.includes(item) ? checked.filter((i) => i !== item) : [...checked, item];
    setChecked(next);
    localStorage.setItem("trip_tips_checklist", JSON.stringify(next));
  };

  const progress = Math.round((checked.length / ESSENTIALS_CHECKLIST.length) * 100);

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
      <div className="flex justify-between items-end mb-3">
        <div className="text-lg font-extrabold text-slate-900">Essentiels</div>
        <div className="text-xs font-extrabold text-emerald-600">{progress}% prêt</div>
      </div>

      <div className="h-2 w-full bg-slate-100 rounded-full mb-4 overflow-hidden">
        <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      <div className="space-y-2">
        {ESSENTIALS_CHECKLIST.map((item) => (
          <button
            key={item}
            onClick={() => toggle(item)}
            className="w-full flex items-center gap-3 text-left p-3 rounded-2xl border border-slate-100 bg-slate-50"
          >
            <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${checked.includes(item) ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300 text-transparent"}`}>
              <CheckSquare size={14} />
            </div>
            <div className={`text-sm ${checked.includes(item) ? "text-slate-400 line-through" : "text-slate-800"}`}>{item}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

const SimpleListCard = ({ title, icon, items }: { title: string; icon: React.ReactNode; items: string[] }) => (
  <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
    <div className="flex items-center gap-2 mb-3">
      <div className="text-emerald-700">{icon}</div>
      <div className="text-lg font-extrabold text-slate-900">{title}</div>
    </div>
    <div className="space-y-2 text-sm text-slate-800">
      {items.map((t, i) => (
        <div key={i} className="flex gap-2">
          <div className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
          <div>{t}</div>
        </div>
      ))}
    </div>
  </div>
);

const PhrasebookCard = () => (
  <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
    <div className="flex items-center gap-2 mb-3">
      <Languages className="text-emerald-700" size={18} />
      <div className="text-lg font-extrabold text-slate-900">Mots utiles (phonétique)</div>
    </div>
    <div className="grid sm:grid-cols-2 gap-3">
      {PHRASEBOOK.map((p) => (
        <div key={p.fr} className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
          <div className="text-sm font-extrabold text-slate-900">{p.fr}</div>
          <div className="text-xs text-slate-700 mt-1">
            <span className="font-semibold">{p.vi}</span> • <span className="font-mono">{p.phon}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const AirportGlossary = () => (
  <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
    <div className="flex items-center gap-2 mb-3">
      <Plane className="text-indigo-700" size={18} />
      <div className="text-lg font-extrabold text-slate-900">Aéroports (codes + trajets)</div>
    </div>
    <div className="text-xs text-slate-500 mb-3">Estimations simples. On part “large” les jours de vol.</div>
    <div className="space-y-3">
      {AIRPORT_GLOSSARY.map((a, i) => (
        <div key={`${a.code}-${a.fromHotel}-${i}`} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-sm font-extrabold text-slate-900">
                <span className="font-mono text-indigo-700">{a.code}</span> • {a.city}
              </div>
              <div className="text-xs text-slate-600 mt-1">{a.airport}</div>
              <div className="text-xs text-slate-600 mt-1">
                Depuis <span className="font-semibold">{a.fromHotel}</span>
              </div>
              {a.note ? <div className="text-xs text-slate-500 mt-1">{a.note}</div> : null}
            </div>
            <div className="text-right shrink-0">
              <div className="text-sm font-extrabold text-slate-900">{a.eta}</div>
              <div className="text-[10px] uppercase tracking-wide text-slate-500">hotel → airport</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
export default function App() {
  const [view, setView] = useState<View>("home");
  const [mood, setMood] = useState<Mood>("normal");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [kidsMode, setKidsMode] = useState<boolean>(false);
  const [cinemaMode, setCinemaMode] = useState<boolean>(true);
  const [quickOpen, setQuickOpen] = useState(false);

  const [vndPerUsd, setVndPerUsd] = useState<number>(26000);
  const [includeActivities, setIncludeActivities] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");

  // timeline
  const cities = useMemo(() => uniqCitiesByOrder(TRIP_DATA.itinerary_days), []);
  const [activeCity, setActiveCity] = useState<string>(cities[0] || "Hanoi");

  const todayISO = toISO(new Date());
  const tripStart = TRIP_DATA.itinerary_days[0]?.date;
  const tripEnd = TRIP_DATA.itinerary_days[TRIP_DATA.itinerary_days.length - 1]?.date;

  const isWithinTrip = tripStart && tripEnd ? todayISO >= tripStart && todayISO <= tripEnd : false;

  const todayIndex = useMemo(() => {
    const idx = TRIP_DATA.itinerary_days.findIndex((d) => d.date === todayISO);
    if (idx >= 0) return idx;
    // si on est hors trip: on met le 1er jour
    return 0;
  }, [todayISO]);

  const [focusDayIndex, setFocusDayIndex] = useState<number>(todayIndex);

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

  const handlePrint = () => window.print();

  // ------------------------------------------------------------
  // FILTERS
  // ------------------------------------------------------------
  const filteredDays = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return TRIP_DATA.itinerary_days;
    return TRIP_DATA.itinerary_days.filter((d) => {
      const blob = (d.city + " " + d.theme.join(" ") + " " + d.blocks.map((b) => b.plan).join(" ")).toLowerCase();
      return blob.includes(q);
    });
  }, [search]);

  // ------------------------------------------------------------
  // BUDGET
  // ------------------------------------------------------------
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
        // kidsMode: on retire les activités tag impact (souvent)
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
        const groupVnd = a.cost.adult_vnd * famAdults + childVnd * famKids;
        return groupVnd / vndPerUsd;
      })
    );

    return {
      fam: { hotels: hotelsFam, flights: flightsFam, transfers: transfersFam, activities: famActUsd, total: hotelsFam + flightsFam + transfersFam + famActUsd },
      claudine: { hotels: hotelsClaudine, flights: flightsClaudine, transfers: transfersClaudine, activities: claudineActUsd, total: hotelsClaudine + flightsClaudine + transfersClaudine + claudineActUsd },
    };
  }, [includeActivities, vndPerUsd, kidsMode]);

  // ------------------------------------------------------------
  // NAV
  // ------------------------------------------------------------
  const Tabs = [
    { id: "home", icon: Star, label: "Home" },
    { id: "itinerary", icon: Calendar, label: "Itinéraire" },
    { id: "hotels", icon: Hotel, label: "Hôtels" },
    { id: "guide", icon: Utensils, label: "Guide" },
    { id: "tips", icon: Lightbulb, label: "Tips" },
    { id: "budget", icon: Wallet, label: "Budget" },
  ] as const;

  // ------------------------------------------------------------
  // HOME “CINEMA HUB”
  // ------------------------------------------------------------
  const focusDay = TRIP_DATA.itinerary_days[clamp(focusDayIndex, 0, TRIP_DATA.itinerary_days.length - 1)];

  const gotoNextDay = () => setFocusDayIndex((i) => clamp(i + 1, 0, TRIP_DATA.itinerary_days.length - 1));
  const gotoPrevDay = () => setFocusDayIndex((i) => clamp(i - 1, 0, TRIP_DATA.itinerary_days.length - 1));

  const setCityFromFocus = () => {
    const base = focusDay.city.split("→").map((s) => s.trim())[0];
    setActiveCity(base);
  };

    // ------------------------------------------------------------
  // RENDER
  // ------------------------------------------------------------
  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 pb-24 print:bg-white print:pb-0">
      {/* TOP BAR */}
      <header className="sticky top-0 z-50 print:hidden">
        <Glass className="border-b border-slate-200">
          <div className="mx-auto w-full min-w-0 max-w-[560px] px-4 h-16 flex items-center justify-between sm:max-w-[720px] lg:max-w-[1120px] lg:px-8">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-9 h-9 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-extrabold shrink-0">
                V
              </div>
              <div className="leading-tight min-w-0">
                <div className="text-sm font-extrabold text-slate-900 truncate">Vietnam 2026</div>
                <div className="text-[11px] text-slate-500 truncate">Mobile Hub • Cinema V2</div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <MoodSelector currentMood={mood} setMood={setMood} />
              <button onClick={() => setQuickOpen(true)} className="p-2 rounded-2xl bg-slate-100 text-slate-700">
                <Sparkles size={18} />
              </button>
              <button onClick={handlePrint} className="p-2 rounded-2xl bg-slate-100 text-slate-700">
                <Printer size={18} />
              </button>
            </div>
          </div>
        </Glass>
      </header>

      <QuickSheet open={quickOpen} onClose={() => setQuickOpen(false)} onGoto={(v) => setView(v)} />

<main className="mx-auto w-full min-w-0 max-w-[560px] px-4 py-5 space-y-6 sm:max-w-[720px] lg:max-w-[1120px] lg:px-8">
        {/* HOME */}
        {view === "home" && (
          <div className="space-y-6">
            <CinemaHero
  onOpenQuick={() => setQuickOpen(true)}
  activeCity={activeCity}
  coverSrc={cityCoverFromLabel(activeCity)}
/>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left / Mobile top stack */}
              <div className="lg:col-span-2 space-y-6 min-w-0">
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div>
                      <div className="text-lg font-extrabold text-slate-900">Dashboard</div>
                      <div className="text-xs text-slate-500">
                        {isWithinTrip ? "On est dans la période du trip." : "Preview — le trip n’a pas commencé (ou est fini)."}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setView("itinerary")} className="px-3 py-2 rounded-2xl bg-indigo-600 text-white text-xsoth
                        text-xs font-extrabold flex items-center gap-2">
                        Itinéraire <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <Toggle
                      label="Mode Kids"
                      icon={<Shield size={16} className="text-emerald-600" />}
                      value={kidsMode}
                      onChange={setKidsMode}
                      hint="Masque les contenus ‘impact’ et simplifie."
                    />
                    <Toggle
                      label="Cinema Mode"
                      icon={<Star size={16} className="text-amber-500" />}
                      value={cinemaMode}
                      onChange={setCinemaMode}
                      hint="Cartes plus immersives, plus de visuel."
                    />
                  </div>

                  <CityTimeline cities={cities} activeCity={activeCity} onSelect={setActiveCity} />

                  <div className="mt-4">
                    <div className="text-sm font-extrabold text-slate-900 mb-2">Équipage</div>
                    <FamilyStrip />
                  </div>
                </div>

                {/* TODAY / NEXT */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-lg font-extrabold text-slate-900">Focus du jour</div>
                      <div className="text-xs text-slate-500">Swipe mental: 1 carte = 1 journée.</div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={gotoPrevDay} className="p-2 rounded-2xl bg-slate-100 text-slate-700">
                        <ChevronLeft size={18} />
                      </button>
                      <button onClick={gotoNextDay} className="p-2 rounded-2xl bg-slate-100 text-slate-700">
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="text-xs font-bold text-slate-600">
                      {safeDateLabel(focusDay.date)} • <span className="text-slate-900">{focusDay.city}</span>
                    </div>
                    <button
                      onClick={() => (setCityFromFocus(), setView("itinerary"))}
                      className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-3 py-2 rounded-2xl"
                    >
                      Voir en itinéraire
                    </button>
                  </div>

<DayCardMobile
  day={focusDay}
  coverSrc={dayCoverFromDay(focusDay)}
  mood={mood}
  isFav={favorites.includes(focusDay.date)}
  onFav={() => toggleFavorite(focusDay.date)}
  kidsMode={kidsMode}
/>
                </div>

                {/* SEARCH */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="text-lg font-extrabold text-slate-900">Recherche</div>
                    <button onClick={() => setSearch("")} className="text-xs font-bold text-slate-500">
                      Reset
                    </button>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2">
                    <Search size={16} className="text-slate-400" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full bg-transparent outline-none text-sm"
                      placeholder="Tape un mot: ‘plage’, ‘café’, ‘musée’, ‘transfert’..."
                    />
                  </div>

                  {search.trim() ? (
                    <div className="mt-3 text-xs text-slate-500">
                      Résultats: <span className="font-bold">{filteredDays.length}</span> jour(s)
                    </div>
                  ) : (
                    <div className="mt-3 text-xs text-slate-500">Astuce: utile quand on doit “retrouver” un truc vite.</div>
                  )}
                </div>
              </div>

              {/* Right column */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
                  <div className="text-lg font-extrabold text-slate-900 mb-3">Shortcuts</div>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setView("tips")} className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-left">
                      <div className="font-extrabold text-emerald-900 flex items-center gap-2">
                        <Lightbulb size={16} /> Tips
                      </div>
                      <div className="text-xs text-emerald-700 mt-1">Checklist + argent</div>
                    </button>
                    <button onClick={() => setView("guide")} className="p-4 rounded-2xl bg-orange-50 border border-orange-100 text-left">
                      <div className="font-extrabold text-orange-900 flex items-center gap-2">
                        <Utensils size={16} /> Food
                      </div>
                      <div className="text-xs text-orange-700 mt-1">Plats cultes</div>
                    </button>
                    <button onClick={() => setView("hotels")} className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-left">
                      <div className="font-extrabold text-indigo-900 flex items-center gap-2">
                        <Hotel size={16} /> Hôtels
                      </div>
                      <div className="text-xs text-indigo-700 mt-1">Covers + liens</div>
                    </button>
                    <button onClick={() => setView("budget")} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left">
                      <div className="font-extrabold text-slate-900 flex items-center gap-2">
                        <Wallet size={16} /> Budget
                      </div>
                      <div className="text-xs text-slate-600 mt-1">Totaux + tickets</div>
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
                  <div className="text-lg font-extrabold text-slate-900 mb-3">Budget (snapshot)</div>
                  <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 font-semibold">Famille</span>
                      <span className="font-extrabold">{formatUSD(budgetSplit.fam.total)}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-slate-600 font-semibold">Claudine</span>
                      <span className="font-extrabold">{formatUSD(budgetSplit.claudine.total)}</span>
                    </div>
                    <div className="mt-3 text-xs text-slate-500">Activités: dépend du taux VND/USD et des toggles.</div>
                  </div>
                </div>

                <AirportGlossary />
              </div>
            </div>
          </div>
        )}

        {/* ITINERARY */}
        {view === "itinerary" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-2xl font-extrabold text-slate-900">Itinéraire</div>
                <div className="text-xs text-slate-500">Mobile-first: cartes immersives.</div>
              </div>
              <button onClick={() => setView("home")} className="px-3 py-2 rounded-2xl bg-slate-100 text-slate-700 text-xs font-extrabold">
                Retour Home
              </button>
            </div>

            {/* City filter */}
            <CityTimeline cities={cities} activeCity={activeCity} onSelect={setActiveCity} />

            <div className="grid lg:grid-cols-2 gap-5">
              {(search.trim() ? filteredDays : TRIP_DATA.itinerary_days)
                .filter((d) => (search.trim() ? true : d.city.toLowerCase().includes(activeCity.toLowerCase())))
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

        {/* HOTELS */}
        {view === "hotels" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-2xl font-extrabold text-slate-900">Hôtels</div>
                <div className="text-xs text-slate-500">Covers + Booking + Maps</div>
              </div>
              <button onClick={() => setView("home")} className="px-3 py-2 rounded-2xl bg-slate-100 text-slate-700 text-xs font-extrabold">
                Retour Home
              </button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {TRIP_DATA.hotels.map((h, i) => (
                <HotelCard key={i} hotel={h} />
              ))}
            </div>
          </div>
        )}

        {/* GUIDE */}
        {view === "guide" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-2xl font-extrabold text-slate-900">Guide & Food</div>
                <div className="text-xs text-slate-500">Plats cultes + logistique + aéroports</div>
              </div>
              <button onClick={() => setView("home")} className="px-3 py-2 rounded-2xl bg-slate-100 text-slate-700 text-xs font-extrabold">
                Retour Home
              </button>
            </div>

            <div className="bg-orange-50 rounded-3xl border border-orange-100 p-5">
              <div className="text-xl font-extrabold text-orange-900 flex items-center gap-2">
                <Utensils size={18} className="text-orange-600" /> Miam Miam (plats cultes)
              </div>

              <div className="mt-4 grid sm:grid-cols-2 gap-4">
                {Object.entries(TRIP_DATA.food).map(([region, dishes]) => (
                  <div key={region} className="bg-white rounded-3xl border border-orange-100 p-4">
                    <div className="text-[11px] font-extrabold uppercase tracking-wide text-orange-800 mb-2">
                      {region.replace("_", " & ")}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {dishes.map((d) => (
                        <span key={d} className="px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-orange-900 text-sm font-semibold">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-indigo-50 rounded-3xl border border-indigo-100 p-5">
              <div className="text-xl font-extrabold text-indigo-900 flex items-center gap-2">
                <Plane size={18} className="text-indigo-600" /> Logistique (rappel)
              </div>

              <div className="mt-4 grid lg:grid-cols-2 gap-4">
                <div className="bg-white rounded-3xl border border-indigo-100 p-4">
                  <div className="text-sm font-extrabold text-indigo-900 mb-2">Vols internes</div>
                  <div className="space-y-2">
                    {TRIP_DATA.internal_flights.map((f, i) => (
                      <div key={i} className="flex justify-between text-sm bg-indigo-50 border border-indigo-100 p-2 rounded-2xl">
                        <span className="font-mono font-extrabold text-indigo-700">{f.route}</span>
                        <span className="text-slate-600">{f.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-indigo-100 p-4">
                  <div className="text-sm font-extrabold text-indigo-900 mb-2">Transferts</div>
                  <div className="space-y-2">
                    {TRIP_DATA.ground_transfers.map((t, i) => (
                      <div key={i} className="flex justify-between text-sm bg-indigo-50 border border-indigo-100 p-2 rounded-2xl">
                        <span className="text-slate-800">{t.name}</span>
                        <span className="font-extrabold">{formatUSD(t.cost_usd)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <AirportGlossary />
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
              <div className="text-lg font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                <Landmark size={18} className="text-emerald-600" /> Petit glossaire
              </div>
              <div className="grid gap-3">
                {TRIP_DATA.glossary.map((g, i) => (
                  <div key={i} className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                    <div className="font-extrabold text-emerald-700">{g.term}</div>
                    <div className="text-sm text-slate-700 mt-1">{g.note}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TIPS */}
        {view === "tips" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-2xl font-extrabold text-slate-900">Bon à savoir</div>
                <div className="text-xs text-slate-500">Simple, clair, utile.</div>
              </div>
              <button onClick={() => setView("home")} className="px-3 py-2 rounded-2xl bg-slate-100 text-slate-700 text-xs font-extrabold">
                Retour Home
              </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-5">
              <div className="lg:col-span-1 space-y-5">
                <TipsChecklist />
                <SimpleListCard title="Traverser la rue" icon={<Navigation size={18} />} items={STREET_CROSSING} />
                <SimpleListCard title="Premier jour Hanoi" icon={<MapPin size={18} />} items={FIRST_DAY_HANOI} />
              </div>

              <div className="lg:col-span-2 space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <SimpleListCard title="Argent & paiements" icon={<Banknote size={18} />} items={MONEY_TIPS} />
                  <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
                    <div className="text-lg font-extrabold text-slate-900 mb-3">Repères prix</div>
                    <div className="space-y-3">
                      {QUICK_PRICES.map((p) => (
                        <div key={p.label} className="flex justify-between gap-4 border-b border-slate-100 pb-2 last:border-b-0 last:pb-0">
                          <div className="text-sm font-semibold text-slate-800">{p.label}</div>
                          <div className="text-sm font-extrabold text-slate-900 text-right">{p.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <SimpleListCard title="Pratique (zéro galère)" icon={<Smartphone size={18} />} items={PRACTICAL_TIPS} />
                <PhrasebookCard />
              </div>
            </div>
          </div>
        )}

        {/* BUDGET */}
        {view === "budget" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-2xl font-extrabold text-slate-900">Budget</div>
                <div className="text-xs text-slate-500">Famille vs Claudine</div>
              </div>
              <button onClick={() => setView("home")} className="px-3 py-2 rounded-2xl bg-slate-100 text-slate-700 text-xs font-extrabold">
                Retour Home
              </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-5">
              <div className="lg:col-span-1 space-y-5">
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
                  <div className="text-lg font-extrabold text-slate-900 mb-3">Totaux</div>

                  <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4">
                    <div className="text-xs font-bold text-emerald-700 uppercase">Famille</div>
                    <div className="text-2xl font-extrabold text-emerald-800 mt-1">{formatUSD(budgetSplit.fam.total)}</div>
                    <div className="text-xs text-emerald-700 mt-2">
                      Hôtels {formatUSD(budgetSplit.fam.hotels)} • Vols {formatUSD(budgetSplit.fam.flights)} • Transferts {formatUSD(budgetSplit.fam.transfers)}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-indigo-50 border border-indigo-100 p-4 mt-4">
                    <div className="text-xs font-bold text-indigo-700 uppercase">Claudine</div>
                    <div className="text-2xl font-extrabold text-indigo-800 mt-1">{formatUSD(budgetSplit.claudine.total)}</div>
                    <div className="text-xs text-indigo-700 mt-2">
                      Hôtels {formatUSD(budgetSplit.claudine.hotels)} • Vols {formatUSD(budgetSplit.claudine.flights)} • Transferts {formatUSD(budgetSplit.claudine.transfers)}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
                  <div className="text-sm font-extrabold text-slate-900 mb-2">Taux VND → USD</div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={vndPerUsd}
                      onChange={(e) => setVndPerUsd(Number(e.target.value || 0))}
                      className="w-full px-3 py-2 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 font-semibold outline-none"
                      min={10000}
                      step={100}
                    />
                    <div className="text-xs text-slate-500 whitespace-nowrap">VND / 1 USD</div>
                  </div>

                  <div className="mt-3 text-xs text-slate-500">
                    Astuce: si kidsMode ON, on retire les activités tag “impact” dans les estimations.
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-5">
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
                  <div className="text-lg font-extrabold text-slate-900 mb-2">Activités (toggle)</div>
                  <div className="text-xs text-slate-500 mb-4">Active/désactive selon envie. Calcul basé sur 4 adultes + 2 enfants.</div>

                  <div className="space-y-3">
                    {TRIP_DATA.activities
                      .filter((a) => !(kidsMode && a.tags?.includes("impact")))
                      .map((a) => {
                        const enabled = includeActivities[a.id] ?? true;
                        const c = a.cost;
                        let usd = 0;
                        let vnd = 0;
                        if (c) {
                          const child = c.child_vnd ?? c.adult_vnd;
                          vnd = c.adult_vnd * TRIP_DATA.meta.travelers_count.adults + child * TRIP_DATA.meta.travelers_count.kids;
                          usd = vnd / vndPerUsd;
                        }

                        return (
                          <div key={a.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <button
                                  onClick={() => setIncludeActivities({ ...includeActivities, [a.id]: !(includeActivities[a.id] ?? true) })}
                                  className="flex items-center gap-2 text-left"
                                >
                                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${enabled ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300 text-transparent"}`}>
                                    <CheckSquare size={14} />
                                  </div>
                                  <div>
                                    <div className="text-sm font-extrabold text-slate-900">{a.name}</div>
                                    <div className="text-xs text-slate-500">{a.city}</div>
                                  </div>
                                </button>

                                {a.tags?.length ? (
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    {a.tags.map((t) => (
                                      <span key={t} className="text-[10px] uppercase tracking-wide px-2 py-1 rounded-full bg-white border border-slate-200 text-slate-600">
                                        {t}
                                      </span>
                                    ))}
                                  </div>
                                ) : null}

                                {a.link ? (
                                  <a href={a.link} target="_blank" rel="noreferrer" className="inline-block mt-2 text-[11px] font-extrabold text-indigo-600 bg-indigo-50 px-3 py-2 rounded-2xl">
                                    Lien
                                  </a>
                                ) : null}
                              </div>

                              <div className="text-right shrink-0">
                                {c ? (
                                  <>
                                    <div className={`text-sm font-extrabold ${enabled ? "text-slate-900" : "text-slate-400"}`}>{formatUSD(usd)}</div>
                                    <div className="text-xs text-slate-500">{formatVND(vnd)}</div>
                                  </>
                                ) : (
                                  <div className="text-xs text-slate-400">—</div>
                                )}
                              </div>
                            </div>

                            {c?.notes ? <div className="mt-2 text-xs text-slate-500">{c.notes}</div> : null}
                          </div>
                        );
                      })}
                  </div>

                  {kidsMode && (
                    <div className="mt-4 text-xs text-emerald-700 font-semibold">
                      Mode kids ON: activités “impact” masquées ici.
                    </div>
                  )}
                </div>

                <AirportGlossary />
              </div>
            </div>
          </div>
        )}

        {/* CULTURE (optionnel - gardé, mais dans V2 on passe via Guide/Quick) */}
        {view === "culture" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-2xl font-extrabold text-slate-900">Culture</div>
                <div className="text-xs text-slate-500">Liens essentiels</div>
              </div>
              <button onClick={() => setView("home")} className="px-3 py-2 rounded-2xl bg-slate-100 text-slate-700 text-xs font-extrabold">
                Retour Home
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              {Object.entries(TRIP_DATA.culture_links).map(([cat, links]) => (
                <div key={cat} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
                  <div className="text-lg font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                    <BookOpen size={18} className="text-emerald-600" /> {cat}
                  </div>
                  <div className="space-y-3">
                    {links.map((l, i) => (
                      <a key={i} href={l.url} target="_blank" rel="noreferrer" className="block p-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <div className="text-sm font-extrabold text-slate-900">{l.name}</div>
                        <div className="text-xs text-slate-500 mt-1">Ouvrir</div>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* MOBILE NAV */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 md:hidden flex justify-around p-2 z-50 print:hidden">
        {Tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setView(tab.id as View)}
            className={`flex flex-col items-center p-2 rounded-2xl transition-colors ${
              view === tab.id ? "text-emerald-600 bg-emerald-50" : "text-slate-400"
            }`}
          >
            <tab.icon size={20} />
            <span className="text-[10px] font-semibold mt-1">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
