import { useEffect, useMemo, useState, type ReactNode } from "react";
import { 
  Banknote, BatteryCharging, BookOpen, Calendar, CheckSquare, Heart, Hotel, Info, 
  Landmark, Languages, Lightbulb, MapPin, Navigation, Plane, Printer, Sparkles, 
  Smartphone, Star, Utensils, Wallet, X, ChevronRight, ChevronLeft, Flame, Moon, Shield, Search,
  TrendingUp, Calculator, ArrowRightLeft, User, Users
} from "lucide-react";

// ------------------------------------------------------------
// ASSET URL (Vite)
// ------------------------------------------------------------
const assetUrl = (path: string) => {
  const base = (import.meta as any)?.env?.BASE_URL ?? "/";
  const cleanBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
};

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
    },
    hotels: {
      hanoi_ja_cosmo: P("/covers/hotels/hanoi-ja-cosmo.jpg"),
      ninh_binh_tam_coc_golden_fields: P("/covers/hotels/ninh-binh-tam-coc-golden-fields.jpg"),
      ha_long_wyndham_legend: P("/covers/hotels/ha-long-wyndham-legend.jpg"),
      ha_long_renea_cruise: P("/covers/hotels/ha-long-rc-cruise.jpg"),
      hoi_an_palm_garden: P("/covers/hotels/hoi-an-palm-garden.png"),
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
  cover?: string;
};

type FlightItem = {
  route: string;
  time: string;
  group_cost_usd: number;
};

type TransferItem = {
  date?: string;
  name: string;
  cost_vnd: number;
  status: "CONFIRMED" | "ESTIMATE";
};

type DayBlock = {
  label: string;
  plan: string;
  links?: string[];
};

type ItineraryDay = {
  date: string;
  city: string;
  theme: string[];
  blocks: DayBlock[];
};

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

interface TripData {
  meta: {
    title: string;
    travelers: string;
    travelers_count: {
      adults: number;
      kids: number;
      kids_ages: number[]
    };
    vibe: string[];
    flights: {
      outbound: { from: string; date: string; time: string };
      arrive_hanoi: { date: string; time: string };
      return_depart_hanoi: { date: string; time: string };
      return_arrive_marrakech: { date: string; time: string };
    };
  };
  hotels: HotelItem[];
  internal_flights: FlightItem[];
  ground_transfers: TransferItem[];
  itinerary_days: ItineraryDay[];
  activities: Activity[];
}

