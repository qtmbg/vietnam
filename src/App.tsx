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
  CheckCircle2,
  Clock,
  CircleDollarSign,
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
// ASSETS
// ------------------------------------------------------------
const ASSETS = {
  family: {
type Money = { us: number; claudine: number; currency: "USD" };

type HotelItem = {
  city: string;
  name: string;
  dates: string;
  budget: Money;
  booking_url?: string;
  why: string;
  status?: "CONFIRMED" | "ESTIMATE";
  cover?: string;
};

const TRIP_DATA = {
  meta: {
    title: "Vietnam 2026",
    travelers_count: { adults: 3, kids: 2, kids_ages: [12, 6] },
  },
  hotels: [
    { city: "Hanoi", name: "Ja Cosmo Hotel", dates: "25 Jul - 28 Jul", budget: { us: 180, claudine: 110, currency: "USD" }, why: "Central", status: "CONFIRMED", cover: "/covers/hotels/hanoi-ja-cosmo.jpg" },
    { city: "Ninh Binh", name: "Tam Coc Golden Fields", dates: "28 Jul - 30 Jul", budget: { us: 140, claudine: 110, currency: "USD" }, why: "Nature", status: "CONFIRMED", cover: "/covers/hotels/ninh-binh-tam-coc-golden-fields.jpg" },
    { city: "Ha Long", name: "Wyndham Legend", dates: "30 Jul - 31 Jul", budget: { us: 130, claudine: 80, currency: "USD" }, why: "Comfort", status: "CONFIRMED", cover: "/covers/hotels/ha-long-wyndham-legend.jpg" },
    { city: "Cruise", name: "Renea Cruises", dates: "31 Jul - 01 Aug", budget: { us: 330, claudine: 300, currency: "USD" }, why: "Experience", status: "CONFIRMED", cover: "/covers/hotels/ha-long-rc-cruise.jpg" },
    { city: "Hoi An", name: "Palm Garden Resort", dates: "01 Aug - 06 Aug", budget: { us: 680, claudine: 620, currency: "USD" }, why: "Beach", status: "CONFIRMED", cover: "/covers/hotels/hoi-an-palm-garden.png" },
    { city: "Da Nang", name: "Seahorse Signature", dates: "06 Aug - 08 Aug", budget: { us: 129, claudine: 92, currency: "USD" }, why: "City", status: "CONFIRMED", cover: "/covers/hotels/da-nang-seahorse-signature.jpg" },
    { city: "Whale Island", name: "Whale Island Resort", dates: "08 Aug - 12 Aug", budget: { us: 415, claudine: 415, currency: "USD" }, why: "Island", status: "CONFIRMED", cover: "/covers/hotels/whale-island-resort.jpg" },
    { city: "HCMC", name: "Alagon Saigon", dates: "12 Aug - 15 Aug", budget: { us: 275, claudine: 211, currency: "USD" }, why: "Central", status: "CONFIRMED", cover: "/covers/hotels/hcmc-alagon-spa.jpg" },
  ],
  internal_flights: [
    { route: "HPH -> DAD", group_cost_usd: 200, status: "ESTIMATE" },
    { route: "DAD -> CXR", group_cost_usd: 250, status: "ESTIMATE" },
    { route: "CXR -> SGN", group_cost_usd: 300, status: "ESTIMATE" },
    { route: "SGN -> HAN", group_cost_usd: 250, status: "ESTIMATE" },
  ],
  ground_transfers: [
    { name: "Airport Hanoi -> Hotel", cost_usd: 20, status: "ESTIMATE" },
    { name: "Hanoi -> Ninh Binh", cost_usd: 60, status: "ESTIMATE" },
    { name: "Ninh Binh -> Ha Long", cost_usd: 70, status: "ESTIMATE" },
    { name: "Ha Long -> Airport", cost_usd: 50, status: "ESTIMATE" },
    { name: "Airport Da Nang -> Hoi An", cost_usd: 20, status: "ESTIMATE" },
    { name: "Hoi An -> Da Nang", cost_usd: 30, status: "ESTIMATE" },
    { name: "Da Nang -> Airport", cost_usd: 20, status: "ESTIMATE" },
    { name: "Airport -> Whale Island", cost_usd: 160, status: "ESTIMATE" },
    { name: "Whale Island -> Airport", cost_usd: 160, status: "ESTIMATE" },
    { name: "Airport SGN -> Hotel", cost_usd: 20, status: "ESTIMATE" },
    { name: "Hotel -> Airport SGN", cost_usd: 20, status: "ESTIMATE" },
  ],
  activities: [
    { id: "trangan", city: "Ninh Binh", name: "Trang An Boat", cost_vnd: 250000, child_vnd: 120000, status: "ESTIMATE" },
    { id: "puppet", city: "Hanoi", name: "Water Puppets", cost_vnd: 150000, status: "ESTIMATE" },
    { id: "hoalo", city: "Hanoi", name: "Hoa Lo Prison", cost_vnd: 50000, status: "ESTIMATE" },
    { id: "hoian", city: "Hoi An", name: "Old Town Ticket", cost_vnd: 120000, child_vnd: 50000, status: "ESTIMATE" },
    { id: "cham", city: "Da Nang", name: "Cham Museum", cost_vnd: 60000, status: "ESTIMATE" },
    { id: "war", city: "HCMC", name: "War Museum", cost_vnd: 40000, child_vnd: 20000, status: "ESTIMATE" },
  ],
};

const formatUSD = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const formatVND = (n: number) => n.toLocaleString("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });
const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

const StatusTag = ({ status }: { status?: "CONFIRMED" | "ESTIMATE" }) => (
  <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${
    status === "CONFIRMED" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
  }`}>
    {status === "CONFIRMED" ? <CheckCircle2 size={10} /> : <Clock size={10} />}
    {status ?? "ESTIMATE"}
  </div>
);

const BudgetRow = ({ label, usd, vnd, status }: { label: string; usd: number; vnd: number; status?: "CONFIRMED" | "ESTIMATE" }) => (
  <div className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
    <div>
      <div className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
        {label}
        {status && <StatusTag status={status} />}
      </div>
      <div className="text-lg font-black text-slate-900">{formatUSD(usd)}</div>
    </div>
    <div className="text-right">
      <div className="text-[10px] font-black text-slate-300 uppercase">Equiv. VND</div>
      <div className="text-sm font-bold text-slate-400">{formatVND(vnd)}</div>
    </div>
  </div>
);

export default function App() {
  const [vndPerUsd, setVndPerUsd] = useState(25975);
  const [includeActivities, setIncludeActivities] = useState<Record<string, boolean>>({});

  const budgetSplit = useMemo(() => {
    const adults = TRIP_DATA.meta.travelers_count.adults;
    const kids = TRIP_DATA.meta.travelers_count.kids;
    const totalPeople = adults + kids;
    const RATIO_CLAU = 1 / totalPeople;
    const RATIO_FAM = (totalPeople - 1) / totalPeople;

    const hotelsFam = sum(TRIP_DATA.hotels.map(h => h.budget.us));
    const hotelsClau = sum(TRIP_DATA.hotels.map(h => h.budget.claudine));
    const flightsTotal = sum(TRIP_DATA.internal_flights.map(f => f.group_cost_usd));
    const transfersTotal = sum(TRIP_DATA.ground_transfers.map(t => t.cost_usd));

    const claudineActUsd = sum(TRIP_DATA.activities.map(a => {
      if (!(includeActivities[a.id] ?? true)) return 0;
      return (a.cost_vnd ?? 0) / vndPerUsd;
    }));

    const familyActUsd = sum(TRIP_DATA.activities.map(a => {
      if (!(includeActivities[a.id] ?? true)) return 0;
      const childVnd = a.child_vnd ?? a.cost_vnd ?? 0;
      const groupVnd = ((a.cost_vnd ?? 0) * (adults - 1)) + (childVnd * kids);
      return groupVnd / vndPerUsd;
    }));

    return {
      fam: { hotels: hotelsFam, flights: flightsTotal * RATIO_FAM, transfers: transfersTotal * RATIO_FAM, activities: familyActUsd, total: hotelsFam + (flightsTotal * RATIO_FAM) + (transfersTotal * RATIO_FAM) + familyActUsd },
      clau: { hotels: hotelsClau, flights: flightsTotal * RATIO_CLAU, transfers: transfersTotal * RATIO_CLAU, activities: claudineActUsd, total: hotelsClau + (flightsTotal * RATIO_CLAU) + (transfersTotal * RATIO_CLAU) + claudineActUsd }
    };
  }, [includeActivities, vndPerUsd]);

  return (
    <div className="min-h-screen bg-slate-50 p-6 pb-32 font-sans">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-black text-slate-900 tracking-tighter mb-8">Budget <span className="text-indigo-600">Vietnam</span></h1>

        <div className="bg-white rounded-[40px] p-8 shadow-xl shadow-slate-200/50 mb-6">
          <div className="text-xs font-bold text-slate-400 uppercase mb-2">Taux de Change</div>
          <div className="flex items-center gap-4">
            <input type="number" value={vndPerUsd} onChange={(e) => setVndPerUsd(Number(e.target.value))} className="flex-1 bg-slate-50 px-6 py-4 rounded-3xl border border-slate-100 text-xl font-black focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            <div className="text-slate-300 font-black">VND / 1$</div>
          </div>
        </div>

        <div className="bg-white rounded-[40px] p-8 shadow-xl shadow-slate-200/50 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black">Famille <span className="text-slate-300 text-sm">(2A + 2E)</span></h2>
            <div className="text-right">
              <div className="text-2xl font-black text-indigo-600">{formatUSD(budgetSplit.fam.total)}</div>
              <div className="text-[10px] font-black text-slate-300 uppercase">{formatVND(budgetSplit.fam.total * vndPerUsd)}</div>
            </div>
          </div>
          <BudgetRow label="Hôtels" usd={budgetSplit.fam.hotels} vnd={budgetSplit.fam.hotels * vndPerUsd} status="CONFIRMED" />
          <BudgetRow label="Vols" usd={budgetSplit.fam.flights} vnd={budgetSplit.fam.flights * vndPerUsd} status="ESTIMATE" />
          <BudgetRow label="Transfers" usd={budgetSplit.fam.transfers} vnd={budgetSplit.fam.transfers * vndPerUsd} status="ESTIMATE" />
          <BudgetRow label="Activités" usd={budgetSplit.fam.activities} vnd={budgetSplit.fam.activities * vndPerUsd} status="ESTIMATE" />
        </div>

        <div className="bg-white rounded-[40px] p-8 shadow-xl shadow-slate-200/50 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black">Claudine <span className="text-slate-300 text-sm">(1A)</span></h2>
            <div className="text-right">
              <div className="text-2xl font-black text-indigo-600">{formatUSD(budgetSplit.clau.total)}</div>
              <div className="text-[10px] font-black text-slate-300 uppercase">{formatVND(budgetSplit.clau.total * vndPerUsd)}</div>
            </div>
          </div>
          <BudgetRow label="Hôtels" usd={budgetSplit.clau.hotels} vnd={budgetSplit.clau.hotels * vndPerUsd} status="CONFIRMED" />
          <BudgetRow label="Vols" usd={budgetSplit.clau.flights} vnd={budgetSplit.clau.flights * vndPerUsd} status="ESTIMATE" />
          <BudgetRow label="Transfers" usd={budgetSplit.clau.transfers} vnd={budgetSplit.clau.transfers * vndPerUsd} status="ESTIMATE" />
          <BudgetRow label="Activités" usd={budgetSplit.clau.activities} vnd={budgetSplit.clau.activities * vndPerUsd} status="ESTIMATE" />
        </div>

        <div className="bg-slate-900 rounded-[40px] p-8 text-white">
          <h2 className="text-lg font-black mb-6">Activités Prévues</h2>
          <div className="space-y-4">
            {TRIP_DATA.activities.map(act => (
              <button key={act.id} onClick={() => setIncludeActivities(prev => ({ ...prev, [act.id]: !(prev[act.id] ?? true) }))} className={`w-full flex items-center justify-between p-4 rounded-3xl border transition-all ${ (includeActivities[act.id] ?? true) ? "bg-white/10 border-white/20" : "bg-white/5 border-transparent opacity-40" }`}>
                <div className="text-left"><div className="text-[10px] font-black text-white/50 uppercase">{act.city}</div><div className="text-sm font-bold">{act.name}</div></div>
                <div className="text-sm font-black text-amber-400">~{formatUSD((act.cost_vnd ?? 0) / vndPerUsd)} <span className="text-[10px] text-white/30">/ pers</span></div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

    marilyne: P("/family/public:family:marilyne.jpg"),
    claudine: P("/family/public:family:claudine.jpg"),
    nizzar: P("/family/public:family:nizzar.jpg"),
    aydann: P("/family/public:family:aydann.jpg"),
    milann: P("/family/public:family:milann.jpg"),
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
  },
};
