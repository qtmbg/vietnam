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

const assetUrl = (path: string) => {
  const base = (import.meta as any)?.env?.BASE_URL ?? "/";
  const cleanBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
};

const P = (p: string) => assetUrl(p);

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
  cover?: string;
};
type FlightItem = {
  route: string;
  time: string;
  group_cost_usd: number;
};
type TransferItem = {
  name: string;
  cost_vnd?: number;
  cost_usd?: number;
  status: 'CONFIRMED' | 'ESTIMATE';
};
type DayBlock = { label: string; plan: string; links?: string[]; };
type ItineraryDay = { date: string; city: string; theme: string[]; blocks: DayBlock[]; };
type ActivityCost = { currency: "VND"; adult_vnd: number; child_vnd?: number; notes?: string; };
type Activity = { id: string; city: string; name: string; link?: string; cost?: ActivityCost; tags?: string[]; when?: string; };

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
  hotels: HotelItem[];
  internal_flights: FlightItem[];
  ground_transfers: TransferItem[];
  itinerary_days: ItineraryDay[];
  activities: Activity[];
}

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
    { route: "Vol Intérieur 1", time: "À définir", group_cost_usd: 287.5 },
    { route: "Vol Intérieur 2", time: "À définir", group_cost_usd: 287.5 },
    { route: "Vol Intérieur 3", time: "À définir", group_cost_usd: 287.5 },
    { route: "Vol Intérieur 4", time: "À définir", group_cost_usd: 287.5 },
  ],
  ground_transfers: [
    { name: "HAN airport → Ja Cosmo", cost_vnd: 520000, status: "CONFIRMED" },
    { name: "Ja Cosmo → Gare (Train)", cost_vnd: 520000, status: "CONFIRMED" },
    { name: "Gare (Train) → Ja Cosmo", cost_vnd: 520000, status: "CONFIRMED" },
    { name: "Ja Cosmo → HAN airport", cost_vnd: 520000, status: "CONFIRMED" },
    { name: "Limousine (D'une traite)", cost_vnd: 2810000, status: "CONFIRMED" },
    { name: "Estimation Route (B1.1)", cost_usd: 47.5, status: "ESTIMATE" },
    { name: "Estimation Route (B1.2)", cost_usd: 47.5, status: "ESTIMATE" },
    { name: "Estimation Route (B1.3)", cost_usd: 47.5, status: "ESTIMATE" },
    { name: "Estimation Route (B1.4)", cost_usd: 47.5, status: "ESTIMATE" },
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

const FAMILY_MEMBERS = [
  { name: "Marilyne", desc: "La Boss", src: ASSETS.family.marilyne, fallback: "https://ui-avatars.com/api/?name=Marilyne" },
  { name: "Claudine", desc: "La Sage", src: ASSETS.family.claudine, fallback: "https://ui-avatars.com/api/?name=Claudine" },
  { name: "Nizzar", desc: "Le Pilote", src: ASSETS.family.nizzar, fallback: "https://ui-avatars.com/api/?name=Nizzar" },
  { name: "Aydann", desc: "L'Ado", src: ASSETS.family.aydann, fallback: "https://ui-avatars.com/api/?name=Aydann" },
  { name: "Milann", desc: "La Mascotte", src: ASSETS.family.milann, fallback: "https://ui-avatars.com/api/?name=Milann" },
];

const formatUSD = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
const safeDateLabel = (iso: string) => new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

const Glass = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`backdrop-blur-xl bg-white/70 border border-white/40 shadow-xl overflow-hidden ${className}`}>
    {children}
  </div>
);