// ------------------------------------------------------------
// DATA
// ------------------------------------------------------------
const TRIP_DATA: TripData = {
  meta: {
    title: "Vietnam 2026 — Family Trip",
    travelers: "3 adultes + 2 enfants (12 et 6) + Claudine (70, active)",
    travelers_count: { adults: 3, kids: 2, kids_ages: [12, 6] },
    vibe: ["culture", "histoire", "art", "nature", "bonne bouffe 🍲", "moments d’amour"],
    flights: {
      outbound: { from: "Marrakech", date: "2026-07-24", time: "18:55" },
      arrive_hanoi: { date: "2026-07-25", time: "19:30" },
      return_depart_hanoi: { date: "2026-08-17", time: "19:30" },
      return_arrive_marrakech: { date: "2026-08-18", time: "09:20" },
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
      cover: ASSETS.covers.hotels.hanoi_ja_cosmo
    },
    {
      city: "Ninh Binh (Tam Coc)",
      name: "Tam Coc Golden Fields Homestay",
      dates: "28 Jul → 30 Jul",
      budget: { us: 140, claudine: 110, currency: "USD" },
      booking_url: "https://www.booking.com/hotel/vn/tam-coc-golden-fields-homestay.html",
      why: "Base rizières + liberté; parfait pour le ‘wow’ Trang An sans galère.",
      cover: ASSETS.covers.hotels.ninh_binh_tam_coc_golden_fields
    },
    {
      city: "Ha Long",
      name: "Wyndham Legend Halong",
      dates: "30 Jul → 31 Jul",
      budget: { us: 130, claudine: 80, currency: "USD" },
      booking_url: "https://www.booking.com/hotel/vn/wyndham-legend-halong-bai-chay5.html",
      why: "Transition confortable avant croisière, logistique simple.",
      cover: ASSETS.covers.hotels.ha_long_wyndham_legend
    },
    {
      city: "Ha Long (Cruise)",
      name: "Renea Cruises Halong",
      dates: "31 Jul → 01 Aug",
      budget: { us: 330, claudine: 300, currency: "USD" },
      booking_url: "https://www.booking.com/hotel/vn/renea-cruises-halong-ha-long.html",
      why: "Le cœur ‘cinéma’ du voyage: karsts, baie, expérience famille.",
      cover: ASSETS.covers.hotels.ha_long_renea_cruise
    },
    {
      city: "Hoi An (Cua Dai Beach)",
      name: "Palm Garden Beach Resort & Spa",
      dates: "01 Aug → 06 Aug",
      budget: { us: 680, claudine: 620, currency: "USD" },
      booking_url: "https://www.booking.com/hotel/vn/palm-garden-beach-resort-spa-510.html",
      why: "Grand resort 5* avec plage privée, jardins tropicaux et immense piscine.",
      cover: ASSETS.covers.hotels.hoi_an_palm_garden
    },
    {
      city: "Da Nang",
      name: "Seahorse Signature Danang Hotel by Haviland",
      dates: "06 Aug → 08 Aug",
      budget: { us: 129, claudine: 92, currency: "USD" },
      booking_url: "https://www.booking.com/hotel/vn/seahorse-signature-danang-by-haviland.html",
      why: "Base urbaine efficace pour culture + musées + ponts.",
      cover: ASSETS.covers.hotels.da_nang_seahorse_signature
    },
    {
      city: "Whale Island (Hon Ong)",
      name: "Whale Island Resort",
      dates: "08 Aug → 12 Aug",
      budget: { us: 415, claudine: 415, currency: "USD" },
      official_url: "https://whaleislandresort.com/",
      why: "Déconnexion nature pure, rythme famille, mer & ciel.",
      cover: ASSETS.covers.hotels.whale_island_resort
    },
    {
      city: "Ho Chi Minh City",
      name: "Alagon Saigon Hotel & Spa",
      dates: "12 Aug → 15 Aug",
      budget: { us: 275, claudine: 211, currency: "USD" },
      booking_url: "https://www.booking.com/hotel/vn/alagon-saigon.html",
      why: "Très central pour histoire, colonial, street life.",
      cover: ASSETS.covers.hotels.hcmc_alagon_spa
    },
  ],
  internal_flights: [
    { route: "HPH → DAD", time: "19:00", group_cost_usd: 200 },
    { route: "DAD → CXR", time: "06:00", group_cost_usd: 250 },
    { route: "CXR → SGN", time: "16:00", group_cost_usd: 300 },
    { route: "SGN → HAN", time: "11:00", group_cost_usd: 250 },
  ],
  ground_transfers: [
    { date: "2026-07-25", name: "Noi Bai Airport (HAN) -> Ja Cosmo", cost_vnd: 520000, status: "CONFIRMED" },
    { date: "2026-07-28", name: "Ja Cosmo -> Ninh Binh (Limousine)", cost_vnd: 1560000, status: "CONFIRMED" },
    { date: "2026-07-30", name: "Ninh Binh -> Ha Long (Private)", cost_vnd: 1300000, status: "CONFIRMED" },
    { date: "2026-08-01", name: "Ha Long -> Hai Phong Airport (HPH)", cost_vnd: 1510000, status: "CONFIRMED" },
    { name: "Da Nang airport -> Hoi An", cost_vnd: 520000, status: "ESTIMATE" },
    { name: "Hoi An -> Da Nang", cost_vnd: 780000, status: "ESTIMATE" },
    { name: "Da Nang -> Da Nang airport", cost_vnd: 520000, status: "ESTIMATE" },
    { name: "CXR airport + port + bateau -> Whale Island", cost_vnd: 2080000, status: "ESTIMATE" },
    { name: "Whale Island -> port + CXR airport", cost_vnd: 2080000, status: "ESTIMATE" },
    { name: "SGN airport -> Alagon", cost_vnd: 520000, status: "ESTIMATE" },
    { name: "Alagon -> SGN airport", cost_vnd: 520000, status: "ESTIMATE" },
    { date: "2026-08-15", name: "HAN airport -> Ja Cosmo", cost_vnd: 520000, status: "ESTIMATE" },
    { date: "2026-08-17", name: "Ja Cosmo -> HAN airport", cost_vnd: 390000, status: "ESTIMATE" },
  ],
  itinerary_days: [
    { date: "2026-07-25", city: "Hanoi", theme: ["arrivée", "repos"], blocks: [{ label: "Soir", plan: "Arrivée 19:30, transfert, check-in, dodo." }] },
    { date: "2026-07-26", city: "Hanoi", theme: ["culture", "street-life"], blocks: [{ label: "Jour", plan: "Old Quarter, Hoan Kiem, Street food." }] },
    { date: "2026-07-27", city: "Hanoi", theme: ["histoire", "esthétique"], blocks: [{ label: "Matin", plan: "Temple of Literature." }] },
    { date: "2026-07-28", city: "Hanoi → Ninh Binh", theme: ["transfert"], blocks: [{ label: "Midi", plan: "Départ limousine." }] },
    { date: "2026-07-29", city: "Ninh Binh", theme: ["nature", "wow"], blocks: [{ label: "Matin", plan: "Trang An boat tour." }] },
    { date: "2026-07-30", city: "Ninh Binh → Ha Long", theme: ["transfert"], blocks: [{ label: "Midi", plan: "Route vers Ha Long." }] },
    { date: "2026-07-31", city: "Ha Long", theme: ["croisière"], blocks: [{ label: "Midi", plan: "Embarquement Renea." }] },
    { date: "2026-08-01", city: "Ha Long → Da Nang → Hoi An", theme: ["transit"], blocks: [{ label: "Soir", plan: "Vol HPH-DAD." }] },
    { date: "2026-08-02", city: "Hoi An", theme: ["plage", "lanternes"], blocks: [{ label: "Jour", plan: "Repos, An Bang beach." }] },
    { date: "2026-08-03", city: "Hoi An", theme: ["culture"], blocks: [{ label: "Matin", plan: "Old Town tôt." }] },
    { date: "2026-08-04", city: "Hoi An", theme: ["cuisine"], blocks: [{ label: "Jour", plan: "Marché et cours." }] },
    { date: "2026-08-05", city: "Hoi An", theme: ["libre"], blocks: [{ label: "Jour", plan: "Plage, massages." }] },
    { date: "2026-08-06", city: "Hoi An → Da Nang", theme: ["transfert"], blocks: [{ label: "Aprem", plan: "Check-in Seahorse." }] },
    { date: "2026-08-07", city: "Da Nang", theme: ["art"], blocks: [{ label: "Matin", plan: "Cham Museum." }] },
    { date: "2026-08-08", city: "Da Nang → Whale Island", theme: ["nature"], blocks: [{ label: "Matin", plan: "Vol 06:00 DAD-CXR." }] },
    { date: "2026-08-09", city: "Whale Island", theme: ["déconnexion"], blocks: [{ label: "Jour", plan: "Snorkeling, sieste." }] },
    { date: "2026-08-10", city: "Whale Island", theme: ["déconnexion"], blocks: [{ label: "Jour", plan: "Plage, lecture." }] },
    { date: "2026-08-11", city: "Whale Island", theme: ["slow"], blocks: [{ label: "Jour", plan: "Dernier jour mer." }] },
    { date: "2026-08-12", city: "Whale Island → HCMC", theme: ["transit"], blocks: [{ label: "Aprem", plan: "Vol 16:00 CXR-SGN." }] },
    { date: "2026-08-13", city: "HCMC", theme: ["colonial"], blocks: [{ label: "Jour", plan: "Post Office, Palace." }] },
    { date: "2026-08-14", city: "HCMC", theme: ["histoire"], blocks: [{ label: "Jour", plan: "War Museum, Cholon." }] },
    { date: "2026-08-15", city: "HCMC → Hanoi", theme: ["transit"], blocks: [{ label: "Matin", plan: "Vol 11:00 SGN-HAN." }] },
    { date: "2026-08-16", city: "Hanoi", theme: ["libre"], blocks: [{ label: "Jour", plan: "Best-of ruelles." }] },
    { date: "2026-08-17", city: "Hanoi", theme: ["départ"], blocks: [{ label: "Aprem", plan: "Vol 19:30." }] },
  ],
  activities: [
    { id: "hoa-lo", city: "Hanoi", name: "Hoa Lo Prison", cost: { currency: "VND", adult_vnd: 50000 }, tags: ["histoire"] },
    { id: "water-puppets", city: "Hanoi", name: "Water Puppets", cost: { currency: "VND", adult_vnd: 150000 }, tags: ["culture"] },
    { id: "trang-an", city: "Ninh Binh", name: "Trang An Boat Tour", cost: { currency: "VND", adult_vnd: 250000, child_vnd: 120000 }, tags: ["nature"] },
    { id: "hoi-an-old-town", city: "Hoi An", name: "Old Town Entry", cost: { currency: "VND", adult_vnd: 120000 }, tags: ["unesco"] },
    { id: "cham-museum", city: "Da Nang", name: "Cham Museum", cost: { currency: "VND", adult_vnd: 60000 }, tags: ["art"] },
    { id: "war-remnants", city: "HCMC", name: "War Remnants Museum", cost: { currency: "VND", adult_vnd: 40000 }, tags: ["histoire"] },
  ],
};

