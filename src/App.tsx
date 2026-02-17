import { useState, useEffect, useMemo } from "react";
import {
  MapPin, Calendar, Users, Battery, BatteryCharging, BatteryFull,
  Hotel, BookOpen, Utensils, CheckSquare, Printer, Heart, ArrowRight,
  Plane, Bus, Ship
} from 'lucide-react';

// ------------------------------------------------------------
// TYPES
// ------------------------------------------------------------
type Mood = 'fatigue' | 'normal' | 'energy';

type Money = {
  us: number;
  claudine: number;
  currency: 'USD';
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
  currency: 'VND';
  adult_vnd: number;      // per person
  child_vnd?: number;     // per child (if known)
  notes?: string;         // e.g. "children <6 free"
};

type Activity = {
  id: string;
  city: string;
  name: string;
  link?: string;
  cost?: ActivityCost;
  tags?: string[];
  when?: string; // optional suggestion e.g. "Hanoi 28 Jul"
};

// ------------------------------------------------------------
// DATA
// ------------------------------------------------------------
interface TripData {
  meta: {
    title: string;
    travelers: string;
    travelers_count: {
      adults: number;      // Nizzar + Marilyne + Claudine + (1 adult) = 4
      kids: number;        // Aydann + Milann = 2
      kids_ages: number[]; // [12,6]
    };
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

const TRIP_DATA: TripData = {
  meta: {
    title: "Vietnam 2026 — Family Trip",
    travelers: "3 adultes + 2 enfants (12 et 6) + Claudine (70, active)",
    travelers_count: {
      adults: 4,
      kids: 2,
      kids_ages: [12, 6],
    },
    vibe: ["culture", "histoire", "art", "nature", "local", "lenteur le soir à Hoi An"],
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
    },
    {
      city: "Ninh Binh (Tam Coc)",
      name: "Tam Coc Golden Fields Homestay",
      dates: "28 Jul → 30 Jul",
      budget: { us: 140, claudine: 110, currency: "USD" },
      booking_url: "https://www.booking.com/hotel/vn/tam-coc-golden-fields-homestay.html",
      why: "Base rizières + liberté; parfait pour le ‘wow’ Trang An sans galère.",
      imageKey: "NinhBinh_TrangAn",
    },
    {
      city: "Ha Long",
      name: "Wyndham Legend Halong",
      dates: "30 Jul → 31 Jul",
      budget: { us: 130, claudine: 80, currency: "USD" },
      booking_url: "https://www.booking.com/hotel/vn/wyndham-legend-halong-bai-chay5.html",
      why: "Transition confortable avant croisière, logistique simple.",
      imageKey: "HaLong",
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
    },
    {
      city: "Da Nang",
      name: "Seahorse Signature Danang Hotel by Haviland",
      dates: "06 Aug → 08 Aug",
      budget: { us: 129, claudine: 92, currency: "USD" },
      booking_url: "https://www.booking.com/hotel/vn/seahorse-signature-danang-by-haviland.html",
      why: "Base urbaine efficace pour culture + musées + ponts.",
      imageKey: "DaNang",
    },
    {
      city: "Whale Island (Hon Ong)",
      name: "Whale Island Resort",
      dates: "08 Aug → 12 Aug",
      budget: { us: 415, claudine: 415, currency: "USD" },
      official_url: "https://whaleislandresort.com/",
      why: "Déconnexion nature pure, rythme famille, mer & ciel.",
      imageKey: "DaNang",
    },
    {
      city: "Ho Chi Minh City",
      name: "Alagon Saigon Hotel & Spa",
      dates: "12 Aug → 15 Aug",
      budget: { us: 275, claudine: 211, currency: "USD" },
      booking_url: "https://www.booking.com/hotel/vn/alagon-saigon.html",
      why: "Très central pour histoire, colonial, street life.",
      imageKey: "HCMC",
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
    { date: "2026-08-05", city: "Hoi An", theme: ["libre", "famille"], blocks: [
      { label: "Journée", plan: "Journée libre: plage, massages, shopping ciblé, repos." },
    ]},
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
    { date: "2026-08-09", city: "Whale Island", theme: ["nature", "déconnexion"], blocks: [
      { label: "Journée", plan: "Baignade / snorkeling doux, sieste, coucher de soleil." },
    ]},
    { date: "2026-08-10", city: "Whale Island", theme: ["nature", "slow"], blocks: [
      { label: "Journée", plan: "Marche, plage, lecture, ciel étoilé." },
    ]},
    { date: "2026-08-11", city: "Whale Island", theme: ["slow", "famille"], blocks: [
      { label: "Journée", plan: "Dernier jour complet: photos, repos, mer." },
    ]},
    { date: "2026-08-12", city: "Whale Island → Ho Chi Minh City", theme: ["transit"], blocks: [
      { label: "Jour", plan: "Bateau + transfert CXR, vol 16:00 vers SGN, check-in Alagon." },
    ]},
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
    { date: "2026-08-16", city: "Hanoi", theme: ["best-of", "libre"], blocks: [
      { label: "Journée", plan: "Best-of selon mood: ruelles / cafés / marchés + lac." },
    ]},
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

  // ACTIVITIES (ticket prices where available)
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
// FAMILY PHOTOS MAPPING
// ------------------------------------------------------------
const FAMILY_MEMBERS = [
  { name: "Marilyne", desc: "La Boss", color: "bg-pink-100 text-pink-700", src: "FullSizeRender_Original.jpg", fallback: "https://ui-avatars.com/api/?name=Marilyne&background=fce7f3&color=be185d&size=200" },
  { name: "Claudine", desc: "La Sage", color: "bg-indigo-100 text-indigo-700", src: "IMG_4429_Original.jpg", fallback: "https://ui-avatars.com/api/?name=Claudine&background=e0e7ff&color=4338ca&size=200" },
  { name: "Nizzar", desc: "Le Pilote", color: "bg-slate-100 text-slate-700", src: "IMG_2022.jpg", fallback: "https://ui-avatars.com/api/?name=Nizzar&background=f1f5f9&color=334155&size=200" },
  { name: "Aydann", desc: "L'Ado Cool", color: "bg-blue-100 text-blue-700", src: "IMG_8924_Original.jpg", fallback: "https://ui-avatars.com/api/?name=Aydann&background=dbeafe&color=1d4ed8&size=200" },
  { name: "Milann", desc: "La Mascotte", color: "bg-orange-100 text-orange-700", src: "IMG_8928_Original.jpg", fallback: "https://ui-avatars.com/api/?name=Milann&background=ffedd5&color=c2410c&size=200" },
];

const CHECKLIST_ITEMS = [
  "Passeports (validité 6 mois)", "E-Visas imprimés", "Assurance voyage",
  "Trousse pharma (Doliprane, Smecta)", "Adaptateur universel", "Powerbank",
  "Crème solaire & Anti-moustique (Tropical)", "Maillots de bain",
  "Casquettes / Lunettes", "Dollars US (cash secours)", "App Grab installée"
];

// ------------------------------------------------------------
// HELPERS
// ------------------------------------------------------------
const formatUSD = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const formatVND = (n: number) =>
  n.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 });

const safeDateLabel = (iso: string) =>
  new Date(iso).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });

