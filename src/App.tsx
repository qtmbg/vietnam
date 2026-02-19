import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Banknote, BatteryCharging, BookOpen, Calendar, CheckSquare, Heart, Hotel, Info, Landmark, Languages, Lightbulb, MapPin, Navigation, Plane, Printer, Sparkles, Smartphone, Star, Utensils, Wallet, X, ChevronRight, ChevronLeft, Flame, Moon, Shield, Search, } from "lucide-react";

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
    { city: "Hanoi", name: "Ja Cosmo Hotel and Spa", dates: "25 Jul → 28 Jul, puis 15 Aug → 17 Aug", budget: { us: 180, claudine: 110, currency: "USD" }, booking_url: "https://www.booking.com/hotel/vn/ja-cosmo-and-spa.html", why: "Central pour ruelles, cafés, culture; simple avec kids + Claudine.", cover: ASSETS.covers.hotels.hanoi_ja_cosmo },
    { city: "Ninh Binh (Tam Coc)", name: "Tam Coc Golden Fields Homestay", dates: "28 Jul → 30 Jul", budget: { us: 140, claudine: 110, currency: "USD" }, booking_url: "https://www.booking.com/hotel/vn/tam-coc-golden-fields-homestay.html", why: "Base rizières + liberté; parfait pour le ‘wow’ Trang An sans galère.", cover: ASSETS.covers.hotels.ninh_binh_tam_coc_golden_fields },
    { city: "Ha Long", name: "Wyndham Legend Halong", dates: "30 Jul → 31 Jul", budget: { us: 130, claudine: 80, currency: "USD" }, booking_url: "https://www.booking.com/hotel/vn/wyndham-legend-halong-bai-chay5.html", why: "Transition confortable avant croisière, logistique simple.", cover: ASSETS.covers.hotels.ha_long_wyndham_legend },
    { city: "Ha Long (Cruise)", name: "Renea Cruises Halong", dates: "31 Jul → 01 Aug", budget: { us: 330, claudine: 300, currency: "USD" }, booking_url: "https://www.booking.com/hotel/vn/renea-cruises-halong-ha-long.html", why: "Le cœur ‘cinéma’ du voyage: karsts, baie, expérience famille.", cover: ASSETS.covers.hotels.ha_long_renea_cruise },
    { city: "Hoi An (Cua Dai Beach)", name: "Palm Garden Beach Resort & Spa", dates: "01 Aug → 06 Aug", budget: { us: 680, claudine: 620, currency: "USD" }, booking_url: "https://www.booking.com/hotel/vn/palm-garden-beach-resort-spa-510.html", why: "Grand resort 5* avec plage privée, jardins tropicaux et immense piscine.", cover: ASSETS.covers.hotels.hoi_an_palm_garden },
    { city: "Da Nang", name: "Seahorse Signature Danang Hotel by Haviland", dates: "06 Aug → 08 Aug", budget: { us: 129, claudine: 92, currency: "USD" }, booking_url: "https://www.booking.com/hotel/vn/seahorse-signature-danang-by-haviland.html", why: "Base urbaine efficace pour culture + musées + ponts.", cover: ASSETS.covers.hotels.da_nang_seahorse_signature },
    { city: "Whale Island (Hon Ong)", name: "Whale Island Resort", dates: "08 Aug → 12 Aug", budget: { us: 415, claudine: 415, currency: "USD" }, official_url: "https://whaleislandresort.com/", why: "Déconnexion nature pure, rythme famille, mer & ciel.", cover: ASSETS.covers.hotels.whale_island_resort },
    { city: "Ho Chi Minh City", name: "Alagon Saigon Hotel & Spa", dates: "12 Aug → 15 Aug", budget: { us: 275, claudine: 211, currency: "USD" }, booking_url: "https://www.booking.com/hotel/vn/alagon-saigon.html", why: "Très central pour histoire, colonial, street life.", cover: ASSETS.covers.hotels.hcmc_alagon_spa },
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
// HELPERS
// ------------------------------------------------------------
const formatUSD = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const safeDateLabel = (iso: string) => new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