// ------------------------------------------------------------
// FAMILY MEMBERS
// ------------------------------------------------------------
const FAMILY_MEMBERS = [
  { name: "Marilyne", desc: "La Boss", src: ASSETS.family.marilyne, fallback: "https://ui-avatars.com/api/?name=Marilyne" },
  { name: "Claudine", desc: "La Sage", src: ASSETS.family.claudine, fallback: "https://ui-avatars.com/api/?name=Claudine" },
  { name: "Nizzar", desc: "Le Pilote", src: ASSETS.family.nizzar, fallback: "https://ui-avatars.com/api/?name=Nizzar" },
  { name: "Aydann", desc: "L'Ado", src: ASSETS.family.aydann, fallback: "https://ui-avatars.com/api/?name=Aydann" },
  { name: "Milann", desc: "La Mascotte", src: ASSETS.family.milann, fallback: "https://ui-avatars.com/api/?name=Milann" },
];

// ------------------------------------------------------------
// COMPONENTS
// ------------------------------------------------------------
const Glass = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`backdrop-blur-xl bg-white/80 border border-white/20 shadow-2xl rounded-[2.5rem] ${className}`}>
    {children}
  </div>
);

const Card = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`bg-white rounded-3xl p-6 shadow-sm border border-slate-100 ${className}`}>
    {children}
  </div>
);

