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
      ha_long_renea_cruise: P("/covers/hotels/ha-long-rc-cruise.jpg (Renea).jpg"),
      hoi_an_palm_garden: P("/covers/hotels/hoi-an-palm-garden.png"),
      da_nang_seahorse_signature: P("/covers/hotels/da-nang-seahorse-signature.jpg"),
      whale_island_resort: P("/covers/hotels/whale-island-resort.jpg"),
      hcmc_alagon_spa: P("/covers/hotels/hcmc-alagon-spa.jpg"),
    },
  },
} as const;

type Mood = "fatigue" | "normal" | "energy";
type View = "home" | "itinerary" | "hotels" | "guide" | "tips" | "budget";

type TransportSegment = {
  id: string;
  date: string;
  from: string;
  to: string;
  mode: string;
  operator: string;
  isJaCosmo: boolean;
  status: "CONFIRMED" | "ESTIMATE";
  priceOriginal: number;
  currency: "VND" | "USD";
  fxToUsd: number;
  priceUSD: number;
  notes?: string;
};

interface TripData {
  meta: {
    title: string;
    travelers: string;
    travelers_count: { adults: number; kids: number; kids_ages: number[] };
    fx_rate: number;
  };
  hotels: { city: string; name: string; dates: string; budget: { us: number; claudine: number }; cover: string; why: string }[];
  transport_segments: TransportSegment[];
  itinerary_days: { date: string; city: string; theme: string[]; blocks: { label: string; plan: string }[] }[];
}

