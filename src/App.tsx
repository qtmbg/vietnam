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
  family: {
    marilyne: P("/family/marilyne.jpg"),
    claudine: P("/family/claudine.jpg"),
    nizzar: P("/family/nizzar.jpg"),
    aydann: P("/family/aydann.jpg"),
    milann: P("/family/milann.jpg"),
  },

  covers: {
    sections: {
      home: P("/covers/sections/cover-home.jpg"),
      itinerary: P("/covers/sections/cover-itinerary.jpg"),
      hotels: P("/covers/sections/cover-hotels.jpg"),
      guide: P("/covers/sections/cover-guide.jpg"),
      tips: P("/covers/sections/cover-tips.jpg"),
      budget: P("/covers/sections/cover-budget.jpg"),
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

    hotels: {
      hanoi_ja_cosmo: P("/covers/hotels/hanoi-ja-cosmo.jpg"),
      ninh_binh_tam_coc_golden_fields: P("/covers/hotels/ninh-binh-tam-coc-golden-fields.jpg"),
      ha_long_wyndham_legend: P("/covers/hotels/ha-long-wyndham-legend.jpg"),
      ha_long_renea_cruise: P("/covers/hotels/ha-long-renea-cruise.jpg"),
      hoi_an_sea_la_vie: P("/covers/hotels/hoi-an-sea-la-vie.jpg"),
      da_nang_seahorse_signature: P("/covers/hotels/da-nang-seahorse-signature.jpg"),
      whale_island_resort: P("/covers/hotels/whale-island-resort.jpg"),
      hcmc_alagon_spa: P("/covers/hotels/hcmc-alagon-spa.jpg"),
    },
  },
} as const;

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
  imageKey?: string;
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
      cover: ASSETS.covers.hotels.hanoi_ja_cosmo,
    },
    {
      city: "Ninh Binh (Tam Coc)",
      name: "Tam Coc Golden Fields Homestay",
      dates: "28 Jul → 30 Jul",
      budget: { us: 140, claudine: 110, currency: "USD" },
      booking_url: "https://www.booking.com/hotel/vn/tam-coc-golden-fields-homestay.html",
      why: "Base rizières + liberté; parfait pour le ‘wow’ Trang An sans galère.",
      imageKey: "NinhBinh_TrangAn",
      cover: ASSETS.covers.hotels.ninh_binh_tam_coc_golden_fields,
    },
    {
      city: "Ha Long",
      name: "Wyndham Legend Halong",
      dates: "30 Jul → 31 Jul",
      budget: { us: 130, claudine: 80, currency: "USD" },
      booking_url: "https://www.booking.com/hotel/vn/wyndham-legend-halong-bai-chay5.html",
      why: "Transition confortable avant croisière, logistique simple.",
      imageKey: "HaLong",
      cover: ASSETS.covers.hotels.ha_long_wyndham_legend,
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
      cover: ASSETS.covers.hotels.ha_long_renea_cruise,
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
      cover: ASSETS.covers.hotels.hoi_an_sea_la_vie,
    },
    {
      city: "Da Nang",
      name: "Seahorse Signature Danang Hotel by Haviland",
      dates: "06 Aug → 08 Aug",
      budget: { us: 129, claudine: 92, currency: "USD" },
      booking_url: "https://www.booking.com/hotel/vn/seahorse-signature-danang-by-haviland.html",
      why: "Base urbaine efficace pour culture + musées + ponts.",
      imageKey: "DaNang",
      cover: ASSETS.covers.hotels.da_nang_seahorse_signature,
    },
    {
      city: "Whale Island (Hon Ong)",
      name: "Whale Island Resort",
      dates: "08 Aug → 12 Aug",
      budget: { us: 415, claudine: 415, currency: "USD" },
      official_url: "https://whaleislandresort.com/",
      why: "Déconnexion nature pure, rythme famille, mer & ciel.",
      imageKey: "DaNang",
      cover: ASSETS.covers.hotels.whale_island_resort,
    },
    {
      city: "Ho Chi Minh City",
      name: "Alagon Saigon Hotel & Spa",
      dates: "12 Aug → 15 Aug",
      budget: { us: 275, claudine: 211, currency: "USD" },
      booking_url: "https://www.booking.com/hotel/vn/alagon-saigon.html",
      why: "Très central pour histoire, colonial, street life.",
      imageKey: "HCMC",
      cover: ASSETS.covers.hotels.hcmc_alagon_spa,
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
        {
          label: "Soir",
          plan: "Street food + Water Puppet show (ludique & culturel).",
          links: ["https://nhahatmuaroithanglong.vn/en/ticket-book/"],
        },
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
    src: ASSETS.family.marilyne,
    fallback: "https://ui-avatars.com/api/?name=Marilyne&background=fce7f3&color=be185d&size=200",
  },
  {
    name: "Claudine",
    desc: "La Sage",
    color: "bg-indigo-100 text-indigo-700",
    src: ASSETS.family.claudine,
    fallback: "https://ui-avatars.com/api/?name=Claudine&background=e0e7ff&color=4338ca&size=200",
  },
  {
    name: "Nizzar",
    desc: "Le Pilote",
    color: "bg-slate-100 text-slate-700",
    src: ASSETS.family.nizzar,
    fallback: "https://ui-avatars.com/api/?name=Nizzar&background=f1f5f9&color=334155&size=200",
  },
  {
    name: "Aydann",
    desc: "L'Ado",
    color: "bg-blue-100 text-blue-700",
    src: ASSETS.family.aydann,
    fallback: "https://ui-avatars.com/api/?name=Aydann&background=dbeafe&color=1d4ed8&size=200",
  },
  {
    name: "Milann",
    desc: "La Mascotte",
    color: "bg-orange-100 text-orange-700",
    src: ASSETS.family.milann,
    fallback: "https://ui-avatars.com/api/?name=Milann&background=ffedd5&color=c2410c&size=200",
  },
];