// ------------------------------------------------------------
// HELPERS
// ------------------------------------------------------------
const formatUSD = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const formatVND = (n: number) => (n / 1000).toLocaleString() + "k";
const safeDateLabel = (iso: string) => new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

// ------------------------------------------------------------
// APP
// ------------------------------------------------------------
export default function App() {
  const [view, setView] = useState<View>("home");
  const [vndPerUsd, setVndPerUsd] = useState(25975);

  const budgetSplit = useMemo(() => {
    const adults = TRIP_DATA.meta.travelers_count.adults; // 3
    const kids = TRIP_DATA.meta.travelers_count.kids; // 2
    const totalPeople = adults + kids; // 5

    const hotelsFam = sum(TRIP_DATA.hotels.map(h => h.budget.us));
    const hotelsClau = sum(TRIP_DATA.hotels.map(h => h.budget.claudine));
    
    const flightsTotal = sum(TRIP_DATA.internal_flights.map(f => f.group_cost_usd));
    const transfersTotalVND = sum(TRIP_DATA.ground_transfers.map(t => t.cost_vnd));
    const transfersTotalUSD = transfersTotalVND / vndPerUsd;

    // Split logic: Family (2A+2K) = 4/5, Claudine (1A) = 1/5
    const famRatio = 4 / 5;
    const clauRatio = 1 / 5;

    return {
      fam: {
        count: 4,
        label: "Famille (2A + 2E)",
        hotels: hotelsFam,
        flights: flightsTotal * famRatio,
        transfers: transfersTotalUSD * famRatio,
        total: hotelsFam + (flightsTotal * famRatio) + (transfersTotalUSD * famRatio),
      },
      clau: {
        count: 1,
        label: "Claudine (1A)",
        hotels: hotelsClau,
        flights: flightsTotal * clauRatio,
        transfers: transfersTotalUSD * clauRatio,
        total: hotelsClau + (flightsTotal * clauRatio) + (transfersTotalUSD * clauRatio),
      }
    };
  }, [vndPerUsd]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-teal-100 pb-32">
      {/* NAV */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md">
        <Glass className="flex items-center justify-between p-2">
          {["home", "itinerary", "hotels", "budget"].map((v) => {
            const active = view === v;
            const Icon = v === "home" ? Sparkles : v === "itinerary" ? MapPin : v === "hotels" ? Hotel : Banknote;
            return (
              <button
                key={v}
                onClick={() => setView(v as View)}
                className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-3xl transition-all duration-500 ${
                  active ? "bg-slate-900 text-white scale-105 shadow-xl" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <Icon size={18} />
                <span className="text-[10px] font-bold uppercase tracking-wider">{v}</span>
              </button>
            );
          })}
        </Glass>
      </div>

      <main className="max-w-2xl mx-auto px-6 pt-12">
        {view === "home" && (
          <div className="space-y-12">
            <header className="space-y-4">
              <div className="flex items-center gap-3 text-teal-600 font-bold uppercase tracking-widest text-sm">
                <Flame size={16} fill="currentColor" />
                <span>Vietnam 2026</span>
              </div>
              <h1 className="text-6xl font-black tracking-tighter leading-none italic">
                SOUVENIR <br /> EN FAMILLE
              </h1>
              <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-md">
                Un voyage conçu pour l'émerveillement, la gourmandise et la douceur entre Marrakech et le Tonkin.
              </p>
            </header>

            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black uppercase tracking-tight">L'Équipage</h2>
                <Users size={20} className="text-slate-300" />
              </div>
              <div className="grid grid-cols-5 gap-3">
                {FAMILY_MEMBERS.map(m => (
                  <div key={m.name} className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-200 border-2 border-white shadow-sm">
                      <img 
                        src={m.src} 
                        alt={m.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => e.currentTarget.src = m.fallback} 
                      />
                    </div>
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">{m.name}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {view === "itinerary" && (
          <div className="space-y-8">
            <h2 className="text-4xl font-black italic tracking-tight">Le Chemin.</h2>
            <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-0 before:w-px before:bg-slate-200">
              {TRIP_DATA.itinerary_days.map((day, idx) => (
                <div key={idx} className="relative pl-12 group">
                  <div className="absolute left-3 top-2 w-2 h-2 rounded-full bg-slate-300 group-hover:bg-teal-500 transition-colors" />
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {safeDateLabel(day.date)} • {day.city}
                    </span>
                    <h3 className="text-xl font-bold group-hover:text-teal-700 transition-colors">
                      {day.theme.join(" • ")}
                    </h3>
                    <div className="pt-2 space-y-3">
                      {day.blocks.map((b, i) => (
                        <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                          <span className="text-[9px] font-black uppercase text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full mb-1 inline-block">
                            {b.label}
                          </span>
                          <p className="text-sm text-slate-600 leading-relaxed font-medium">
                            {b.plan}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === "hotels" && (
          <div className="space-y-8">
            <h2 className="text-4xl font-black italic tracking-tight">Les Escales.</h2>
            <div className="grid gap-6">
              {TRIP_DATA.hotels.map((h, i) => (
                <Card key={i} className="overflow-hidden p-0 group">
                  {h.cover && (
                    <div className="h-48 overflow-hidden relative">
                      <img src={h.cover} alt={h.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-80">{h.city}</span>
                        <h3 className="text-lg font-bold leading-none">{h.name}</h3>
                      </div>
                    </div>
                  )}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                      <div className="flex items-center gap-2">
                        <Calendar size={12} />
                        <span>{h.dates}</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 italic font-medium leading-relaxed">
                      “{h.why}”
                    </p>
                    <div className="flex items-center gap-3 pt-2">
                      {h.booking_url && (
                        <a href={h.booking_url} target="_blank" className="flex-1 text-center py-2.5 rounded-xl bg-slate-900 text-white text-[11px] font-black uppercase tracking-wider hover:bg-teal-600 transition-colors">
                          Booking.com
                        </a>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {view === "budget" && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="space-y-2">
              <h2 className="text-4xl font-black italic tracking-tight">Budget.</h2>
              <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
                <Calculator size={14} />
                <span>Base 1$ = {vndPerUsd.toLocaleString()} VND</span>
              </div>
            </header>

            {/* Split Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[budgetSplit.fam, budgetSplit.clau].map((group, idx) => (
                <Card key={idx} className={`relative overflow-hidden ${idx === 0 ? 'bg-slate-900 text-white' : 'bg-white'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-xl ${idx === 0 ? 'bg-white/10' : 'bg-slate-100'}`}>
                      {idx === 0 ? <Users size={20} /> : <User size={20} />}
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-tighter ${idx === 0 ? 'text-white/40' : 'text-slate-400'}`}>
                      {group.label}
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-3xl font-black tabular-nums">{formatUSD(group.total)}</div>
                    <div className={`text-[11px] font-bold ${idx === 0 ? 'text-teal-400' : 'text-teal-600'}`}>
                      {formatUSD(group.total / group.count)} / personne
                    </div>
                  </div>
                  
                  <div className={`mt-6 pt-6 border-t ${idx === 0 ? 'border-white/10' : 'border-slate-100'} space-y-2`}>
                    <div className="flex justify-between text-[10px] font-bold opacity-60 uppercase tracking-widest">
                      <span>Hôtels</span>
                      <span>{formatUSD(group.hotels)}</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold opacity-60 uppercase tracking-widest">
                      <span>Vols</span>
                      <span>{formatUSD(group.flights)}</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold opacity-60 uppercase tracking-widest">
                      <span>Transferts</span>
                      <span>{formatUSD(group.transfers)}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Ja Cosmo Table Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                    <ArrowRightLeft size={20} />
                  </div>
                  <div>
                    <h3 className="font-black uppercase tracking-tight text-sm">Transferts Ja Cosmo</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Suivi des paiements VND</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-teal-600 tabular-nums">4,890k VND</div>
                  <span className="text-[9px] font-black uppercase text-slate-400">Total Confirmé</span>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="p-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Date</th>
                      <th className="p-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Trajet</th>
                      <th className="p-4 text-[9px] font-black uppercase tracking-widest text-slate-400 text-right">Prix</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-sm">
                    {TRIP_DATA.ground_transfers.map((t, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 font-bold text-slate-400 tabular-nums whitespace-nowrap">
                          {t.date ? safeDateLabel(t.date) : "—"}
                        </td>
                        <td className="p-4 font-bold text-slate-800">
                          {t.name}
                          {t.status === "ESTIMATE" && (
                            <span className="ml-2 px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-600 text-[8px] font-black align-middle">EST.</span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <span className="font-black text-slate-900 tabular-nums">{formatVND(t.cost_vnd)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Currency Input */}
            <Card className="bg-teal-50 border-teal-100 p-8 text-center space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-600">Simulateur de Change</span>
              <div className="flex items-center justify-center gap-4">
                <div className="text-4xl font-black text-slate-900">1$</div>
                <TrendingUp className="text-teal-400" />
                <input 
                  type="number" 
                  value={vndPerUsd}
                  onChange={(e) => setVndPerUsd(Number(e.target.value))}
                  className="w-32 px-4 py-2 rounded-2xl bg-white border-2 border-teal-200 font-black text-2xl text-teal-700 focus:outline-none focus:border-teal-500 text-center transition-all tabular-nums"
                />
                <div className="text-2xl font-black text-slate-400">VND</div>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
