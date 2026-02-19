import { useEffect, useMemo, useState, type ReactNode } from "react";
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
  ChevronLeft,
  Moon,
  Shield,
  Copy,
  Filter,
  BadgeCheck,
  BadgeHelp,
  Car,
  Tag,
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
// ASSETS (public/)
// ============================================================
const ASSETS = {
  family: {
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

type TicketCostVND = {
  currency: "VND";
  adult_vnd: number;
  child_vnd?: number;
  notes?: string;
};

type TicketActivity = {
  id: string;
  city: string;
  name: string;
  link?: string;
  cost?: TicketCostVND;
  tags?: string[];
};

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
type Operator = "Ja Cosmo" | "Other" | "Airline" | "Renea" | "Whale Island";

type PayerRule = "claudine_20pct_transport" | "split_given" | "adult_equal_split";

type ExpenseItemUSD = {
  id: string;
  category: ExpenseCategory;
  mode: ExpenseMode;
  operator: Operator;
  operated_by_ja_cosmo: boolean;
  status: StatusTag;
  date?: string | null; // ISO or null
  from?: string;
  to?: string;
  title: string;
  price_total_usd: number;
  payer_rule: PayerRule;
  // when payer_rule = split_given we set explicit split:
  claudine_usd?: number;
  nous_usd?: number;
  notes?: string;
  tags?: string[];
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
  ticket_activities: TicketActivity[]; // small local tickets (VND)
  expenses_usd: ExpenseItemUSD[]; // CORE — USD only (no hotels, no food)
}

// ============================================================
// HELPERS
// ============================================================
const formatUSD = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
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
  const text = (day.theme?.join(" ") ?? "") + " " + (day.blocks?.map((b) => b.plan).join(" ") ?? "");
  const cityCover = cityCoverFromLabel(day.city);
  if (day.city.includes("→")) {
    const moment = momentCoverFromText(text);
    if (moment) return P(moment);
  }
  return cityCover;
};

const badgeForStatus = (s: StatusTag) => {
  if (s === "CONFIRMED") return { label: "CONFIRMED", cls: "bg-emerald-600 text-white", icon: <BadgeCheck size={14} /> };
  return { label: "ESTIMATE", cls: "bg-amber-500 text-white", icon: <BadgeHelp size={14} /> };
};

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

// ============================================================
// UI ATOMS (Premium, consistent)
// ============================================================
const Glass = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`backdrop-blur-xl bg-white/70 border border-white/40 shadow-xl overflow-hidden ${className}`}>{children}</div>
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
  <div className="flex -space-x-3 overflow-hidden p-2">
    {members.map((m) => (
      <div key={m.name} className="group relative">
        <img
          src={P(m.src)}
          alt={m.name}
          className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-md transition-transform group-hover:scale-110"
          onError={(e) => {
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
  subtitle,
}: {
  onOpenQuick: () => void;
  activeCity: string;
  coverSrc?: string;
  subtitle?: string;
}) => {
  const src = coverSrc || ASSETS.covers.sections.home;
  return (
    <div className="relative h-[78vh] w-full bg-slate-900">
      <img src={src} alt="Hero" className="absolute inset-0 w-full h-full object-cover opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-slate-900" />

      <div className="absolute top-12 left-0 right-0 px-6 flex justify-between items-start pointer-events-none">
        <div className="pointer-events-auto">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 mb-1">24 Juil → 18 Août</p>
          <h1 className="text-4xl font-black text-white leading-none">
            Vietnam <span className="text-emerald-400">2026</span>
          </h1>
          {subtitle && <p className="mt-2 text-xs font-bold text-white/60">{subtitle}</p>}
        </div>
        <button
          onClick={onOpenQuick}
          className="pointer-events-auto w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white"
        >
          <Search size={20} />
        </button>
      </div>

      <div className="absolute bottom-10 left-0 right-0 px-6">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 mb-2">Family Trip</p>
        <h2 className="text-6xl font-black text-white leading-none mb-6">VIETNAM</h2>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-bold text-white/60 mb-1">Focus du moment :</p>
            <p className="text-2xl font-black text-white tracking-tight italic">{activeCity}</p>
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
            <p className="text-xs font-medium text-white/70">Checklist + Argent</p>
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
            <p className="text-xs font-medium text-white/70">Core + Tickets</p>
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
            <p className="text-xs font-medium text-slate-500">Food + Aéroports</p>
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
            <p className="text-xs font-medium text-white/70">USD only</p>
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
      <div className="relative h-64 rounded-[40px] overflow-hidden shadow-2xl">
        <img
          src={coverSrc}
          alt={day.city}
          className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110 duration-700"
          onError={(e) => {
            e.currentTarget.src = ASSETS.covers.sections.itinerary;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
        <div className="absolute bottom-8 left-8 right-8">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={12} className="text-emerald-400" />
            <p className="text-[10px] font-black text-white/80 uppercase tracking-widest">{safeDateLabel(day.date)}</p>
          </div>
          <h4 className="text-2xl font-black text-white tracking-tighter mb-4 leading-none">{day.city}</h4>
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
                <p className="text-xs font-bold text-slate-500 italic">Contenu masqué (Mode Kids)</p>
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
          <p className="text-xs font-bold text-amber-800">Énergie au max : on explore un café caché !</p>
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
        <h4 className="text-2xl font-black text-slate-900 tracking-tighter mb-1">{hotel.name}</h4>
        <div className="flex items-center gap-2 text-indigo-600 mb-6">
          <Calendar size={14} />
          <p className="text-xs font-black">{hotel.dates}</p>
        </div>

        {hotel.note && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 text-[10px] font-bold text-amber-800 mb-6 leading-relaxed">
            {hotel.note}
          </div>
        )}

        <p className="text-sm font-bold text-slate-500 italic mb-8">“{hotel.why}”</p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100">
            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Famille</p>
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
              Voir Résa
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

// ============================================================
// FAMILY (static)
// ============================================================
const FAMILY_MEMBERS = [
  {
    name: "Marilyne",
    desc: "La Boss",
    color: "bg-pink-100 text-pink-700",
    src: "/family/public:family:marilyne.jpg",
    fallback: "https://ui-avatars.com/api/?name=Marilyne&background=fce7f3&color=be185d&size=200",
  },
  {
    name: "Claudine",
    desc: "La Sage",
    color: "bg-indigo-100 text-indigo-700",
    src: "/family/public:family:claudine.jpg",
    fallback: "https://ui-avatars.com/api/?name=Claudine&background=e0e7ff&color=4338ca&size=200",
  },
  {
    name: "Nizzar",
    desc: "Le Pilote",
    color: "bg-slate-100 text-slate-700",
    src: "/family/public:family:nizzar.jpg",
    fallback: "https://ui-avatars.com/api/?name=Nizzar&background=f1f5f9&color=334155&size=200",
  },
  {
    name: "Aydann",
    desc: "L'Ado",
    color: "bg-blue-100 text-blue-700",
    src: "/family/public:family:aydann.jpg",
    fallback: "https://ui-avatars.com/api/?name=Aydann&background=dbeafe&color=1d4ed8&size=200",
  },
  {
    name: "Milann",
    desc: "La Mascotte",
    color: "bg-orange-100 text-orange-700",
    src: "/family/public:family:milann.jpg",
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
  "Cash recommandé au Vietnam (certains hôtels/shops facturent des frais carte).",
  "Je prévois du cash: restaurants locaux et petits commerces = liquide roi.",
  "ATM: souvent limites + frais; je retire moins souvent mais plus gros.",
  "Marchés: je vérifie le prix avant, et je négocie (c’est attendu).",
];

// ============================================================
// TRIP DATA (includes the NEW expenses model)
// ============================================================
const TRIP_DATA: TripData = {
  meta: {
    title: "Vietnam 2026 — Family Trip",
    travelers: "3 adultes + 2 enfants (12 et 6) + Claudine",
    travelers_count: {
      adults_total: 4,
      adults_core_family: 3, // Nous
      adults_claudine: 1, // Claudine
      kids_total: 2,
      kids_ages: [12, 6],
    },
    vibe: ["culture", "histoire", "art", "nature", "bonne bouffe", "moments d’amour"],
    flights: {
      outbound: { from: "Marrakech", date: "2026-07-24", time: "18:55" },
      arrive_hanoi: { date: "2026-07-25", time: "19:55" },
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
      cover: "/covers/hotels/hanoi-ja-cosmo.jpg",
      note: "Extra bed confirmé pour l’enfant de 6 ans (par l’hôtel).",
    },
    {
      city: "Ninh Binh (Tam Coc)",
      name: "Tam Coc Golden Fields Homestay",
      dates: "28 Jul → 30 Jul",
      budget: { us: 140, claudine: 110, currency: "USD" },
      booking_url: "https://www.booking.com/hotel/vn/tam-coc-golden-fields-homestay.html",
      why: "Base rizières + liberté; parfait pour le ‘wow’ UNESCO sans galère.",
      cover: "/covers/hotels/ninh-binh-tam-coc-golden-fields.jpg",
    },
    {
      city: "Ha Long",
      name: "Wyndham Legend Halong",
      dates: "30 Jul → 31 Jul",
      budget: { us: 130, claudine: 80, currency: "USD" },
      booking_url: "https://www.booking.com/hotel/vn/wyndham-legend-halong-bai-chay5.html",
      why: "Transition confortable avant croisière, logistique simple.",
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
      cover: "/covers/hotels/ha-long-rc-cruise.jpg (Renea).jpg",
    },
    {
      city: "Hoi An (Cua Dai Beach)",
      name: "Palm Garden Beach Resort & Spa",
      dates: "01 Aug → 06 Aug",
      budget: { us: 680, claudine: 620, currency: "USD" },
      booking_url: "https://www.booking.com/hotel/vn/palm-garden-beach-resort-spa-510.html",
      why: "Grand resort avec plage et immense piscine. Le top pour se poser en famille.",
      cover: "/covers/hotels/hoi-an-palm-garden.png",
    },
    {
      city: "Da Nang",
      name: "Seahorse Signature Danang Hotel by Haviland",
      dates: "06 Aug → 08 Aug",
      budget: { us: 129, claudine: 92, currency: "USD" },
      booking_url: "https://www.booking.com/hotel/vn/seahorse-signature-danang-by-haviland.html",
      why: "Base urbaine efficace pour culture + ponts + musées.",
      cover: "/covers/hotels/da-nang-seahorse-signature.jpg",
    },
    {
      city: "Whale Island (Hon Ong)",
      name: "Whale Island Resort",
      dates: "08 Aug → 12 Aug",
      budget: { us: 415, claudine: 415, currency: "USD" },
      official_url: "https://whaleislandresort.com/",
      why: "Déconnexion nature pure, rythme famille, mer & ciel.",
      cover: "/covers/hotels/whale-island-resort.jpg",
    },
    {
      city: "Ho Chi Minh City",
      name: "Alagon Saigon Hotel & Spa",
      dates: "12 Aug → 15 Aug",
      budget: { us: 275, claudine: 211, currency: "USD" },
      booking_url: "https://www.booking.com/hotel/vn/alagon-saigon.html",
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
    Hanoi: [
      { name: "Hoa Lo Prison Relic (site)", url: "https://hoalo.vn/EN" },
      { name: "Thang Long Water Puppet Theatre (tickets)", url: "https://nhahatmuaroithanglong.vn/en/ticket-book/" },
    ],
    HoChiMinh: [
      { name: "War Remnants Museum (EN)", url: "https://baotangchungtichchientranh.vn/en" },
      { name: "Independence Palace (visiting hours)", url: "https://dinhdoclap.gov.vn/en/visiting-hours/" },
    ],
  },

  itinerary_days: [
    { date: "2026-07-25", city: "Hanoi", theme: ["arrivée", "dîner", "repos"], blocks: [{ label: "Soir", plan: "Arrivée 19:55, transfert, check-in, dîner simple local, dodo." }] },
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
        { label: "Midi", plan: "Départ driver privé vers Ninh Binh + check-in." },
        { label: "Soir", plan: "Rizières au coucher, dîner au calme." },
      ],
    },
    {
      date: "2026-07-29",
      city: "Ninh Binh",
      theme: ["nature", "wow", "boat"],
      blocks: [
        { label: "Matin", plan: "Trang An boat tour (UNESCO).", links: ["https://whc.unesco.org/en/list/1438/"] },
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
    { date: "2026-07-31", city: "Ha Long", theme: ["unesco", "cruise"], blocks: [{ label: "Midi/Soir", plan: "Embarquement Renea Cruise (Baie / karsts).", links: ["https://whc.unesco.org/en/list/672/"] }] },
    {
      date: "2026-08-01",
      city: "Ha Long → Da Nang → Hoi An",
      theme: ["transit", "buffer"],
      blocks: [
        { label: "Matin", plan: "Fin croisière + transfert HPH (si besoin)." },
        { label: "Soir", plan: "Vol HPH→DAD (si pris), transfert Hoi An, dodo." },
      ],
    },
    { date: "2026-08-02", city: "Hoi An", theme: ["plage", "slow", "night"], blocks: [{ label: "Soir", plan: "Old Town lanterns + food + flânerie.", links: ["https://whc.unesco.org/en/list/948/"] }] },
    { date: "2026-08-06", city: "Hoi An → Da Nang", theme: ["transfert", "city"], blocks: [{ label: "Soir", plan: "Rivière / ponts + dinner." }] },
    { date: "2026-08-08", city: "Da Nang → Whale Island", theme: ["early", "nature"], blocks: [{ label: "Jour", plan: "Vol DAD→CXR (si pris), transfert port + bateau, installation." }] },
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

  // Optional small tickets — NOT included in the “scope” totals by default
  ticket_activities: [
    {
      id: "ticket-hanoi-water-puppets",
      city: "Hanoi",
      name: "Thang Long Water Puppet (ticket)",
      link: "https://nhahatmuaroithanglong.vn/en/ticket-book/",
      cost: { currency: "VND", adult_vnd: 150000, notes: "Fourchette 100k–200k selon placement." },
      tags: ["kids-friendly", "culture"],
    },
    {
      id: "ticket-hanoi-hoa-lo",
      city: "Hanoi",
      name: "Hoa Lo Prison (ticket)",
      link: "https://hoalo.vn/EN",
      cost: { currency: "VND", adult_vnd: 50000, notes: "Enfants parfois gratuits/discount (à confirmer sur place)." },
      tags: ["impact", "histoire"],
    },
  ],

  // CORE expenses (USD only, no hotels, no food) — as provided
  expenses_usd: [
    // 1A — Ja Cosmo transfers (CONFIRMED)
    {
      id: "T-JC-001",
      category: "transport",
      mode: "private_car_7_seater",
      operator: "Ja Cosmo",
      operated_by_ja_cosmo: true,
      status: "CONFIRMED",
      date: "2026-07-25",
      from: "Hanoi Airport (HAN)",
      to: "Ja Cosmo Hotel (Hanoi)",
      title: "Private transfer (7-seater) — Airport → Hotel",
      price_total_usd: 20.02,
      payer_rule: "claudine_20pct_transport",
      notes: "Confirmed by Ja Cosmo. Private 7-seat vehicle.",
      tags: ["ja_cosmo", "private", "HAN"],
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
      to: "Ninh Binh (hotel TBD)",
      title: "Private transfer (7-seater) — Hanoi → Ninh Binh",
      price_total_usd: 57.75,
      payer_rule: "claudine_20pct_transport",
      notes: "Confirmed by Ja Cosmo. Early departure requested.",
      tags: ["ja_cosmo", "private"],
    },
    {
      id: "T-JC-003",
      category: "transport",
      mode: "private_car_7_seater",
      operator: "Ja Cosmo",
      operated_by_ja_cosmo: true,
      status: "CONFIRMED",
      date: "2026-07-30",
      from: "Ninh Binh (hotel TBD)",
      to: "Ha Long (hotel/port TBD)",
      title: "Private transfer (7-seater) — Ninh Binh → Ha Long",
      price_total_usd: 77.0,
      payer_rule: "claudine_20pct_transport",
      notes: "Confirmed by Ja Cosmo. Luggage note: upgrade if 4 big suitcases+.",
      tags: ["ja_cosmo", "private"],
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
      title: "Private transfer (7-seater) — Airport → Hotel",
      price_total_usd: 20.02,
      payer_rule: "claudine_20pct_transport",
      notes: "Confirmed by Ja Cosmo. Time TBD.",
      tags: ["ja_cosmo", "private", "HAN"],
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
      title: "Private transfer (7-seater) — Hotel → Airport",
      price_total_usd: 13.47,
      payer_rule: "claudine_20pct_transport",
      notes: "Confirmed by Ja Cosmo. Recommended depart hotel 16:00 for 19:30 flight.",
      tags: ["ja_cosmo", "private", "HAN"],
    },

    // 1B — Ground/limousine estimates (ESTIMATE)
    {
      id: "T-OT-101",
      category: "transport",
      mode: "limousine_or_private_van",
      operator: "Other",
      operated_by_ja_cosmo: false,
      status: "ESTIMATE",
      date: null,
      from: "Hanoi",
      to: "Ninh Binh",
      title: "Limousine / van — Hanoi → Ninh Binh",
      price_total_usd: 60.0,
      payer_rule: "claudine_20pct_transport",
      notes: "Estimate (older list). Keep only if not replaced by Ja Cosmo transfer.",
      tags: ["estimate"],
    },
    {
      id: "T-OT-102",
      category: "transport",
      mode: "limousine_or_private_van",
      operator: "Other",
      operated_by_ja_cosmo: false,
      status: "ESTIMATE",
      date: null,
      from: "Ninh Binh",
      to: "Ha Long",
      title: "Limousine / van — Ninh Binh → Ha Long",
      price_total_usd: 60.0,
      payer_rule: "claudine_20pct_transport",
      notes: "Estimate (older list). Keep only if not replaced.",
      tags: ["estimate"],
    },
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
      title: "Private transfer — Ha Long → HPH",
      price_total_usd: 50.0,
      payer_rule: "claudine_20pct_transport",
      notes: "Estimate (older list).",
      tags: ["estimate"],
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
      title: "Private transfer — DAD → Hoi An",
      price_total_usd: 20.0,
      payer_rule: "claudine_20pct_transport",
      notes: "Estimate (older list).",
      tags: ["estimate"],
    },

    // 1C — Domestic flights estimates (ESTIMATE)
    {
      id: "F-OT-201",
      category: "transport",
      mode: "flight_domestic",
      operator: "Airline",
      operated_by_ja_cosmo: false,
      status: "ESTIMATE",
      date: null,
      from: "Hai Phong (HPH)",
      to: "Da Nang (DAD)",
      title: "Domestic flight — HPH → DAD (for 5)",
      price_total_usd: 300.0,
      payer_rule: "claudine_20pct_transport",
      notes: "Estimate (older list).",
      tags: ["estimate", "flight"],
    },
    {
      id: "F-OT-202",
      category: "transport",
      mode: "flight_domestic",
      operator: "Airline",
      operated_by_ja_cosmo: false,
      status: "ESTIMATE",
      date: null,
      from: "Da Nang (DAD)",
      to: "Cam Ranh (CXR)",
      title: "Domestic flight — DAD → CXR (for 5)",
      price_total_usd: 300.0,
      payer_rule: "claudine_20pct_transport",
      notes: "Estimate (older list).",
      tags: ["estimate", "flight"],
    },
    {
      id: "F-OT-203",
      category: "transport",
      mode: "flight_domestic",
      operator: "Airline",
      operated_by_ja_cosmo: false,
      status: "ESTIMATE",
      date: null,
      from: "Cam Ranh (CXR)",
      to: "Ho Chi Minh (SGN)",
      title: "Domestic flight — CXR → SGN (for 5)",
      price_total_usd: 300.0,
      payer_rule: "claudine_20pct_transport",
      notes: "Estimate (older list).",
      tags: ["estimate", "flight"],
    },
    {
      id: "F-OT-204",
      category: "transport",
      mode: "flight_domestic",
      operator: "Airline",
      operated_by_ja_cosmo: false,
      status: "ESTIMATE",
      date: null,
      from: "Ho Chi Minh (SGN)",
      to: "Hanoi (HAN)",
      title: "Domestic flight — SGN → HAN (for 5)",
      price_total_usd: 250.0,
      payer_rule: "claudine_20pct_transport",
      notes: "Estimate (older list).",
      tags: ["estimate", "flight"],
    },

    // 2A — Activities core (explicit split)
    {
      id: "A-HL-001",
      category: "activity",
      mode: "stay_or_package",
      operator: "Renea",
      operated_by_ja_cosmo: false,
      status: "CONFIRMED",
      date: "2026-07-31",
      from: "Ha Long",
      to: "Ha Long",
      title: "Renea Cruise (Ha Long) — explicit split",
      price_total_usd: 630.0,
      payer_rule: "split_given",
      claudine_usd: 300.0,
      nous_usd: 330.0,
      notes: "Confirmed in internal trip recap.",
      tags: ["cruise", "confirmed"],
    },
    {
      id: "A-WI-001",
      category: "activity",
      mode: "stay_or_package",
      operator: "Whale Island",
      operated_by_ja_cosmo: false,
      status: "CONFIRMED",
      date: "2026-08-08",
      from: "Whale Island",
      to: "Whale Island",
      title: "Whale Island Resort stay — explicit split",
      price_total_usd: 830.0,
      payer_rule: "split_given",
      claudine_usd: 415.0,
      nous_usd: 415.0,
      notes: "Confirmed in internal trip recap.",
      tags: ["nature", "confirmed"],
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
// Expense Engine (Scope & Rules)
// - USD only, no hotels, no food
// - Transport allocation: 20% Claudine, 80% Nous (on the included transport set)
// - Activities: explicit split if provided else adult_equal_split (not used here)
// ============================================================
type BudgetFilters = {
  includeConfirmed: boolean;
  includeEstimates: boolean;
  onlyJaCosmo: boolean;
  search: string;
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
  const q = filters.search.trim().toLowerCase();

  const filtered = expenses.filter((e) => {
    if (!filters.includeConfirmed && e.status === "CONFIRMED") return false;
    if (!filters.includeEstimates && e.status === "ESTIMATE") return false;
    if (filters.onlyJaCosmo && !e.operated_by_ja_cosmo) return false;

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
    // fallback adult_equal_split if ever used:
    const each = a.price_total_usd / 3;
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
// Expense UI
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
          <p className="mt-2 text-xl font-black text-slate-900">{formatUSD(item.price_total_usd)}</p>
          {item.date && <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{item.date}</p>}
        </div>
      </div>

      {showAlloc && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Claudine</p>
            <p className="text-sm font-black text-slate-900">{formatUSD(item.alloc_claudine)}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Nous</p>
            <p className="text-sm font-black text-slate-900">{formatUSD(item.alloc_nous)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const TicketsCard = ({
  title,
  items,
  kidsMode,
  includeTicket,
  setIncludeTicket,
  vndPerUsd,
  setVndPerUsd,
}: {
  title: string;
  items: TicketActivity[];
  kidsMode: boolean;
  includeTicket: Record<string, boolean>;
  setIncludeTicket: (next: Record<string, boolean>) => void;
  vndPerUsd: number;
  setVndPerUsd: (n: number) => void;
}) => {
  const visible = items.filter((a) => {
    if (kidsMode && a.tags?.includes("impact")) return false;
    return true;
  });

  const totalUsd = sum(
    visible.map((a) => {
      const on = includeTicket[a.id] ?? false;
      if (!on || !a.cost) return 0;
      // Tickets: assume "Nous" = 3 adults + 2 kids, Claudine = 1 adult
      const child = a.cost.child_vnd ?? a.cost.adult_vnd;
      const nousVnd = a.cost.adult_vnd * 3 + child * 2;
      const claudineVnd = a.cost.adult_vnd * 1;
      return (nousVnd + claudineVnd) / vndPerUsd;
    })
  );

  return (
    <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl p-8">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h4 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{title}</h4>
          <p className="text-xs font-bold text-slate-400 italic mt-1">Optionnel — conversion VND → USD</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total tickets (est.)</p>
          <p className="text-xl font-black text-slate-900">{formatUSD(totalUsd)}</p>
        </div>
      </div>

      <div className="p-5 rounded-[28px] bg-slate-50 border border-slate-100 mb-6">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
          <Banknote size={14} /> Taux (VND / $1)
        </p>
        <input
          type="number"
          value={vndPerUsd}
          onChange={(e) => setVndPerUsd(Number(e.target.value || 0))}
          className="bg-white px-5 py-4 rounded-2xl border border-slate-200 w-full text-lg font-black text-slate-900 shadow-sm"
        />
      </div>

      <div className="space-y-4">
        {visible.map((a) => {
          const on = includeTicket[a.id] ?? false;
          const usd = a.cost ? a.cost.adult_vnd / vndPerUsd : 0;
          return (
            <div key={a.id} className="p-5 rounded-[28px] bg-slate-50 border border-slate-100">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-black text-slate-900">{a.name}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{a.city}</p>
                  {a.cost && (
                    <p className="mt-2 text-xs font-bold text-slate-600">
                      Base: {a.cost.adult_vnd.toLocaleString("vi-VN")} VND (~ {formatUSD(usd)} / adulte)
                    </p>
                  )}
                  {a.cost?.notes && <p className="mt-2 text-[11px] font-semibold text-slate-500 leading-relaxed">{a.cost.notes}</p>}
                  {a.link && (
                    <a
                      href={a.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full bg-white border border-slate-200 text-[10px] font-black text-slate-700"
                    >
                      <Info size={12} />
                      Lien
                    </a>
                  )}
                </div>

                <button
                  onClick={() => setIncludeTicket({ ...includeTicket, [a.id]: !on })}
                  className={`w-12 h-7 rounded-full p-1 transition-colors ${on ? "bg-emerald-500" : "bg-slate-200"}`}
                  aria-label="toggle"
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${on ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
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

  // Budget filters
  const [budgetTab, setBudgetTab] = useState<"overview" | "transport" | "activities">("overview");
  const [filters, setFilters] = useState<BudgetFilters>({
    includeConfirmed: true,
    includeEstimates: true,
    onlyJaCosmo: false,
    search: "",
  });

  // Optional tickets toggles
  const [vndPerUsd, setVndPerUsd] = useState(26000);
  const [includeTicket, setIncludeTicket] = useState<Record<string, boolean>>({});

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

  // Persist
  useEffect(() => {
    const savedKids = localStorage.getItem("trip_kids_mode");
    if (savedKids) setKidsMode(savedKids === "1");

    const savedCity = localStorage.getItem("trip_active_city");
    if (savedCity) setActiveCity(savedCity);

    const savedFocus = localStorage.getItem("trip_focus_day");
    if (savedFocus) setFocusDayIndex(Number(savedFocus));

    const savedVnd = localStorage.getItem("trip_vnd_per_usd");
    if (savedVnd) setVndPerUsd(Number(savedVnd));

    const savedTickets = localStorage.getItem("trip_ticket_toggle");
    if (savedTickets) setIncludeTicket(JSON.parse(savedTickets));

    const savedBudgetFilters = localStorage.getItem("trip_budget_filters_v2");
    if (savedBudgetFilters) setFilters(JSON.parse(savedBudgetFilters));

    const savedBudgetTab = localStorage.getItem("trip_budget_tab_v2");
    if (savedBudgetTab) setBudgetTab(savedBudgetTab as any);
  }, []);

  useEffect(() => localStorage.setItem("trip_kids_mode", kidsMode ? "1" : "0"), [kidsMode]);
  useEffect(() => localStorage.setItem("trip_active_city", activeCity), [activeCity]);
  useEffect(() => localStorage.setItem("trip_focus_day", String(focusDayIndex)), [focusDayIndex]);
  useEffect(() => localStorage.setItem("trip_vnd_per_usd", String(vndPerUsd)), [vndPerUsd]);
  useEffect(() => localStorage.setItem("trip_ticket_toggle", JSON.stringify(includeTicket)), [includeTicket]);
  useEffect(() => localStorage.setItem("trip_budget_filters_v2", JSON.stringify(filters)), [filters]);
  useEffect(() => localStorage.setItem("trip_budget_tab_v2", budgetTab), [budgetTab]);

  const focusDay = TRIP_DATA.itinerary_days[clamp(focusDayIndex, 0, TRIP_DATA.itinerary_days.length - 1)];

  const setCityFromFocus = () => {
    const base = focusDay.city.split("→").map((s) => s.trim())[0];
    setActiveCity(base);
  };

  const budget = useMemo(() => computeBudget(TRIP_DATA.expenses_usd, filters), [filters]);

  // Optional tickets computed (for display in activities / budget overview)
  const optionalTickets = useMemo(() => {
    const visible = TRIP_DATA.ticket_activities.filter((a) => !(kidsMode && a.tags?.includes("impact")));
    const totalUsd = sum(
      visible.map((a) => {
        const on = includeTicket[a.id] ?? false;
        if (!on || !a.cost) return 0;
        const child = a.cost.child_vnd ?? a.cost.adult_vnd;
        const nousVnd = a.cost.adult_vnd * 3 + child * 2;
        const claudineVnd = a.cost.adult_vnd;
        return (nousVnd + claudineVnd) / vndPerUsd;
      })
    );
    return { totalUsd, countOn: visible.filter((a) => includeTicket[a.id]).length };
  }, [includeTicket, kidsMode, vndPerUsd]);

  const grandPlusTickets = budget.grand.total + optionalTickets.totalUsd;

  const TabsList = [
    { id: "home", icon: Star },
    { id: "itinerary", icon: Calendar },
    { id: "hotels", icon: Hotel },
    { id: "activities", icon: Sparkles },
    { id: "guide", icon: Utensils },
    { id: "tips", icon: Lightbulb },
    { id: "budget", icon: Wallet },
  ] as const;

  // copy JSON of the *filtered* view to feed another AI / spreadsheet
  const exportPayload = useMemo(() => {
    const payload = {
      scope: "USD only, no hotels, no food. Includes transports + explicitly priced activities.",
      rules: {
        transport: "Claudine 20% of transport total; Nous 80%.",
        activities: "Use explicit split if provided; else adult_equal_split (3 adults = 33.33% each).",
        status: "CONFIRMED or ESTIMATE",
      },
      filters,
      computed: {
        transport_total_usd: budget.transport.total,
        activities_total_usd: budget.activities.total,
        grand_total_usd: budget.grand.total,
        claudine_total_usd: budget.grand.claudine_total,
        nous_total_usd: budget.grand.nous_total,
        optional_tickets_usd_estimate: optionalTickets.totalUsd,
        grand_plus_tickets_estimate: grandPlusTickets,
      },
      items_transport: budget.transport.items.map((x) => ({
        id: x.id,
        status: x.status,
        operator: x.operator,
        operated_by_ja_cosmo: x.operated_by_ja_cosmo,
        mode: x.mode,
        date: x.date ?? null,
        from: x.from ?? null,
        to: x.to ?? null,
        title: x.title,
        price_total_usd: Number(x.price_total_usd.toFixed(2)),
        allocated: {
          claudine_usd: Number(x.alloc_claudine.toFixed(2)),
          nous_usd: Number(x.alloc_nous.toFixed(2)),
        },
        notes: x.notes ?? null,
        tags: x.tags ?? [],
      })),
      items_activities: budget.activities.items.map((x) => ({
        id: x.id,
        status: x.status,
        operator: x.operator,
        mode: x.mode,
        date: x.date ?? null,
        title: x.title,
        price_total_usd: Number(x.price_total_usd.toFixed(2)),
        allocated: {
          claudine_usd: Number(x.alloc_claudine.toFixed(2)),
          nous_usd: Number(x.alloc_nous.toFixed(2)),
        },
        payer_rule: x.payer_rule,
        notes: x.notes ?? null,
        tags: x.tags ?? [],
      })),
    };
    return JSON.stringify(payload, null, 2);
  }, [filters, budget, optionalTickets.totalUsd, grandPlusTickets]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-32 overflow-x-hidden select-none">
      <QuickSheet open={quickOpen} onClose={() => setQuickOpen(false)} onGoto={(v) => setView(v)} />

      {/* HOME */}
      {view === "home" && (
        <div className="animate-in fade-in duration-500">
          <CinemaHero onOpenQuick={() => setQuickOpen(true)} activeCity={activeCity} coverSrc={cityCoverFromLabel(activeCity)} subtitle="Mobile HQ — Itinerary • Budget • Activities" />

          <div className="relative -mt-10 px-6 space-y-8">
            <Glass className="rounded-[40px] p-8 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                <p className="text-sm font-black text-slate-900 leading-none">{isWithinTrip ? "Trip en cours 🇻🇳" : "En préparation 📝"}</p>
              </div>
              <button onClick={() => setView("itinerary")} className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg">
                <ChevronRight size={24} />
              </button>
            </Glass>

            <div className="grid grid-cols-1 gap-4">
              <Toggle label="Mode Kids" icon={<Smartphone size={20} />} value={kidsMode} onChange={setKidsMode} hint="Masque les contenus ‘impact’ + tickets sensibles." />
            </div>

            <div>
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Équipage</h3>
                  <p className="text-xs font-bold text-slate-400 tracking-tight italic">Les aventuriers</p>
                </div>
              </div>
              <FamilyStrip members={FAMILY_MEMBERS as any} />
            </div>

            <div>
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tighter leading-none mb-1">Focus Jour</h3>
                  <p className="text-xs font-bold text-slate-400 italic">Swipe mental</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFocusDayIndex((i) => clamp(i - 1, 0, TRIP_DATA.itinerary_days.length - 1))}
                    className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setFocusDayIndex((i) => clamp(i + 1, 0, TRIP_DATA.itinerary_days.length - 1))}
                    className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              <DayCardMobile day={focusDay} coverSrc={dayCoverFromDay(focusDay)} mood={mood} kidsMode={kidsMode} />

              <button
                onClick={() => {
                  setCityFromFocus();
                  setView("itinerary");
                }}
                className="w-full py-5 rounded-[32px] bg-slate-100 text-slate-600 text-xs font-black uppercase tracking-widest mt-4"
              >
                Explorer cet itinéraire
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 pb-12">
              <button onClick={() => setView("activities")} className="p-6 rounded-[40px] bg-emerald-50 border border-emerald-100 text-left">
                <Sparkles size={24} className="text-emerald-600 mb-4" />
                <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Activités</p>
                <p className="text-[10px] font-bold text-emerald-500">Core + Tickets</p>
              </button>
              <button onClick={() => setView("budget")} className="p-6 rounded-[40px] bg-amber-50 border border-amber-100 text-left">
                <Wallet size={24} className="text-amber-600 mb-4" />
                <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Budget</p>
                <p className="text-[10px] font-bold text-amber-500">USD • split auto</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ITINERARY */}
      {view === "itinerary" && (
        <div className="animate-in slide-in-from-bottom duration-500 px-6 pt-12">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-1">Itinéraire</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Carte par carte</p>
            </div>
            <button onClick={() => setView("home")} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
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
        <div className="animate-in slide-in-from-bottom duration-500 px-6 pt-12">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-1">Hôtels</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Le repos du guerrier</p>
            </div>
            <button onClick={() => setView("home")} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <X size={20} />
            </button>
          </div>

          <div className="pb-20">{TRIP_DATA.hotels.map((h, i) => <HotelCard key={i} hotel={h} />)}</div>
        </div>
      )}

      {/* ACTIVITIES */}
      {view === "activities" && (
        <div className="animate-in slide-in-from-bottom duration-500 px-6 pt-12">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-1">Activités</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Core (USD) + Tickets (option)</p>
            </div>
            <button onClick={() => setView("home")} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <X size={20} />
            </button>
          </div>

          <Glass className="rounded-[40px] p-7 mb-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Core activities (USD)</p>
                <p className="text-3xl font-black text-slate-900 tracking-tighter">{formatUSD(budget.activities.total)}</p>
                <p className="mt-2 text-xs font-bold text-slate-500">Split: Claudine {formatUSD(budget.activities.claudine_total)} • Nous {formatUSD(budget.activities.nous_total)}</p>
              </div>
              <div className="grid gap-2">
                <StatChip label="Tickets ON" value={`${optionalTickets.countOn}`} accent="slate" />
              </div>
            </div>
          </Glass>

          <div className="space-y-5 mb-10">
            {budget.activities.items.map((item) => (
              <ExpenseRow key={item.id} item={item} showAlloc />
            ))}
          </div>

          <div className="pb-20">
            <TicketsCard
              title="Tickets locaux (optionnels)"
              items={TRIP_DATA.ticket_activities}
              kidsMode={kidsMode}
              includeTicket={includeTicket}
              setIncludeTicket={setIncludeTicket}
              vndPerUsd={vndPerUsd}
              setVndPerUsd={setVndPerUsd}
            />
          </div>
        </div>
      )}

      {/* GUIDE */}
      {view === "guide" && (
        <div className="animate-in slide-in-from-bottom duration-500 px-6 pt-12">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-1">Guide</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Food + Logistique</p>
            </div>
            <button onClick={() => setView("home")} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <X size={20} />
            </button>
          </div>

          <SimpleListCard title="Miam Miam" icon={<Utensils size={24} />} items={Object.entries(TRIP_DATA.food).map(([r, f]) => `${r}: ${f.join(", ")}`)} />
          <AirportGlossaryCard items={TRIP_DATA.airport_glossary} />
          <PhrasebookCard items={TRIP_DATA.phrasebook} />
        </div>
      )}

      {/* TIPS */}
      {view === "tips" && (
        <div className="animate-in slide-in-from-bottom duration-500 px-6 pt-12">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-1">Conseils</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Argent & Culture</p>
            </div>
            <button onClick={() => setView("home")} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <X size={20} />
            </button>
          </div>

          <TipsChecklist />
          <div className="h-8" />
          <SimpleListCard title="Argent" icon={<Wallet size={24} />} items={MONEY_TIPS} />
          <SimpleListCard title="Rappels utiles" icon={<Info size={24} />} items={TRIP_DATA.glossary.map((g) => `${g.term}: ${g.note}`)} />
        </div>
      )}

      {/* BUDGET */}
      {view === "budget" && (
        <div className="animate-in slide-in-from-bottom duration-500 px-6 pt-12">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-1">Budget</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">USD only • No hotels • No food</p>
            </div>
            <button onClick={() => setView("home")} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <X size={20} />
            </button>
          </div>

          <div className="mb-8">
            <Segmented
              value={budgetTab}
              onChange={(id) => setBudgetTab(id as any)}
              items={[
                { id: "overview", label: "Overview", icon: <Wallet size={16} /> },
                { id: "transport", label: "Transport", icon: <Car size={16} /> },
                { id: "activities", label: "Activities", icon: <Sparkles size={16} /> },
              ]}
            />
          </div>

          {/* Filters */}
          <div className="mb-8 bg-white rounded-[40px] border border-slate-100 shadow-xl p-7">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600">
                  <Filter size={18} />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900">Filtres</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Affecte les totaux + export</p>
                </div>
              </div>

              <button
                onClick={async () => {
                  const ok = await copyToClipboard(exportPayload);
                  if (ok) alert("Export JSON copié ✅");
                  else alert("Impossible de copier (permissions navigateur).");
                }}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900 text-white text-xs font-black"
              >
                <Copy size={16} />
                Copy JSON
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Search</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-500">
                    <Search size={18} />
                  </div>
                  <input
                    value={filters.search}
                    onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                    placeholder="id, operator, route, notes, tags…"
                    className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Toggle
                  label="Include CONFIRMED"
                  icon={<BadgeCheck size={18} />}
                  value={filters.includeConfirmed}
                  onChange={(v) => setFilters((f) => ({ ...f, includeConfirmed: v }))}
                  hint="Données confirmées"
                />
                <Toggle
                  label="Include ESTIMATE"
                  icon={<BadgeHelp size={18} />}
                  value={filters.includeEstimates}
                  onChange={(v) => setFilters((f) => ({ ...f, includeEstimates: v }))}
                  hint="Montants non confirmés"
                />
                <Toggle
                  label="Only Ja Cosmo"
                  icon={<BadgeCheck size={18} />}
                  value={filters.onlyJaCosmo}
                  onChange={(v) => setFilters((f) => ({ ...f, onlyJaCosmo: v }))}
                  hint="Uniquement transferts opérés"
                />
                <Toggle
                  label="Mode Kids"
                  icon={<Smartphone size={18} />}
                  value={kidsMode}
                  onChange={setKidsMode}
                  hint="Masque ‘impact’ (tickets)"
                />
              </div>
            </div>
          </div>

          {/* Overview */}
          {budgetTab === "overview" && (
            <div className="space-y-6 pb-20">
              <Glass className="rounded-[40px] p-8">
                <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-4">Grand Total (scope)</p>
                <p className="text-5xl font-black text-slate-900 tracking-tighter mb-3">{formatUSD(budget.grand.total)}</p>
                <p className="text-xs font-bold text-slate-500">Transport + Activities (USD only). Hotels/Food excluded.</p>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <StatChip label="Claudine" value={formatUSD(budget.grand.claudine_total)} accent="indigo" />
                  <StatChip label="Nous" value={formatUSD(budget.grand.nous_total)} accent="slate" />
                  <StatChip label="Transport total" value={formatUSD(budget.transport.total)} accent="emerald" />
                  <StatChip label="Activities total" value={formatUSD(budget.activities.total)} accent="amber" />
                </div>

                <div className="mt-6 p-5 rounded-[28px] bg-slate-50 border border-slate-100">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Rule recap</p>
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-700">1) Transport split: Claudine 20% • Nous 80%</p>
                    <p className="text-xs font-bold text-slate-700">2) Activities: split_given if provided (here: yes)</p>
                    <p className="text-xs font-bold text-slate-700">3) Status: CONFIRMED vs ESTIMATE (filters apply)</p>
                  </div>
                </div>
              </Glass>

              <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl p-8">
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Optional add-on</p>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">Tickets locaux (est.)</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tickets total</p>
                    <p className="text-2xl font-black text-slate-900">{formatUSD(optionalTickets.totalUsd)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <StatChip label="Tickets ON" value={`${optionalTickets.countOn}`} accent="slate" />
                  <StatChip label="Grand + Tickets" value={formatUSD(grandPlusTickets)} accent="emerald" />
                </div>

                <button
                  onClick={() => setView("activities")}
                  className="mt-6 w-full py-5 rounded-[32px] bg-slate-900 text-white text-xs font-black uppercase tracking-widest"
                >
                  Gérer les tickets
                </button>
              </div>
            </div>
          )}

          {/* Transport */}
          {budgetTab === "transport" && (
            <div className="space-y-5 pb-20">
              <Glass className="rounded-[40px] p-8">
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-3">Transport total (filtered)</p>
                <p className="text-4xl font-black text-slate-900 tracking-tighter">{formatUSD(budget.transport.total)}</p>
                <p className="mt-2 text-xs font-bold text-slate-500">
                  Split auto: Claudine {formatUSD(budget.transport.claudine_total)} • Nous {formatUSD(budget.transport.nous_total)}
                </p>
              </Glass>

              <div className="space-y-4">
                {budget.transport.items.map((item) => (
                  <ExpenseRow key={item.id} item={item} showAlloc />
                ))}
              </div>
            </div>
          )}

          {/* Activities */}
          {budgetTab === "activities" && (
            <div className="space-y-5 pb-20">
              <Glass className="rounded-[40px] p-8">
                <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-3">Activities total (filtered)</p>
                <p className="text-4xl font-black text-slate-900 tracking-tighter">{formatUSD(budget.activities.total)}</p>
                <p className="mt-2 text-xs font-bold text-slate-500">
                  Split (explicit): Claudine {formatUSD(budget.activities.claudine_total)} • Nous {formatUSD(budget.activities.nous_total)}
                </p>
              </Glass>

              <div className="space-y-4">
                {budget.activities.items.map((item) => (
                  <ExpenseRow key={item.id} item={item} showAlloc />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MOBILE NAV */}
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