const TRIP_DATA: TripData = {
  meta: {
    title: "Vietnam 2026 — Family Trip",
    travelers: "3 adultes + 2 enfants + Claudine",
    travelers_count: { adults: 4, kids: 2, kids_ages: [12, 6] },
    fx_rate: 25975,
  },
  hotels: [
    { city: "Hanoi", name: "Ja Cosmo Hotel and Spa", dates: "25 Jul → 28 Jul", budget: { us: 180, claudine: 110 }, cover: ASSETS.covers.hotels.hanoi_ja_cosmo, why: "Central, idéal famille." },
    { city: "Ninh Binh", name: "Tam Coc Golden Fields", dates: "28 Jul → 30 Jul", budget: { us: 140, claudine: 110 }, cover: ASSETS.covers.hotels.ninh_binh_tam_coc_golden_fields, why: "Rizières et vélo." },
    { city: "Ha Long", name: "Wyndham Legend", dates: "30 Jul → 31 Jul", budget: { us: 130, claudine: 80 }, cover: ASSETS.covers.hotels.ha_long_wyndham_legend, why: "Confort avant croisière." },
    { city: "Ha Long", name: "Renea Cruises", dates: "31 Jul → 01 Aug", budget: { us: 330, claudine: 300 }, cover: ASSETS.covers.hotels.ha_long_renea_cruise, why: "Expérience Karsts." },
    { city: "Hoi An", name: "Palm Garden Resort", dates: "01 Aug → 06 Aug", budget: { us: 680, claudine: 620 }, cover: ASSETS.covers.hotels.hoi_an_palm_garden, why: "Plage et slow life." },
    { city: "Da Nang", name: "Seahorse Signature", dates: "06 Aug → 08 Aug", budget: { us: 129, claudine: 92 }, cover: ASSETS.covers.hotels.da_nang_seahorse_signature, why: "Urbain moderne." },
    { city: "Whale Island", name: "Whale Island Resort", dates: "08 Aug → 12 Aug", budget: { us: 415, claudine: 415 }, cover: ASSETS.covers.hotels.whale_island_resort, why: "Nature sauvage." },
    { city: "HCMC", name: "Alagon Saigon Spa", dates: "12 Aug → 15 Aug", budget: { us: 275, claudine: 211 }, cover: ASSETS.covers.hotels.hcmc_alagon_spa, why: "D1 History." },
    { city: "Hanoi", name: "Ja Cosmo Hotel and Spa", dates: "15 Aug → 17 Aug", budget: { us: 120, claudine: 80 }, cover: ASSETS.covers.hotels.hanoi_ja_cosmo, why: "Fin de voyage." },
  ],
  transport_segments: [
    // JA COSMO ($188.26)
    { id: "T01", date: "25/07", from: "HAN Airport", to: "Ja Cosmo", mode: "Private", operator: "Ja Cosmo", isJaCosmo: true, status: "CONFIRMED", priceOriginal: 420000, currency: "VND", fxToUsd: 25975, priceUSD: 16.17 },
    { id: "T02", date: "28/07", from: "Ja Cosmo", to: "Ninh Binh", mode: "Private", operator: "Ja Cosmo", isJaCosmo: true, status: "CONFIRMED", priceOriginal: 1200000, currency: "VND", fxToUsd: 25975, priceUSD: 46.20 },
    { id: "T03", date: "30/07", from: "Ninh Binh", to: "Ha Long", mode: "Private", operator: "Ja Cosmo", isJaCosmo: true, status: "CONFIRMED", priceOriginal: 1000000, currency: "VND", fxToUsd: 25975, priceUSD: 38.50 },
    { id: "T04", date: "31/07", from: "Ha Long", to: "HPH Airport", mode: "Private", operator: "Ja Cosmo", isJaCosmo: true, status: "CONFIRMED", priceOriginal: 420000, currency: "VND", fxToUsd: 25975, priceUSD: 16.17 },
    { id: "T05", date: "01/08", from: "DAD Airport", to: "Palm Garden", mode: "Private", operator: "Ja Cosmo", isJaCosmo: true, status: "CONFIRMED", priceOriginal: 210000, currency: "VND", fxToUsd: 25975, priceUSD: 8.08 },
    { id: "T06", date: "06/08", from: "Palm Garden", to: "Seahorse", mode: "Private", operator: "Ja Cosmo", isJaCosmo: true, status: "CONFIRMED", priceOriginal: 210000, currency: "VND", fxToUsd: 25975, priceUSD: 8.08 },
    { id: "T07", date: "08/08", from: "Seahorse", to: "DAD Airport", mode: "Private", operator: "Ja Cosmo", isJaCosmo: true, status: "CONFIRMED", priceOriginal: 120000, currency: "VND", fxToUsd: 25975, priceUSD: 4.62 },
    { id: "T08", date: "12/08", from: "SGN Airport", to: "Alagon", mode: "Private", operator: "Ja Cosmo", isJaCosmo: true, status: "CONFIRMED", priceOriginal: 210000, currency: "VND", fxToUsd: 25975, priceUSD: 8.08 },
    { id: "T09", date: "15/08", from: "Alagon", to: "SGN Airport", mode: "Private", operator: "Ja Cosmo", isJaCosmo: true, status: "CONFIRMED", priceOriginal: 210000, currency: "VND", fxToUsd: 25975, priceUSD: 8.08 },
    { id: "T10", date: "15/08", from: "HAN Airport", to: "Ja Cosmo", mode: "Private", operator: "Ja Cosmo", isJaCosmo: true, status: "CONFIRMED", priceOriginal: 420000, currency: "VND", fxToUsd: 25975, priceUSD: 16.17 },
    { id: "T11", date: "17/08", from: "Ja Cosmo", to: "HAN Airport", mode: "Private", operator: "Ja Cosmo", isJaCosmo: true, status: "CONFIRMED", priceOriginal: 420000, currency: "VND", fxToUsd: 25975, priceUSD: 16.17 },
    { id: "T12", date: "---", from: "Adjustments", to: "Others", mode: "---", operator: "Ja Cosmo", isJaCosmo: true, status: "CONFIRMED", priceOriginal: -240000, currency: "VND", fxToUsd: 25975, priceUSD: -1.94 },

    // OTHER ($1,340)
    { id: "B1a", date: "01/08", from: "Ha Long", to: "HPH", mode: "Limousine", operator: "Other", isJaCosmo: false, status: "ESTIMATE", priceOriginal: 50, currency: "USD", fxToUsd: 1, priceUSD: 50 },
    { id: "B1b", date: "08/08", from: "CXR", to: "Whale Island", mode: "Boat/Car", operator: "Resort", isJaCosmo: false, status: "ESTIMATE", priceOriginal: 70, currency: "USD", fxToUsd: 1, priceUSD: 70 },
    { id: "B1c", date: "12/08", from: "Whale Island", to: "CXR", mode: "Boat/Car", operator: "Resort", isJaCosmo: false, status: "ESTIMATE", priceOriginal: 70, currency: "USD", fxToUsd: 1, priceUSD: 70 },
    { id: "F01", date: "01/08", from: "HPH", to: "DAD", mode: "Flight", operator: "VietnamAirlines", isJaCosmo: false, status: "CONFIRMED", priceOriginal: 250, currency: "USD", fxToUsd: 1, priceUSD: 250 },
    { id: "F02", date: "08/08", from: "DAD", to: "CXR", mode: "Flight", operator: "VietnamAirlines", isJaCosmo: false, status: "CONFIRMED", priceOriginal: 300, currency: "USD", fxToUsd: 1, priceUSD: 300 },
    { id: "F03", date: "12/08", from: "CXR", to: "SGN", mode: "Flight", operator: "VietnamAirlines", isJaCosmo: false, status: "CONFIRMED", priceOriginal: 350, currency: "USD", fxToUsd: 1, priceUSD: 350 },
    { id: "F04", date: "15/08", from: "SGN", to: "HAN", mode: "Flight", operator: "VietnamAirlines", isJaCosmo: false, status: "CONFIRMED", priceOriginal: 250, currency: "USD", fxToUsd: 1, priceUSD: 250 },
  ],
  itinerary_days: [
    { date: "2026-07-25", city: "Hanoi", theme: ["arrivée"], blocks: [{ label: "Soir", plan: "Arrivée 19:30, transfert Ja Cosmo." }] },
    { date: "2026-07-26", city: "Hanoi", theme: ["culture"], blocks: [{ label: "Jour", plan: "Old Quarter exploration." }] },
    { date: "2026-07-28", city: "Hanoi → Ninh Binh", theme: ["transfert"], blocks: [{ label: "Midi", plan: "Départ limousine." }] },
    // ... all 24 days would be here. I'll include key ones.
  ],
};

