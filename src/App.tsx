import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  Banknote,
  Calendar,
  CheckSquare,
  Hotel,
  Info,
  Languages,
  Lightbulb,
  MapPin,
  Navigation,
  Plane,
  Search,
  Sparkles,
  Smartphone,
  Star,
  Utensils,
  Wallet,
  X,
  ChevronRight,
  
  Moon,
  Shield,
  BadgeCheck,
  BadgeHelp,
  Car,
  Tag,
  Ticket,
  Clock,
  Users,
  ChevronLeft,
  Send,
  ArrowRight,
  RotateCcw,
  BedDouble,
  Compass,
  Loader2,
  CalendarDays,
  CornerDownLeft,
  Sparkle,
} from "lucide-react";

// ============================================================
// ASSET URL (Vite) — works locally + Vercel + base path
// Put your files in /public/covers/... and /public/family/...
// ============================================================
const assetUrl = (path: string) => {
  const base = (import.meta as any)?.env?.BASE_URL ?? "/";
  const cleanBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
};
const P = (p: string) => assetUrl(p);

// ============================================================
// VND → USD (fixed hypothesis for the app)
// 1 USD ≈ 25 970 VND
// ============================================================
const VND_PER_USD = 25970;
const vndToUsdRounded = (vnd: number) => Math.round(vnd / VND_PER_USD);
const usdRounded = (usd: number) => Math.round(usd);

// ============================================================
// ASSETS (public/)
// ============================================================
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
      activities: P("/covers/moments/temple.jpg"),
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
      plane: P("/covers/moments/plane.jpg"),
      night: P("/covers/moments/night.jpg"),
      beach: P("/covers/moments/beach.jpg"),
      boat: P("/covers/moments/boat.jpg"),
      market: P("/covers/moments/market.jpg"),
      coffee: P("/covers/moments/coffee.jpg"),
      streetfood: P("/covers/moments/streetfood.jpg"),
      museum: P("/covers/moments/museum.jpg"),
      temple: P("/covers/moments/temple.jpg"),
      massage: P("/covers/moments/massage.jpg"),
      family: P("/covers/moments/family.jpg"),
      love: P("/covers/moments/love.jpg"),
    },
    hotels: {
      hanoi_ja_cosmo: P("/covers/hotels/hanoi-ja-cosmo.jpg"),
      ninh_binh_tam_coc_golden_fields: P("/covers/hotels/ninh-binh-tam-coc-golden-fields.jpg"),
      ha_long_wyndham_legend: P("/covers/hotels/ha-long-wyndham-legend.jpg"),
      ha_long_renea_cruise: P("/covers/hotels/ha-long-renea-cruise.jpg"),
      hoi_an_palm_garden: P("/covers/hotels/hoi-an-palm-garden.jpg"),
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

// Per-city "chapter" accent (literal classes so Tailwind JIT keeps them)
type CityAccent = { text: string; pill: string; dot: string; soft: string; glow: string };
const CITY_ACCENT: Record<string, CityAccent> = {
  Hanoi: { text: "text-indigo-300", pill: "bg-indigo-600 text-white", dot: "bg-indigo-500", soft: "bg-indigo-50 text-indigo-700 border-indigo-100", glow: "bg-indigo-500/20" },
  "Ninh Binh": { text: "text-emerald-300", pill: "bg-emerald-600 text-white", dot: "bg-emerald-500", soft: "bg-emerald-50 text-emerald-700 border-emerald-100", glow: "bg-emerald-500/20" },
  "Ha Long": { text: "text-teal-300", pill: "bg-teal-600 text-white", dot: "bg-teal-500", soft: "bg-teal-50 text-teal-700 border-teal-100", glow: "bg-teal-500/20" },
  "Hoi An": { text: "text-amber-300", pill: "bg-amber-500 text-white", dot: "bg-amber-500", soft: "bg-amber-50 text-amber-700 border-amber-100", glow: "bg-amber-500/20" },
  "Ho Chi Minh City": { text: "text-rose-300", pill: "bg-rose-600 text-white", dot: "bg-rose-500", soft: "bg-rose-50 text-rose-700 border-rose-100", glow: "bg-rose-500/20" },
  "Whale Island": { text: "text-sky-300", pill: "bg-sky-600 text-white", dot: "bg-sky-500", soft: "bg-sky-50 text-sky-700 border-sky-100", glow: "bg-sky-500/20" },
};
const accentForCity = (label?: string): CityAccent => {
  const s = (label ?? "").toLowerCase();
  if (s.includes("ninh")) return CITY_ACCENT["Ninh Binh"];
  if (s.includes("ha long") || s.includes("halong")) return CITY_ACCENT["Ha Long"];
  if (s.includes("hoi an") || s.includes("hoian") || s.includes("da nang") || s.includes("danang")) return CITY_ACCENT["Hoi An"];
  if (s.includes("ho chi minh") || s.includes("hcmc") || s.includes("saigon")) return CITY_ACCENT["Ho Chi Minh City"];
  if (s.includes("whale")) return CITY_ACCENT["Whale Island"];
  return CITY_ACCENT["Hanoi"];
};

// Specific scene photo per itinerary date (uses the rich, previously-unused library)
const DAY_COVERS: Record<string, string> = {
  "2026-07-26": "/covers/moments/hanoi-hoan-kiem.jpg",
  "2026-07-27": "/covers/moments/hanoi-temple-of-literature.jpg",
  "2026-07-28": "/covers/moments/hanoi-train-street.jpg",
  "2026-07-29": "/covers/moments/ninh-binh-trang-an.jpg",
  "2026-07-30": "/covers/moments/ninhbinh-hang-mua.jpg",
  "2026-07-31": "/covers/moments/ha-long-cruise.jpg",
  "2026-08-01": "/covers/moments/pont-dragon-da-nang.jpg",
  "2026-08-02": "/covers/moments/hoi-an-old-town-night.jpg",
  "2026-08-06": "/covers/moments/hoi-an-an-bang.jpg",
  "2026-08-08": "/covers/moments/whale-island-ponton.jpg",
  "2026-08-12": "/covers/moments/whale-island-ponton.jpg",
  "2026-08-15": "/covers/moments/hcmc-central-post-office.jpg",
  "2026-08-17": "/covers/moments/hanoi-lan-ong.jpg",
};

// Specific scene photo per activity id (falls back to city cover)
const ACT_COVERS: Record<string, string> = {
  "ACT-HAN-001": "/covers/moments/hanoi-hoan-kiem.jpg",
  "ACT-HAN-002": "/covers/moments/museum.jpg",
  "ACT-NB-001": "/covers/moments/ninh-binh-trang-an.jpg",
  "ACT-NB-002": "/covers/moments/ninhbinh-hang-mua.jpg",
  "ACT-HA-001": "/covers/moments/hoi-an-old-town-night.jpg",
  "ACT-HA-002": "/covers/moments/boat.jpg",
  "ACT-HA-003": "/covers/moments/temple.jpg",
  "ACT-HA-004": "/covers/moments/hoi-an-old-town-night.jpg",
  "ACT-DAD-001": "/covers/moments/pont-dragon-da-nang.jpg",
  "ACT-SGN-001": "/covers/moments/boat.jpg",
  "ACT-SGN-002": "/covers/moments/hcmc-war-museum.jpg",
};

// ============================================================
// TYPES
// ============================================================
type Mood = "fatigue" | "normal" | "energy";
type View = "home" | "itinerary" | "hotels" | "activities" | "guide" | "tips" | "budget";
type StatusTag = "CONFIRMED" | "ESTIMATE";

type Money = { us: number; claudine: number; currency: "USD" };

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
  paidBy?: "Nous" | "Claudine"; // who fronted the payment (cash flow, not the share split)
  paidNote?: string; // optional clarifier shown next to the "Payé" badge
};

type LinkItem = { name: string; url: string };
type CultureLinks = Record<string, LinkItem[]>;

type ItineraryDay = {
  date: string; // ISO YYYY-MM-DD
  city: string;
  theme: string[];
  blocks: { label: string; plan: string; links?: string[] }[];
};

type GlossaryItem = { term: string; note: string };
type FoodByRegion = Record<string, string[]>;
type PhraseItem = { fr: string; vi: string; phon: string };

type AirportGlossaryItem = {
  code: string;
  city: string;
  airport: string;
  fromHotel: string;
  eta: string;
  note?: string;
};

type ExpenseCategory = "transport" | "activity";
type ExpenseMode = "private_car_7_seater" | "limousine_or_private_van" | "flight_domestic" | "stay_or_package";
type Operator = "Ja Cosmo" | "Other" | "Airline" | "VietJet" | "Renea" | "Whale Island";

type PayerRule = "claudine_20pct_transport" | "split_given" | "adult_equal_split";

type ExpenseItemUSD = {
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
type PlannedActivity = {
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

interface TripData {
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

// ============================================================
// HELPERS
// ============================================================
const formatUSD0 = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

const safeDateLabel = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });

const toISO = (d: Date) => d.toISOString().slice(0, 10);

const googleMapsSearchUrl = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

const uniqCitiesByOrder = (days: ItineraryDay[]) => {
  const out: string[] = [];
  for (const d of days) {
    const base = d.city.split("→").map((s) => s.trim())[0];
    if (!out.includes(base)) out.push(base);
  }
  return out;
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
  if (DAY_COVERS[day.date]) return P(DAY_COVERS[day.date]);
  const text = (day.theme?.join(" ") ?? "") + " " + (day.blocks?.map((b) => b.plan).join(" ") ?? "");
  const cityCover = cityCoverFromLabel(day.city);
  if (day.city.includes("→")) {
    const moment = momentCoverFromText(text);
    if (moment) return P(moment);
  }
  return cityCover;
};

const badgeForStatus = (s: StatusTag) => {
  if (s === "CONFIRMED") return { label: "CONFIRMÉ", cls: "bg-emerald-600 text-white", icon: <BadgeCheck size={14} /> };
  return { label: "ESTIMÉ", cls: "bg-amber-500 text-white", icon: <BadgeHelp size={14} /> };
};

// ============================================================
// UI ATOMS
// ============================================================
const Glass = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`backdrop-blur-xl bg-white/75 border border-white/60 shadow-card overflow-hidden ${className}`}>{children}</div>
);

const Card = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`bg-white rounded-card border border-ink-100 shadow-card overflow-hidden ${className}`}>{children}</div>
);

// One funnel for every image: skeleton shimmer + lazy + async decode + fade-in + graceful fallback.
const SmartImage = ({
  src,
  alt = "",
  fallback,
  className = "",
  imgClassName = "",
  eager = false,
  overlay,
}: {
  src: string;
  alt?: string;
  fallback?: string;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
  overlay?: ReactNode;
}) => {
  const [loaded, setLoaded] = useState(false);
  const [err, setErr] = useState(false);
  return (
    <div className={`relative overflow-hidden bg-ink-200 ${className}`}>
      {!loaded && <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-ink-200 to-ink-100" />}
      <img
        src={err && fallback ? fallback : src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        {...(eager ? ({ fetchPriority: "high" } as any) : {})}
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (fallback && !err) setErr(true);
          setLoaded(true);
        }}
        className={`w-full h-full object-cover transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"} ${imgClassName}`}
      />
      {overlay}
    </div>
  );
};

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
      <div className="p-2 rounded-2xl bg-white shadow-sm text-slate-600">{icon}</div>
      <div>
        <p className="text-sm font-extrabold text-slate-900">{label}</p>
        {hint && <p className="text-[10px] text-slate-500 font-medium">{hint}</p>}
      </div>
    </div>
    <button
      onClick={() => onChange(!value)}
      className={`w-12 h-7 rounded-full p-1 transition-colors ${value ? "bg-emerald-500" : "bg-slate-200"}`}
      aria-label={label}
    >
      <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${value ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  </div>
);