export default function App() {
  const [view, setView] = useState<View>("home");
  const [vndPerUsd, setVndPerUsd] = useState(25975);

  const budgetSplit = useMemo(() => {
    const adults = TRIP_DATA.meta.travelers_count.adults;
    const kids = TRIP_DATA.meta.travelers_count.kids;
    const hotelsTotal = sum(TRIP_DATA.hotels.map(h => h.budget.us + h.budget.claudine));
    const flightsTotal = sum(TRIP_DATA.internal_flights.map(f => f.group_cost_usd));
    const transfersConfirmedVnd = sum(TRIP_DATA.ground_transfers.filter(t => t.status === "CONFIRMED").map(t => t.cost_vnd || 0));
    const transfersEstimateUsd = sum(TRIP_DATA.ground_transfers.filter(t => t.status === "ESTIMATE").map(t => t.cost_usd || 0));
    
    return {
      total: hotelsTotal + flightsTotal + (transfersConfirmedVnd / vndPerUsd) + transfersEstimateUsd
    };
  }, [vndPerUsd]);

  const TabsList = [
    { id: "home", icon: Star, label: "Home" },
    { id: "itinerary", icon: Calendar, label: "Itinéraire" },
    { id: "hotels", icon: Hotel, label: "Hôtels" },
    { id: "budget", icon: Wallet, label: "Budget" },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-32 overflow-x-hidden select-none">
      {view === "home" && (
        <div className="animate-in fade-in duration-500">
          <div className="relative h-[60vh] bg-slate-900">
            <img src={ASSETS.covers.sections.home} className="absolute inset-0 w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900" />
            <div className="absolute bottom-10 left-8">
              <h1 className="text-6xl font-black text-white leading-none mb-2">VIETNAM</h1>
              <p className="text-emerald-400 font-black tracking-widest uppercase">Family Trip 2026</p>
            </div>
          </div>
          <div className="px-8 -mt-8 relative space-y-12">
            <Glass className="rounded-[40px] p-8 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                <p className="text-lg font-black text-slate-900">En préparation 📝</p>
              </div>
              <div className="flex -space-x-3">
                {FAMILY_MEMBERS.map(m => <img key={m.name} src={m.src} className="w-10 h-10 rounded-full border-2 border-white object-cover" onError={(e) => e.currentTarget.src = m.fallback} />)}
              </div>
            </Glass>
            <div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-6">Équipage</h3>
              <div className="grid grid-cols-1 gap-4">
                {FAMILY_MEMBERS.map(m => (
                  <div key={m.name} className="flex items-center gap-4 p-4 bg-white rounded-3xl border border-slate-100 shadow-sm">
                    <img src={m.src} className="w-12 h-12 rounded-full object-cover" onError={(e) => e.currentTarget.src = m.fallback} />
                    <div>
                      <p className="font-black text-slate-900">{m.name}</p>
                      <p className="text-xs font-bold text-slate-400">{m.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {view === "itinerary" && (
        <div className="animate-in slide-in-from-bottom duration-500 px-8 pt-12 space-y-12">
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Itinéraire</h2>
          {TRIP_DATA.itinerary_days.map((day) => (
            <div key={day.date} className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{safeDateLabel(day.date)} • {day.city}</p>
              </div>
              <Glass className="rounded-[32px] p-6">
                <h3 className="text-xl font-black text-slate-900 mb-4">{day.theme.join(" • ")}</h3>
                {day.blocks.map((b, i) => (
                  <div key={i} className="mb-4 last:mb-0">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{b.label}</p>
                    <p className="text-sm font-bold text-slate-700">{b.plan}</p>
                  </div>
                ))}
              </Glass>
            </div>
          ))}
        </div>
      )}

      {view === "hotels" && (
        <div className="animate-in slide-in-from-bottom duration-500 px-8 pt-12 space-y-8">
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Hôtels</h2>
          {TRIP_DATA.hotels.map((h, i) => (
            <Glass key={i} className="rounded-[40px] overflow-hidden">
              <img src={h.cover} className="h-48 w-full object-cover" />
              <div className="p-8">
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">{h.city}</p>
                <h3 className="text-2xl font-black text-slate-900 mb-4">{h.name}</h3>
                <p className="text-xs font-bold text-slate-500 italic mb-6">“{h.why}”</p>
                <div className="flex justify-between items-end">
                  <p className="text-xs font-black text-slate-400">{h.dates}</p>
                  {h.booking_url && <a href={h.booking_url} target="_blank" className="px-4 py-2 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase">Réserver</a>}
                </div>
              </div>
            </Glass>
          ))}
        </div>
      )}

      {view === "budget" && (
        <div className="animate-in slide-in-from-bottom duration-500 px-6 pt-12">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-1">Budget</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Vietnam 2026</p>
            </div>
            <button onClick={() => setView("home")} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6 pb-20">
            <Glass className="rounded-[40px] p-8">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Total Global Prévu</p>
              <p className="text-5xl font-black text-slate-900 tracking-tighter mb-4">
                {formatUSD(1528.26)}
              </p>
              <div className="flex gap-4">
                <div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase">
                  $188.26 (Confirmé)
                </div>
                <div className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-black uppercase">
                  $1,340.00 (Estimé)
                </div>
              </div>
            </Glass>

            <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex justify-between items-end">
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Section A : Ja Cosmo</h3>
                  <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Confirmed via Chat</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-slate-900">4,890k VND</p>
                  <p className="text-[10px] font-bold text-slate-400">≈ $188.26</p>
                </div>
              </div>
              <div className="p-0">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase">Trajet</th>
                      <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase text-right">VND</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {[
                      { name: "HAN airport → Ja Cosmo", cost: "520k" },
                      { name: "Ja Cosmo → Gare (Train)", cost: "520k" },
                      { name: "Gare (Train) → Ja Cosmo", cost: "520k" },
                      { name: "Ja Cosmo → HAN airport", cost: "520k" },
                      { name: "Limousine (D'une traite)", cost: "2,810k" },
                    ].map((item, i) => (
                      <tr key={i}>
                        <td className="px-6 py-4 text-xs font-bold text-slate-700">{item.name}</td>
                        <td className="px-6 py-4 text-xs font-black text-slate-900 text-right">{item.cost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <Glass className="rounded-[40px] p-8">
                <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Section B1 : Route / Limousine</p>
                <div className="flex justify-between items-end">
                  <h3 className="text-xl font-black text-slate-900">Estimation 4 trajets</h3>
                  <p className="text-xl font-black text-slate-900">$190</p>
                </div>
              </Glass>

              <Glass className="rounded-[40px] p-8">
                <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Section B2 : Vols Intérieurs</p>
                <div className="flex justify-between items-end">
                  <h3 className="text-xl font-black text-slate-900">Estimation 4 vols</h3>
                  <p className="text-xl font-black text-slate-900">$1,150</p>
                </div>
              </Glass>
            </div>

            <div className="p-8 rounded-[40px] bg-slate-100 border border-slate-200">
              <p className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Banknote size={16} /> Taux de change (Fixé)
              </p>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-black text-slate-900">1 USD = 25,975 VND</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-6 left-6 right-6 z-[90]">
        <div className="backdrop-blur-2xl bg-slate-900/90 rounded-[40px] border border-white/10 p-2 flex items-center justify-between shadow-2xl">
          {TabsList.map((tab) => {
            const Icon = tab.icon;
            const active = view === tab.id;
            return (
              <button key={tab.id} onClick={() => setView(tab.id as View)} className={`flex-1 flex flex-col items-center justify-center py-4 rounded-3xl transition-all ${active ? "bg-white text-slate-900 scale-105 shadow-xl" : "text-white/40"}`}>
                <Icon size={18} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
