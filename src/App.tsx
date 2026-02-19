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
  BadgeCheck,
  BadgeHelp,
  Car,
  Tag,
  Ticket,
  Clock,
  Users,
} from "lucide-react";

// ============================================================
// ASSET URL (Vite)
// ============================================================
const assetUrl = (path: string) => {
  const base = (import.meta as any)?.env?.BASE_URL ?? "/";
  const cleanBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
};
const P = (p: string) => assetUrl(p);

const VND_PER_USD = 25970;
const vndToUsdRounded = (vnd: number) => Math.round(vnd / VND_PER_USD);
const usdRounded = (usd: number) => Math.round(usd);

// ============================================================
// ASSETS
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
      ha_long_renea_cruise: P("/covers/hotels/ha-long-rc-cruise.jpg"),
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
  date: string;
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
type Operator = "Ja Cosmo" | "Other" | "Airline" | "Renea" | "Whale Island";
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

// FIX: category et payMode sont string pour flexibilite
type PlannedActivity = {
  id: string;
  city: string;
  window?: string;
  name: string;
  category: string;
  duration?: string;
  bestTime?: string;
  pricing: {
    currency: "VND" | "USD";
    vnd_adult?: number;
    vnd_child?: number;
    vnd_range?: [number, number];
    usd_adult?: number;
    usd_range?: [number, number];
    estimatedUSD_adult?: number;
    estimatedUSD_range?: [number, number];
    estimatedUSD_total?: number;
    quantity?: number;
    basis?: string;
  };
  kidsRule?: string;
  payMode?: string;
  cashOnly?: boolean;
  provider: string;
  sourceUrl?: string;
  notes?: string;
  tags?: string[];
  impact?: boolean;
};

interface TripData {
  meta: {
    title: string;
    travelers: string;
    travelers_count: {
      adults_total: number;
      kids_total: number;
      kids_ages: number[];
      adults_core_family: number;
      adults_claudine: number;
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
const googleMapsSearchUrl = (q: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
const uniqCitiesByOrder = (days: ItineraryDay[]) => {
  const out: string[] = [];
  for (const d of days) {
    const base = d.city.split("\u2192").map((s) => s.trim())[0];
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
  if (t.includes("vol") || t.includes("\u00e9roport") || t.includes("airport") || t.includes("flight")) return MOMENT_COVERS.plane;
  if (t.includes("bateau") || t.includes("croisi") || t.includes("cruise") || t.includes("boat")) return MOMENT_COVERS.boat;
  if (t.includes("plage") || t.includes("beach")) return MOMENT_COVERS.beach;
  if (t.includes("march\u00e9") || t.includes("marche") || t.includes("market")) return MOMENT_COVERS.market;
  if (t.includes("caf\u00e9") || t.includes("cafe") || t.includes("coffee")) return MOMENT_COVERS.coffee;
  if (t.includes("street food") || t.includes("streetfood") || t.includes("food") || t.includes("d\u00eener")) return MOMENT_COVERS.streetfood;
  if (t.includes("mus\u00e9e") || t.includes("museum")) return MOMENT_COVERS.museum;
  if (t.includes("temple")) return MOMENT_COVERS.temple;
  if (t.includes("massage")) return MOMENT_COVERS.massage;
  if (t.includes("arriv\u00e9e") || t.includes("check-in") || t.includes("arrival")) return MOMENT_COVERS.arrival;
  if (t.includes("transfert") || t.includes("transfer") || t.includes("limousine") || t.includes("drive")) return MOMENT_COVERS.transfer;
  if (t.includes("soir") || t.includes("night") || t.includes("lantern")) return MOMENT_COVERS.night;
  return null;
};

const dayCoverFromDay = (day: ItineraryDay) => {
  const text = (day.theme?.join(" ") ?? "") + " " + (day.blocks?.map((b) => b.plan).join(" ") ?? "");
  const cityCover = cityCoverFromLabel(day.city);
  if (day.city.includes("\u2192")) {
    const moment = momentCoverFromText(text);
    if (moment) return P(moment);
  }
  return cityCover;
};

const badgeForStatus = (s: StatusTag) => {
  if (s === "CONFIRMED")
    return { label: "CONFIRM\u00c9", cls: "bg-emerald-600 text-white", icon: <BadgeCheck size={12} /> };
  return { label: "ESTIM\u00c9", cls: "bg-amber-500 text-white", icon: <BadgeHelp size={12} /> };
};

// ============================================================
// UI ATOMS
// ============================================================
const Glass = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`bg-white/80 backdrop-blur-xl rounded-[40px] shadow-sm border border-white/60 p-6 ${className}`}>
    {children}
  </div>
);

const Toggle = ({
  label, icon, value, onChange, hint,
}: {
  label: string; icon?: ReactNode; value: boolean;
  onChange: (v: boolean) => void; hint?: string;
}) => (
  <div className="flex items-center gap-3 py-3">
    {icon}
    <div className="flex-1">
      <div className="text-sm font-black text-slate-900">{label}</div>
      {hint && <div className="text-xs text-slate-400">{hint}</div>}
    </div>
    <button
      onClick={() => onChange(!value)}
      className={`w-12 h-7 rounded-full p-1 transition-colors ${value ? "bg-emerald-500" : "bg-slate-200"}`}
      aria-label={label}
    >
      <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${value ? "translate-x-5" : ""}`} />
    </button>
  </div>
);

const Segmented = ({
  items, value, onChange,
}: {
  items: { id: string; label: string; icon?: ReactNode }[];
  value: string;
  onChange: (id: string) => void;
}) => (
  <div className="flex gap-1 bg-slate-100 rounded-2xl p-1">
    {items.map((it) => (
      <button
        key={it.id}
        onClick={() => onChange(it.id)}
        className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
          value === it.id ? "bg-white text-slate-900 shadow" : "text-slate-500 hover:text-slate-700"
        }`}
      >
        {it.icon} {it.label}
      </button>
    ))}
  </div>
);

const StatChip = ({
  label, value, accent = "indigo",
}: {
  label: string; value: string; accent?: "indigo" | "emerald" | "amber" | "slate";
}) => {
  const cls =
    accent === "emerald" ? "bg-emerald-50 border-emerald-100 text-emerald-700" :
    accent === "amber" ? "bg-amber-50 border-amber-100 text-amber-700" :
    accent === "slate" ? "bg-slate-50 border-slate-100 text-slate-700" :
    "bg-indigo-50 border-indigo-100 text-indigo-700";
  return (
    <div className={`rounded-2xl border px-4 py-3 ${cls}`}>
      <div className="text-[10px] font-bold uppercase tracking-widest opacity-60">{label}</div>
      <div className="text-lg font-black">{value}</div>
    </div>
  );
};

const FamilyStrip = ({ members }: { members: typeof FAMILY_MEMBERS }) => (
  <div className="flex gap-3 overflow-x-auto pb-2">
    {members.map((m) => (
      <div key={m.name} className="flex-shrink-0 text-center">
        <img
          src={m.src}
          alt={m.name}
          className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
          onError={(e) => { e.currentTarget.src = m.fallback; }}
        />
        <div className="text-xs font-black mt-1">{m.name}</div>
      </div>
    ))}
  </div>
);