function sum(arr: number[]) { return arr.reduce((a, b) => a + b, 0); }

// ------------------------------------------------------------
// COMPONENTS
// ------------------------------------------------------------
const MoodSelector = ({ currentMood, setMood }: { currentMood: Mood, setMood: (m: Mood) => void }) => {
  return (
    <div className="flex bg-white/50 backdrop-blur-md rounded-full p-1 border border-white shadow-sm">
      <button
        onClick={() => setMood('fatigue')}
        className={`px-3 py-1.5 rounded-full flex items-center gap-1 text-xs font-semibold transition-all ${
          currentMood === 'fatigue' ? 'bg-indigo-100 text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
        }`}
      >
        <Battery className="w-4 h-4" /> <span className="hidden md:inline">Repos</span>
      </button>
      <button
        onClick={() => setMood('normal')}
        className={`px-3 py-1.5 rounded-full flex items-center gap-1 text-xs font-semibold transition-all ${
          currentMood === 'normal' ? 'bg-emerald-100 text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
        }`}
      >
        <BatteryCharging className="w-4 h-4" /> <span className="hidden md:inline">Normal</span>
      </button>
      <button
        onClick={() => setMood('energy')}
        className={`px-3 py-1.5 rounded-full flex items-center gap-1 text-xs font-semibold transition-all ${
          currentMood === 'energy' ? 'bg-amber-100 text-amber-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
        }`}
      >
        <BatteryFull className="w-4 h-4" /> <span className="hidden md:inline">Énergie</span>
      </button>
    </div>
  );
};