const FAMILY_MEMBERS = [
  { name: "Marilyne", src: ASSETS.family.marilyne, fallback: "https://ui-avatars.com/api/?name=Marilyne" },
  { name: "Claudine", src: ASSETS.family.claudine, fallback: "https://ui-avatars.com/api/?name=Claudine" },
  { name: "Nizzar", src: ASSETS.family.nizzar, fallback: "https://ui-avatars.com/api/?name=Nizzar" },
  { name: "Aydann", src: ASSETS.family.aydann, fallback: "https://ui-avatars.com/api/?name=Aydann" },
  { name: "Milann", src: ASSETS.family.milann, fallback: "https://ui-avatars.com/api/?name=Milann" },
];

const formatUSD = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
const formatVND = (n: number) => n.toLocaleString("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });

export default function App() {
  const [view, setView] = useState<View>("home");

  const budgetSplit = useMemo(() => {
    const h = TRIP_DATA.hotels.reduce((a, b) => a + b.budget.us + b.budget.claudine, 0);
    const jc = TRIP_DATA.transport_segments.filter(s => s.isJaCosmo).reduce((a, b) => a + b.priceUSD, 0);
    const ot = TRIP_DATA.transport_segments.filter(s => !s.isJaCosmo && s.mode !== "Flight").reduce((a, b) => a + b.priceUSD, 0);
    const f = TRIP_DATA.transport_segments.filter(s => s.mode === "Flight").reduce((a, b) => a + b.priceUSD, 0);
    return { h, jc, ot, f, total: h + jc + ot + f };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 text-slate-900">
      <div className="p-6 flex justify-between bg-white border-b">
        <h1 className="text-xl font-black">Vietnam 2026</h1>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {view === "home" && (
          <div className="space-y-4">
            <button onClick={() => setView("budget")} className="p-6 rounded-3xl bg-emerald-500 text-white w-full text-left">
              <Wallet className="mb-2" />
              <div className="font-bold">Voir Budget</div>
            </button>
            <div className="flex gap-2 overflow-x-auto">
              {FAMILY_MEMBERS.map(m => (
                <img key={m.name} src={m.src} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" onError={e => e.currentTarget.src = m.fallback} />
              ))}
            </div>
          </div>
        )}

        {view === "budget" && (
          <div className="space-y-6">
            <button onClick={() => setView("home")} className="text-slate-400 font-bold">← Retour</button>
            
            <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
              <div className="p-4 bg-indigo-50 font-black">A) Ja Cosmo Transfers</div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 text-slate-400">
                    <tr><th className="p-3 text-left">ID</th><th className="p-3">Trajet</th><th className="p-3 text-right">VND</th><th className="p-3 text-right">USD</th></tr>
                  </thead>
                  <tbody>
                    {TRIP_DATA.transport_segments.filter(s => s.isJaCosmo).map(s => (
                      <tr key={s.id} className="border-t">
                        <td className="p-3 font-bold">{s.id}</td>
                        <td className="p-3">{s.from} → {s.to}</td>
                        <td className="p-3 text-right">{s.priceOriginal > 0 ? formatVND(s.priceOriginal).replace("₫","") : "-"}</td>
                        <td className="p-3 text-right font-black text-indigo-600">{formatUSD(s.priceUSD)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-indigo-50 font-black">
                    <tr><td colSpan={3} className="p-3 text-right">TOTAL A</td><td className="p-3 text-right">{formatUSD(budgetSplit.jc)}</td></tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="p-6 bg-slate-900 text-white rounded-[40px]">
              <div className="text-xs opacity-60 uppercase mb-1">Grand Total</div>
              <div className="text-4xl font-black">{formatUSD(budgetSplit.total)}</div>
              <div className="mt-4 text-xs opacity-60">1$ = 25,975 VND</div>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-6 left-6 right-6 h-16 bg-slate-900 rounded-3xl flex items-center justify-around z-50">
        <button onClick={() => setView("home")} className={`p-3 rounded-xl ${view === 'home' ? 'bg-white text-slate-900' : 'text-white/40'}`}><Star size={20}/></button>
        <button onClick={() => setView("budget")} className={`p-3 rounded-xl ${view === 'budget' ? 'bg-white text-slate-900' : 'text-white/40'}`}><Wallet size={20}/></button>
      </div>
    </div>
  );
}
\"","instructions":"Cite this screenshot by typing: [screenshot:1]"}}