const CinemaHero = ({
  onOpenQuick, activeCity, coverSrc, subtitle,
}: {
  onOpenQuick: () => void; activeCity: string; coverSrc?: string; subtitle?: string;
}) => {
  const src = coverSrc || ASSETS.covers.sections.home;
  return (
    <div className="relative h-[380px] rounded-[40px] overflow-hidden mb-6 cursor-pointer" onClick={onOpenQuick}>
      <img src={src} alt="Hero" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute top-6 left-6">
        <span className="text-white/60 text-xs font-black uppercase tracking-widest">24 juil → 18 août</span>
      </div>
      <div className="absolute bottom-6 left-6 right-6">
        <h1 className="text-white text-4xl font-black leading-none">Vietnam <span className="opacity-40">2026</span></h1>
        {subtitle && <p className="text-white/70 text-sm mt-1">{subtitle}</p>}
        <div className="flex gap-2 mt-3">
          <span className="text-white/60 text-xs font-black uppercase tracking-widest">Family Trip</span>
        </div>
        <div className="mt-2 text-white text-xs font-bold opacity-60">VIETNAM</div>
        <div className="text-white text-sm font-black">Focus : <span className="opacity-80">{activeCity}</span></div>
      </div>
    </div>
  );
};

const QuickSheet = ({
  open, onClose, onGoto,
}: {
  open: boolean; onClose: () => void; onGoto: (v: View) => void;
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end" onClick={onClose}>
      <div className="w-full bg-white rounded-t-[40px] p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-black mb-4">Accès rapide</h3>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => { onGoto("tips"); onClose(); }} className="p-6 rounded-3xl bg-indigo-500 text-white text-left aspect-square flex flex-col justify-between">
            <Lightbulb size={24} /><div><div className="font-black">Conseils</div><div className="text-xs opacity-70">Checklist + argent</div></div>
          </button>
          <button onClick={() => { onGoto("activities"); onClose(); }} className="p-6 rounded-3xl bg-emerald-500 text-white text-left aspect-square flex flex-col justify-between">
            <Sparkles size={24} /><div><div className="font-black">Activités</div><div className="text-xs opacity-70">Par ville</div></div>
          </button>
          <button onClick={() => { onGoto("guide"); onClose(); }} className="p-6 rounded-3xl bg-slate-100 text-slate-900 text-left aspect-square flex flex-col justify-between">
            <Utensils size={24} /><div><div className="font-black">Guide</div><div className="text-xs opacity-70">Food + aéroports</div></div>
          </button>
          <button onClick={() => { onGoto("budget"); onClose(); }} className="p-6 rounded-3xl bg-amber-500 text-white text-left aspect-square flex flex-col justify-between">
            <Wallet size={24} /><div><div className="font-black">Budget</div><div className="text-xs opacity-70">USD uniquement</div></div>
          </button>
        </div>
        <p className="text-center text-xs text-slate-400 mt-4">Vietnam Trip 2026 — Hub Mobile</p>
      </div>
    </div>
  );
};