// ------------------------------------------------------------
// APP
// ------------------------------------------------------------
export default function App() {
  const [view, setView] = useState("home");
  const [vndPerUsd, setVndPerUsd] = useState(25975);

  // Budget logic
  const budgetSplit = useMemo(() => {
    const adults = TRIP_DATA.meta.travelers_count.adults;
    const kids = TRIP_DATA.meta.travelers_count.kids;
    
    const hotelsFam = sum(TRIP_DATA.hotels.map(h => h.budget.us));
    const hotelsClau = sum(TRIP_DATA.hotels.map(h => h.budget.claudine));
    
    const flightsUsd = sum(TRIP_DATA.internal_flights.map(f => f.group_cost_usd));
    const transfersUsd = sum(TRIP_DATA.ground_transfers.map(t => t.cost_vnd / vndPerUsd));
    
    const famRatio = 4 / 5; // Family (2 Adults + 2 Kids)
    const clauRatio = 1 / 5; // Claudine (1 Adult)
    
    return {
      fam: {
        hotels: hotelsFam,
        flights: flightsUsd * famRatio,
        transfers: transfersUsd * famRatio,
        total: hotelsFam + (flightsUsd * famRatio) + (transfersUsd * famRatio),
      },
      clau: {
        hotels: hotelsClau,
        flights: flightsUsd * clauRatio,
        transfers: transfersUsd * clauRatio,
        total: hotelsClau + (flightsUsd * clauRatio) + (transfersUsd * clauRatio),
      }
    };
  }, [vndPerUsd]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-24">
      {/* NAV */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur px-2 py-2 rounded-full flex gap-1 z-50 shadow-2xl">
        {["home", "itinerary", "hotels", "budget"].map((v) => (
          <button
            key={v}
            onClick={() => setView(v as View)}
            className={`px-6 py-3 rounded-full text-xs font-bold uppercase ${view === v ? "bg-white text-slate-900" : "text-white/50"}`}
          >
            {v}
          </button>
        ))}
      </nav>

      {view === "home" && (
        <div>
          <header className="h-[60vh] relative flex items-center justify-center overflow-hidden">
            <img src={ASSETS.covers.sections.home} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative text-center text-white">
              <h1 className="text-7xl font-black tracking-tighter">VIETNAM<br/>2026</h1>
              <p className="mt-4 uppercase tracking-[0.3em] font-bold text-white/70">Family Trip</p>
            </div>
          </header>

          <section className="p-8 max-w-xl mx-auto">
            <h2 className="text-3xl font-black mb-8">Équipage</h2>
            <div className="flex flex-wrap gap-4">
              {FAMILY_MEMBERS.map(m => (
                <div key={m.name} className="flex-1 min-w-[100px] text-center">
                  <img src={m.src} className="w-full aspect-square rounded-3xl object-cover mb-2 border-2 border-slate-200" onError={(e) => e.currentTarget.src = m.fallback} />
                  <p className="font-bold text-xs">{m.name}</p>
                </div>
              ))}
            </div>
            <div className="mt-12 p-8 rounded-[40px] bg-indigo-50 border border-indigo-100">
              <h3 className="font-black text-indigo-900 mb-2">Détails</h3>
              <p className="text-indigo-700/70 text-sm leading-relaxed">{TRIP_DATA.meta.travelers}</p>
            </div>
          </section>
        </div>
      )}

      {view === "itinerary" && (
        <div className="p-8 max-w-xl mx-auto">
          <h2 className="text-3xl font-black mb-8">Itinéraire</h2>
          {TRIP_DATA.itinerary_days.map((day, idx) => (
            <div key={idx} className="mb-8 pl-6 border-l-2 border-slate-200 relative">
              <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-slate-900" />
              <p className="text-xs font-black uppercase text-slate-400 mb-1">{safeDateLabel(day.date)} • {day.city}</p>
              <h3 className="text-xl font-black mb-4">{day.theme.join(" • ")}</h3>
              {day.blocks.map((b, i) => (
                <div key={i} className="mb-4 p-4 rounded-2xl bg-white shadow-sm border border-slate-100">
                  <p className="text-[10px] font-black uppercase text-indigo-500 mb-1">{b.label}</p>
                  <p className="text-sm leading-relaxed text-slate-600">{b.plan}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {view === "hotels" && (
        <div className="p-8 max-w-xl mx-auto">
          <h2 className="text-3xl font-black mb-8">Hôtels</h2>
          {TRIP_DATA.hotels.map((h, i) => (
            <div key={i} className="mb-12 overflow-hidden rounded-[40px] bg-white border border-slate-100 shadow-xl">
              <img src={h.cover} className="w-full h-48 object-cover" />
              <div className="p-8">
                <p className="text-xs font-black uppercase text-indigo-500 mb-1">{h.city}</p>
                <h3 className="text-2xl font-black mb-2">{h.name}</h3>
                <p className="text-slate-400 text-xs font-bold mb-6">{h.dates}</p>
                <p className="text-slate-600 italic leading-relaxed mb-6">“{h.why}”</p>
                <div className="flex gap-4">
                   {h.booking_url && <a href={h.booking_url} className="px-6 py-3 rounded-full bg-slate-900 text-white text-xs font-bold">Booking.com</a>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === "budget" && (
        <div className="p-8 max-w-xl mx-auto">
          <h2 className="text-3xl font-black mb-2">Budget 💰</h2>
          <p className="text-slate-500 mb-8 uppercase tracking-widest text-[10px] font-bold">Référence USD • Taux: {vndPerUsd.toLocaleString()} VND</p>

          <div className="grid grid-cols-1 gap-6 mb-12">
            <div className="p-8 rounded-[40px] bg-slate-900 text-white shadow-2xl">
              <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">Famille (4p)</p>
              <div className="text-4xl font-black mb-2">{formatUSD(budgetSplit.fam.total)}</div>
              <p className="text-white/40 text-[10px] font-bold uppercase">{formatUSD(budgetSplit.fam.total / 4)} / personne</p>
            </div>

            <div className="p-8 rounded-[40px] bg-white border border-slate-100 shadow-xl">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Claudine (1p)</p>
              <div className="text-4xl font-black mb-2 text-slate-900">{formatUSD(budgetSplit.clau.total)}</div>
              <p className="text-slate-400 text-[10px] font-bold uppercase">Solo adult rate</p>
            </div>
          </div>

          <div className="p-8 rounded-[40px] bg-indigo-50 border border-indigo-100 mb-8">
             <h4 className="text-xs font-black uppercase tracking-widest text-indigo-900 mb-6">A) Transferts Ja Cosmo</h4>
             <div className="mb-6 p-4 rounded-2xl bg-indigo-600 text-white">
                <p className="text-[10px] font-bold uppercase opacity-60">TOTAL TRANSFERTS CONFIRMÉS</p>
                <p className="text-2xl font-black">4,890k VND</p>
             </div>
             
             <div className="space-y-3">
               {TRIP_DATA.ground_transfers.map((t, i) => (
                 <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white border border-indigo-100 shadow-sm">
                   <div>
                     <p className="text-[10px] font-black text-slate-400 uppercase">{t.date ? safeDateLabel(t.date) : "À définir"}</p>
                     <p className="text-sm font-bold text-slate-900">{t.name}</p>
                   </div>
                   <div className="text-right">
                     <p className="text-sm font-black text-indigo-600">{(t.cost_vnd/1000).toLocaleString()}k</p>
                     <p className={`text-[8px] font-black px-2 py-0.5 rounded-full inline-block ${t.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>{t.status}</p>
                   </div>
                 </div>
               ))}
             </div>
          </div>

          <div className="p-8 rounded-[40px] bg-white border border-slate-200">
            <p className="text-xs font-black uppercase mb-4 text-slate-400">Taux de Change (Simulateur)</p>
            <div className="flex items-center gap-4">
              <input 
                type="number" 
                value={vndPerUsd} 
                onChange={(e) => setVndPerUsd(Number(e.target.value))}
                className="flex-1 px-6 py-4 rounded-3xl bg-slate-50 border border-slate-200 font-black text-2xl"
              />
              <p className="font-bold text-slate-400 uppercase text-xs">VND / $1</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