const Segmented = ({
  items,
  value,
  onChange,
}: {
  items: { id: string; label: string; icon?: ReactNode }[];
  value: string;
  onChange: (id: string) => void;
}) => (
  <div className="bg-slate-100 p-1 rounded-2xl flex gap-1">
    {items.map((it) => (
      <button
        key={it.id}
        onClick={() => onChange(it.id)}
        className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
          value === it.id ? "bg-white text-slate-900 shadow" : "text-slate-500 hover:text-slate-700"
        }`}
      >
        {it.icon}
        {it.label}
      </button>
    ))}
  </div>
);

const StatChip = ({
  label,
  value,
  accent = "indigo",
}: {
  label: string;
  value: string;
  accent?: "indigo" | "emerald" | "amber" | "slate";
}) => {
  const cls =
    accent === "emerald"
      ? "bg-emerald-50 border-emerald-100 text-emerald-700"
      : accent === "amber"
      ? "bg-amber-50 border-amber-100 text-amber-700"
      : accent === "slate"
      ? "bg-slate-50 border-slate-100 text-slate-700"
      : "bg-indigo-50 border-indigo-100 text-indigo-700";
  return (
    <div className={`p-4 rounded-3xl border ${cls}`}>
      <p className="text-[9px] font-black uppercase tracking-widest opacity-70 mb-1">{label}</p>
      <p className="text-lg font-black">{value}</p>
    </div>
  );
};

const FamilyStrip = ({ members }: { members: typeof FAMILY_MEMBERS }) => (
  <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
    {members.map((m) => (
      <div key={m.name} className="flex flex-col items-center gap-1.5 shrink-0 w-[68px]">
        <div className="relative">
          <SmartImage src={P(m.src)} alt={m.name} fallback={m.fallback} className="w-16 h-16 rounded-full ring-2 ring-white shadow-card" />
          <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-sm">
            <div className={`w-2.5 h-2.5 rounded-full ${m.color.split(" ")[0]}`} />
          </div>
        </div>
        <div className="text-center leading-tight">
          <p className="text-[11px] font-bold text-ink-900 truncate w-full">{m.name}</p>
          <p className="text-[9px] font-semibold text-ink-400 truncate w-full">{m.desc}</p>
        </div>
      </div>
    ))}
  </div>
);

const CinemaHero = ({
  onOpenQuick,
  activeCity,
  coverSrc,
  daysTo,
  dayNo,
  tripLen,
  isWithinTrip,
}: {
  onOpenQuick: () => void;
  activeCity: string;
  coverSrc?: string;
  daysTo: number;
  dayNo: number;
  tripLen: number;
  isWithinTrip: boolean;
}) => {
  const src = coverSrc || ASSETS.covers.sections.home;
  const accent = accentForCity(activeCity);
  return (
    <div className="relative h-[80vh] w-full bg-ink-950">
      <SmartImage
        src={src}
        alt={`Vietnam — ${activeCity}`}
        fallback={ASSETS.covers.sections.home}
        eager
        className="absolute inset-0 h-full w-full"
        overlay={
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-ink-950/10" />
            <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-ink-950/60 to-transparent" />
          </>
        }
      />

      <div className="absolute inset-0 flex flex-col justify-between px-6 pt-14 pb-10">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55 mb-2">24 juil → 18 août 2026</p>
            <div className="inline-flex items-baseline gap-2 px-4 py-2 rounded-full bg-jade-500/15 ring-1 ring-jade-400/30 backdrop-blur-md">
              {isWithinTrip ? (
                <>
                  <span className="font-display text-2xl text-jade-300 tabular-nums leading-none">Jour {dayNo}</span>
                  <span className="text-[11px] font-semibold text-white/60 uppercase tracking-widest">/ {tripLen}</span>
                </>
              ) : daysTo > 0 ? (
                <>
                  <span className="font-display text-[28px] text-jade-300 tabular-nums leading-none">J−{daysTo}</span>
                  <span className="text-[11px] font-semibold text-white/60 uppercase tracking-widest">avant le départ</span>
                </>
              ) : (
                <span className="font-display text-xl text-jade-300 leading-none">De retour ✨</span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenQuick}
            aria-label="Recherche et accès rapide"
            className="shrink-0 w-11 h-11 rounded-full bg-white/15 backdrop-blur-md ring-1 ring-white/25 flex items-center justify-center text-white active:scale-90 transition-transform"
          >
            <Search size={20} />
          </button>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/70 mb-2">Carnet de voyage famille</p>
          <h1 className="font-display text-[clamp(3.5rem,18vw,5rem)] leading-[0.82] text-white tracking-tight mb-5">Vietnam</h1>
          <div className="flex items-center gap-2">
            <Compass size={15} className="text-white/50" />
            <p className="text-[11px] font-semibold text-white/55 uppercase tracking-widest">Focus</p>
            <span className={`inline-flex px-3 py-1.5 rounded-full text-sm font-semibold backdrop-blur-md bg-white/15 ring-1 ring-white/25 ${accent.text}`}>
              {activeCity}
            </span>
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
        <h3 className="text-3xl font-black text-white">Accès rapide</h3>
        <button onClick={onClose} className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white">
          <X size={24} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => {
            onGoto("tips");
            onClose();
          }}
          className="p-6 rounded-3xl bg-indigo-500 text-white text-left aspect-square flex flex-col justify-between"
        >
          <Lightbulb size={32} />
          <div>
            <p className="font-black text-lg leading-tight mb-1">Conseils</p>
            <p className="text-xs font-medium text-white/70">Checklist + argent</p>
          </div>
        </button>

        <button
          onClick={() => {
            onGoto("activities");
            onClose();
          }}
          className="p-6 rounded-3xl bg-emerald-500 text-white text-left aspect-square flex flex-col justify-between"
        >
          <Sparkles size={32} />
          <div>
            <p className="font-black text-lg leading-tight mb-1">Activités</p>
            <p className="text-xs font-medium text-white/70">Par ville</p>
          </div>
        </button>

        <button
          onClick={() => {
            onGoto("guide");
            onClose();
          }}
          className="p-6 rounded-3xl bg-slate-100 text-slate-900 text-left aspect-square flex flex-col justify-between"
        >
          <Utensils size={32} />
          <div>
            <p className="font-black text-lg leading-tight mb-1">Guide</p>
            <p className="text-xs font-medium text-slate-500">Food + aéroports</p>
          </div>
        </button>

        <button
          onClick={() => {
            onGoto("budget");
            onClose();
          }}
          className="p-6 rounded-3xl bg-amber-500 text-white text-left aspect-square flex flex-col justify-between"
        >
          <Wallet size={32} />
          <div>
            <p className="font-black text-lg leading-tight mb-1">Budget</p>
            <p className="text-xs font-medium text-white/70">USD uniquement</p>
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

const CityTimeline = ({ cities, activeCity, onSelect }: { cities: string[]; activeCity: string; onSelect: (c: string) => void }) => (
  <div className="flex items-center gap-2 overflow-x-auto pb-4 px-6 no-scrollbar">
    {cities.map((c) => (
      <button
        key={c}
        onClick={() => onSelect(c)}
        className={`whitespace-nowrap px-6 py-3 rounded-full text-sm font-black transition-all ${
          activeCity === c ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 -rotate-2" : "bg-white text-slate-400 border border-slate-100"
        }`}
      >
        {c}
      </button>
    ))}
  </div>
);

const DayCardMobile = ({
  day,
  coverSrc,
  mood,
  kidsMode,
}: {
  day: ItineraryDay;
  coverSrc: string;
  mood: Mood;
  kidsMode: boolean;
}) => {
  const isFatigue = mood === "fatigue";

  const shouldHideImpact = (text: string) => {
    const t = text.toLowerCase();
    return t.includes("prison") || t.includes("war") || t.includes("remnants") || t.includes("impact") || t.includes("fort");
  };

  return (
    <div className="group relative w-full mb-8 last:mb-0">
      <SmartImage
        src={coverSrc}
        alt={day.city}
        fallback={ASSETS.covers.sections.itinerary}
        className="h-64 rounded-hero shadow-float"
        imgClassName="motion-safe:transition-transform motion-safe:group-hover:scale-110 duration-700"
        overlay={
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/25 to-transparent" />
            <div className="absolute bottom-7 left-7 right-7">
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={12} className={accentForCity(day.city).text} />
                <p className="text-[11px] font-semibold text-white/85 uppercase tracking-widest">{safeDateLabel(day.date)}</p>
              </div>
              <h4 className="font-display text-3xl text-white leading-none mb-3">{day.city}</h4>
              <div className="flex flex-wrap gap-1.5">
                {day.theme.map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/15 text-[10px] font-semibold text-white tracking-wide">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </>
        }
      />

      <div className="mt-6 px-4 space-y-4">
        {day.blocks.map((b, idx) => {
          if (isFatigue && b.label === "Soir" && !b.plan.toLowerCase().includes("repos")) {
            return (
              <div key={idx} className="p-4 rounded-3xl bg-indigo-50/50 border border-indigo-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <Moon size={16} />
                </div>
                <p className="text-xs font-bold text-indigo-700 italic">Repos suggéré ce soir 😴</p>
              </div>
            );
          }

          if (kidsMode && shouldHideImpact(b.plan)) {
            return (
              <div key={idx} className="p-4 rounded-3xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-400">
                  <Shield size={16} />
                </div>
                <p className="text-xs font-bold text-slate-500 italic">Contenu masqué (mode kids)</p>
              </div>
            );
          }

          return (
            <div key={idx} className="relative pl-6 border-l-2 border-slate-100">
              <div className="absolute top-0 left-[-5px] w-2 h-2 rounded-full bg-slate-200" />
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{b.label}</p>
              <p className="text-sm font-bold text-slate-800 leading-relaxed">{b.plan}</p>
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
        <div className="mt-6 mx-4 p-4 rounded-3xl bg-amber-50 border border-amber-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
            <Sparkles size={16} />
          </div>
          <p className="text-xs font-bold text-amber-800">Énergie au max : un café caché + balade.</p>
        </div>
      )}
    </div>
  );
};

const HotelCard = ({ hotel }: { hotel: HotelItem }) => {
  const link = hotel.booking_url || hotel.official_url;

  return (
    <div className="group bg-white rounded-card border border-ink-100 shadow-card overflow-hidden mb-8">
      {hotel.cover ? (
        <SmartImage
          src={P(hotel.cover)}
          alt={hotel.name}
          fallback={ASSETS.covers.sections.hotels}
          className="h-48"
          imgClassName="motion-safe:transition-transform motion-safe:group-hover:scale-105 duration-700"
          overlay={
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/45 via-transparent to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-ink-900/70 backdrop-blur-md text-[11px] font-semibold text-white tracking-wide">{hotel.city}</span>
              </div>
            </>
          }
        />
      ) : (
        <div className="h-48 bg-ink-100 flex items-center justify-center text-ink-400">
          <Hotel size={48} />
        </div>
      )}

      <div className="p-8">
        <h4 className="font-display text-[26px] text-ink-900 leading-tight mb-1">{hotel.name}</h4>
        <div className="flex items-center gap-2 text-indigo-600 mb-3">
          <Calendar size={14} />
          <p className="text-xs font-black">{hotel.dates}</p>
        </div>

        <div className="mb-6">
          {hotel.paidBy ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest">
                <BadgeCheck size={12} /> Payé · {hotel.paidBy}
              </span>
              {hotel.paidNote && <span className="text-[10px] font-bold text-slate-500">{hotel.paidNote}</span>}
            </div>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest">
              <BadgeHelp size={12} /> À régler
            </span>
          )}
        </div>

        {hotel.note && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 text-[10px] font-bold text-amber-800 mb-6 leading-relaxed">
            {hotel.note}
          </div>
        )}

        <p className="text-sm font-bold text-slate-500 italic mb-8">“{hotel.why}”</p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100">
            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Nous</p>
            <p className="text-lg font-black text-slate-900 leading-none">{formatUSD0(hotel.budget.us)}</p>
          </div>
          <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100">
            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Claudine</p>
            <p className="text-lg font-black text-slate-900 leading-none">{formatUSD0(hotel.budget.claudine)}</p>
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
              Voir la résa
            </a>
          ) : (
            <div className="flex-1 py-4 rounded-3xl bg-slate-100 text-slate-400 text-xs font-black text-center italic">Pas de lien</div>
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

const SimpleListCard = ({ title, icon, items }: { title: string; icon: ReactNode; items: string[] }) => (
  <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl p-8 mb-8">
    <div className="flex items-center gap-3 mb-8">
      <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">{icon}</div>
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

const PhrasebookCard = ({ items }: { items: PhraseItem[] }) => (
  <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl p-8 mb-8">
    <div className="flex items-center gap-3 mb-8">
      <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
        <Languages size={24} />
      </div>
      <h4 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">Mots utiles</h4>
    </div>
    <div className="space-y-6">
      {items.map((p) => (
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

const AirportGlossaryCard = ({ items }: { items: AirportGlossaryItem[] }) => (
  <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl p-8 mb-8">
    <div className="flex items-center gap-3 mb-2">
      <div className="p-3 rounded-2xl bg-amber-50 text-amber-600">
        <Plane size={24} />
      </div>
      <h4 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">Aéroports</h4>
    </div>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">Codes + trajets estimés</p>

    <div className="space-y-8">
      {items.map((a, i) => (
        <div key={i} className="relative pl-6 border-l-2 border-slate-100">
          <div className="absolute top-0 left-[-5px] w-2 h-2 rounded-full bg-slate-200" />
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-lg font-black text-slate-900 tracking-tight">{a.code}</span>
            <span className="text-xs font-bold text-indigo-500 italic">• {a.city}</span>
          </div>
          <p className="text-xs font-bold text-slate-600 mb-2">{a.airport}</p>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Depuis l’hôtel</p>
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

// ============================================================
// FAMILY
// ============================================================
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
    desc: "L’Ado",
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
] as const;

// ============================================================
// STATIC LISTS (Tips)
// ============================================================
const ESSENTIALS_CHECKLIST = [
  "Passeports (validité 6 mois)",
  "Trousse pharma (Doliprane, Smecta)",
  "Adaptateur universel",
  "Crème solaire & anti-moustique (tropical)",
  "Dollars / euros (cash secours)",
  "Grab installée",
];

const MONEY_TIPS = [
  "Le cash reste très utile (certains endroits appliquent des frais carte).",
  "Prévoir du cash pour restos locaux et petits commerces.",
  "ATM : limites + frais. Mieux vaut retirer moins souvent mais plus gros.",
  "Marchés : vérifier le prix avant, négocier si besoin (attendu).",
];

// ============================================================
// TRIP DATA
// ============================================================
const TRIP_DATA: TripData = {
  meta: {
    title: "Vietnam 2026 — Family Trip",
    travelers: "3 adultes + 2 enfants (12 et 6) + Claudine",
    travelers_count: {
      adults_total: 4,
      adults_core_family: 3,
      adults_claudine: 1,
      kids_total: 2,
      kids_ages: [12, 6],
    },
    vibe: ["culture", "histoire", "art", "nature", "bonne bouffe", "moments d’amour"],
    flights: {
      outbound: { from: "Marrakech", date: "2026-07-24", time: "18:15" },
      arrive_hanoi: { date: "2026-07-26", time: "07:15" },
      return_depart_hanoi: { date: "2026-08-17", time: "19:30" },
      return_arrive_marrakech: { date: "2026-08-18", time: "09:20" },
    },
  },

  hotels: [
    {
      city: "Hanoi",
      name: "Ja Cosmo Hotel and Spa",
      dates: "26 juil → 28 juil, puis 15 août → 17 août",
      budget: { us: 144, claudine: 88, currency: "USD" },
      booking_url: "https://www.booking.com/hotel/vn/ja-cosmo-and-spa.html",
      why: "Central pour ruelles, cafés, culture; simple avec kids + Claudine.",
      cover: "/covers/hotels/hanoi-ja-cosmo.jpg",
      note: "Lit supplémentaire confirmé pour l’enfant de 6 ans. Arrivée Hanoi le 26 juil à 07:15 : 1ʳᵉ nuit retirée, prix au prorata (4 nuits au lieu de 5).",
    },
    {
      city: "Ninh Binh (Tam Coc)",
      name: "Tam Coc Golden Fields Homestay",
      dates: "28 juil → 30 juil",
      budget: { us: 140, claudine: 110, currency: "USD" },
      booking_url: "https://www.booking.com/hotel/vn/tam-coc-golden-fields-homestay.html",
      why: "Base rizières + liberté; parfait pour le ‘wow’ UNESCO sans galère.",
      cover: "/covers/hotels/ninh-binh-tam-coc-golden-fields.jpg",
    },
    {
      city: "Ha Long",
      name: "Wyndham Legend Halong",
      dates: "30 juil → 31 juil",
      budget: { us: 70, claudine: 90, currency: "USD" },      booking_url: "https://www.booking.com/hotel/vn/wyndham-legend-halong-bai-chay5.html",
      why: "Transition confortable avant croisière, logistique simple.",
      cover: "/covers/hotels/ha-long-wyndham-legend.jpg",
      paidBy: "Nous",
    },
    {
      city: "Ha Long (Croisière)",
      name: "Renea Cruises Halong",
      dates: "31 juil → 01 août",
      budget: { us: 330, claudine: 300, currency: "USD" },
      booking_url: "https://www.booking.com/hotel/vn/renea-cruises-halong-ha-long.html",
      note: "Port : Halong International Cruise Port",
      why: "Le cœur ‘cinéma’ du voyage : karsts, baie, expérience famille.",
      cover: "/covers/hotels/ha-long-renea-cruise.jpg",
    },
    {
      city: "Hoi An (Cua Dai Beach)",
      name: "Palm Garden Beach Resort & Spa",
      dates: "01 août → 08 août",
      budget: { us: 1008, claudine: 924, currency: "USD" },      booking_url: "https://www.booking.com/hotel/vn/palm-garden-beach-resort-spa-510.html",
      why: "Grand resort avec plage et immense piscine. Le top pour se poser en famille.",
      cover: "/covers/hotels/hoi-an-palm-garden.jpg",
      note: "+2 nuits ajoutées (06 → 08 août) : on remplace l’étape Da Nang par 2 nuits de plus au Palm Garden. Da Nang reste faisable en excursion à la journée.",
      paidBy: "Nous",
      paidNote: "Nuits 01→06 août réglées · +2 nuits (06→08) à régler",
    },
    {
      city: "Whale Island (Hon Ong)",
      name: "Whale Island Resort",
      dates: "08 août → 12 août",
      budget: { us: 350, claudine: 350, currency: "USD" },      official_url: "https://whaleislandresort.com/",
      why: "Déconnexion nature pure, rythme famille, mer & ciel.",
      cover: "/covers/hotels/whale-island-resort.jpg",
      paidBy: "Claudine",
      note: "Réservé via Agoda (#630563199) : 2 Sea View Bungalows, petit-déj + transferts bateau inclus. Transferts voiture CXR ↔ embarcadère Dam Mon en sus (voir Budget).",
    },
    {
      city: "Ho Chi Minh City",
      name: "Alagon Saigon Hotel & Spa",
      dates: "12 août → 15 août",
      budget: { us: 400, claudine: 240, currency: "USD" },      booking_url: "https://www.booking.com/hotel/vn/alagon-saigon.html",
      why: "Très central pour histoire, colonial, street life.",
      cover: "/covers/hotels/hcmc-alagon-spa.jpg",
    },
  ],

  culture_links: {
    UNESCO: [
      { name: "Trang An Landscape Complex (Ninh Binh)", url: "https://whc.unesco.org/en/list/1438/" },
      { name: "Ha Long Bay - Cat Ba Archipelago", url: "https://whc.unesco.org/en/list/672/" },
      { name: "Hoi An Ancient Town", url: "https://whc.unesco.org/en/list/948/" },
    ],
  },

  itinerary_days: [
    {
      date: "2026-07-26",
      city: "Hanoi",
      theme: ["arrivée", "culture", "street-life"],
      blocks: [
        { label: "Escale", plan: "Escale 14h à Doha prise en charge par Qatar Airways (hôtel + repos). Vol QR982 Doha→Hanoi décollage 20:05 (25 juil) → arrivée Noi Bai le 26 à 07:15." },
        { label: "Matin", plan: "Arrivée 07:15, transfert privé, check-in / dépôt bagages au Ja Cosmo, petit-déj + repos après le vol." },
        { label: "Aprem", plan: "Old Quarter + lac Hoan Kiem + cafés (rythme doux, jet-lag)." },
        { label: "Soir", plan: "Street food + spectacle marionnettes sur l’eau (kids-friendly).", links: ["https://nhahatmuaroithanglong.vn/en/ticket-book/"] },
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
        { label: "Matin", plan: "Musée prison Hoa Lo (fort, bien fait)." },
        { label: "Midi", plan: "Départ driver privé vers Ninh Binh + check-in." },
        { label: "Soir", plan: "Rizières au coucher, dîner au calme." },
      ],
    },
    {
      date: "2026-07-29",
      city: "Ninh Binh",
      theme: ["nature", "wow", "bateau"],
      blocks: [
        { label: "Matin", plan: "Trang An (UNESCO) — tour en barque." },
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
    { date: "2026-07-31", city: "Ha Long", theme: ["unesco", "croisière"], blocks: [{ label: "Jour", plan: "Embarquement Renea Cruise (baie / karsts)." }] },
    {
      date: "2026-08-01",
      city: "Ha Long → Da Nang → Hoi An",
      theme: ["transit", "buffer"],
      blocks: [
        { label: "Matin", plan: "Fin croisière + transfert HPH (si besoin)." },
        { label: "Soir", plan: "Vol HPH→DAD (si pris), transfert Hoi An, dodo." },
      ],
    },
    { date: "2026-08-02", city: "Hoi An", theme: ["plage", "slow", "soir"], blocks: [{ label: "Soir", plan: "Old Town lanterns + food + flânerie." }] },
    { date: "2026-08-06", city: "Hoi An", theme: ["plage", "slow", "excursion"], blocks: [{ label: "Jour", plan: "Toujours au Palm Garden (2 nuits de plus) : plage / piscine. Excursion possible à Da Nang à la journée (Marble Mountains, ponts)." }, { label: "Soir", plan: "Vieille ville de Hoi An, lanternes + dîner." }] },
    { date: "2026-08-08", city: "Hoi An → Whale Island", theme: ["early", "nature"], blocks: [{ label: "Tôt", plan: "Départ très tôt du Palm Garden vers DAD. Vol VJ581 DAD→CXR 06:20→07:25, transfert port + bateau, installation à Whale Island." }] },
    { date: "2026-08-12", city: "Whale Island → Ho Chi Minh City", theme: ["transit"], blocks: [{ label: "Jour", plan: "Bateau + transfert CXR, vol vers SGN (si pris), check-in Alagon." }] },
    { date: "2026-08-15", city: "Ho Chi Minh City → Hanoi", theme: ["transit"], blocks: [{ label: "Matin", plan: "Vol SGN→HAN (si pris), check-in Ja Cosmo." }] },
    { date: "2026-08-17", city: "Hanoi", theme: ["départ"], blocks: [{ label: "Aprem", plan: "Départ aéroport (reco 16:00) pour vol 19:30." }] },
  ],

  glossary: [
    { term: "Grab", note: "App taxi la plus simple. Carte ou cash selon chauffeurs." },
    { term: "Cash", note: "Très utile au quotidien. Certains endroits appliquent des frais carte." },
    { term: "Rythme kids", note: "Matin actif / aprem repos / soir doux. Eau + snacks." },
  ],

  food: {
    Hanoi: ["Bún chả", "Phở", "Café à l’œuf"],
    NinhBinh: ["Chèvre (dê)", "Cơm cháy (riz croustillant)"],
    HoiAn_DaNang: ["Cao lầu", "Bánh mì", "White rose", "Mì Quảng"],
    HCMC: ["Cơm tấm", "Bánh xèo", "Hủ tiếu"],
  },

  phrasebook: [
    { fr: "Bonjour", vi: "Xin chào", phon: "sin tcha-o" },
    { fr: "Merci", vi: "Cảm ơn", phon: "kam eune" },
    { fr: "S'il vous plaît", vi: "Làm ơn", phon: "lam eune" },
    { fr: "Combien ça coûte ?", vi: "Bao nhiêu tiền?", phon: "bao ni-eu tiène" },
    { fr: "Sans piment", vi: "Không cay", phon: "kong kaï" },
    { fr: "Toilettes ?", vi: "Nhà vệ sinh ở đâu?", phon: "nia ve sin eu da-ou" },
  ],

  airport_glossary: [
    { code: "HAN", city: "Hanoi", airport: "Noi Bai International", fromHotel: "Ja Cosmo (Old Quarter)", eta: "35–50 min", note: "Prévoir marge trafic." },
    { code: "HPH", city: "Hai Phong", airport: "Cat Bi International", fromHotel: "Ha Long (Bai Chay)", eta: "55–75 min" },
    { code: "DAD", city: "Da Nang", airport: "Da Nang International", fromHotel: "Hoi An", eta: "45–60 min" },
    { code: "CXR", city: "Cam Ranh", airport: "Cam Ranh International", fromHotel: "Port Whale Island", eta: "45–75 min" },
    { code: "SGN", city: "Ho Chi Minh City", airport: "Tan Son Nhat International", fromHotel: "District 1", eta: "20–40 min", note: "Trafic variable." },
  ],

  // CORE expenses (USD only, no hotels, no food)
  expenses_usd: [
    // Ja Cosmo transfers (CONFIRMED)
    {
      id: "T-JC-001",
      category: "transport",
      mode: "private_car_7_seater",
      operator: "Ja Cosmo",
      operated_by_ja_cosmo: true,
      status: "CONFIRMED",
      date: "2026-07-26",
      from: "Hanoi Airport (HAN)",
      to: "Ja Cosmo Hotel (Hanoi)",
      title: "Transfert privé (7 places) — Aéroport → Hôtel",
      price_total_usd: 20.02,
      payer_rule: "claudine_20pct_transport",
      notes: "Confirmé par Ja Cosmo. Arrivée le 26 juil 07:15 (vol QR982).",
      tags: ["ja_cosmo", "privé", "HAN"],
    },
    {
      id: "T-JC-002",
      category: "transport",
      mode: "private_car_7_seater",
      operator: "Ja Cosmo",
      operated_by_ja_cosmo: true,
      status: "CONFIRMED",
      date: "2026-07-28",
      from: "Ja Cosmo Hotel (Hanoi)",
      to: "Ninh Binh (hôtel à confirmer)",
      title: "Transfert privé (7 places) — Hanoi → Ninh Binh",
      price_total_usd: 57.75,
      payer_rule: "claudine_20pct_transport",
      notes: "Confirmé par Ja Cosmo. Départ tôt demandé.",
      tags: ["ja_cosmo", "privé"],
    },
    {
      id: "T-JC-003",
      category: "transport",
      mode: "private_car_7_seater",
      operator: "Ja Cosmo",
      operated_by_ja_cosmo: true,
      status: "CONFIRMED",
      date: "2026-07-30",
      from: "Ninh Binh (hôtel à confirmer)",
      to: "Ha Long (hôtel/port à confirmer)",
      title: "Transfert privé (7 places) — Ninh Binh → Ha Long",
      price_total_usd: 77.0,
      payer_rule: "claudine_20pct_transport",
      notes: "Confirmé par Ja Cosmo. Upgrade si 4 grosses valises+.",
      tags: ["ja_cosmo", "privé"],
    },
    {
      id: "T-JC-004",
      category: "transport",
      mode: "private_car_7_seater",
      operator: "Ja Cosmo",
      operated_by_ja_cosmo: true,
      status: "CONFIRMED",
      date: "2026-08-15",
      from: "Hanoi Airport (HAN)",
      to: "Ja Cosmo Hotel (Hanoi)",
      title: "Transfert privé (7 places) — Aéroport → Hôtel",
      price_total_usd: 20.02,
      payer_rule: "claudine_20pct_transport",
      notes: "Confirmé par Ja Cosmo. Heure à préciser.",
      tags: ["ja_cosmo", "privé", "HAN"],
    },
    {
      id: "T-JC-005",
      category: "transport",
      mode: "private_car_7_seater",
      operator: "Ja Cosmo",
      operated_by_ja_cosmo: true,
      status: "CONFIRMED",
      date: "2026-08-17",
      from: "Ja Cosmo Hotel (Hanoi)",
      to: "Hanoi Airport (HAN)",
      title: "Transfert privé (7 places) — Hôtel → Aéroport",
      price_total_usd: 13.47,
      payer_rule: "claudine_20pct_transport",
      notes: "Confirmé par Ja Cosmo. Départ recommandé 16:00 (vol 19:30).",
      tags: ["ja_cosmo", "privé", "HAN"],
    },

    // Estimates (kept as ESTIMATE)
    {
      id: "T-OT-103",
      category: "transport",
      mode: "limousine_or_private_van",
      operator: "Other",
      operated_by_ja_cosmo: false,
      status: "ESTIMATE",
      date: null,
      from: "Ha Long",
      to: "Hai Phong Airport (HPH)",
      title: "Transfert privé — Ha Long → HPH",
      price_total_usd: 50.0,
      payer_rule: "claudine_20pct_transport",
      notes: "Estimation.",
      tags: ["estimation"],
    },
    {
      id: "T-OT-104",
      category: "transport",
      mode: "limousine_or_private_van",
      operator: "Other",
      operated_by_ja_cosmo: false,
      status: "ESTIMATE",
      date: null,
      from: "Da Nang Airport (DAD)",
      to: "Hoi An",
      title: "Transfert privé — DAD → Hoi An",
      price_total_usd: 20.0,
      payer_rule: "claudine_20pct_transport",
      notes: "Estimation.",
      tags: ["estimation"],
    },
        {
      id: "T-OT-105",
      category: "transport",
      mode: "limousine_or_private_van",
      operator: "Whale Island",
      operated_by_ja_cosmo: false,
      status: "CONFIRMED",
      date: "2026-08-08",
      from: "Cam Ranh Airport (CXR)",
      to: "Whale Island (port Dam Mon)",
      title: "Transfert privé — CXR → Whale Island",
      price_total_usd: 80.86,
      payer_rule: "claudine_20pct_transport",
      notes: "VND 2 100 000/trajet (famille). Pickup 07:30 à la sortie arrivées CXR (chauffeur avec pancarte au nom) — buffer possible 07:45–08:15 après VJ581 (07:25). Voiture ~3h jusqu'à l'embarcadère Dam Mon + bateau ~15 min. Petit-déj & transferts bateau inclus dans le tarif chambre. Confirmé par e-mail Whale Island Resort (24/02).",
      tags: ["whale", "confirmed", "transfert"],
    },
        {
      id: "T-OT-106",
      category: "transport",
      mode: "limousine_or_private_van",
      operator: "Whale Island",
      operated_by_ja_cosmo: false,
      status: "CONFIRMED",
      date: "2026-08-12",
      from: "Whale Island (port Dam Mon)",
      to: "Cam Ranh Airport (CXR)",
      title: "Transfert privé — Whale Island → CXR",
      price_total_usd: 80.86,
      payer_rule: "claudine_20pct_transport",
      notes: "VND 2 100 000/trajet (famille). Départ de l'île à 10:00 (bateau + voiture) pour être à CXR ~14:05 avant le vol VJ601 (16:05). Confirmé par e-mail Whale Island Resort (24/02).",
      tags: ["whale", "confirmed", "transfert"],
    },

    // Domestic flights estimates
    {
      id: "F-OT-201",
      category: "transport",
      mode: "flight_domestic",
      operator: "VietJet",
      operated_by_ja_cosmo: false,
      status: "CONFIRMED",
      date: "2026-08-01",
      from: "Hai Phong (HPH)",
      to: "Da Nang (DAD)",
      title: "Vol VJ723 — HPH → DAD (5 pax) — VietJet",
                price_total_usd: 270.0,
                payer_rule: "split_given",
          claudine_usd: 55,
          nous_usd: 220,
      notes: "VJ723 · Sam 01/08/2026 · 19:10→20:25 · Résa : 7BYD6X",
      tags: ["vol", "vietjet", "confirmé"],
    },
    {
      id: "F-OT-202",
      category: "transport",
      mode: "flight_domestic",
      operator: "VietJet",
      operated_by_ja_cosmo: false,
      status: "CONFIRMED",
      date: "2026-08-08",
      from: "Da Nang (DAD)",
      to: "Cam Ranh (CXR)",
      title: "Vol VJ581 — DAD → CXR (5 pax) — VietJet",
                price_total_usd: 315.0,
                payer_rule: "split_given",
          claudine_usd: 65,
          nous_usd: 255,
      notes: "VJ581 · Sam 08/08/2026 · 06:20→07:25 · Résa : GPXYYA",
      tags: ["vol", "vietjet", "confirmé"],
    },
    {
      id: "F-OT-203",
      category: "transport",
      mode: "flight_domestic",
      operator: "VietJet",
      operated_by_ja_cosmo: false,
      status: "CONFIRMED",
      date: "2026-08-12",
      from: "Cam Ranh (CXR)",
      to: "Ho Chi Minh (SGN)",
      title: "Vol VJ601 — CXR → SGN (5 pax) — VietJet",
                price_total_usd: 270.0,
                payer_rule: "split_given",
          claudine_usd: 55,
          nous_usd: 220,
      notes: "VJ601 · Mer 12/08/2026 · 16:05→17:10 (SGN T1) · Résa : E9UN3Z",
      tags: ["vol", "vietjet", "confirmé"],
    },
    {
      id: "F-OT-204",
      category: "transport",
      mode: "flight_domestic",
      operator: "VietJet",
      operated_by_ja_cosmo: false,
      status: "CONFIRMED",
      date: "2026-08-15",
      from: "Ho Chi Minh (SGN)",
      to: "Hanoi (HAN)",
      title: "Vol VJ136 — SGN → HAN (5 pax) — VietJet",
                price_total_usd: 305.0,
                payer_rule: "split_given",
          claudine_usd: 65,
          nous_usd: 245,
      notes: "VJ136 · Sam 15/08/2026 · 12:00→14:10 (SGN T1 départ) · Résa : FCRQ6G",
      tags: ["vol", "vietjet", "confirmé"],
    },

// Planned activities — budget (12 activités, USD, 5 pers)
        // HANOI
        {
          id: "A-HAN-001",
          category: "activity",
          mode: "stay_or_package",
          operator: "Other",
          operated_by_ja_cosmo: false,
          status: "CONFIRMED",
          date: null,
          title: "Spectacle marionnettes sur l'eau (Thang Long) — Hanoi",
          price_total_usd: 29,
          payer_rule: "adult_equal_split",
          notes: "5 pers × 150 000 VND = $28.88 arrondi à $29.",
          tags: ["hanoi", "show", "kids"],
        },
        {
          id: "A-HAN-002",
          category: "activity",
          mode: "stay_or_package",
          operator: "Other",
          operated_by_ja_cosmo: false,
          status: "CONFIRMED",
          date: null,
          title: "Musée prison Hoa Lo — Hanoi",
          price_total_usd: 8,
          payer_rule: "adult_equal_split",
          notes: "4 payants × 50 000 VND = $7.70 arrondi à $8. Milann gratuit.",
          tags: ["hanoi", "histoire"],
        },
        // NINH BINH
        {
          id: "A-NB-001",
          category: "activity",
          mode: "stay_or_package",
          operator: "Other",
          operated_by_ja_cosmo: false,
          status: "CONFIRMED",
          date: null,
          title: "Trang An (UNESCO) — tour en barque — Ninh Binh",
          price_total_usd: 39,
          payer_rule: "adult_equal_split",
          notes: "4 payants × 250 000 VND = $38.51. Milann <1m gratuit.",
          tags: ["ninh-binh", "nature", "bateau"],
        },
        {
          id: "A-NB-002",
          category: "activity",
          mode: "stay_or_package",
          operator: "Other",
          operated_by_ja_cosmo: false,
          status: "CONFIRMED",
          date: null,
          title: "Hang Mua (Mua Caves) viewpoint — Ninh Binh",
          price_total_usd: 19,
          payer_rule: "adult_equal_split",
          notes: "5 × 100 000 VND = $19.25.",
          tags: ["ninh-binh", "nature"],
        },
        // HOI AN
        {
          id: "A-HA-001",
          category: "activity",
          mode: "stay_or_package",
          operator: "Other",
          operated_by_ja_cosmo: false,
          status: "CONFIRMED",
          date: null,
          title: "Hoi An Ancient Town — pass (ticket)",
          price_total_usd: 18,
          payer_rule: "adult_equal_split",
          notes: "4 payants × 120 000 VND = $18.48. Souvent gratuit pour petits.",
          tags: ["hoi-an", "culture", "UNESCO"],
        },
        {
          id: "A-HA-002",
          category: "activity",
          mode: "stay_or_package",
          operator: "Other",
          operated_by_ja_cosmo: false,
          status: "CONFIRMED",
          date: null,
          title: "Cam Thanh Coconut Village — basket boat — Hoi An",
          price_total_usd: 39,
          payer_rule: "adult_equal_split",
          notes: "5 × 200 000 VND = $38.51 arrondi à $39.",
          tags: ["hoi-an", "mer", "fun"],
        },
        {
          id: "A-HA-003",
          category: "activity",
          mode: "stay_or_package",
          operator: "Other",
          operated_by_ja_cosmo: false,
          status: "CONFIRMED",
          date: null,
          title: "My Son Sanctuary (UNESCO) — Hoi An",
          price_total_usd: 23,
          payer_rule: "adult_equal_split",
          notes: "4 payants × 150 000 VND = $23.10.",
          tags: ["hoi-an", "histoire", "UNESCO"],
        },
        {
          id: "A-HA-004",
          category: "activity",
          mode: "stay_or_package",
          operator: "Other",
          operated_by_ja_cosmo: false,
          status: "CONFIRMED",
          date: null,
          title: "Hoi An Memories Show — Hoi An",
          price_total_usd: 104,
          payer_rule: "adult_equal_split",
          notes: "5 × 540 000 VND = $103.97. Sièges Row ECO.",
          tags: ["hoi-an", "show"],
        },
        // DA NANG
        {
          id: "A-DAD-001",
          category: "activity",
          mode: "stay_or_package",
          operator: "Other",
          operated_by_ja_cosmo: false,
          status: "CONFIRMED",
          date: null,
          title: "Marble Mountains (Ngu Hanh Son) — Da Nang",
          price_total_usd: 11,
          payer_rule: "adult_equal_split",
          notes: "5 × 55 000 VND = $10.59 arrondi à $11. Entrée 40k + ascenseur 15k.",
          tags: ["da-nang", "nature"],
        },
        {
          id: "A-DAD-002",
          category: "activity",
          mode: "stay_or_package",
          operator: "Other",
          operated_by_ja_cosmo: false,
          status: "CONFIRMED",
          date: null,
          title: "Ba Na Hills (Golden Bridge) — Da Nang",
          price_total_usd: 185,
          payer_rule: "adult_equal_split",
          notes: "4 adultes × 1 000 000 + 1 enfant × 800 000 VND = $184.83. Cable car inclus.",
          tags: ["da-nang", "parc"],
        },
        // HO CHI MINH
        {
          id: "A-SGN-001",
          category: "activity",
          mode: "stay_or_package",
          operator: "Other",
          operated_by_ja_cosmo: false,
          status: "CONFIRMED",
          date: null,
          title: "Mekong Delta — journée (My Tho / Ben Tre) — HCMC",
          price_total_usd: 85,
          payer_rule: "adult_equal_split",
          notes: "$17/pers × 5 = $85. GetYourGuide pickup District 1.",
          tags: ["hcmc", "nature", "bateau"],
        },
        {
          id: "A-SGN-002",
          category: "activity",
          mode: "stay_or_package",
          operator: "Other",
          operated_by_ja_cosmo: false,
          status: "CONFIRMED",
          date: null,
          title: "Cu Chi Tunnels — demi-journée — HCMC",
          price_total_usd: 75,
          payer_rule: "adult_equal_split",
          notes: "$15/pers × 5 = $75. Chaleur + tunnels.",
          tags: ["hcmc", "histoire"],
        },
  ],

  // Planned activities by city (rounded USD using 1 USD ≈ 25 970 VND)
  planned_activities: [
    // HANOI
    {
      id: "ACT-HAN-001",
      city: "Hanoi",
      window: "25–28 juil + 15–17 août",
      name: "Spectacle marionnettes sur l’eau (Thang Long)",
      category: "show",
      duration: "50 min",
      bestTime: "Soir",
      pricing: {
        currency: "VND",
        vnd_adult: 150_000,
        estimatedUSD_adult: vndToUsdRounded(150_000),
      },
      kidsRule: "5 personnes × 150 000 VND. Siège Standard.",
      payMode: "réservation",
      provider: "Officiel",
      sourceUrl: "https://nhahatmuaroithanglong.vn/en/ticket-book/",
      notes: "Total : 750 000 VND = $28.88 pour 5 pers. Arriver 20–30 min avant.",
      tags: ["kids", "soir"],
    },
    {
      id: "ACT-HAN-002",
      city: "Hanoi",
      window: "25–28 juil + 15–17 août",
      name: "Musée prison Hoa Lo",
      category: "histoire",
      duration: "1–1h30",
      bestTime: "Matin",
      pricing: {
        currency: "VND",
        vnd_adult: 50_000,
        estimatedUSD_adult: vndToUsdRounded(50_000),
      },
      kidsRule: "Enfant <6 ans gratuit. 4 payants (3 adultes + enfant 12 ans).",
      payMode: "sur place",
      provider: "Vietnam Airlines (guide)",
      sourceUrl: "https://www.vietnamairlines.com/ch/en/useful-information/travel-guide/hoa-lo-prison",
      notes: "Total : 200 000 VND = $7.70. Enfant <6 ans gratuit. 4 payants.",
      impact: true,
      tags: ["impact", "culture"],
    },

    // NINH BINH
    {
      id: "ACT-NB-001",
      city: "Ninh Binh",
      window: "28–30 juil",
      name: "Trang An (UNESCO) — tour en barque (ticket site)",
      category: "nature",
      duration: "2–3 h",
      bestTime: "Matin",
      pricing: {
        currency: "VND",
        vnd_adult: 250_000,
        estimatedUSD_adult: vndToUsdRounded(250_000),
      },
      kidsRule: "<1 m gratuit • 1–1.3 m : 120k VND • >1.3 m : adulte",
      payMode: "sur place",
      provider: "Good Morning Cat Ba (règles/prix)",
      sourceUrl: "https://goodmorningcatba.com/trang-an-departure-boat-ticket/",
      notes: "Bateau = 4–5 pax. Possibilité de ‘privatiser’ (supplément).",
      tags: ["bateau", "wow"],
    },
    {
      id: "ACT-NB-002",
      city: "Ninh Binh",
      window: "28–30 juil",
      name: "Hang Mua (Mua Caves) — viewpoint",
      category: "nature",
      duration: "1–2 h",
      bestTime: "Fin d’aprem",
      pricing: {
        currency: "VND",
        vnd_adult: 100_000,
        estimatedUSD_adult: vndToUsdRounded(100_000),
      },
      kidsRule: "Prévoir eau + chaussures (marches)",
      payMode: "sur place",
      provider: "Chris & Wren’s World (guide 2026)",
      sourceUrl: "https://chrisandwrensworld.com/mua-caves/",
      notes: "Top ‘wow’ photo. Éviter midi chaleur.",
      tags: ["photos", "wow"],
    },

    // HOI AN
    {
      id: "ACT-HA-001",
      city: "Hoi An",
      window: "1–6 août",
      name: "Hoi An Ancient Town — ticket (pass)",
      category: "culture",
      duration: "2–4 h",
      bestTime: "Soir",
      pricing: {
        currency: "VND",
        vnd_adult: 120_000,
        estimatedUSD_adult: vndToUsdRounded(120_000),
      },
      kidsRule: "Souvent gratuit pour petits (à confirmer sur place)",
      payMode: "sur place",
      provider: "HoiAnDayTrip (explication + prix)",
      sourceUrl: "https://hoiandaytrip.com/hoi-an-old-town-ticket-attractions/",
      notes: "Total : 480 000 VND = $18.48 (4 payants). Souvent gratuit pour petits. Prévoir cash.",
      tags: ["UNESCO", "lanterns"],
    },
    {
      id: "ACT-HA-002",
      city: "Hoi An",
      window: "1–6 août",
      name: "Cam Thanh Coconut Village — basket boat",
      category: "tour",
      duration: "1–2 h",
      bestTime: "Matin",
      pricing: {
        currency: "VND",
        vnd_range: [150_000, 200_000],
        estimatedUSD_range: [vndToUsdRounded(150_000), vndToUsdRounded(200_000)],
      },
      kidsRule: "OK kids",
      payMode: "sur place",
      provider: "La Siesta Resorts (repère)",
      sourceUrl: "https://lasiestaresorts.com/hoi-an-coconut-basket-boat-tour.html",
      notes: "Total : 1 000 000 VND = $38.51 pour 5 pers. Budget 200k/pers.",
      tags: ["mer", "fun"],
    },
    {
      id: "ACT-HA-003",
      city: "Hoi An",
      window: "1–6 août",
      name: "My Son Sanctuary (UNESCO) — ticket site",
      category: "culture",
      duration: "3–5 h (avec trajet)",
      bestTime: "Très tôt",
      pricing: {
        currency: "VND",
        vnd_adult: 150_000,
        estimatedUSD_adult: vndToUsdRounded(150_000),
      },
      kidsRule: "Chaleur : prévoir eau + chapeau",
      payMode: "sur place",
      provider: "HoiAnDayTrip (guide + ticket)",
      sourceUrl: "https://hoiandaytrip.com/my-son-sanctuary-travel-guide/",
      notes: "Total : 600 000 VND = $23.10 (4 payants). À caler tôt le matin (chaleur).",
      tags: ["UNESCO", "histoire"],
    },
    {
      id: "ACT-HA-004",
      city: "Hoi An",
      window: "1–6 août",
      name: "Hoi An Memories Show",
      category: "show",
      duration: "1–2 h",
      bestTime: "Soir",
      pricing: {
        currency: "VND",
        vnd_adult: 540_000,
        estimatedUSD_adult: vndToUsdRounded(540_000),
      },
      kidsRule: "OK kids (selon énergie)",
      payMode: "réservation",
      provider: "Site officiel + plateformes",
      sourceUrl: "https://hoianmemoriesshow.com/",
      notes: "Total : 2 700 000 VND = $103.97 pour 5 pers. Siège Row ECO online.",
      tags: ["soir", "show"],
    },

    // DA NANG
    {
      id: "ACT-DAD-001",
      city: "Da Nang",
      window: "6–8 août (excursion depuis Hoi An)",
      name: "Marble Mountains (Ngu Hanh Son)",
      category: "nature",
      duration: "2–3 h",
      bestTime: "Matin",
      pricing: {
        currency: "VND",
        vnd_adult: 55_000,
        estimatedUSD_adult: vndToUsdRounded(55_000),
      },
      kidsRule: "Escaliers : attention fatigue",
      payMode: "sur place",
      provider: "Vietnam.travel (tourisme)",
      sourceUrl: "https://vietnam.travel/things-to-do/around-marble-mountains",
      notes: "Total : 275 000 VND = $10.59 pour 5 pers. Entrée 40k + ascenseur 15k par pers.",
      tags: ["pagodes", "grottes"],
    },
    {
      id: "ACT-DAD-002",
      city: "Da Nang",
      window: "6–8 août (excursion depuis Hoi An)",
      name: "Ba Na Hills (Golden Bridge) — option",
      category: "tour",
      duration: "Journée",
      bestTime: "Matin",
      pricing: {
        currency: "VND",
        vnd_adult: 1_000_000,
        vnd_child: 800_000,
        estimatedUSD_adult: vndToUsdRounded(1_000_000),
      },
      kidsRule: "Règle souvent par taille (1m / 1.4m) + combos repas",
      payMode: "réservation",
      provider: "Distributeur / infos 2026",
      sourceUrl: "https://danaticket.com/ba-na-hills-ticket",
        notes: "Total : 4 800 000 VND = $184.83 (4 adultes + 1 enfant). Cable car inclus.",
      tags: ["parc", "téléphérique"],
    },

    // HO CHI MINH
    {
      id: "ACT-SGN-001",
      city: "Ho Chi Minh City",
      window: "12–15 août",
      name: "Mekong Delta — journée (My Tho / Ben Tre)",
      category: "tour",
      duration: "Journée",
      bestTime: "Matin",
      pricing: {
        currency: "USD",
        usd_adult: 17,
        estimatedUSD_adult: usdRounded(17),
      },
      kidsRule: "OK kids (longue journée) — prévoir snacks",
      payMode: "réservation",
      provider: "GetYourGuide / Viator (repères)",
      sourceUrl: "https://www.getyourguide.com/ho-chi-minh-city-l272/from-ho-chi-minh-city-mekong-delta-small-group-tour-t60784/",
      notes: "Total : $85 pour 5 pers. GetYourGuide pickup District 1.",
      tags: ["bateau", "journée"],
    },
    {
      id: "ACT-SGN-002",
      city: "Ho Chi Minh City",
      window: "12–15 août",
      name: "Cu Chi Tunnels — demi-journée (histoire)",
      category: "histoire",
      duration: "5–6 h",
      bestTime: "Matin",
      pricing: {
        currency: "USD",
        usd_adult: 15,
        estimatedUSD_adult: usdRounded(15),
      },
      kidsRule: "Contenu impact (masqué en mode kids si souhaité)",
      payMode: "réservation",
      provider: "Backpackers Wanderlust (repères 2026)",
      sourceUrl: "https://www.backpackerswanderlust.com/cheap-tour-cu-chi-tunnels/",
      notes: "Total : $75 pour 5 pers. Chaleur + tunnels : prévoir eau.",
      impact: true,
      tags: ["impact", "histoire"],
    },
  ],
};

// ============================================================
// Tips Checklist (localStorage)
// ============================================================
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
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                checked.includes(item) ? "bg-emerald-500 border-emerald-500" : "border-slate-200"
              }`}
            >
              {checked.includes(item) && <CheckSquare size={14} className="text-white" />}
            </div>
            <p className={`text-sm font-bold ${checked.includes(item) ? "text-slate-400 line-through" : "text-slate-700"}`}>{item}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

// ============================================================
// Budget Engine (USD only, no hotels, no food)
// - Transport: 20% Claudine / 80% Nous (on included transport set)
// - Activities: explicit split if provided else adult_equal_split
// ============================================================
type BudgetFilters = {
  inclureConfirmes: boolean;
  inclureEstimes: boolean;
  seulementJaCosmo: boolean;
  recherche: string;
};

type BudgetComputed = {
  transport: {
    total: number;
    items: (ExpenseItemUSD & { alloc_claudine: number; alloc_nous: number })[];
    claudine_total: number;
    nous_total: number;
  };
  activities: {
    total: number;
    items: (ExpenseItemUSD & { alloc_claudine: number; alloc_nous: number })[];
    claudine_total: number;
    nous_total: number;
  };
  grand: {
    total: number;
    claudine_total: number;
    nous_total: number;
  };
};

const computeBudget = (expenses: ExpenseItemUSD[], filters: BudgetFilters): BudgetComputed => {
  const q = filters.recherche.trim().toLowerCase();

  const filtered = expenses.filter((e) => {
    if (!filters.inclureConfirmes && e.status === "CONFIRMED") return false;
    if (!filters.inclureEstimes && e.status === "ESTIMATE") return false;
    if (filters.seulementJaCosmo && !e.operated_by_ja_cosmo) return false;

    if (q) {
      const blob = [
        e.id,
        e.category,
        e.mode,
        e.operator,
        e.status,
        e.title,
        e.from ?? "",
        e.to ?? "",
        (e.tags ?? []).join(" "),
        e.notes ?? "",
      ]
        .join(" ")
        .toLowerCase();
      if (!blob.includes(q)) return false;
    }
    return true;
  });

  const transports = filtered.filter((e) => e.category === "transport");
  const activities = filtered.filter((e) => e.category === "activity");

  const transportTotal = sum(transports.map((t) => t.price_total_usd));
  const transportClaudine = transportTotal * 0.2;
  const transportNous = transportTotal * 0.8;

  const transportItems = transports.map((t) => {
    const ratio = transportTotal > 0 ? t.price_total_usd / transportTotal : 0;
    return {
      ...t,
      alloc_claudine: transportClaudine * ratio,
      alloc_nous: transportNous * ratio,
    };
  });

  const activityItems = activities.map((a) => {
    if (a.payer_rule === "split_given") {
      return { ...a, alloc_claudine: a.claudine_usd ?? 0, alloc_nous: a.nous_usd ?? 0 };
    }
    const each = a.price_total_usd / 3; // fallback
    return { ...a, alloc_claudine: each, alloc_nous: a.price_total_usd - each };
  });

  const activitiesTotal = sum(activityItems.map((a) => a.price_total_usd));
  const activitiesClaudine = sum(activityItems.map((a) => a.alloc_claudine));
  const activitiesNous = sum(activityItems.map((a) => a.alloc_nous));

  const grandTotal = transportTotal + activitiesTotal;
  const grandClaudine = transportClaudine + activitiesClaudine;
  const grandNous = transportNous + activitiesNous;

  return {
    transport: { total: transportTotal, items: transportItems, claudine_total: transportClaudine, nous_total: transportNous },
    activities: { total: activitiesTotal, items: activityItems, claudine_total: activitiesClaudine, nous_total: activitiesNous },
    grand: { total: grandTotal, claudine_total: grandClaudine, nous_total: grandNous },
  };
};

// ============================================================
// Budget UI (rows)
// ============================================================
const ExpenseRow = ({
  item,
  showAlloc,
}: {
  item: ExpenseItemUSD & { alloc_claudine: number; alloc_nous: number };
  showAlloc: boolean;
}) => {
  const badge = badgeForStatus(item.status);

  const Icon =
    item.mode === "flight_domestic"
      ? Plane
      : item.mode === "private_car_7_seater"
      ? Car
      : item.mode === "limousine_or_private_van"
      ? Navigation
      : Sparkles;

  return (
    <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${item.operated_by_ja_cosmo ? "bg-emerald-50 text-emerald-700" : "bg-slate-50 text-slate-600"}`}>
            <Icon size={18} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-black text-slate-900 tracking-tight">{item.title}</p>
              {item.operated_by_ja_cosmo && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest">
                  <BadgeCheck size={12} /> Ja Cosmo
                </span>
              )}
            </div>

            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              {item.id} • {item.operator} • {item.mode.replaceAll("_", " ")}
            </p>

            {(item.from || item.to) && (
              <p className="mt-2 text-xs font-bold text-slate-600">
                {item.from ? item.from : "—"} <span className="text-slate-300 mx-1">→</span> {item.to ? item.to : "—"}
              </p>
            )}

            {item.notes && <p className="mt-2 text-[11px] font-semibold text-slate-500 leading-relaxed">{item.notes}</p>}

            {item.tags?.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {item.tags.slice(0, 4).map((t) => (
                  <span key={t} className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-100 text-[10px] font-black text-slate-600">
                    <Tag size={12} /> {t}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="shrink-0 text-right">
          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black ${badge.cls}`}>
            {badge.icon} {badge.label}
          </div>
          <p className="mt-2 text-xl font-black text-slate-900">{formatUSD0(item.price_total_usd)}</p>
          {item.date && <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{item.date}</p>}
        </div>
      </div>

      {showAlloc && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Claudine</p>
            <p className="text-sm font-black text-slate-900">{formatUSD0(item.alloc_claudine)}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Nous</p>
            <p className="text-sm font-black text-slate-900">{formatUSD0(item.alloc_nous)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================
// Activities UI (by city)
// ============================================================
const ActivityCard = ({ a }: { a: PlannedActivity }) => {
  const priceLine = (() => {
    if (a.pricing.estimatedUSD_range) {
      const [min, max] = a.pricing.estimatedUSD_range;
      return `$${min}–$${max} (arrondi)`;
    }
    if (typeof a.pricing.estimatedUSD_adult === "number") {
      return `$${a.pricing.estimatedUSD_adult} (arrondi)`;
    }
    if (a.pricing.usd_range) {
      const [min, max] = a.pricing.usd_range;
      return `$${usdRounded(min)}–$${usdRounded(max)} (arrondi)`;
    }
    if (typeof a.pricing.usd_adult === "number") {
      return `$${usdRounded(a.pricing.usd_adult)} (arrondi)`;
    }
    return "—";
  })();

  const rawLine = (() => {
    if (a.pricing.vnd_range) {
      const [min, max] = a.pricing.vnd_range;
      return `${min.toLocaleString("vi-VN")}–${max.toLocaleString("vi-VN")} VND`;
    }
    if (typeof a.pricing.vnd_adult === "number") {
      return `${a.pricing.vnd_adult.toLocaleString("vi-VN")} VND`;
    }
    if (a.pricing.usd_range) {
      const [min, max] = a.pricing.usd_range;
      return `$${min}–$${max}`;
    }
    if (typeof a.pricing.usd_adult === "number") return `$${a.pricing.usd_adult}`;
    return "";
  })();

  return (
    <div className="bg-white rounded-card border border-ink-100 shadow-card overflow-hidden">
      <SmartImage
        src={ACT_COVERS[a.id] ? P(ACT_COVERS[a.id]) : cityCoverFromLabel(a.city)}
        alt={a.name}
        fallback={cityCoverFromLabel(a.city)}
        className="h-36"
        imgClassName="motion-safe:transition-transform motion-safe:hover:scale-105 duration-700"
        overlay={
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-ink-900/70 via-ink-900/10 to-transparent" />
            <div className="absolute bottom-4 left-5 right-5">
              <p className="text-[10px] font-semibold text-white/80 uppercase tracking-widest mb-0.5">
                {a.city}
                {a.window ? ` • ${a.window}` : ""}
              </p>
              <h4 className="font-display text-[22px] text-white leading-tight">{a.name}</h4>
            </div>
          </>
        }
      />
      <div className="p-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-jade-50 border border-jade-100">
            <p className="text-[10px] font-bold text-jade-700 uppercase tracking-widest mb-1">Prix</p>
            <p className="text-sm font-extrabold text-ink-900">{priceLine}</p>
            <p className="text-[11px] font-semibold text-jade-700/80 mt-1">{rawLine}</p>
          </div>
          <div className="p-4 rounded-2xl bg-ink-50 border border-ink-100">
            <p className="text-[10px] font-bold text-ink-500 uppercase tracking-widest mb-1">Cadre</p>
            <div className="flex items-center gap-2 text-ink-600">
              <Clock size={14} />
              <p className="text-xs font-semibold">{a.duration ?? "—"}</p>
            </div>
            <div className="flex items-start gap-2 text-ink-600 mt-2">
              <Users size={14} className="mt-0.5 shrink-0" />
              <p className="text-[11px] font-semibold leading-snug">{a.kidsRule ?? "—"}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-100 text-[11px] font-semibold text-brand-700 uppercase tracking-wide">
            <Ticket size={13} /> {a.category}
          </span>
          {a.payMode && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ink-50 border border-ink-100 text-[11px] font-semibold text-ink-600 uppercase tracking-wide">
              {a.payMode}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ink-50 border border-ink-100 text-[11px] font-semibold text-ink-600">
            <Tag size={13} /> {a.provider}
          </span>
        </div>

        {a.notes && <p className="mt-4 text-[13px] font-medium text-ink-600 leading-relaxed">{a.notes}</p>}

        <div className="mt-5 flex gap-2">
          {a.sourceUrl ? (
            <a
              href={a.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-ink-900 text-white text-xs font-bold"
            >
              <Info size={16} />
              Source
            </a>
          ) : (
            <div className="px-4 py-3 rounded-2xl bg-ink-100 text-ink-400 text-xs font-bold italic">Pas de source</div>
          )}

          <a
            href={googleMapsSearchUrl(a.name + " " + a.city)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-ink-100 text-ink-600"
            aria-label={`Voir ${a.name} sur Google Maps`}
          >
            <MapPin size={18} />
          </a>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// Mr. Tang — floating family concierge (trip-aware + live web search)
// ============================================================
const buildTripContext = (today: string) => {
  const d = TRIP_DATA;
  const flights =
    "Vols internationaux (Qatar Airways, réf X6CPNI) : Marrakech 24/07 18:15 → escale 14h à Doha (hôtel offert par Qatar Airways) → arrivée Hanoi 26/07 07:15 (vol QR982). Retour : Hanoi 17/08 19:30 (QR977) → Doha → Casablanca → Marrakech 18/08 09:20.";
  const internal = d.expenses_usd
    .filter((e) => e.mode === "flight_domestic")
    .map((e) => `${e.title} (${e.date}) ${e.notes ?? ""}`)
    .join(" ; ");
  const hotels = d.hotels.map((h) => `${h.city} — ${h.name} (${h.dates})${h.paidBy ? `, payé par ${h.paidBy}` : ""}`).join("\n");
  const days = d.itinerary_days
    .map((x) => `${x.date} ${x.city} [${x.theme.join(", ")}] : ${x.blocks.map((b) => `${b.label}: ${b.plan}`).join(" | ")}`)
    .join("\n");
  const acts = d.planned_activities.map((a) => `${a.city} — ${a.name} (${a.duration ?? ""}, ${a.bestTime ?? ""})`).join(" ; ");
  const transfers = d.expenses_usd
    .filter((e) => e.category === "transport" && e.mode !== "flight_domestic")
    .map((e) => `${e.date ?? "?"} ${e.from}→${e.to}`)
    .join(" ; ");
  return [
    `Voyageurs : ${d.meta.travelers}.`,
    `Date du jour : ${today}.`,
    flights,
    `Vols internes (VietJet) : ${internal}.`,
    `Hôtels :\n${hotels}`,
    `Itinéraire jour par jour :\n${days}`,
    `Transferts privés : ${transfers}.`,
    `Activités prévues : ${acts}.`,
    "Budget : transports répartis Claudine 20% / le reste de la famille 80% ; activités en USD (1 $ ≈ 25 970 VND).",
  ].join("\n\n");
};

const TangAvatar = ({ size = 48, className = "" }: { size?: number; className?: string }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} className={className} aria-hidden="true">
    <defs>
      <linearGradient id="tang-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#10b981" />
        <stop offset="1" stopColor="#0ea5e9" />
      </linearGradient>
    </defs>
    <circle cx="24" cy="24" r="24" fill="url(#tang-grad)" />
    <circle cx="24" cy="27" r="10.5" fill="#fde9c8" />
    <path d="M24 7 L35 21 Q24 24.5 13 21 Z" fill="#f3cd86" stroke="#e0a948" strokeWidth="1" strokeLinejoin="round" />
    <ellipse cx="24" cy="21" rx="11.5" ry="2.2" fill="#e7b75f" />
    <circle cx="20.3" cy="27" r="1.5" fill="#3b2f2f" />
    <circle cx="27.7" cy="27" r="1.5" fill="#3b2f2f" />
    <path d="M20.5 31 Q24 33.6 27.5 31" fill="none" stroke="#3b2f2f" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

type TangMsg = { role: "user" | "assistant"; content: string; sources?: { title: string; url: string }[] };

const TANG_SUGGESTIONS = [
  "Quel est le programme aujourd'hui ?",
  "Une expo ou un événement cette semaine au Vietnam ?",
  "Idées de restos près de notre hôtel à Hanoi",
  "Que faire avec les enfants à Hoi An ?",
];

const MrTang = ({ tripContext, today }: { tripContext: string; today: string }) => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<TangMsg[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("trip_tang_chat");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch {
        /* ignore */
      }
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("trip_tang_chat", JSON.stringify(messages.slice(-20)));
  }, [messages]);
  useEffect(() => {
    if (open) requestAnimationFrame(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }));
  }, [messages, open, loading]);

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || loading) return;
    const next: TangMsg[] = [...messages, { role: "user", content: q }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const r = await fetch("/api/tang", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.map((m) => ({ role: m.role, content: m.content })), tripContext, today }),
      });
      const data = await r.json();
      setMessages((m) => [...m, { role: "assistant", content: data.reply || "…", sources: data.sources }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Je n'arrive pas à me connecter pour l'instant 😅. Réessaie dans un moment — il faut une connexion internet (et que Mr. Tang soit activé sur le serveur)." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Ouvrir Mr. Tang, votre concierge"
          className="fixed right-4 bottom-[104px] z-[95] flex items-center gap-2.5 pl-2 pr-4 py-2 rounded-full bg-white shadow-float ring-1 ring-ink-100 active:scale-95 transition-transform motion-safe:animate-pop"
        >
          <span className="relative">
            <TangAvatar size={40} />
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-jade-500 ring-2 ring-white" />
          </span>
          <span className="text-left leading-tight">
            <span className="block text-[13px] font-bold text-ink-900">Mr. Tang</span>
            <span className="block text-[10px] font-semibold text-jade-600">Concierge · en ligne</span>
          </span>
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end">
          <button type="button" aria-label="Fermer le concierge" onClick={() => setOpen(false)} className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm" />
          <div className="relative w-full max-h-[82vh] bg-white rounded-t-[2rem] shadow-float flex flex-col motion-safe:animate-fade-up">
            <div className="flex items-center gap-3 p-4 border-b border-ink-100">
              <TangAvatar size={44} />
              <div className="flex-1 min-w-0">
                <p className="font-display text-xl text-ink-900 leading-none">Mr. Tang</p>
                <p className="text-[11px] font-semibold text-jade-600 flex items-center gap-1.5 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-jade-500" /> Votre concierge Vietnam
                </p>
              </div>
              <button type="button" aria-label="Fermer" onClick={() => setOpen(false)} className="w-9 h-9 rounded-full bg-ink-100 text-ink-500 flex items-center justify-center active:scale-90 transition-transform">
                <X size={18} />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="flex gap-2.5">
                  <TangAvatar size={32} className="shrink-0 mt-0.5" />
                  <div className="rounded-2xl rounded-tl-md bg-ink-50 border border-ink-100 p-3 text-sm text-ink-700 leading-relaxed">
                    Xin chào ! 👋 Je suis <b>Mr. Tang</b>, votre concierge pour le Vietnam. Je connais tout votre voyage — itinéraire, hôtels, transferts, budget — et je peux aussi chercher en direct des idées : expos, restos, événements, météo… Posez-moi votre question !
                  </div>
                </div>
              )}
              {messages.map((m, i) =>
                m.role === "user" ? (
                  <div key={i} className="flex justify-end">
                    <div className="max-w-[82%] rounded-2xl rounded-tr-md bg-brand-600 text-white p-3 text-sm leading-relaxed whitespace-pre-wrap">{m.content}</div>
                  </div>
                ) : (
                  <div key={i} className="flex gap-2.5">
                    <TangAvatar size={32} className="shrink-0 mt-0.5" />
                    <div className="max-w-[82%]">
                      <div className="rounded-2xl rounded-tl-md bg-ink-50 border border-ink-100 p-3 text-sm text-ink-700 leading-relaxed whitespace-pre-wrap">{m.content}</div>
                      {m.sources && m.sources.length > 0 && (
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {m.sources.map((s, j) => (
                            <a key={j} href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-ink-100 text-[10px] font-semibold text-brand-700 max-w-[170px] truncate">
                              <Compass size={11} className="shrink-0" /> {s.title}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )
              )}
              {loading && (
                <div className="flex gap-2.5">
                  <TangAvatar size={32} className="shrink-0 mt-0.5" />
                  <div className="rounded-2xl rounded-tl-md bg-ink-50 border border-ink-100 p-3 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-ink-300 motion-safe:animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-ink-300 motion-safe:animate-bounce" style={{ animationDelay: "120ms" }} />
                    <span className="w-2 h-2 rounded-full bg-ink-300 motion-safe:animate-bounce" style={{ animationDelay: "240ms" }} />
                  </div>
                </div>
              )}
            </div>

            {messages.length === 0 && (
              <div className="px-4 pb-2 flex flex-wrap gap-2">
                {TANG_SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="px-3 py-2 rounded-full bg-jade-50 border border-jade-100 text-[11px] font-semibold text-jade-700 active:scale-95 transition-transform text-left"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="p-3 border-t border-ink-100 flex items-center gap-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Demandez à Mr. Tang…"
                className="flex-1 bg-ink-50 border border-ink-100 rounded-full px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Envoyer"
                className="w-11 h-11 rounded-full bg-brand-600 text-white flex items-center justify-center disabled:opacity-40 active:scale-90 transition-transform shrink-0"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

// ============================================================
// APP
// ============================================================
export default function App() {
  const [view, setView] = useState<View>("home");
  const [mood, setMood] = useState<Mood>("normal");
  const [kidsMode, setKidsMode] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);

  // Budget filters (FR)
  const [budgetTab, setBudgetTab] = useState<"overview" | "transport" | "activities">("overview");
  const [filters, setFilters] = useState<BudgetFilters>({
    inclureConfirmes: true,
    inclureEstimes: true,
    seulementJaCosmo: false,
    recherche: "",
  });

  const cities = useMemo(() => uniqCitiesByOrder(TRIP_DATA.itinerary_days), []);
  const [activeCity, setActiveCity] = useState(cities[0] || "Hanoi");

  const todayISO = toISO(new Date());
  const tripStart = TRIP_DATA.itinerary_days[0]?.date;
  const tripEnd = TRIP_DATA.itinerary_days[TRIP_DATA.itinerary_days.length - 1]?.date;
  const isWithinTrip = tripStart && tripEnd ? todayISO >= tripStart && todayISO <= tripEnd : false;

  const todayIndex = useMemo(() => {
    const idx = TRIP_DATA.itinerary_days.findIndex((d) => d.date === todayISO);
    return idx >= 0 ? idx : 0;
  }, [todayISO]);

  const [focusDayIndex, setFocusDayIndex] = useState(todayIndex);
  const focusDay = TRIP_DATA.itinerary_days[clamp(focusDayIndex, 0, TRIP_DATA.itinerary_days.length - 1)];

  // Persist
  useEffect(() => {
    const savedKids = localStorage.getItem("trip_kids_mode");
    if (savedKids) setKidsMode(savedKids === "1");

    const savedCity = localStorage.getItem("trip_active_city");
    if (savedCity) setActiveCity(savedCity);

    const savedMood = localStorage.getItem("trip_mood");
    if (savedMood) setMood(savedMood as Mood);

    if (isWithinTrip) {
      setFocusDayIndex(todayIndex);
    } else {
      const savedFocus = localStorage.getItem("trip_focus_day");
      if (savedFocus) setFocusDayIndex(Number(savedFocus));
    }

    const savedBudgetFilters = localStorage.getItem("trip_budget_filters_v3");
    if (savedBudgetFilters) setFilters(JSON.parse(savedBudgetFilters));

    const savedBudgetTab = localStorage.getItem("trip_budget_tab_v3");
    if (savedBudgetTab) setBudgetTab(savedBudgetTab as any);
  }, []);

  useEffect(() => localStorage.setItem("trip_kids_mode", kidsMode ? "1" : "0"), [kidsMode]);
  useEffect(() => localStorage.setItem("trip_active_city", activeCity), [activeCity]);
  useEffect(() => localStorage.setItem("trip_focus_day", String(focusDayIndex)), [focusDayIndex]);
  useEffect(() => localStorage.setItem("trip_budget_filters_v3", JSON.stringify(filters)), [filters]);
  useEffect(() => localStorage.setItem("trip_budget_tab_v3", budgetTab), [budgetTab]);
  useEffect(() => localStorage.setItem("trip_mood", mood), [mood]);

  const setCityFromFocus = () => {
    const base = focusDay.city.split("→").map((s) => s.trim())[0];
    setActiveCity(base);
  };

  const budget = useMemo(() => computeBudget(TRIP_DATA.expenses_usd, filters), [filters]);

  // Live countdown / trip-day + glanceable "today" derivations
  const MS_DAY = 86400000;
  const daysTo = Math.max(0, Math.ceil((+new Date(tripStart!) - +new Date(todayISO)) / MS_DAY));
  const tripLen = Math.round((+new Date(tripEnd!) - +new Date(tripStart!)) / MS_DAY) + 1;
  const dayNo = clamp(Math.floor((+new Date(todayISO) - +new Date(tripStart!)) / MS_DAY) + 1, 1, tripLen);
  const todayDay = TRIP_DATA.itinerary_days[todayIndex];
  const nextTransfer = useMemo(
    () =>
      TRIP_DATA.expenses_usd
        .filter((e) => e.category === "transport" && e.date && e.date >= todayISO)
        .sort((a, b) => (a.date! < b.date! ? -1 : 1))[0] ?? null,
    [todayISO]
  );
  const lastDay = TRIP_DATA.itinerary_days.length - 1;
  const goView = (v: View) => {
    setView(v);
    requestAnimationFrame(() => window.scrollTo({ top: 0 }));
  };
  const tripContext = useMemo(() => buildTripContext(todayISO), [todayISO]);

  const TabsList = [
    { id: "home", icon: Star, label: "Accueil" },
    { id: "itinerary", icon: Calendar, label: "Jours" },
    { id: "hotels", icon: Hotel, label: "Hôtels" },
    { id: "activities", icon: Sparkles, label: "Activités" },
    { id: "guide", icon: Utensils, label: "Guide" },
    { id: "tips", icon: Lightbulb, label: "Conseils" },
    { id: "budget", icon: Wallet, label: "Budget" },
  ] as const;

  // Activities filtered by city & kids mode
  const activitiesByCity = useMemo(() => {
    const list = TRIP_DATA.planned_activities.filter((a) => !(kidsMode && a.impact));
    const map = new Map<string, PlannedActivity[]>();
    for (const a of list) {
      const k = a.city;
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(a);
    }
    // Keep a consistent order
    const order = ["Hanoi", "Ninh Binh", "Ha Long", "Hoi An", "Da Nang", "Ho Chi Minh City", "Whale Island"];
    const out: { city: string; items: PlannedActivity[] }[] = [];
    for (const c of order) {
      if (map.has(c)) out.push({ city: c, items: map.get(c)! });
    }
    // add any leftover
    for (const [c, items] of map.entries()) {
      if (!order.includes(c)) out.push({ city: c, items });
    }
    return out;
  }, [kidsMode]);

  return (
    <div className="min-h-screen bg-[radial-gradient(120%_80%_at_50%_-10%,#eef2ff_0%,#f8fafc_45%,#f1f5f9_100%)] font-sans text-ink-900 pb-36 overflow-x-clip">
      <QuickSheet open={quickOpen} onClose={() => setQuickOpen(false)} onGoto={(v) => setView(v)} />

      {/* HOME */}
      {view === "home" && (
        <div key="home" className="motion-safe:animate-fade-up">
          <CinemaHero
            onOpenQuick={() => setQuickOpen(true)}
            activeCity={activeCity}
            coverSrc={cityCoverFromLabel(activeCity)}
            daysTo={daysTo}
            dayNo={dayNo}
            tripLen={tripLen}
            isWithinTrip={isWithinTrip}
          />

          <div className="relative -mt-12 px-5 space-y-7">
            {/* Aujourd'hui / Prochainement — the daily command card */}
            <Glass className="rounded-hero p-6 ring-1 ring-white/60">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-jade-500/60 motion-safe:animate-ping" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-jade-500" />
                  </span>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-jade-600">
                    {isWithinTrip ? "Aujourd'hui" : "Prochainement"}
                  </p>
                </div>
                <p className="text-[11px] font-semibold text-ink-400">
                  {isWithinTrip ? `Jour ${dayNo} / ${tripLen}` : daysTo > 0 ? `J−${daysTo}` : "Terminé"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setFocusDayIndex(todayIndex);
                  setCityFromFocus();
                  goView("itinerary");
                }}
                className="group w-full flex items-center gap-4 text-left mb-3"
              >
                <SmartImage src={dayCoverFromDay(todayDay)} alt={todayDay.city} className="w-16 h-16 rounded-2xl shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-ink-400">{safeDateLabel(todayDay.date)}</p>
                  <p className="font-display text-xl text-ink-900 leading-tight truncate">{todayDay.city}</p>
                  <p className="text-[11px] font-medium text-ink-500 truncate">{todayDay.blocks[0]?.plan}</p>
                </div>
                <ArrowRight size={18} className="text-ink-300 shrink-0 group-active:translate-x-0.5 transition-transform" />
              </button>

              {nextTransfer && (
                <button
                  type="button"
                  onClick={() => goView("budget")}
                  className="w-full flex items-center gap-3 text-left p-3 rounded-2xl bg-ink-50/80 border border-ink-100"
                >
                  <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-brand-600 shadow-soft shrink-0">
                    {nextTransfer.mode === "flight_domestic" ? <Plane size={16} /> : <Car size={16} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-ink-400">
                      Prochain transfert{nextTransfer.date ? ` · ${safeDateLabel(nextTransfer.date)}` : ""}
                    </p>
                    <p className="text-xs font-semibold text-ink-700 truncate">
                      {nextTransfer.from} → {nextTransfer.to}
                    </p>
                  </div>
                  <ChevronRight size={16} className="text-ink-300 shrink-0" />
                </button>
              )}
            </Glass>

            {/* Énergie / mood */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-ink-400 mb-3 ml-1">Énergie du jour</p>
              <Segmented
                value={mood}
                onChange={(id) => setMood(id as Mood)}
                items={[
                  { id: "fatigue", label: "Doux", icon: <Moon size={15} /> },
                  { id: "normal", label: "Normal", icon: <Star size={15} /> },
                  { id: "energy", label: "À fond", icon: <Sparkles size={15} /> },
                ]}
              />
            </div>

            <Toggle
              label="Mode enfants"
              icon={<Smartphone size={20} />}
              value={kidsMode}
              onChange={setKidsMode}
              hint="Masque les contenus sensibles (mode kids)."
            />

            {/* Équipage */}
            <div>
              <div className="mb-4">
                <h3 className="font-display text-3xl text-ink-900 leading-none">Équipage</h3>
                <p className="text-xs font-semibold text-ink-400 italic">Les aventuriers</p>
              </div>
              <FamilyStrip members={FAMILY_MEMBERS as any} />
            </div>

            {/* Jour focus */}
            <div>
              <div className="flex justify-between items-end mb-4">
                <div>
                  <h3 className="font-display text-3xl text-ink-900 leading-none mb-0.5">Jour focus</h3>
                  <p className="text-xs font-semibold text-ink-400 italic">Glisse pour explorer</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    aria-label="Jour précédent"
                    onClick={() => setFocusDayIndex((i) => clamp(i - 1, 0, lastDay))}
                    className="w-10 h-10 rounded-full bg-ink-100 text-ink-600 flex items-center justify-center active:scale-90 transition-transform"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    aria-label="Jour suivant"
                    onClick={() => setFocusDayIndex((i) => clamp(i + 1, 0, lastDay))}
                    className="w-10 h-10 rounded-full bg-ink-100 text-ink-600 flex items-center justify-center active:scale-90 transition-transform"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              <div
                onTouchStart={(e) => {
                  (e.currentTarget as any)._swipeX = e.touches[0].clientX;
                }}
                onTouchEnd={(e) => {
                  const startX = (e.currentTarget as any)._swipeX ?? null;
                  if (startX === null) return;
                  const delta = e.changedTouches[0].clientX - startX;
                  if (Math.abs(delta) > 50) {
                    setFocusDayIndex((i) => clamp(i + (delta < 0 ? 1 : -1), 0, lastDay));
                  }
                }}
              >
                <div key={focusDayIndex} className="motion-safe:animate-fade-up">
                  <DayCardMobile day={focusDay} coverSrc={dayCoverFromDay(focusDay)} mood={mood} kidsMode={kidsMode} />
                </div>
              </div>

              <div className="flex items-center justify-center gap-1.5 mt-1 flex-wrap px-4">
                {TRIP_DATA.itinerary_days.map((d, i) => (
                  <button
                    key={d.date}
                    type="button"
                    aria-label={`Aller au jour ${i + 1}`}
                    onClick={() => setFocusDayIndex(i)}
                    className={`h-1.5 rounded-full transition-all ${i === focusDayIndex ? "w-6 bg-brand-600" : "w-1.5 bg-ink-200"}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  setCityFromFocus();
                  goView("itinerary");
                }}
                className="w-full py-4 rounded-card bg-ink-100 text-ink-600 text-xs font-bold uppercase tracking-widest mt-4 active:scale-[.99] transition-transform"
              >
                Voir tout l'itinéraire
              </button>
            </div>

            {/* Quick tiles */}
            <div className="grid grid-cols-2 gap-4 pb-10">
              <button
                type="button"
                onClick={() => goView("activities")}
                className="p-6 rounded-card bg-jade-50 border border-jade-100 text-left active:scale-[.98] transition-transform"
              >
                <Sparkles size={24} className="text-jade-600 mb-4" />
                <p className="text-sm font-bold text-ink-900">Activités</p>
                <p className="text-[11px] font-semibold text-jade-600">Par ville</p>
              </button>
              <button
                type="button"
                onClick={() => goView("budget")}
                className="p-6 rounded-card bg-sun-50 border border-sun-100 text-left active:scale-[.98] transition-transform"
              >
                <Wallet size={24} className="text-sun-600 mb-4" />
                <p className="text-sm font-bold text-ink-900">Budget</p>
                <p className="text-[11px] font-semibold text-sun-600">USD</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ITINERARY */}
      {view === "itinerary" && (
        <div className="motion-safe:animate-fade-up px-6 pt-12">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="font-display text-[2.5rem] text-ink-900 leading-none mb-1">Itinéraire</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Carte par carte</p>
            </div>
            <button type="button" onClick={() => goView("home")} aria-label="Retour à l'accueil" className="w-10 h-10 rounded-full bg-ink-100 flex items-center justify-center text-ink-500 active:scale-90 transition-transform">
              <X size={20} />
            </button>
          </div>

          <div className="mb-10">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-2">Filtrer par ville</p>
            <CityTimeline cities={cities} activeCity={activeCity} onSelect={setActiveCity} />
          </div>

          <div className="space-y-12 pb-20">
            {TRIP_DATA.itinerary_days
              .filter((d) => d.city.toLowerCase().includes(activeCity.toLowerCase()))
              .map((day) => (
                <DayCardMobile key={day.date} day={day} coverSrc={dayCoverFromDay(day)} mood={mood} kidsMode={kidsMode} />
              ))}
          </div>
        </div>
      )}

      {/* HOTELS */}
      {view === "hotels" && (
        <div className="motion-safe:animate-fade-up px-6 pt-12">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="font-display text-[2.5rem] text-ink-900 leading-none mb-1">Hôtels</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Repos & logistique</p>
            </div>
            <button type="button" onClick={() => goView("home")} aria-label="Retour à l'accueil" className="w-10 h-10 rounded-full bg-ink-100 flex items-center justify-center text-ink-500 active:scale-90 transition-transform">
              <X size={20} />
            </button>
          </div>

          <div className="pb-20">{TRIP_DATA.hotels.map((h, i) => <HotelCard key={i} hotel={h} />)}</div>
        </div>
      )}

      {/* ACTIVITIES (UPDATED) */}
      {view === "activities" && (
        <div className="motion-safe:animate-fade-up px-6 pt-12">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="font-display text-[2.5rem] text-ink-900 leading-none mb-1">Activités</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Prix arrondis • USD via 1$ ≈ {VND_PER_USD.toLocaleString("fr-FR")} VND
              </p>
            </div>
            <button type="button" onClick={() => goView("home")} aria-label="Retour à l'accueil" className="w-10 h-10 rounded-full bg-ink-100 flex items-center justify-center text-ink-500 active:scale-90 transition-transform">
              <X size={20} />
            </button>
          </div>

          <Glass className="rounded-[40px] p-7 mb-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Mode d’affichage</p>
                <p className="text-xl font-black text-slate-900 tracking-tighter">Liste complète, par ville</p>
                <p className="mt-2 text-xs font-bold text-slate-500">
                  Les activités ‘impact’ sont masquées si le mode kids est activé.
                </p>
              </div>
              <div className="w-44">
                <Toggle label="Mode kids" icon={<Smartphone size={18} />} value={kidsMode} onChange={setKidsMode} hint="Masque ‘impact’" />
              </div>
            </div>
          </Glass>

          <div className="space-y-10 pb-20">
            {activitiesByCity.map((group) => (
              <div key={group.city} className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ville</p>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{group.city}</h3>
                  </div>
                  <a
                    href={googleMapsSearchUrl(group.city)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-100 text-slate-700 text-xs font-black"
                  >
                    <MapPin size={16} />
                    Carte
                  </a>
                </div>

                <div className="space-y-4">
                  {group.items.map((a) => (
                    <ActivityCard key={a.id} a={a} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GUIDE */}
      {view === "guide" && (
        <div className="motion-safe:animate-fade-up px-6 pt-12">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="font-display text-[2.5rem] text-ink-900 leading-none mb-1">Guide</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Food + aéroports</p>
            </div>
            <button type="button" onClick={() => goView("home")} aria-label="Retour à l'accueil" className="w-10 h-10 rounded-full bg-ink-100 flex items-center justify-center text-ink-500 active:scale-90 transition-transform">
              <X size={20} />
            </button>
          </div>

          <SimpleListCard title="Food" icon={<Utensils size={24} />} items={Object.entries(TRIP_DATA.food).map(([r, f]) => `${r}: ${f.join(", ")}`)} />
          <AirportGlossaryCard items={TRIP_DATA.airport_glossary} />
          <PhrasebookCard items={TRIP_DATA.phrasebook} />
        </div>
      )}

      {/* TIPS */}
      {view === "tips" && (
        <div className="motion-safe:animate-fade-up px-6 pt-12">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="font-display text-[2.5rem] text-ink-900 leading-none mb-1">Conseils</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pratique</p>
            </div>
            <button type="button" onClick={() => goView("home")} aria-label="Retour à l'accueil" className="w-10 h-10 rounded-full bg-ink-100 flex items-center justify-center text-ink-500 active:scale-90 transition-transform">
              <X size={20} />
            </button>
          </div>

          <TipsChecklist />
          <div className="h-8" />
          <SimpleListCard title="Argent" icon={<Wallet size={24} />} items={MONEY_TIPS} />
          <SimpleListCard title="Rappels" icon={<Info size={24} />} items={TRIP_DATA.glossary.map((g) => `${g.term}: ${g.note}`)} />
        </div>
      )}

      {/* BUDGET (FR, no “Copy JSON”) */}
      {view === "budget" && (
        <div className="motion-safe:animate-fade-up px-6 pt-12">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="font-display text-[2.5rem] text-ink-900 leading-none mb-1">Budget</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">USD uniquement • sans hôtels • sans food</p>
            </div>
            <button type="button" onClick={() => goView("home")} aria-label="Retour à l'accueil" className="w-10 h-10 rounded-full bg-ink-100 flex items-center justify-center text-ink-500 active:scale-90 transition-transform">
              <X size={20} />
            </button>
          </div>

          <div className="mb-8">
            <Segmented
              value={budgetTab}
              onChange={(id) => setBudgetTab(id as any)}
              items={[
                { id: "overview", label: "Vue d’ensemble", icon: <Wallet size={16} /> },
                { id: "transport", label: "Transports", icon: <Car size={16} /> },
                { id: "activities", label: "Activités", icon: <Sparkles size={16} /> },
              ]}
            />
          </div>

          {/* Filters */}
          <div className="mb-8 bg-white rounded-[40px] border border-slate-100 shadow-xl p-7">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600">
                  <Search size={18} />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900">Filtres</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Affecte les totaux</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Recherche</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-500">
                    <Search size={18} />
                  </div>
                  <input
                    value={filters.recherche}
                    onChange={(e) => setFilters((f) => ({ ...f, recherche: e.target.value }))}
                    placeholder="id, opérateur, trajet, notes, tag…"
                    className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Toggle
                  label="Inclure confirmés"
                  icon={<BadgeCheck size={18} />}
                  value={filters.inclureConfirmes}
                  onChange={(v) => setFilters((f) => ({ ...f, inclureConfirmes: v }))}
                  hint="Données confirmées"
                />
                <Toggle
                  label="Inclure estimés"
                  icon={<BadgeHelp size={18} />}
                  value={filters.inclureEstimes}
                  onChange={(v) => setFilters((f) => ({ ...f, inclureEstimes: v }))}
                  hint="Montants non confirmés"
                />
                <Toggle
                  label="Uniquement Ja Cosmo"
                  icon={<BadgeCheck size={18} />}
                  value={filters.seulementJaCosmo}
                  onChange={(v) => setFilters((f) => ({ ...f, seulementJaCosmo: v }))}
                  hint="Transferts opérés"
                />
                <Toggle
                  label="Mode kids"
                  icon={<Smartphone size={18} />}
                  value={kidsMode}
                  onChange={setKidsMode}
                  hint="Masque ‘impact’"
                />
              </div>
            </div>
          </div>

          {/* Overview */}
          {budgetTab === "overview" && (
            <div className="space-y-6 pb-20">
              <Glass className="rounded-[40px] p-8">
                <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-4">Total (scope)</p>
                <p className="text-5xl font-black text-slate-900 tracking-tighter mb-3">{formatUSD0(budget.grand.total)}</p>
                <p className="text-xs font-bold text-slate-500">Transports + activités (USD uniquement). Hôtels/food exclus.</p>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <StatChip label="Claudine" value={formatUSD0(budget.grand.claudine_total)} accent="indigo" />
                  <StatChip label="Nous" value={formatUSD0(budget.grand.nous_total)} accent="slate" />
                  <StatChip label="Transports" value={formatUSD0(budget.transport.total)} accent="emerald" />
                  <StatChip label="Activités" value={formatUSD0(budget.activities.total)} accent="amber" />
                </div>

                <div className="mt-6 p-5 rounded-[28px] bg-slate-50 border border-slate-100">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Règles</p>
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-700">1) Transports : Claudine 20% • Nous 80%</p>
                    <p className="text-xs font-bold text-slate-700">2) Activités : répartition explicite si disponible</p>
                    <p className="text-xs font-bold text-slate-700">3) Confirmé vs estimé : dépend des filtres</p>
                  </div>
                </div>
              </Glass>
            </div>
          )}

          {/* Transport */}
          {budgetTab === "transport" && (
            <div className="space-y-5 pb-20">
              <Glass className="rounded-[40px] p-8">
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-3">Transports (filtrés)</p>
                <p className="text-4xl font-black text-slate-900 tracking-tighter">{formatUSD0(budget.transport.total)}</p>
                <p className="mt-2 text-xs font-bold text-slate-500">
                  Répartition : Claudine {formatUSD0(budget.transport.claudine_total)} • Nous {formatUSD0(budget.transport.nous_total)}
                </p>
              </Glass>

              {budget.transport.items.length === 0 ? (
                <div className="rounded-card border border-dashed border-ink-200 p-8 text-center">
                  <p className="text-sm font-semibold text-ink-500">Aucun transport pour ces filtres.</p>
                  <button
                    type="button"
                    onClick={() => setFilters((f) => ({ ...f, recherche: "", inclureConfirmes: true, inclureEstimes: true, seulementJaCosmo: false }))}
                    className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ink-100 text-ink-700 text-xs font-bold active:scale-95 transition-transform"
                  >
                    <RotateCcw size={14} /> Réinitialiser les filtres
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {budget.transport.items.map((item) => (
                    <ExpenseRow key={item.id} item={item} showAlloc />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Activities */}
          {budgetTab === "activities" && (
            <div className="space-y-5 pb-20">
              <Glass className="rounded-[40px] p-8">
                <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-3">Activités (filtrées)</p>
                <p className="text-4xl font-black text-slate-900 tracking-tighter">{formatUSD0(budget.activities.total)}</p>
                <p className="mt-2 text-xs font-bold text-slate-500">
                  Répartition : Claudine {formatUSD0(budget.activities.claudine_total)} • Nous {formatUSD0(budget.activities.nous_total)}
                </p>
              </Glass>

              {budget.activities.items.length === 0 ? (
                <div className="rounded-card border border-dashed border-ink-200 p-8 text-center">
                  <p className="text-sm font-semibold text-ink-500">Aucune activité pour ces filtres.</p>
                  <button
                    type="button"
                    onClick={() => setFilters((f) => ({ ...f, recherche: "", inclureConfirmes: true, inclureEstimes: true, seulementJaCosmo: false }))}
                    className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ink-100 text-ink-700 text-xs font-bold active:scale-95 transition-transform"
                  >
                    <RotateCcw size={14} /> Réinitialiser les filtres
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {budget.activities.items.map((item) => (
                    <ExpenseRow key={item.id} item={item} showAlloc />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* MOBILE NAV */}
      <nav aria-label="Navigation principale" className="fixed bottom-4 left-3 right-3 z-[90] pb-[env(safe-area-inset-bottom)]">
        <div className="backdrop-blur-2xl bg-ink-900/90 rounded-[2rem] border border-white/10 p-1.5 flex items-stretch justify-between gap-0.5 shadow-float">
          {TabsList.map((tab) => {
            const Icon = tab.icon;
            const active = view === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => goView(tab.id as View)}
                aria-label={tab.label}
                aria-current={active ? "page" : undefined}
                className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 rounded-2xl transition-all duration-300 ${
                  active ? "bg-white text-ink-900 shadow-float" : "text-white/55 active:scale-90"
                }`}
              >
                <Icon size={17} aria-hidden="true" />
                <span className="text-[9px] font-bold tracking-tight leading-none">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <MrTang tripContext={tripContext} today={todayISO} />
    </div>
  );
}