const CityTimeline = ({ cities, activeCity, onSelect }: { cities: string[]; activeCity: string; onSelect: (c: string) => void }) => (
  <div className="flex gap-2 overflow-x-auto pb-2">
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
  day, coverSrc, mood, kidsMode,
}: {
  day: ItineraryDay; coverSrc: string; mood: Mood; kidsMode: boolean;
}) => {
  const isFatigue = mood === "fatigue";
  const shouldHideImpact = (text: string) => {
    const t = text.toLowerCase();
    return t.includes("prison") || t.includes("war") || t.includes("remnants") || t.includes("impact") || t.includes("fort");
  };
  return (
    <div className="rounded-[40px] overflow-hidden bg-white shadow-sm border border-slate-50">
      <img src={coverSrc} alt={day.city} className="w-full h-48 object-cover"
        onError={(e) => { e.currentTarget.src = ASSETS.covers.sections.itinerary; }} />
      <div className="p-6">
        <div className="text-xs text-slate-400 font-bold mb-1">{safeDateLabel(day.date)}</div>
        <h4 className="text-xl font-black mb-2">{day.city}</h4>
        <div className="flex flex-wrap gap-1 mb-4">
          {day.theme.map((t) => (<span key={t} className="text-xs bg-slate-100 text-slate-600 rounded-full px-3 py-1 font-bold">{t}</span>))}
        </div>
        {day.blocks.map((b, idx) => {
          if (isFatigue && b.label === "Soir" && !b.plan.toLowerCase().includes("repos")) {
            return (<div key={idx} className="text-xs text-slate-400 italic py-2">Repos suggéré ce soir 😴</div>);
          }
          if (kidsMode && shouldHideImpact(b.plan)) {
            return (<div key={idx} className="text-xs text-slate-300 italic py-2">Contenu masqué (mode kids)</div>);
          }
          return (
            <div key={idx} className="mb-3">
              <div className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-1">{b.label}</div>
              <div className="text-sm text-slate-700 leading-relaxed">{b.plan}</div>
              {b.links?.length ? (
                <div className="flex gap-2 mt-1">
                  {b.links.map((l, i) => (
                    <a key={i} href={l} target="_blank" rel="noreferrer" className="text-xs text-indigo-500 font-bold underline">Lien</a>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
        {mood === "energy" && (
          <div className="mt-2 text-xs text-emerald-600 font-bold">⚡ Énergie au max : un café caché + balade.</div>
        )}
      </div>
    </div>
  );
};

const HotelCard = ({ hotel }: { hotel: HotelItem }) => {
  const link = hotel.booking_url || hotel.official_url;
  return (
    <Glass className="mb-4">
      {hotel.cover ? (
        <img src={hotel.cover} alt={hotel.name}
          className="w-full h-48 object-cover rounded-3xl mb-4"
          onError={(e) => { e.currentTarget.src = ASSETS.covers.sections.hotels; }} />
      ) : (<div className="w-full h-48 bg-slate-100 rounded-3xl mb-4" />)}
      <span className="text-xs bg-slate-100 text-slate-500 rounded-full px-3 py-1 font-bold">{hotel.city}</span>
      <h4 className="text-lg font-black mt-2 mb-1">{hotel.name}</h4>
      <p className="text-xs text-slate-400 font-bold mb-2">{hotel.dates}</p>
      {hotel.note && (<p className="text-xs text-amber-600 font-bold mb-2">{hotel.note}</p>)}
      <p className="text-sm text-slate-600 italic mb-4">“{hotel.why}”</p>
      <div className="flex gap-3 mb-4">
        <StatChip label="Nous" value={formatUSD0(hotel.budget.us)} />
        <StatChip label="Claudine" value={formatUSD0(hotel.budget.claudine)} accent="indigo" />
      </div>
      <div className="flex gap-2">
        {link ? (
          <a href={link} target="_blank" rel="noreferrer" className="flex-1 py-3 rounded-2xl bg-slate-900 text-white text-xs font-black text-center">Voir la résa</a>
        ) : (<span className="flex-1 py-3 rounded-2xl bg-slate-100 text-slate-400 text-xs font-black text-center">Pas de lien</span>)}
        <a href={googleMapsSearchUrl(hotel.name)} target="_blank" rel="noreferrer"
          className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center"><MapPin size={16} /></a>
      </div>
    </Glass>
  );
};

const SimpleListCard = ({ title, icon, items }: { title: string; icon: ReactNode; items: string[] }) => (
  <Glass className="mb-4">
    <div className="flex items-center gap-2 mb-4">{icon}<h4 className="text-lg font-black">{title}</h4></div>
    {items.map((t, i) => (<div key={i} className="text-sm text-slate-700 py-2 border-b border-slate-50 last:border-0">{t}</div>))}
  </Glass>
);

const PhrasebookCard = ({ items }: { items: PhraseItem[] }) => (
  <Glass className="mb-4">
    <h4 className="text-lg font-black mb-4">Mots utiles</h4>
    {items.map((p) => (
      <div key={p.fr} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
        <span className="text-sm font-bold text-slate-900 w-24 shrink-0">{p.fr}</span>
        <span className="text-sm font-black text-indigo-600">{p.vi}</span>
        <span className="text-xs text-slate-400">• {p.phon}</span>
      </div>
    ))}
  </Glass>
);

const AirportGlossaryCard = ({ items }: { items: AirportGlossaryItem[] }) => (
  <Glass className="mb-4">
    <h4 className="text-lg font-black mb-1">Aéroports</h4>
    <p className="text-xs text-slate-400 mb-4">Codes + trajets estimés</p>
    {items.map((a, i) => (
      <div key={i} className="mb-4 pb-4 border-b border-slate-50 last:border-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-black text-indigo-600">{a.code}</span>
          <span className="text-slate-300">•</span>
          <span className="text-sm font-bold">{a.city}</span>
        </div>
        <p className="text-xs text-slate-600 mb-1">{a.airport}</p>
        <div className="flex gap-4">
          <div><div className="text-[10px] text-slate-400">Depuis l’hôtel</div><div className="text-xs font-bold">{a.fromHotel}</div></div>
          <div><div className="text-[10px] text-slate-400">Trajet</div><div className="text-xs font-bold">{a.eta}</div></div>
        </div>
        {a.note && <p className="text-xs text-amber-600 font-bold mt-1">! {a.note}</p>}
      </div>
    ))}
  </Glass>
);

// ============================================================
// FAMILY
// ============================================================
const FAMILY_MEMBERS = [
  { name: "Marilyne", desc: "La Boss", color: "bg-pink-100 text-pink-700", src: "/family/public:family:marilyne.jpg", fallback: "https://ui-avatars.com/api/?name=Marilyne&background=fce7f3&color=be185d&size=200" },
  { name: "Claudine", desc: "La Sage", color: "bg-indigo-100 text-indigo-700", src: "/family/public:family:claudine.jpg", fallback: "https://ui-avatars.com/api/?name=Claudine&background=e0e7ff&color=4338ca&size=200" },
  { name: "Nizzar", desc: "Le Pilote", color: "bg-slate-100 text-slate-700", src: "/family/public:family:nizzar.jpg", fallback: "https://ui-avatars.com/api/?name=Nizzar&background=f1f5f9&color=334155&size=200" },
  { name: "Aydann", desc: "L'Ado", color: "bg-blue-100 text-blue-700", src: "/family/public:family:aydann.jpg", fallback: "https://ui-avatars.com/api/?name=Aydann&background=dbeafe&color=1d4ed8&size=200" },
  { name: "Milann", desc: "La Mascotte", color: "bg-orange-100 text-orange-700", src: "/family/public:family:milann.jpg", fallback: "https://ui-avatars.com/api/?name=Milann&background=ffedd5&color=c2410c&size=200" },
] as const;

// ============================================================
// STATIC LISTS
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
      adults_total: 4, adults_core_family: 3, adults_claudine: 1,
      kids_total: 2, kids_ages: [12, 6],
    },
    vibe: ["culture", "histoire", "art", "nature", "bonne bouffe", "moments d\u2019amour"],
    flights: {
      outbound: { from: "Marrakech", date: "2026-07-24", time: "18:55" },
      arrive_hanoi: { date: "2026-07-25", time: "19:55" },
      return_depart_hanoi: { date: "2026-08-17", time: "19:30" },
      return_arrive_marrakech: { date: "2026-08-18", time: "09:20" },
    },
  },
  hotels: [
    {
      city: "Hanoi", name: "Ja Cosmo Hotel and Spa", dates: "25 juil \u2192 28 juil, puis 15 ao\u00fbt \u2192 17 ao\u00fbt",
      budget: { us: 180, claudine: 110, currency: "USD" },
      booking_url: "https://www.booking.com/hotel/vn/ja-cosmo-and-spa.html",
      why: "Central pour ruelles, caf\u00e9s, culture; simple avec kids + Claudine.",
      cover: "/covers/hotels/hanoi-ja-cosmo.jpg",
      note: "Lit suppl\u00e9mentaire confirm\u00e9 pour l\u2019enfant de 6 ans.",
    },
    {
      city: "Ninh Binh (Tam Coc)", name: "Tam Coc Golden Fields Homestay", dates: "28 juil \u2192 30 juil",
      budget: { us: 140, claudine: 110, currency: "USD" },
      booking_url: "https://www.booking.com/hotel/vn/tam-coc-golden-fields-homestay.html",
      why: "Base rizi\u00e8res + libert\u00e9; parfait pour le \u2018wow\u2019 UNESCO sans gal\u00e8re.",
      cover: "/covers/hotels/ninh-binh-tam-coc-golden-fields.jpg",
    },
    {
      city: "Ha Long", name: "Wyndham Legend Halong", dates: "30 juil \u2192 31 juil",
      budget: { us: 130, claudine: 80, currency: "USD" },
      booking_url: "https://www.booking.com/hotel/vn/wyndham-legend-halong-bai-chay5.html",
      why: "Transition confortable avant croisi\u00e8re, logistique simple.",
      cover: "/covers/hotels/ha-long-wyndham-legend.jpg",
    },
    {
      city: "Ha Long (Croisi\u00e8re)", name: "Renea Cruises Halong", dates: "31 juil \u2192 01 ao\u00fbt",
      budget: { us: 330, claudine: 300, currency: "USD" },
      booking_url: "https://www.booking.com/hotel/vn/renea-cruises-halong-ha-long.html",
      note: "Port : Halong International Cruise Port",
      why: "Le c\u0153ur \u2018cin\u00e9ma\u2019 du voyage : karsts, baie, exp\u00e9rience famille.",
      cover: "/covers/hotels/ha-long-rc-cruise.jpg",
    },
    {
      city: "Hoi An (Cua Dai Beach)", name: "Palm Garden Beach Resort & Spa", dates: "01 ao\u00fbt \u2192 06 ao\u00fbt",
      budget: { us: 680, claudine: 620, currency: "USD" },
      booking_url: "https://www.booking.com/hotel/vn/palm-garden-beach-resort-spa-510.html",
      why: "Grand resort avec plage et immense piscine. Le top pour se poser en famille.",
      cover: "/covers/hotels/hoi-an-palm-garden.png",
    },
    {
      city: "Da Nang", name: "Seahorse Signature Danang Hotel by Haviland", dates: "06 ao\u00fbt \u2192 08 ao\u00fbt",
      budget: { us: 129, claudine: 92, currency: "USD" },
      booking_url: "https://www.booking.com/hotel/vn/seahorse-signature-danang-by-haviland.html",
      why: "Base urbaine efficace pour culture + ponts + mus\u00e9es.",
      cover: "/covers/hotels/da-nang-seahorse-signature.jpg",
    },
    {
      city: "Whale Island (Hon Ong)", name: "Whale Island Resort", dates: "08 ao\u00fbt \u2192 12 ao\u00fbt",
      budget: { us: 415, claudine: 415, currency: "USD" },
      official_url: "https://whaleislandresort.com/",
      why: "D\u00e9connexion nature pure, rythme famille, mer & ciel.",
      cover: "/covers/hotels/whale-island-resort.jpg",
    },
    {
      city: "Ho Chi Minh City", name: "Alagon Saigon Hotel & Spa", dates: "12 ao\u00fbt \u2192 15 ao\u00fbt",
      budget: { us: 275, claudine: 211, currency: "USD" },
      booking_url: "https://www.booking.com/hotel/vn/alagon-saigon.html",
      why: "Tr\u00e8s central pour histoire, colonial, street life.",
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
    { date: "2026-07-25", city: "Hanoi", theme: ["arriv\u00e9e", "d\u00eener", "repos"], blocks: [{ label: "Soir", plan: "Arriv\u00e9e 19:55, transfert, check-in, d\u00eener simple local, dodo." }] },
    {
      date: "2026-07-26", city: "Hanoi", theme: ["culture", "street-life", "kids"], blocks: [
        { label: "Matin", plan: "Old Quarter + lac + caf\u00e9s." },
        { label: "Aprem", plan: "Sieste / recharge kids." },
        { label: "Soir", plan: "Street food + spectacle marionnettes sur l\u2019eau (kids-friendly).", links: ["https://nhahatmuaroithanglong.vn/en/ticket-book/"] },
      ],
    },
    {
      date: "2026-07-27", city: "Hanoi", theme: ["histoire", "colonial", "esth\u00e9tique"], blocks: [
        { label: "Matin", plan: "Temple of Literature (beau, symbolique)." },
        { label: "Aprem", plan: "Quartier colonial + Op\u00e9ra (ext\u00e9rieur / zone)." },
        { label: "Soir", plan: "D\u00eener calme, balade." },
      ],
    },
    {
      date: "2026-07-28", city: "Hanoi \u2192 Ninh Binh", theme: ["histoire", "transfert"], blocks: [
        { label: "Matin", plan: "Mus\u00e9e prison Hoa Lo (fort, bien fait)." },
        { label: "Midi", plan: "D\u00e9part driver priv\u00e9 vers Ninh Binh + check-in." },
        { label: "Soir", plan: "Rizi\u00e8res au coucher, d\u00eener au calme." },
      ],
    },
    {
      date: "2026-07-29", city: "Ninh Binh", theme: ["nature", "wow", "bateau"], blocks: [
        { label: "Matin", plan: "Trang An (UNESCO) \u2014 tour en barque." },
        { label: "Aprem", plan: "Repos + v\u00e9lo doux si \u00e9nergie." },
        { label: "Soir", plan: "D\u00eener local." },
      ],
    },
    {
      date: "2026-07-30", city: "Ninh Binh \u2192 Ha Long", theme: ["nature", "transfert"], blocks: [
        { label: "Matin", plan: "Balade courte + caf\u00e9, d\u00e9part vers Ha Long." },
        { label: "Aprem", plan: "Check-in Wyndham, repos." },
        { label: "Soir", plan: "Seafood + promenade." },
      ],
    },
    { date: "2026-07-31", city: "Ha Long", theme: ["unesco", "croisi\u00e8re"], blocks: [{ label: "Jour", plan: "Embarquement Renea Cruise (baie / karsts)." }] },
    {
      date: "2026-08-01", city: "Ha Long \u2192 Da Nang \u2192 Hoi An", theme: ["transit", "buffer"], blocks: [
        { label: "Matin", plan: "Fin croisi\u00e8re + transfert HPH (si besoin)." },
        { label: "Soir", plan: "Vol HPH\u2192DAD (si pris), transfert Hoi An, dodo." },
      ],
    },
    { date: "2026-08-02", city: "Hoi An", theme: ["plage", "slow", "soir"], blocks: [{ label: "Soir", plan: "Old Town lanterns + food + fl\u00e2nerie." }] },
    { date: "2026-08-06", city: "Hoi An \u2192 Da Nang", theme: ["transfert", "ville"], blocks: [{ label: "Soir", plan: "Rivi\u00e8re / ponts + d\u00eener." }] },
    { date: "2026-08-08", city: "Da Nang \u2192 Whale Island", theme: ["early", "nature"], blocks: [{ label: "Jour", plan: "Vol DAD\u2192CXR (si pris), transfert port + bateau, installation." }] },
    { date: "2026-08-12", city: "Whale Island \u2192 Ho Chi Minh City", theme: ["transit"], blocks: [{ label: "Jour", plan: "Bateau + transfert CXR, vol vers SGN (si pris), check-in Alagon." }] },
    { date: "2026-08-15", city: "Ho Chi Minh City \u2192 Hanoi", theme: ["transit"], blocks: [{ label: "Matin", plan: "Vol SGN\u2192HAN (si pris), check-in Ja Cosmo." }] },
    { date: "2026-08-17", city: "Hanoi", theme: ["d\u00e9part"], blocks: [{ label: "Aprem", plan: "D\u00e9part a\u00e9roport (reco 16:00) pour vol 19:30." }] },
  ],
  glossary: [
    { term: "Grab", note: "App taxi la plus simple. Carte ou cash selon chauffeurs." },
    { term: "Cash", note: "Tr\u00e8s utile au quotidien. Certains endroits appliquent des frais carte." },
    { term: "Rythme kids", note: "Matin actif / aprem repos / soir doux. Eau + snacks." },
  ],
  food: {
    Hanoi: ["B\u00fan ch\u1ea3", "Ph\u1edf", "Caf\u00e9 \u00e0 l\u2019\u0153uf"],
    NinhBinh: ["Ch\u00e8vre (d\u00ea)", "C\u01a1m ch\u00e1y (riz croustillant)"],
    HoiAn_DaNang: ["Cao l\u1ea7u", "B\u00e1nh m\u00ec", "White rose", "M\u00ec Qu\u1ea3ng"],
    HCMC: ["C\u01a1m t\u1ea5m", "B\u00e1nh x\u00e8o", "H\u1ee7 ti\u1ebfu"],
  },
  phrasebook: [
    { fr: "Bonjour", vi: "Xin ch\u00e0o", phon: "sin tcha-o" },
    { fr: "Merci", vi: "C\u1ea3m \u01a1n", phon: "kam eune" },
    { fr: "S'il vous pla\u00eet", vi: "L\u00e0m \u01a1n", phon: "lam eune" },
    { fr: "Combien \u00e7a co\u00fbte ?", vi: "Bao nhi\u00eau ti\u1ec1n?", phon: "bao ni-eu ti\u00e8ne" },
    { fr: "Sans piment", vi: "Kh\u00f4ng cay", phon: "kong ka\u00ef" },
    { fr: "Toilettes ?", vi: "Nh\u00e0 v\u1ec7 sinh \u1edf \u0111\u00e2u?", phon: "nia ve sin eu da-ou" },
  ],
  airport_glossary: [
    { code: "HAN", city: "Hanoi", airport: "Noi Bai International", fromHotel: "Ja Cosmo (Old Quarter)", eta: "35\u201350 min", note: "Pr\u00e9voir marge trafic." },
    { code: "HPH", city: "Hai Phong", airport: "Cat Bi International", fromHotel: "Ha Long (Bai Chay)", eta: "55\u201375 min" },
    { code: "DAD", city: "Da Nang", airport: "Da Nang International", fromHotel: "Hoi An", eta: "45\u201360 min" },
    { code: "CXR", city: "Cam Ranh", airport: "Cam Ranh International", fromHotel: "Port Whale Island", eta: "45\u201375 min" },
    { code: "SGN", city: "Ho Chi Minh City", airport: "Tan Son Nhat International", fromHotel: "District 1", eta: "20\u201340 min", note: "Trafic variable." },
  ],
  expenses_usd: [
    { id: "T-JC-001", category: "transport", mode: "private_car_7_seater", operator: "Ja Cosmo", operated_by_ja_cosmo: true, status: "CONFIRMED", date: "2026-07-25", from: "Hanoi Airport (HAN)", to: "Ja Cosmo Hotel (Hanoi)", title: "Transfert priv\u00e9 (7 places) \u2014 A\u00e9roport \u2192 H\u00f4tel", price_total_usd: 20.02, payer_rule: "claudine_20pct_transport", notes: "Confirm\u00e9 par Ja Cosmo.", tags: ["ja_cosmo", "priv\u00e9", "HAN"] },
    { id: "T-JC-002", category: "transport", mode: "private_car_7_seater", operator: "Ja Cosmo", operated_by_ja_cosmo: true, status: "CONFIRMED", date: "2026-07-28", from: "Ja Cosmo Hotel (Hanoi)", to: "Ninh Binh (h\u00f4tel \u00e0 confirmer)", title: "Transfert priv\u00e9 (7 places) \u2014 Hanoi \u2192 Ninh Binh", price_total_usd: 57.75, payer_rule: "claudine_20pct_transport", notes: "Confirm\u00e9 par Ja Cosmo. D\u00e9part t\u00f4t demand\u00e9.", tags: ["ja_cosmo", "priv\u00e9"] },
    { id: "T-JC-003", category: "transport", mode: "private_car_7_seater", operator: "Ja Cosmo", operated_by_ja_cosmo: true, status: "CONFIRMED", date: "2026-07-30", from: "Ninh Binh (h\u00f4tel \u00e0 confirmer)", to: "Ha Long (h\u00f4tel/port \u00e0 confirmer)", title: "Transfert priv\u00e9 (7 places) \u2014 Ninh Binh \u2192 Ha Long", price_total_usd: 77.0, payer_rule: "claudine_20pct_transport", notes: "Confirm\u00e9 par Ja Cosmo. Upgrade si 4 grosses valises+.", tags: ["ja_cosmo", "priv\u00e9"] },
    { id: "T-JC-004", category: "transport", mode: "private_car_7_seater", operator: "Ja Cosmo", operated_by_ja_cosmo: true, status: "CONFIRMED", date: "2026-08-15", from: "Hanoi Airport (HAN)", to: "Ja Cosmo Hotel (Hanoi)", title: "Transfert priv\u00e9 (7 places) \u2014 A\u00e9roport \u2192 H\u00f4tel", price_total_usd: 20.02, payer_rule: "claudine_20pct_transport", notes: "Confirm\u00e9 par Ja Cosmo. Heure \u00e0 pr\u00e9ciser.", tags: ["ja_cosmo", "priv\u00e9", "HAN"] },
    { id: "T-JC-005", category: "transport", mode: "private_car_7_seater", operator: "Ja Cosmo", operated_by_ja_cosmo: true, status: "CONFIRMED", date: "2026-08-17", from: "Ja Cosmo Hotel (Hanoi)", to: "Hanoi Airport (HAN)", title: "Transfert priv\u00e9 (7 places) \u2014 H\u00f4tel \u2192 A\u00e9roport", price_total_usd: 13.47, payer_rule: "claudine_20pct_transport", notes: "Confirm\u00e9 par Ja Cosmo. D\u00e9part recommand\u00e9 16:00 (vol 19:30).", tags: ["ja_cosmo", "priv\u00e9", "HAN"] },
    { id: "T-OT-101", category: "transport", mode: "limousine_or_private_van", operator: "Other", operated_by_ja_cosmo: false, status: "ESTIMATE", date: null, from: "Hanoi", to: "Ninh Binh", title: "Limousine / van \u2014 Hanoi \u2192 Ninh Binh", price_total_usd: 60.0, payer_rule: "claudine_20pct_transport", notes: "Ancienne estimation. \u00c0 ignorer si remplac\u00e9 par Ja Cosmo.", tags: ["estimation"] },
    { id: "T-OT-102", category: "transport", mode: "limousine_or_private_van", operator: "Other", operated_by_ja_cosmo: false, status: "ESTIMATE", date: null, from: "Ninh Binh", to: "Ha Long", title: "Limousine / van \u2014 Ninh Binh \u2192 Ha Long", price_total_usd: 60.0, payer_rule: "claudine_20pct_transport", notes: "Ancienne estimation. \u00c0 ignorer si remplac\u00e9 par Ja Cosmo.", tags: ["estimation"] },
    { id: "T-OT-103", category: "transport", mode: "limousine_or_private_van", operator: "Other", operated_by_ja_cosmo: false, status: "ESTIMATE", date: null, from: "Ha Long", to: "Hai Phong Airport (HPH)", title: "Transfert priv\u00e9 \u2014 Ha Long \u2192 HPH", price_total_usd: 50.0, payer_rule: "claudine_20pct_transport", notes: "Estimation.", tags: ["estimation"] },
    { id: "T-OT-104", category: "transport", mode: "limousine_or_private_van", operator: "Other", operated_by_ja_cosmo: false, status: "ESTIMATE", date: null, from: "Da Nang Airport (DAD)", to: "Hoi An", title: "Transfert priv\u00e9 \u2014 DAD \u2192 Hoi An", price_total_usd: 20.0, payer_rule: "claudine_20pct_transport", notes: "Estimation.", tags: ["estimation"] },
    { id: "F-OT-201", category: "transport", mode: "flight_domestic", operator: "Airline", operated_by_ja_cosmo: false, status: "ESTIMATE", date: null, from: "Hai Phong (HPH)", to: "Da Nang (DAD)", title: "Vol int\u00e9rieur \u2014 HPH \u2192 DAD (pour 5)", price_total_usd: 300.0, payer_rule: "claudine_20pct_transport", notes: "Estimation.", tags: ["estimation", "vol"] },
    { id: "F-OT-202", category: "transport", mode: "flight_domestic", operator: "Airline", operated_by_ja_cosmo: false, status: "ESTIMATE", date: null, from: "Da Nang (DAD)", to: "Cam Ranh (CXR)", title: "Vol int\u00e9rieur \u2014 DAD \u2192 CXR (pour 5)", price_total_usd: 300.0, payer_rule: "claudine_20pct_transport", notes: "Estimation.", tags: ["estimation", "vol"] },
    { id: "F-OT-203", category: "transport", mode: "flight_domestic", operator: "Airline", operated_by_ja_cosmo: false, status: "ESTIMATE", date: null, from: "Cam Ranh (CXR)", to: "Ho Chi Minh (SGN)", title: "Vol int\u00e9rieur \u2014 CXR \u2192 SGN (pour 5)", price_total_usd: 300.0, payer_rule: "claudine_20pct_transport", notes: "Estimation.", tags: ["estimation", "vol"] },
    { id: "F-OT-204", category: "transport", mode: "flight_domestic", operator: "Airline", operated_by_ja_cosmo: false, status: "ESTIMATE", date: null, from: "Ho Chi Minh (SGN)", to: "Hanoi (HAN)", title: "Vol int\u00e9rieur \u2014 SGN \u2192 HAN (pour 5)", price_total_usd: 250.0, payer_rule: "claudine_20pct_transport", notes: "Estimation.", tags: ["estimation", "vol"] },
    { id: "A-HL-001", category: "activity", mode: "stay_or_package", operator: "Renea", operated_by_ja_cosmo: false, status: "CONFIRMED", date: "2026-07-31", from: "Ha Long", to: "Ha Long", title: "Renea Cruise (Ha Long) \u2014 r\u00e9partition explicite", price_total_usd: 630.0, payer_rule: "split_given", claudine_usd: 300.0, nous_usd: 330.0, notes: "Montants du r\u00e9cap voyage.", tags: ["croisi\u00e8re", "confirm\u00e9"] },
    { id: "A-WI-001", category: "activity", mode: "stay_or_package", operator: "Whale Island", operated_by_ja_cosmo: false, status: "CONFIRMED", date: "2026-08-08", from: "Whale Island", to: "Whale Island", title: "Whale Island Resort \u2014 r\u00e9partition explicite", price_total_usd: 830.0, payer_rule: "split_given", claudine_usd: 415.0, nous_usd: 415.0, notes: "Montants du r\u00e9cap voyage.", tags: ["nature", "confirm\u00e9"] },
  ],
  planned_activities: [
    { id: "PA-HN-001", city: "Hanoi", window: "25\u201328 juil", name: "Marionnettes sur l\u2019eau (Thang Long) \u2014 si\u00e8ges Standard", category: "spectacle", provider: "Traveloka", payMode: "Billets", duration: "50 min", kidsRule: "Enfants accept\u00e9s (arriver 20\u201330 min avant)", notes: "Budget calcul\u00e9 pour 5 personnes (3 adultes + 2 enfants).", impact: false, pricing: { currency: "USD", estimatedUSD_total: 29, quantity: 5, basis: "150k VND/pers" }, sourceUrl: "https://www.traveloka.com/en-vn/activities/vietnam/product/thang-long-water-puppet-show-tickets-skip-the-line-2001486919941" },
    { id: "PA-HN-002", city: "Hanoi", window: "25\u201328 juil", name: "Mus\u00e9e Hoa Lo \u2014 entr\u00e9e", category: "mus\u00e9e", provider: "Vietnam Airlines", payMode: "Sur place", duration: "1\u20132 h", kidsRule: "Enfant <6 ans gratuit", notes: "Budget calcul\u00e9 pour 4 billets payants.", impact: false, pricing: { currency: "USD", estimatedUSD_total: 8, quantity: 4, basis: "50k VND/pers (payant)" }, sourceUrl: "https://www.vietnamairlines.com/us/en/plan-book/travel/travel-guide/hoa-lo-prison" },
    { id: "PA-NB-003", city: "Ninh Binh", window: "28\u201330 juil", name: "Trang An (UNESCO) \u2014 barque (r\u00e8gles par taille)", category: "nature", provider: "VinWonders", payMode: "Sur place", duration: "2\u20133 h", kidsRule: "Prudent: enfant 12 ans compt\u00e9 adulte; enfant 6 ans tarif enfant", notes: "4 adultes x 250k + 1 enfant x 120k.", impact: false, pricing: { currency: "USD", estimatedUSD_total: 43, quantity: 5, basis: "Tarifs officiels VND" }, sourceUrl: "https://vinwonders.com/en/wonderpedia/news/trang-an-boat-tour/" },
    { id: "PA-NB-004", city: "Ninh Binh", window: "28\u201330 juil", name: "Hang Mua (Mua Caves) \u2014 entr\u00e9e", category: "vue / randonn\u00e9e", provider: "Vinpearl", payMode: "Sur place", duration: "1\u20132 h", kidsRule: "OK enfants", notes: "Budget calcul\u00e9 pour 5 billets.", impact: false, pricing: { currency: "USD", estimatedUSD_total: 19, quantity: 5, basis: "100k VND/pers" }, sourceUrl: "https://vinpearl.com/en/mua-caves-ninh-binh" },
    { id: "PA-HA-005", city: "Hoi An", window: "1\u20136 ao\u00fbt", name: "Hoi An Ancient Town \u2014 ticket UNESCO", category: "culture", provider: "HoiAn Day Trip", payMode: "Sur place", duration: "2\u20134 h", kidsRule: "Ticket surtout pour adultes", notes: "Budget calcul\u00e9 pour 3 adultes.", impact: false, pricing: { currency: "USD", estimatedUSD_total: 14, quantity: 3, basis: "120k VND/adulte" }, sourceUrl: "https://hoiandaytrip.com/hoi-an-old-town-ticket-attractions/" },
    { id: "PA-HA-006", city: "Hoi An", window: "1\u20136 ao\u00fbt", name: "My Son Sanctuary \u2014 tickets (tarifs 2026)", category: "culture / UNESCO", provider: "FVG Travel", payMode: "Sur place", duration: "2\u20133 h", kidsRule: "Enfants 5\u201315: tarif enfant", notes: "3 adultes + 2 enfants (5\u201315).", impact: false, pricing: { currency: "USD", estimatedUSD_total: 21, quantity: 5, basis: "150k adulte / 50k enfant" }, sourceUrl: "https://fvgtravel.com.vn/en/news/gia-ve-thanh-dia-my-son-new-n343" },
    { id: "PA-HA-007", city: "Hoi An", window: "1\u20136 ao\u00fbt", name: "Coconut Basket Boat (Cam Thanh / Bay Mau)", category: "exp\u00e9rience", provider: "La Siesta", payMode: "Sur place", duration: "45\u201360 min", kidsRule: "OK enfants", notes: "Budget prudent: 200k VND/pers.", impact: false, pricing: { currency: "USD", estimatedUSD_total: 39, quantity: 5, basis: "200k VND/pers" }, sourceUrl: "https://lasiestaresorts.com/hoi-an-coconut-basket-boat-tour.html" },
    { id: "PA-HA-008", city: "Hoi An", window: "1\u20136 ao\u00fbt", name: "Hoi An Memories Show \u2014 billets ECO", category: "spectacle", provider: "Hoi An Memories Show", payMode: "En ligne", duration: "1\u20131h30", kidsRule: "OK enfants", notes: "Budget calcul\u00e9 pour 5 billets.", impact: false, pricing: { currency: "USD", estimatedUSD_total: 104, quantity: 5, basis: "540k VND/pers" }, sourceUrl: "https://hoianmemoriesshow.com/" },
    { id: "PA-DN-009", city: "Da Nang", window: "6\u20138 ao\u00fbt", name: "Marble Mountains \u2014 entr\u00e9e + ascenseur", category: "nature / pagodes", provider: "Ahoy Vietnam", payMode: "Sur place", duration: "2\u20133 h", kidsRule: "OK enfants", notes: "Entr\u00e9e 40k + ascenseur 15k par personne.", impact: false, pricing: { currency: "USD", estimatedUSD_total: 11, quantity: 5, basis: "55k VND/pers" }, sourceUrl: "https://ahoyvietnam.com/am-phu-cave-and-the-marble-mountains/" },
    { id: "PA-DN-010", city: "Da Nang", window: "6\u20138 ao\u00fbt", name: "Ba Na Hills (Golden Bridge) \u2014 ticket 2026", category: "parc", provider: "Sun Paradise Land", payMode: "En ligne", duration: "Journ\u00e9e", kidsRule: "Prudent: enfant 12 ans compt\u00e9 adulte si >1.4m", notes: "4 billets adulte + 1 billet enfant (prudent).", impact: false, pricing: { currency: "USD", estimatedUSD_total: 185, quantity: 5, basis: "1,000,000 VND adulte / 800,000 VND enfant" }, sourceUrl: "https://sunparadiseland.com/en/tin-tuc/what-are-the-ticket-prices-for-sun-world-ba-na-hills-during-tet-new-update-2026-16237" },
    { id: "PA-HCM-011", city: "Ho Chi Minh City", window: "12\u201315 ao\u00fbt", name: "Mekong Delta \u2014 tour groupe", category: "excursion", provider: "GetYourGuide", payMode: "En ligne", duration: "8\u20139 h", kidsRule: "OK enfants", notes: "Budget calcul\u00e9 pour 5 personnes.", impact: false, pricing: { currency: "USD", estimatedUSD_total: 85, quantity: 5, basis: "$17/pers" }, sourceUrl: "https://www.getyourguide.com/ho-chi-minh-city-l272/from-ho-chi-minh-city-mekong-delta-small-group-tour-t60784/" },
    { id: "PA-HCM-012", city: "Ho Chi Minh City", window: "12\u201315 ao\u00fbt", name: "Cu Chi Tunnels \u2014 tour bus/minivan", category: "histoire", provider: "GetYourGuide", payMode: "En ligne", duration: "5\u20136 h", kidsRule: "OK enfants", notes: "Budget calcul\u00e9 pour 5 personnes.", impact: false, pricing: { currency: "USD", estimatedUSD_total: 75, quantity: 5, basis: "$15/pers" }, sourceUrl: "https://www.getyourguide.com/cu-chi-tunnels-l3671/" },
  ],
};

// ============================================================
// Budget Engine
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
        e.id, e.category, e.mode, e.operator, e.status, e.title,
        e.from ?? "", e.to ?? "", (e.tags ?? []).join(" "), e.notes ?? "",
      ].join(" ").toLowerCase();
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
    const each = a.price_total_usd / 3;
    return { ...a, alloc_claudine: each, alloc_nous: a.price_total_usd - each };
  });

  const activitiesTotal = sum(activityItems.map((a) => a.price_total_usd));
  const activitiesClaudine = sum(activityItems.map((a) => a.alloc_claudine));
  const activitiesNous = sum(activityItems.map((a) => a.alloc_nous));

  return {
    transport: { total: transportTotal, items: transportItems, claudine_total: transportClaudine, nous_total: transportNous },
    activities: { total: activitiesTotal, items: activityItems, claudine_total: activitiesClaudine, nous_total: activitiesNous },
    grand: { total: transportTotal + activitiesTotal, claudine_total: transportClaudine + activitiesClaudine, nous_total: transportNous + activitiesNous },
  };
};

const ExpenseRow = ({ item, showAlloc }: { item: ExpenseItemUSD & { alloc_claudine: number; alloc_nous: number }; showAlloc: boolean }) => {
  const badge = badgeForStatus(item.status);
  const Icon = item.mode === "flight_domestic" ? Plane : item.mode === "private_car_7_seater" ? Car : item.mode === "limousine_or_private_van" ? Navigation : Sparkles;
  return (
    <div className="py-4 border-b border-slate-50 last:border-0">
      <div className="flex justify-between items-start mb-1">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-black text-slate-900">{item.title}</span>
            {item.operated_by_ja_cosmo && (
              <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-black uppercase">Ja Cosmo</span>
            )}
          </div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            {item.id} \u2022 {item.operator} \u2022 {item.mode.replaceAll("_", " ")}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-black text-slate-900">{formatUSD0(item.price_total_usd)}</div>
          {item.date && <div className="text-[10px] text-slate-400 font-bold">{item.date}</div>}
        </div>
      </div>
      {(item.from || item.to) && (
        <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 mb-2">
          <span>{item.from || "\u2014"}</span>
          <ChevronRight size={10} />
          <span>{item.to || "\u2014"}</span>
        </div>
      )}
      {item.notes && <p className="text-xs text-slate-500 italic mb-2">{item.notes}</p>}
      <div className="flex items-center justify-between mt-3">
        <div className="flex gap-1">
          <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-black ${badge.cls}`}>
            {badge.icon} {badge.label}
          </div>
        </div>
        {showAlloc && (
          <div className="flex gap-4">
            <div className="text-right">
              <div className="text-[9px] text-slate-400 font-black uppercase">Claudine</div>
              <div className="text-xs font-black text-indigo-600">{formatUSD0(item.alloc_claudine)}</div>
            </div>
            <div className="text-right">
              <div className="text-[9px] text-slate-400 font-black uppercase">Nous</div>
              <div className="text-xs font-black text-slate-900">{formatUSD0(item.alloc_nous)}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ActivityCard = ({ a }: { a: PlannedActivity }) => {
  const priceLine = (() => {
    if (a.pricing.estimatedUSD_range) {
      const [min, max] = a.pricing.estimatedUSD_range;
      return `$${min}\u2013$${max} (arrondi)`;
    }
    if (typeof a.pricing.estimatedUSD_adult === "number") return `$${a.pricing.estimatedUSD_adult} (arrondi)`;
    if (typeof a.pricing.estimatedUSD_total === "number") return `$${a.pricing.estimatedUSD_total} (total)`;
    return "\u2014";
  })();

  return (
    <Glass className="mb-4">
      <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">
        {a.city}{a.window ? ` \u2022 ${a.window}` : ""}
      </div>
      <h4 className="text-lg font-black mb-4">{a.name}</h4>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-[10px] text-slate-400 font-black uppercase mb-1">Prix</div>
          <div className="text-sm font-black text-slate-900">{priceLine}</div>
          <div className="text-[10px] text-slate-400 font-bold">{a.pricing.basis || ""}</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-400 font-black uppercase mb-1">Cadre</div>
          <div className="text-sm font-black text-slate-900">{a.duration || "\u2014"}</div>
        </div>
      </div>
      {a.kidsRule && <p className="text-xs text-slate-500 mb-4">{a.kidsRule}</p>}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-black uppercase">{a.category}</span>
        {a.payMode && <span className="text-[10px] bg-amber-50 text-amber-600 px-2 py-1 rounded-md font-black uppercase">{a.payMode}</span>}
        <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md font-black uppercase">{a.provider}</span>
      </div>
      {a.notes && <p className="text-xs text-slate-400 italic mb-4">{a.notes}</p>}
      <div className="flex gap-2">
        {a.sourceUrl ? (
          <a href={a.sourceUrl} target="_blank" rel="noreferrer" className="flex-1 py-3 rounded-2xl bg-slate-900 text-white text-xs font-black text-center">Source</a>
        ) : (
          <span className="flex-1 py-3 rounded-2xl bg-slate-100 text-slate-400 text-xs font-black text-center">Pas de source</span>
        )}
        <a href={googleMapsSearchUrl(a.name)} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
          <Navigation size={16} />
        </a>
      </div>
    </Glass>
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
    const savedFocus = localStorage.getItem("trip_focus_day");
    if (savedFocus) setFocusDayIndex(Number(savedFocus));
    const savedFilters = localStorage.getItem("trip_budget_filters_v3");
    if (savedFilters) setFilters(JSON.parse(savedFilters));
    const savedTab = localStorage.getItem("trip_budget_tab_v3");
    if (savedTab) setBudgetTab(savedTab as any);
  }, []);

  useEffect(() => localStorage.setItem("trip_kids_mode", kidsMode ? "1" : "0"), [kidsMode]);
  useEffect(() => localStorage.setItem("trip_active_city", activeCity), [activeCity]);
  useEffect(() => localStorage.setItem("trip_focus_day", String(focusDayIndex)), [focusDayIndex]);
  useEffect(() => localStorage.setItem("trip_budget_filters_v3", JSON.stringify(filters)), [filters]);
  useEffect(() => localStorage.setItem("trip_budget_tab_v3", budgetTab), [budgetTab]);

  const budget = useMemo(() => computeBudget(TRIP_DATA.expenses_usd, filters), [filters]);

  const TabsList = [
    { id: "home", icon: Star },
    { id: "itinerary", icon: Calendar },
    { id: "hotels", icon: Hotel },
    { id: "activities", icon: Sparkles },
    { id: "guide", icon: Utensils },
    { id: "tips", icon: Lightbulb },
    { id: "budget", icon: Wallet },
  ] as const;

  const activitiesByCity = useMemo(() => {
    const EXCLUS_IDS = new Set(["A-HL-001", "A-WI-001"]);
    const EXCLUS_NOMS = ["renea", "whale island"];
    const list = TRIP_DATA.planned_activities.filter((a) => {
      if (kidsMode && a.impact) return false;
      const id = String(a.id ?? "");
      const name = String(a.name ?? "").toLowerCase();
      if (EXCLUS_IDS.has(id)) return false;
      if (EXCLUS_NOMS.some((k) => name.includes(k))) return false;
      return true;
    });
    const map = new Map<string, PlannedActivity[]>();
    for (const a of list) {
      if (!map.has(a.city)) map.set(a.city, []);
      map.get(a.city)!.push(a);
    }
    const order = ["Hanoi", "Ninh Binh", "Ha Long", "Hoi An", "Da Nang", "Ho Chi Minh City", "Whale Island"];
    const out: { city: string; items: PlannedActivity[] }[] = [];
    for (const c of order) {
      if (map.has(c)) out.push({ city: c, items: map.get(c)! });
    }
    return out;
  }, [kidsMode]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-32">
      <QuickSheet open={quickOpen} onClose={() => setQuickOpen(false)} onGoto={(v) => setView(v)} />

      {view === "home" && (
        <div className="p-6 max-w-md mx-auto">
          <CinemaHero onOpenQuick={() => setQuickOpen(true)} activeCity={activeCity} coverSrc={cityCoverFromLabel(activeCity)} />
          <Glass className="mb-6">
            <Toggle label="Mode Kids" icon={<BadgeCheck size={20} className="text-emerald-500" />} value={kidsMode} onChange={setKidsMode} hint="Masque les activit\u00e9s \u2018impact\u2019." />
          </Glass>
          <h3 className="text-xl font-black mb-4">Jour focus</h3>
          <DayCardMobile day={focusDay} coverSrc={dayCoverFromDay(focusDay)} mood={mood} kidsMode={kidsMode} />
          <div className="flex gap-2 mt-4">
            <button onClick={() => setFocusDayIndex(i => Math.max(0, i-1))} className="flex-1 py-4 rounded-2xl bg-white border border-slate-100 font-bold">Pr\u00e9c\u00e9dent</button>
            <button onClick={() => setFocusDayIndex(i => Math.min(TRIP_DATA.itinerary_days.length-1, i+1))} className="flex-1 py-4 rounded-2xl bg-white border border-slate-100 font-bold">Suivant</button>
          </div>
        </div>
      )}

      {view === "itinerary" && (
        <div className="p-6 max-w-md mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-black italic">Itin\u00e9raire</h2>
            <button onClick={() => setView("home")} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center"><X size={20} /></button>
          </div>
          <CityTimeline cities={cities} activeCity={activeCity} onSelect={setActiveCity} />
          <div className="mt-6 space-y-6">
            {TRIP_DATA.itinerary_days.filter(d => d.city.includes(activeCity)).map(day => (
              <DayCardMobile key={day.date} day={day} coverSrc={dayCoverFromDay(day)} mood={mood} kidsMode={kidsMode} />
            ))}
          </div>
        </div>
      )}

      {view === "hotels" && (
        <div className="p-6 max-w-md mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-black italic">H\u00f4tels</h2>
            <button onClick={() => setView("home")} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center"><X size={20} /></button>
          </div>
          {TRIP_DATA.hotels.map((h, i) => <HotelCard key={i} hotel={h} />)}
        </div>
      )}

      {view === "activities" && (
        <div className="p-6 max-w-md mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-black italic">Activit\u00e9s</h2>
            <button onClick={() => setView("home")} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center"><X size={20} /></button>
          </div>
          <Toggle label="Mode Kids" value={kidsMode} onChange={setKidsMode} />
          {activitiesByCity.map(group => (
            <div key={group.city} className="mt-8">
              <h3 className="text-xl font-black mb-4">{group.city}</h3>
              {group.items.map(a => <ActivityCard key={a.id} a={a} />)}
            </div>
          ))}
        </div>
      )}

      {view === "budget" && (
        <div className="p-6 max-w-md mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-black italic">Budget</h2>
            <button onClick={() => setView("home")} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center"><X size={20} /></button>
          </div>
          <Segmented value={budgetTab} onChange={(id) => setBudgetTab(id as any)} items={[
            { id: "overview", label: "Global", icon: <BadgeCheck size={14}/> },
            { id: "transport", label: "Transport", icon: <Car size={14}/> },
            { id: "activities", label: "Activit\u00e9s", icon: <Sparkles size={14}/> }
          ]} />
          {budgetTab === "overview" && (
            <div className="mt-6 space-y-4">
              <StatChip label="Total (Scope)" value={formatUSD0(budget.grand.total)} accent="amber" />
              <div className="grid grid-cols-2 gap-3">
                <StatChip label="Claudine" value={formatUSD0(budget.grand.claudine_total)} />
                <StatChip label="Nous" value={formatUSD0(budget.grand.nous_total)} accent="emerald" />
              </div>
            </div>
          )}
          {budgetTab === "transport" && (
            <div className="mt-6 space-y-4">
              {budget.transport.items.map(item => <ExpenseRow key={item.id} item={item} showAlloc={true} />)}
            </div>
          )}
          {budgetTab === "activities" && (
            <div className="mt-6 space-y-4">
              {budget.activities.items.map(item => <ExpenseRow key={item.id} item={item} showAlloc={true} />)}
            </div>
          )}
        </div>
      )}

      <nav className="fixed bottom-6 left-6 right-6 h-20 bg-slate-900/90 backdrop-blur-xl rounded-[32px] flex items-center px-4 gap-1 z-40 shadow-2xl shadow-slate-900/20">
        {TabsList.map((tab) => {
          const Icon = tab.icon;
          const active = view === tab.id;
          return (
            <button key={tab.id} onClick={() => setView(tab.id as View)} className={`flex-1 flex flex-col items-center justify-center py-2 rounded-2xl transition-all ${active ? "bg-white text-slate-900 shadow-lg" : "text-white/40"}`} aria-label={tab.id}>
              <Icon size={20} />
            </button>
          );
        })}
      </nav>
    </div>
  );
}