const Hero = () => {
  const [heroError, setHeroError] = useState(false);
  const heroSrc = TRIP_DATA.hero_images["Hanoi"].src;

  // FALLBACK COVER - VIETNAM FLAG STYLE
  if (heroError) {
    return (
      <div className="relative w-full h-[450px] md:h-[500px] rounded-3xl overflow-hidden shadow-xl mb-8 bg-red-800 text-yellow-400">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-700 to-red-900" />
        {/* Abstract Star Hint */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20">
           <Star size={300} fill="currentColor" stroke="none" />
        </div>
        
        <div className="relative z-10 p-8 md:p-12 h-full flex flex-col justify-end max-w-3xl">
          <div className="flex gap-2 mb-4">
            <span className="px-3 py-1 rounded-full bg-black/20 border border-white/10 text-xs font-medium text-white">
              24 Juil → 18 Août
            </span>
            <span className="px-3 py-1 rounded-full bg-yellow-500 text-red-900 text-xs font-bold shadow-md">
              Vietnam 2026
            </span>
          </div>
          <div className="text-5xl md:text-6xl font-extrabold tracking-tight leading-[0.95] text-white">
            VIETNAM
            <span className="block text-yellow-400 font-light mt-2">Family Trip</span>
          </div>
          <p className="mt-4 text-white/90 text-lg leading-relaxed max-w-xl">
            Culture, histoire, art, nature — et des soirées lentes à Hoi An.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-xs text-white/70">
            {TRIP_DATA.meta.vibe.map(v => (
              <span key={v} className="px-2 py-1 rounded bg-black/20 border border-white/10">{v}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[450px] md:h-[500px] rounded-3xl overflow-hidden shadow-xl mb-8 group">
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent z-10" />
      <img
        src={heroSrc}
        alt="Vietnam Hero"
        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        onError={() => setHeroError(true)}
      />
      <div className="absolute bottom-0 left-0 p-6 md:p-10 z-20 text-white max-w-2xl">
        <div className="flex gap-2 mb-3">
          <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-medium text-white">
            24 Juil → 18 Août
          </span>
          <span className="px-3 py-1 rounded-full bg-emerald-500/80 backdrop-blur-md border border-emerald-400/30 text-xs font-medium text-white">
            Vietnam 2026
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
          L'Aventure en Famille
        </h1>
        <p className="text-lg text-slate-200 leading-relaxed font-light">
          Un voyage sur mesure — culture millénaire, baies mythiques, soirées douces à Hoi An.
        </p>
        <div className="mt-3 text-xs text-white/60">
          Source image: {TRIP_DATA.hero_images["Hanoi"].source}
        </div>
      </div>
    </div>
  );
};

const FamilyGrid = () => (
  <div className="mb-12">
    <div className="flex items-center gap-3 mb-6">
      <Users className="text-emerald-600" />
      <h2 className="text-xl font-bold text-slate-800">L'Équipage</h2>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {FAMILY_MEMBERS.map((member) => (
        <div key={member.name} className="flex flex-col items-center group">
          <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-white shadow-lg mb-3 hover:scale-105 transition-transform bg-slate-200">
            <img 
              src={member.src} 
              alt={member.name} 
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.src = member.fallback; }} 
            />
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-bold ${member.color} mb-1 shadow-sm`}>
            {member.name}
          </div>
          <span className="text-xs text-slate-500 font-medium">{member.desc}</span>
        </div>
      ))}
    </div>
  </div>
);

const DayCard = ({ day, mood, toggleFav, isFav }: { day: ItineraryDay, mood: Mood, toggleFav: (id: string)=>void, isFav: boolean }) => {
  const isFatigue = mood === 'fatigue';
  const isEnergy = mood === 'energy';

  return (
    <div className="relative pl-8 md:pl-0 md:grid md:grid-cols-12 gap-6 mb-8 group">
      <div className="hidden md:block absolute left-[22%] top-0 bottom-0 w-px bg-slate-200 -z-10 group-last:bottom-auto group-last:h-full"></div>
      
      <div className="md:col-span-3 text-right md:pr-8 mb-2 md:mb-0 relative">
        <div className="hidden md:block absolute right-[-5px] top-6 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-white"></div>
        <h3 className="text-lg font-bold text-slate-800 capitalize">
          {safeDateLabel(day.date)}
        </h3>
        <div className="text-sm font-semibold text-emerald-600 mb-1">{day.city}</div>
        <div className="flex flex-wrap justify-end gap-1">
          {day.theme.map((t) => (
            <span key={t} className="text-[10px] uppercase tracking-wide text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="md:col-span-9">
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-400 to-indigo-400"></div>

          <button 
            onClick={() => toggleFav(day.date)}
            className="absolute top-4 right-4 text-slate-300 hover:text-amber-400 transition-colors"
            aria-label="Favorite day"
          >
            <Heart size={20} fill={isFav ? "currentColor" : "none"} className={isFav ? "text-amber-400" : ""} />
          </button>

          <div className="space-y-4">
            {day.blocks.map((block, idx) => {
              if (isFatigue && block.label === "Soir" && !block.plan.toLowerCase().includes("repos")) {
                return (
                  <div key={idx} className="opacity-40 text-sm flex gap-3 italic">
                    <span className="font-bold min-w-[50px]">{block.label}</span>
                    <span>(Repos suggéré - activité masquée)</span>
                  </div>
                );
              }
              
              return (
                <div key={idx} className="flex gap-4">
                  <div className="min-w-[70px] text-xs font-bold uppercase text-slate-400 pt-1">{block.label}</div>
                  <div className="flex-1">
                    <p className="text-slate-700 leading-relaxed">
                      {block.plan}
                    </p>
                    {block.links && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {block.links.map((link, i) => (
                          <a 
                            key={i} 
                            href={link} 
                            target="_blank" 
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-medium bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md hover:bg-indigo-100 transition-colors"
                          >
                            <BookOpen size={10} /> Info
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {isEnergy && (
            <div className="mt-4 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs text-amber-600 font-medium">
                <BatteryFull size={14} />
                <span>Conseil Énergie : marchez 30 minutes + un café caché (trouvé à l’instinct).</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const HotelCard = ({ hotel }: { hotel: HotelItem }) => {
  const imgKey = hotel.imageKey;
  const imgSrc = imgKey ? TRIP_DATA.hero_images[imgKey].src : undefined;
  
  const link = hotel.booking_url || hotel.official_url;

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm flex flex-col h-full hover:shadow-lg transition-shadow">
      <div className="h-36 bg-slate-100 relative">
        {imgSrc ? (
          <img src={imgSrc} alt={hotel.city} className="absolute inset-0 w-full h-full object-cover opacity-90" />
        ) : (
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 to-transparent"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/35 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4">
          <h3 className="text-lg font-bold text-slate-800 leading-tight bg-white/90 backdrop-blur-sm px-2 py-1 rounded inline-block shadow-sm">
            {hotel.name}
          </h3>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 mb-2">
          <MapPin size={12} /> {hotel.city}
        </div>
        <div className="text-xs text-slate-400 mb-3">{hotel.dates}</div>
        
        {hotel.note && (
          <div className="text-xs text-slate-500 bg-slate-50 border border-slate-100 rounded-xl p-3 mb-4">
            <div className="flex items-start gap-2">
              <Info size={14} className="mt-0.5 text-slate-400" />
              <span>{hotel.note}</span>
            </div>
          </div>
        )}
        
        <p className="text-sm text-slate-600 italic mb-4 flex-1">
          "{hotel.why}"
        </p>

        <div className="bg-slate-50 rounded-xl p-3 mb-4 space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Famille</span>
            <span className="font-bold text-slate-700">${hotel.budget.us}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Claudine</span>
            <span className="font-bold text-slate-700">${hotel.budget.claudine}</span>
          </div>
        </div>

        {link && (
          <a 
            href={link} 
            target="_blank" 
            rel="noreferrer"
            className="w-full py-2 bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg text-center hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            Voir <ArrowRight size={12} />
          </a>
        )}
      </div>
    </div>
  );
};

const Checklist = () => {
  const [checked, setChecked] = useState<string[]>([]);
  
  useEffect(() => {
    const saved = localStorage.getItem('trip_checklist');
    if (saved) setChecked(JSON.parse(saved));
  }, []);

  const toggle = (item: string) => {
    const newChecked = checked.includes(item) 
      ? checked.filter(i => i !== item)
      : [...checked, item];
    setChecked(newChecked);
    localStorage.setItem('trip_checklist', JSON.stringify(newChecked));
  };

  const progress = Math.round((checked.length / CHECKLIST_ITEMS.length) * 100);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
      <div className="flex justify-between items-end mb-4">
        <h3 className="font-bold text-lg text-slate-800">Valise & Papiers</h3>
        <span className="text-xs font-bold text-emerald-600">{progress}% prêt</span>
      </div>
      
      <div className="h-2 w-full bg-slate-100 rounded-full mb-6 overflow-hidden">
        <div 
          className="h-full bg-emerald-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="space-y-3">
        {CHECKLIST_ITEMS.map(item => (
          <div 
            key={item} 
            onClick={() => toggle(item)}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
              checked.includes(item) ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 group-hover:border-emerald-400'
            }`}>
              {checked.includes(item) && <CheckSquare size={14} />}
            </div>
            <span className={`text-sm ${checked.includes(item) ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const BudgetRow = ({ label, value, note }: { label: string; value: string; note?: string }) => (
  <div className="flex items-start justify-between gap-4 py-2 border-b border-slate-100 last:border-b-0">
    <div>
      <div className="text-sm font-semibold text-slate-800">{label}</div>
      {note && <div className="text-xs text-slate-500 mt-0.5">{note}</div>}
    </div>
    <div className="text-sm font-bold text-slate-900 whitespace-nowrap">{value}</div>
  </div>
);

const ActivitiesBudget = ({ 
  vndPerUsd, 
  includeOptional, 
  setIncludeOptional,
}: { 
  vndPerUsd: number; 
  includeOptional: Record<string, boolean>;
  setIncludeOptional: (n: Record<string, boolean>) => void;
}) => {
  const { adults, kids } = TRIP_DATA.meta.travelers_count;
  
  const items = TRIP_DATA.activities.map(a => {
    const cost = a.cost;
    const enabled = includeOptional[a.id] ?? true;

    if (!cost) return { ...a, enabled, groupVnd: 0, groupUsd: 0 };
    
    const childVnd = cost.child_vnd ?? cost.adult_vnd; // fallback: if unknown, treat as adult
    const groupVnd = (cost.adult_vnd * adults) + (childVnd * kids);
    const groupUsd = groupVnd / vndPerUsd;

    return { ...a, enabled, groupVnd, groupUsd };
  });

  const totalUsd = sum(items.filter(i => i.enabled).map(i => i.groupUsd));

  const toggle = (id: string) => {
    setIncludeOptional({ ...includeOptional, [id]: !(includeOptional[id] ?? true) });
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="text-emerald-600" size={18} />
          <h3 className="text-lg font-bold text-slate-800">Activités (tickets estimés)</h3>
        </div>
        <div className="text-sm font-bold text-emerald-700">{formatUSD(totalUsd)}</div>
      </div>
      
      <div className="text-xs text-slate-500 mb-4">
        Estimation basée sur {adults} adultes + {kids} enfants. Ajuste le taux VND/USD ci-dessous.
      </div>

      <div className="space-y-3">
        {items.map((a) => (
          <div key={a.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => toggle(a.id)}
                    className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                      a.enabled ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 text-transparent'
                    }`}
                    aria-label="toggle activity"
                  >
                    <CheckSquare size={14} />
                  </button>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-slate-800 truncate">{a.name}</div>
                    <div className="text-xs text-slate-500">{a.city}</div>
                  </div>
                </div>

                {a.cost && (
                  <div className="mt-2 text-xs text-slate-600">
                    <span className="font-semibold">Prix:</span>{" "}
                    {formatVND(a.cost.adult_vnd)} / adulte
                    {a.cost.child_vnd ? ` • ${formatVND(a.cost.child_vnd)} / enfant` : ""}
                    {a.cost.notes ? <span className="block mt-1 text-slate-500">{a.cost.notes}</span> : null}
                  </div>
                )}

                {a.link && (
                  <a 
                    href={a.link} 
                    target="_blank" 
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md hover:bg-indigo-100 transition-colors"
                  >
                    <BookOpen size={10} /> Lien
                  </a>
                )}
              </div>
              
              <div className="text-right">
                {a.cost ? (
                  <>
                    <div className={`text-sm font-bold ${a.enabled ? 'text-slate-900' : 'text-slate-400'}`}>
                      {formatUSD(a.groupUsd)}
                    </div>
                    <div className="text-xs text-slate-500">{formatVND(a.groupVnd)}</div>
                  </>
                ) : (
                  <div className="text-xs text-slate-400">—</div>
                )}
              </div>
            </div>

            {a.tags?.length ? (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {a.tags.map(t => (
                  <span key={t} className="text-[10px] uppercase tracking-wide text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
                    {t}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

// ------------------------------------------------------------
// MAIN APP
// ------------------------------------------------------------
export default function App() {
  const [view, setView] = useState<'itinerary' | 'hotels' | 'culture' | 'guide' | 'budget'>('itinerary');
  const [mood, setMood] = useState<Mood>('normal');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [vndPerUsd, setVndPerUsd] = useState<number>(26000); // default close to recent history
  const [includeActivities, setIncludeActivities] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const savedFavs = localStorage.getItem('trip_favs');
    if (savedFavs) setFavorites(JSON.parse(savedFavs));

    const savedRate = localStorage.getItem('trip_vnd_per_usd');
    if (savedRate) setVndPerUsd(Number(savedRate));

    const savedAct = localStorage.getItem('trip_activities_toggle');
    if (savedAct) setIncludeActivities(JSON.parse(savedAct));
  }, []);

  useEffect(() => {
    localStorage.setItem('trip_vnd_per_usd', String(vndPerUsd));
  }, [vndPerUsd]);

  useEffect(() => {
    localStorage.setItem('trip_activities_toggle', JSON.stringify(includeActivities));
  }, [includeActivities]);

  const toggleFavorite = (id: string) => {
    const newFavs = favorites.includes(id) 
      ? favorites.filter(f => f !== id)
      : [...favorites, id];
    setFavorites(newFavs);
    localStorage.setItem('trip_favs', JSON.stringify(newFavs));
  };

  const handlePrint = () => window.print();

  // -------------------------
  // BUDGET CALCS - SEPARATED
  // -------------------------
  const budgetSplit = useMemo(() => {
    const adults = TRIP_DATA.meta.travelers_count.adults; // 4
    const kids = TRIP_DATA.meta.travelers_count.kids; // 2
    // total 6 in meta, but scenario says 5?
    // Let's rely on explicit ratios. 
    // Logic: 5 people. Family (4) = 80%, Claudine (1) = 20%.
    const RATIO_FAM = 0.8;
    const RATIO_CLAU = 0.2;

    // 1. HOTELS (Explicit)
    const hotelsFam = sum(TRIP_DATA.hotels.map(h => h.budget.us));
    const hotelsClaudine = sum(TRIP_DATA.hotels.map(h => h.budget.claudine));

    // 2. SHARED FLIGHTS & TRANSFERS (Split)
    const flightsTotal = sum(TRIP_DATA.internal_flights.map(f => f.group_cost_usd));
    const transfersTotal = sum(TRIP_DATA.ground_transfers.map(t => t.cost_usd));
    
    const flightsFam = flightsTotal * RATIO_FAM;
    const flightsClaudine = flightsTotal * RATIO_CLAU;
    
    const transfersFam = transfersTotal * RATIO_FAM;
    const transfersClaudine = transfersTotal * RATIO_CLAU;

    // 3. ACTIVITIES (Calculated per person)
    // Claudine = 1 Adult
    // Family = (Adults - 1) + Kids
    const actTotalClaudine = sum(TRIP_DATA.activities.map(a => {
        const enabled = includeActivities[a.id] ?? true;
        if (!enabled || !a.cost) return 0;
        return a.cost.adult_vnd / vndPerUsd;
    }));

    const actTotalFam = sum(TRIP_DATA.activities.map(a => {
        const enabled = includeActivities[a.id] ?? true;
        if (!enabled || !a.cost) return 0;
        const famAdults = adults - 1; // 3
        const famKids = kids; // 2
        const childVnd = a.cost.child_vnd ?? a.cost.adult_vnd;
        const groupVnd = (a.cost.adult_vnd * famAdults) + (childVnd * famKids);
        return groupVnd / vndPerUsd;
    }));

    return {
        fam: {
            hotels: hotelsFam,
            flights: flightsFam,
            transfers: transfersFam,
            activities: actTotalFam,
            total: hotelsFam + flightsFam + transfersFam + actTotalFam
        },
        claudine: {
            hotels: hotelsClaudine,
            flights: flightsClaudine,
            transfers: transfersClaudine,
            activities: actTotalClaudine,
            total: hotelsClaudine + flightsClaudine + transfersClaudine + actTotalClaudine
        }
    };
  }, [includeActivities, vndPerUsd]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 print:bg-white print:pb-0">
      
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 print:hidden">
        <div className="max-w-[1120px] mx-auto px-4 h-16 flex items-center justify-between">
          <div className="font-bold text-xl tracking-tight text-slate-800 flex items-center gap-2">
            <span className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-serif italic">V</span>
            <span className="hidden md:inline">Vietnam 2026</span>
          </div>

          <nav className="hidden md:flex gap-1 bg-slate-100/50 p-1 rounded-xl">
            {[
              { id: 'itinerary', icon: Calendar, label: 'Itinéraire' },
              { id: 'hotels', icon: Hotel, label: 'Hôtels' },
              { id: 'culture', icon: BookOpen, label: 'Culture' },
              { id: 'guide', icon: Utensils, label: 'Guide & Food' },
              { id: 'budget', icon: Wallet, label: 'Budget' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setView(tab.id as any)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  view === tab.id ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <tab.icon size={16} /> {tab.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <MoodSelector currentMood={mood} setMood={setMood} />
            <button 
              onClick={handlePrint}
              className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
              title="Exporter PDF"
            >
              <Printer size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-[1120px] mx-auto px-4 py-8">
        {view === 'itinerary' && (
          <>
            <Hero />
            <FamilyGrid />
          </>
        )}

        {/* ITINERARY */}
        {view === 'itinerary' && (
          <div className="animate-fade-in">
            <div className="flex justify-between items-end mb-8 print:hidden">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Le Grand Tour</h2>
                <p className="text-slate-500 text-sm mt-1">Du 25 juillet au 17 août (Vietnam) • 7 étapes • rythme famille</p>
              </div>
            </div>

            <div className="space-y-2">
              {TRIP_DATA.itinerary_days.map((day) => (
                <DayCard 
                  key={day.date} 
                  day={day} 
                  mood={mood} 
                  toggleFav={toggleFavorite}
                  isFav={favorites.includes(day.date)}
                />
              ))}
            </div>
          </div>
        )}

        {/* HOTELS */}
        {view === 'hotels' && (
          <div className="animate-fade-in">
            <div className="relative rounded-2xl overflow-hidden mb-8 h-48 bg-indigo-900 text-white flex items-center justify-center shadow-lg">
              <img src={TRIP_DATA.hero_images["HoiAn"].src} className="absolute inset-0 w-full h-full object-cover opacity-50" />
              <div className="relative z-10 text-center">
                <h2 className="text-3xl font-bold mb-2">Nos Refuges</h2>
                <p className="text-indigo-100">La sélection validée (Booking/Officiel).</p>
              </div>
            </div>
             
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {TRIP_DATA.hotels.map((hotel, idx) => (
                <HotelCard key={idx} hotel={hotel} />
              ))}
            </div>
          </div>
        )}

        {/* CULTURE */}
        {view === 'culture' && (
          <div className="animate-fade-in">
            <div className="relative rounded-2xl overflow-hidden mb-8 h-48 bg-amber-900 text-white flex items-center justify-center shadow-lg">
              <img src={TRIP_DATA.hero_images["DaNang"].src} className="absolute inset-0 w-full h-full object-cover opacity-50" />
              <div className="relative z-10 text-center">
                <h2 className="text-3xl font-bold mb-2">Culture & Histoire</h2>
                <p className="text-amber-100">Liens essentiels (UNESCO / sites / guides fiables).</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Object.entries(TRIP_DATA.culture_links).map(([category, links]) => (
                <div key={category} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <BookOpen size={18} className="text-emerald-600" /> {category}
                  </h3>
                  <ul className="space-y-3">
                    {links.map((link, i) => (
                      <li key={i}>
                        <a 
                          href={link.url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-start gap-2 group"
                        >
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-indigo-500 transition-colors"></div>
                          <div>
                            <span className="text-slate-700 font-medium group-hover:text-indigo-600 transition-colors block">
                              {link.name}
                            </span>
                            <span className="text-[10px] text-slate-400 uppercase tracking-wide">Lien</span>
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GUIDE */}
        {view === 'guide' && (
          <div className="animate-fade-in grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <Checklist />
            </div>

            <div className="md:col-span-2 space-y-8">
              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                <h3 className="text-xl font-bold text-orange-900 mb-6 flex items-center gap-2">
                  <Utensils className="text-orange-600" /> Miam Miam (plats cultes)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {Object.entries(TRIP_DATA.food).map(([region, dishes]) => (
                    <div key={region}>
                      <h4 className="text-sm font-bold uppercase tracking-wider text-orange-800 mb-2 border-b border-orange-200 pb-1">
                        {region.replace('_', ' & ')}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {dishes.map((dish) => (
                          <span key={dish} className="bg-white text-orange-900 px-3 py-1 rounded-full text-sm font-medium shadow-sm border border-orange-100">
                            {dish}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <h3 className="text-xl font-bold text-slate-800 mb-6">Le Petit Glossaire</h3>
                <div className="grid gap-4">
                  {TRIP_DATA.glossary.map((item, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-xl bg-slate-50">
                      <div className="font-bold text-emerald-700 min-w-[140px]">{item.term}</div>
                      <div className="text-slate-600 text-sm">{item.note}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                  <Plane className="text-blue-600" /> Logistique (rappel)
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-bold text-blue-800 mb-2">Vols internes</h4>
                    <div className="grid gap-2">
                      {TRIP_DATA.internal_flights.map((f, i) => (
                        <div key={i} className="flex justify-between text-sm bg-white p-2 rounded-lg border border-blue-100">
                          <span className="font-mono font-bold text-blue-600">{f.route}</span>
                          <span className="text-slate-500">{f.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-blue-800 mb-2">Transferts</h4>
                    <div className="grid gap-2">
                      {TRIP_DATA.ground_transfers.map((t, i) => (
                        <div key={i} className="flex justify-between text-sm bg-white p-2 rounded-lg border border-blue-100">
                          <span className="text-slate-700">{t.name}</span>
                          <span className="font-bold">{formatUSD(t.cost_usd)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* BUDGET */}
        {view === 'budget' && (
          <div className="animate-fade-in">
            <div className="relative rounded-2xl overflow-hidden mb-8 h-48 bg-emerald-900 text-white flex items-center justify-center shadow-lg">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_25%,#34d399_0%,transparent_55%),radial-gradient(circle_at_80%_35%,#818cf8_0%,transparent_50%),radial-gradient(circle_at_55%_85%,#fbbf24_0%,transparent_45%)]" />
              <div className="relative z-10 text-center px-6">
                <h2 className="text-3xl font-bold mb-2">Budget Master</h2>
                <p className="text-emerald-100">Comptes séparés : Famille vs Claudine</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-6">
                
                {/* RECAP SPLIT */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-6">
                  
                  {/* FAMILLE */}
                  <div>
                    <div className="flex items-center gap-2 mb-3 text-emerald-800">
                      <Users size={18} />
                      <h3 className="text-lg font-bold">Budget Famille</h3>
                    </div>
                    <BudgetRow label="Hôtels" value={formatUSD(budgetSplit.fam.hotels)} />
                    <BudgetRow label="Vols (80%)" value={formatUSD(budgetSplit.fam.flights)} />
                    <BudgetRow label="Transferts (80%)" value={formatUSD(budgetSplit.fam.transfers)} />
                    <BudgetRow label="Activités (estim.)" value={formatUSD(budgetSplit.fam.activities)} />
                    <div className="mt-3 pt-3 border-t border-slate-200">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-500 uppercase font-bold">Total Famille</span>
                        <span className="text-xl font-extrabold text-emerald-600">{formatUSD(budgetSplit.fam.total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* CLAUDINE */}
                  <div className="pt-6 border-t border-dashed border-slate-200">
                    <div className="flex items-center gap-2 mb-3 text-indigo-800">
                      <Users size={18} />
                      <h3 className="text-lg font-bold">Budget Claudine</h3>
                    </div>
                    <BudgetRow label="Hôtels" value={formatUSD(budgetSplit.claudine.hotels)} />
                    <BudgetRow label="Vols (20%)" value={formatUSD(budgetSplit.claudine.flights)} />
                    <BudgetRow label="Transferts (20%)" value={formatUSD(budgetSplit.claudine.transfers)} />
                    <BudgetRow label="Activités (estim.)" value={formatUSD(budgetSplit.claudine.activities)} />
                    <div className="mt-3 pt-3 border-t border-slate-200">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-500 uppercase font-bold">Total Claudine</span>
                        <span className="text-xl font-extrabold text-indigo-600">{formatUSD(budgetSplit.claudine.total)}</span>
                      </div>
                    </div>
                  </div>

                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                  <div className="text-sm font-bold text-slate-800 mb-2">Taux VND → USD</div>
                  <div className="flex items-center gap-3">
                    <input 
                      type="number" 
                      value={vndPerUsd}
                      onChange={(e) => setVndPerUsd(Number(e.target.value || 0))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-semibold"
                      min={10000}
                      step={100}
                    />
                    <div className="text-xs text-slate-500 whitespace-nowrap">VND / 1 USD</div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-8">
                <ActivitiesBudget 
                  vndPerUsd={vndPerUsd} 
                  includeOptional={includeActivities} 
                  setIncludeOptional={setIncludeActivities} 
                />

                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800 mb-3">Notes de calcul</h3>
                  <div className="text-sm text-slate-600 space-y-2">
                    <p>• <strong>Hôtels :</strong> Basé sur les prix exacts de chaque chambre.</p>
                    <p>• <strong>Vols & Transferts :</strong> Coûts partagés divisés (Famille 80% / Claudine 20%).</p>
                    <p>• <strong>Activités :</strong> Claudine paie 1 part adulte. La famille paie les autres adultes + enfants.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </main>

      {/* MOBILE NAV */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 md:hidden flex justify-around p-2 pb-safe z-50 print:hidden">
        {[
          { id: 'itinerary', icon: Calendar, label: 'Trip' },
          { id: 'hotels', icon: Hotel, label: 'Hôtels' },
          { id: 'culture', icon: BookOpen, label: 'Culture' },
          { id: 'guide', icon: Utensils, label: 'Guide' },
          { id: 'budget', icon: Wallet, label: 'Budget' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setView(tab.id as any)}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              view === tab.id ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400'
            }`}
          >
            <tab.icon size={20} />
            <span className="text-[10px] font-medium mt-1">{tab.label}</span>
          </button>
        ))}
      </nav>

    </div>
  );
}