// ------------------------------------------------------------
// BON A SAVOIR / ESSENTIELS
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
const formatUSD = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const formatVND = (n: number) =>
  n.toLocaleString("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });

const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

const safeDateLabel = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });

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

const googleMapsSearchUrl = (q: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

const uniqCitiesByOrder = (days: ItineraryDay[]) => {
  const out: string[] = [];
  for (const d of days) {
    const base = d.city.split("→").map((s) => s.trim())[0];
    if (!out.includes(base)) out.push(base);
  }
  return out;
};

// ------------------------------------------------------------
// COVERS — SINGLE SOURCE = ASSETS (fixes ALL previous bugs)
// ------------------------------------------------------------
const getBaseCity = (raw: string) => {
  const first = raw.split("→")[0].trim();
  const s = first.toLowerCase();

  if (s.includes("ninh binh")) return "Ninh Binh";
  if (s.includes("ha long") || s.includes("halong")) return "Ha Long";
  if (s.includes("hoi an") || s.includes("hoian")) return "Hoi An";
  if (s.includes("da nang") || s.includes("danang")) return "Da Nang";
  if (s.includes("whale")) return "Whale Island";
  if (s.includes("ho chi minh") || s.includes("hcmc") || s.includes("saigon")) return "Ho Chi Minh City";
  if (s.includes("hanoi")) return "Hanoi";

  return first;
};

const cityCoverFromLabel = (label?: string) => {
  const base = getBaseCity(label ?? "").toLowerCase();

  if (base.includes("hanoi")) return ASSETS.covers.cities.hanoi;
  if (base.includes("ninh")) return ASSETS.covers.cities.ninh_binh;
  if (base.includes("ha long") || base.includes("halong")) return ASSETS.covers.cities.ha_long;
  if (base.includes("hoi an") || base.includes("hoian")) return ASSETS.covers.cities.hoi_an;
  if (base.includes("da nang") || base.includes("danang")) return ASSETS.covers.cities.da_nang;
  if (base.includes("ho chi minh") || base.includes("hcmc") || base.includes("saigon")) return ASSETS.covers.cities.hcmc;
  if (base.includes("whale")) return ASSETS.covers.cities.whale_island;

  return ASSETS.covers.sections.home;
};

const momentCoverFromText = (text: string) => {
  const t = text.toLowerCase();

  if (t.includes("vol") || t.includes("aéroport") || t.includes("airport") || t.includes("flight")) return ASSETS.covers.moments.plane;
  if (t.includes("bateau") || t.includes("croisi") || t.includes("cruise") || t.includes("boat")) return ASSETS.covers.moments.boat;
  if (t.includes("plage") || t.includes("beach")) return ASSETS.covers.moments.beach;
  if (t.includes("marché") || t.includes("marche") || t.includes("market")) return ASSETS.covers.moments.market;
  if (t.includes("café") || t.includes("cafe") || t.includes("coffee")) return ASSETS.covers.moments.coffee;
  if (t.includes("street food") || t.includes("street-food") || t.includes("streetfood") || t.includes("food") || t.includes("dîner") || t.includes("diner"))
    return ASSETS.covers.moments.streetfood;
  if (t.includes("musée") || t.includes("musee") || t.includes("museum")) return ASSETS.covers.moments.museum;
  if (t.includes("temple")) return ASSETS.covers.moments.temple;
  if (t.includes("massage")) return ASSETS.covers.moments.massage;
  if (t.includes("arrivée") || t.includes("arrivee") || t.includes("check-in") || t.includes("check in") || t.includes("arrival")) return ASSETS.covers.moments.arrival;
  if (t.includes("transfert") || t.includes("transfer") || t.includes("limousine") || t.includes("drive")) return ASSETS.covers.moments.transfer;

  // IMPORTANT: do NOT trigger night on "soir" (too frequent)
  if (t.includes("lantern") || t.includes("lanternes") || t.includes("night market") || t.includes("old town night")) return ASSETS.covers.moments.night;

  return null;
};

const dayCoverFromDay = (day: ItineraryDay) => {
  const baseCity = getBaseCity(day.city);

  const text =
    (day.theme?.join(" ") ?? "") +
    " " +
    (day.blocks?.map((b) => b.plan).join(" ") ?? "");

  const moment = momentCoverFromText(text);
  if (moment) return moment;

  return cityCoverFromLabel(baseCity);
};

// ------------------------------------------------------------
// UI ATOMS
// ------------------------------------------------------------
const Glass = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`bg-white/80 backdrop-blur-md border border-white/60 shadow-sm ${className}`}>{children}</div>
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
  icon?: ReactNode;
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
      <div
        className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
          value ? "translate-x-5" : "translate-x-0"
        }`}
      />
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
      <div
        key={m.name}
        className="shrink-0 flex items-center gap-3 bg-white rounded-2xl border border-slate-100 px-3 py-2 shadow-sm"
      >
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
  coverSrc,
}: {
  onOpenQuick: () => void;
  activeCity: string;
  coverSrc?: string;
}) => {
  const key = cityKeyFromName(activeCity);
  const hero = TRIP_DATA.hero_images[key];
  const src = coverSrc || hero?.src || ASSETS.covers.sections.home;

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-xl">
      <div className="absolute inset-0">
        <img src={src} alt="Hero" className="w-full h-full object-cover scale-[1.02]" />
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
          <button
            onClick={() => (onGoto("tips"), onClose())}
            className="p-4 rounded-2xl border border-slate-200 bg-slate-50 text-left"
          >
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <Lightbulb size={16} className="text-emerald-600" /> Bon à savoir
            </div>
            <div className="text-xs text-slate-500 mt-1">Checklist + argent + règles street</div>
          </button>

          <button
            onClick={() => (onGoto("guide"), onClose())}
            className="p-4 rounded-2xl border border-slate-200 bg-slate-50 text-left"
          >
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <Utensils size={16} className="text-orange-600" /> Food + logistique
            </div>
            <div className="text-xs text-slate-500 mt-1">Plats cultes + transferts</div>
          </button>

          <a
            href={googleMapsSearchUrl("Grab Vietnam")}
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-2xl border border-slate-200 bg-slate-50 text-left"
          >
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <Smartphone size={16} className="text-indigo-600" /> Grab (rappel)
            </div>
            <div className="text-xs text-slate-500 mt-1">Au besoin: recherche rapide</div>
          </a>

          <button
            onClick={() => (onGoto("budget"), onClose())}
            className="p-4 rounded-2xl border border-slate-200 bg-slate-50 text-left"
          >
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <Wallet size={16} className="text-slate-800" /> Budget
            </div>
            <div className="text-xs text-slate-500 mt-1">Totaux + activités</div>
          </button>
        </div>

        <div className="mt-4 text-xs text-slate-500">Astuce: sur mobile, l’écran “Home” sert de hub.</div>
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
    return t.includes("prison") || t.includes("war") || t.includes("remnants") || t.includes("impact") || t.includes("fort");
  };

  return (
    <div className="relative bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="relative h-28">
        <img
          src={coverSrc}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = ASSETS.covers.sections.itinerary;
          }}
        />
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
                      <a
                        key={i}
                        href={l}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-xl"
                      >
                        Lien
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            );
