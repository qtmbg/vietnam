import React, { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  Hotel,
  MapPin,
  Plane,
  Car,
  Wallet,
  Search,
  Filter,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  Circle,
  BookOpen,
  Lightbulb,
  Download,
  Printer,
} from "lucide-react";

// ------------------------------------------------------------
// TYPES
// ------------------------------------------------------------
type ViewKey = "home" | "itinerary" | "hotels" | "culture" | "guide" | "tips" | "budget";

type ItineraryBlock = {
  label: string;
  plan: string;
  links?: { label: string; url: string }[];
};

type ItineraryDay = {
  date: string; // YYYY-MM-DD
  city: string;
  theme: string[];
  blocks: ItineraryBlock[];
};

type HotelBudget = {
  us: number;
  claudine: number;
};

type HotelItem = {
  city: string;
  name: string;
  dates: string;
  why: string;
  cover?: string;
  booking_url?: string;
  official_url?: string;
  budget: HotelBudget;
  room_rules?: string[];
  notes?: string;
};

type FlightItem = {
  route: string;
  group_cost_usd: number;
  note?: string;
};

type TransferItem = {
  route: string;
  cost_usd: number;
  note?: string;
};

type CultureItem = {
  city: string;
  title: string;
  why: string;
  tip?: string;
  link?: string;
};

type TipItem = {
  title: string;
  content: string;
  bullets?: string[];
};

// Persistent states
type ChecklistState = Record<string, boolean>;
type NotesState = Record<string, string>;

// ------------------------------------------------------------
// BASE DATASET — YOU CAN EDIT THIS SECTION
// ------------------------------------------------------------

const TRIP_DATA: {
  itinerary: ItineraryDay[];
  hotels: HotelItem[];
  internal_flights: FlightItem[];
  ground_transfers: TransferItem[];
  culture: CultureItem[];
  tips: TipItem[];
  guide_sections: { title: string; content: string }[];
} = {
  itinerary: [
    {
      date: "2026-07-25",
      city: "Hanoi",
      theme: ["Arrival", "Easy", "Recovery"],
      blocks: [
        {
          label: "Arrival (evening)",
          plan:
            "Land 19:55. Private pickup. Check-in. Simple dinner close to hotel. Early sleep.",
        },
        {
          label: "Kids reset",
          plan:
            "No big plan. Walk 20–30 min, snacks, showers, sleep routine.",
        },
      ],
    },
    {
      date: "2026-07-26",
      city: "Hanoi",
      theme: ["Old Quarter", "Culture", "Street life"],
      blocks: [
        {
          label: "Morning",
          plan: "Old Quarter walk + coffee/egg coffee. Light museum if kids are ok.",
        },
        {
          label: "Afternoon",
          plan:
            "Hoan Kiem + Ngoc Son. Optional water puppet show. Early dinner.",
        },
      ],
    },
    {
      date: "2026-07-27",
      city: "Hanoi",
      theme: ["History", "Parks", "Food"],
      blocks: [
        {
          label: "Morning",
          plan: "Temple of Literature + quiet park time.",
        },
        {
          label: "Afternoon",
          plan: "West Lake loop + sunset. Pack for Ninh Binh.",
        },
      ],
    },
    {
      date: "2026-07-28",
      city: "Ninh Binh",
      theme: ["Nature", "Wow", "Slow"],
      blocks: [
        {
          label: "Transfer",
          plan: "Limousine early from Hanoi. Check-in. Lunch + rest.",
        },
        {
          label: "Late afternoon",
          plan: "Short bicycle / rice field walk. Golden hour photos.",
        },
      ],
    },
    {
      date: "2026-07-29",
      city: "Ninh Binh",
      theme: ["Boat", "Viewpoints", "Icons"],
      blocks: [
        {
          label: "Morning",
          plan: "Boat ride (Trang An or Tam Coc depending on base).",
        },
        {
          label: "Afternoon",
          plan: "Mua Cave viewpoint (if kids ok) OR chill pool + sunset.",
        },
      ],
    },
    {
      date: "2026-07-30",
      city: "Ha Long Bay",
      theme: ["Cruise", "Ocean", "Relax"],
      blocks: [
        {
          label: "Transfer",
          plan: "Driver Ninh Binh → Ha Long. Cruise check-in.",
        },
        {
          label: "On cruise",
          plan: "Kayak/swim if allowed. Sunset deck. Early night.",
        },
      ],
    },
    {
      date: "2026-07-31",
      city: "Ha Long Bay",
      theme: ["Cruise", "Islands", "Easy"],
      blocks: [
        {
          label: "Morning",
          plan: "Light activity + brunch. Disembark.",
        },
        {
          label: "Transfer",
          plan: "Go to hotel or toward HPH for next flight plan.",
        },
      ],
    },
    {
      date: "2026-08-01",
      city: "Hoi An",
      theme: ["Beach", "Town", "Family"],
      blocks: [
        {
          label: "Arrival",
          plan: "Check-in. Pool + beach. Simple dinner.",
        },
        {
          label: "Evening",
          plan: "Old Town lantern walk (short, fun, not late).",
        },
      ],
    },
    {
      date: "2026-08-02",
      city: "Hoi An",
      theme: ["Beach", "Kids", "Food"],
      blocks: [
        { label: "Morning", plan: "Beach time (An Bang / Cua Dai depending)."},
        { label: "Afternoon", plan: "Rest + spa for adults OR cooking class."},
      ],
    },
    {
      date: "2026-08-03",
      city: "Hoi An",
      theme: ["Culture", "Short excursion"],
      blocks: [
        { label: "Morning", plan: "My Son sanctuary (if everyone has energy)."},
        { label: "Afternoon", plan: "Back for pool + early dinner."},
      ],
    },
    {
      date: "2026-08-04",
      city: "Hoi An",
      theme: ["Free", "Flex", "Wow moments"],
      blocks: [
        { label: "Morning", plan: "Tailor / café / slow walk."},
        { label: "Afternoon", plan: "Boat basket ride OR nothing (protect energy)."},
      ],
    },
    {
      date: "2026-08-05",
      city: "Hoi An",
      theme: ["Beach", "Photos", "Slow"],
      blocks: [
        { label: "Morning", plan: "Beach morning. Photos."},
        { label: "Afternoon", plan: "Nap + sunset cocktail (short)."},
      ],
    },
    {
      date: "2026-08-06",
      city: "Da Nang",
      theme: ["City", "Culture", "Easy"],
      blocks: [
        { label: "Transfer", plan: "Move from Hoi An to Da Nang. Check-in."},
        { label: "Afternoon", plan: "City walk + riverside. Market if ok."},
      ],
    },
    {
      date: "2026-08-07",
      city: "Da Nang",
      theme: ["Views", "Iconic", "Short"],
      blocks: [
        { label: "Morning", plan: "Marble Mountains OR Son Tra viewpoint."},
        { label: "Afternoon", plan: "Museum OR chill + good dinner."},
      ],
    },
    {
      date: "2026-08-08",
      city: "Whale Island",
      theme: ["Remote", "Nature", "Reset"],
      blocks: [
        { label: "Transfer", plan: "Fly to Cam Ranh + limousine + boat."},
        { label: "On island", plan: "No plan. Swim. Rest. Early sleep."},
      ],
    },
    {
      date: "2026-08-09",
      city: "Whale Island",
      theme: ["Nature", "Snorkel", "Slow"],
      blocks: [
        { label: "Day", plan: "Snorkel if conditions + shade breaks for kids."},
      ],
    },
    {
      date: "2026-08-10",
      city: "Whale Island",
      theme: ["Slow", "Reset"],
      blocks: [
        { label: "Day", plan: "Nothing scheduled. Let the island do its job."},
      ],
    },
    {
      date: "2026-08-11",
      city: "Whale Island",
      theme: ["Last day", "Easy"],
      blocks: [
        { label: "Day", plan: "Pack light. Sunset. Early night."},
      ],
    },
    {
      date: "2026-08-12",
      city: "Ho Chi Minh City",
      theme: ["City", "Food", "Culture"],
      blocks: [
        { label: "Transfer", plan: "Boat + road to CXR + flight to SGN. Check-in."},
        { label: "Evening", plan: "Ben Thanh area stroll + dinner."},
      ],
    },
    {
      date: "2026-08-13",
      city: "Ho Chi Minh City",
      theme: ["Museums", "History"],
      blocks: [
        { label: "Morning", plan: "War Remnants Museum (short) + café."},
        { label: "Afternoon", plan: "Post Office + Cathedral area + chill."},
      ],
    },
    {
      date: "2026-08-14",
      city: "Ho Chi Minh City",
      theme: ["Flexible", "Markets", "Parks"],
      blocks: [
        { label: "Morning", plan: "Thao Dien (if you want calmer) OR D1 wandering."},
        { label: "Afternoon", plan: "Pack for return to Hanoi."},
      ],
    },
    {
      date: "2026-08-15",
      city: "Hanoi",
      theme: ["Return", "Buffer"],
      blocks: [
        { label: "Flight", plan: "SGN → HAN. Check-in. Easy evening."},
      ],
    },
    {
      date: "2026-08-16",
      city: "Hanoi",
      theme: ["Last full day", "Gifts", "Walk"],
      blocks: [
        { label: "Morning", plan: "Gifts shopping + coffee."},
        { label: "Afternoon", plan: "One last cultural spot OR rest."},
      ],
    },
    {
      date: "2026-08-17",
      city: "Hanoi",
      theme: ["Departure"],
      blocks: [
        { label: "Exit", plan: "Airport drop. Qatar departs 19:30."},
      ],
    },
  ],

  hotels: [
    {
      city: "Hanoi",
      name: "Ja Cosmo",
      dates: "Jul 25–28",
      why: "Central base for Old Quarter + easy logistics with kids.",
      budget: { us: 180, claudine: 110 },
      room_rules: ["2 rooms", "1 room must allow extra bed", "free cancellation + pay at property"],
    },
    {
      city: "Ninh Binh",
      name: "ChezCao Rice Field Ecolodge",
      dates: "Jul 28–30",
      why: "Best compromise: wow scenery + freedom + good base.",
      budget: { us: 140, claudine: 140 },
      room_rules: ["2 rooms", "1 room must allow extra bed", "free cancellation + pay at property"],
    },
    {
      city: "Ha Long Bay",
      name: "Renea Cruise",
      dates: "Jul 30–Aug 1",
      why: "Cruise for the ‘wow’ with easy family rhythm.",
      budget: { us: 330, claudine: 300 },
      room_rules: ["2 cabins if needed", "confirm kid bed situation", "cancellation rules differ on cruises"],
    },
    {
      city: "Hoi An",
      name: "Palm Garden Resort",
      dates: "Aug 1–6",
      why: "Strong resort base: beach + pool + family ease.",
      budget: { us: 682, claudine: 612 },
      room_rules: ["2 rooms", "1 room must allow extra bed", "free cancellation + pay at property"],
    },
    {
      city: "Da Nang",
      name: "Seahorse Signature",
      dates: "Aug 6–8",
      why: "Central for city visits + good comfort-to-price ratio.",
      budget: { us: 129, claudine: 92 },
      room_rules: ["2 rooms", "1 room must allow extra bed", "free cancellation + pay at property"],
    },
    {
      city: "Whale Island",
      name: "Whale Island Resort",
      dates: "Aug 8–12",
      why: "Eco-reset on a private island (simple comfort, big nature).",
      budget: { us: 415, claudine: 415 },
      room_rules: ["Confirm bedding for 6yo", "meals are paid separately", "boat schedule constraints"],
    },
    {
      city: "Ho Chi Minh City",
      name: "Alagon Saigon Hotel & Spa",
      dates: "Aug 12–15",
      why: "Good base for D1 visits + culture + walkable areas.",
      budget: { us: 275, claudine: 211 },
      room_rules: ["2 rooms", "1 room must allow extra bed", "free cancellation + pay at property"],
    },
    {
      city: "Hanoi",
      name: "Return stay (same base)",
      dates: "Aug 15–17",
      why: "Simple: no move stress before flight home.",
      budget: { us: 0, claudine: 0 },
      room_rules: ["2 rooms", "1 room must allow extra bed", "free cancellation + pay at property"],
    },
  ],

  internal_flights: [
    { route: "Hai Phong (HPH) → Da Nang (DAD) (x5)", group_cost_usd: 300, note: "Family of 5" },
    { route: "Da Nang (DAD) → Cam Ranh (CXR) (x5)", group_cost_usd: 300 },
    { route: "Cam Ranh (CXR) → Ho Chi Minh (SGN) (x5)", group_cost_usd: 300 },
    { route: "Ho Chi Minh (SGN) → Hanoi (HAN) (x5)", group_cost_usd: 250 },
  ],

  ground_transfers: [
    { route: "Hanoi → Ninh Binh (limousine)", cost_usd: 60, note: "for 5" },
    { route: "Ninh Binh → Ha Long (driver)", cost_usd: 60, note: "for 5" },
    { route: "Ha Long → Hai Phong airport (HPH)", cost_usd: 50, note: "for 5" },
    { route: "Da Nang airport → Hoi An", cost_usd: 20, note: "for 5" },
  ],

  culture: [
    { city: "Hanoi", title: "Old Quarter walk", why: "City heartbeat, street life, architecture.", tip: "Early morning is calmer." },
    { city: "Hanoi", title: "Temple of Literature", why: "Deep cultural symbol, quiet + beautiful.", tip: "Go early to avoid heat." },
    { city: "Ninh Binh", title: "Trang An / Tam Coc boat", why: "Signature landscape: limestone + rivers." },
    { city: "Ninh Binh", title: "Mua Cave viewpoint", why: "Most iconic viewpoint for photos.", tip: "Only if kids have energy; lots of steps." },
    { city: "Hoi An", title: "Old Town at night", why: "Lantern magic + easy for family.", tip: "Keep it short; avoid late hours." },
    { city: "Da Nang", title: "Marble Mountains", why: "Quick wow: caves + views + temples." },
    { city: "Ho Chi Minh City", title: "War Remnants Museum", why: "Context and depth. Choose short visit.", tip: "Skip if kids are too young/sensitive." },
    { city: "Ho Chi Minh City", title: "Central Post Office area", why: "Easy combo: architecture + photos + cafés." },
  ],

  tips: [
    {
      title: "Protect mornings",
      content: "With kids, mornings decide the whole day. Keep one ‘must’ only.",
      bullets: ["Breakfast + sunscreen + water always first", "One activity then lunch then rest"],
    },
    {
      title: "Always build buffer",
      content: "Vietnam logistics can slip. Buffer makes you feel rich.",
      bullets: ["Never plan two ‘big’ things same day", "Arrive, settle, then explore"],
    },
    {
      title: "Heat management",
      content: "Midday heat is real. Plan indoor or pool time 12:00–15:30.",
    },
    {
      title: "Food safety basics",
      content: "Don’t be paranoid, just be consistent.",
      bullets: ["Bottled water for kids", "Prefer busy restaurants", "Carry simple meds"],
    },
  ],

  guide_sections: [
    {
      title: "The ‘wow without chaos’ rule",
      content:
        "One wow per day max. Everything else is optional. Kids + travel is an energy management game.",
    },
    {
      title: "The 3-hour road ceiling",
      content:
        "Any road transfer beyond ~3h30 drains everyone. If it’s longer, fly or split with a stop.",
    },
    {
      title: "Room strategy",
      content:
        "Always 2 rooms. One must allow an extra bed for the 6yo. Pay at property + free cancellation whenever possible.",
    },
  ],
};

// ------------------------------------------------------------
// CHECKLIST ITEMS (HOME VIEW)
// ------------------------------------------------------------
const checklistItems: { key: string; label: string }[] = [
  { key: "confirm_room_setup", label: "Confirm 2 rooms + extra bed option everywhere" },
  { key: "airport_pickups", label: "Confirm all airport pickups/drops" },
  { key: "drivers_hanoi_nb", label: "Driver Hanoi → Ninh Binh (Jul 28)" },
  { key: "drivers_nb_halong", label: "Driver Ninh Binh → Ha Long (Jul 30)" },
  { key: "cruise_details", label: "Cruise: cabin config + kid bedding + timing" },
  { key: "flights_internal", label: "Internal flights booked + baggage checked" },
  { key: "whale_island_boat", label: "Whale Island boat schedule confirmed" },
  { key: "insurance", label: "Travel insurance checked" },
];

// ------------------------------------------------------------
// UTILITIES
// ------------------------------------------------------------
function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
function moneyFmt(n: number) {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}
function fmtDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}
function sameCityKey(city: string) {
  return city.trim();
}
function cityCoverFromLabel(city: string) {
  // Simple deterministic image mapping; replace with your own hosted images if you want.
  const key = city.toLowerCase();
  if (key.includes("hanoi")) return "https://images.unsplash.com/photo-1548032885-b5e38734688a?auto=format&fit=crop&w=1400&q=80";
  if (key.includes("ninh")) return "https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&w=1400&q=80";
  if (key.includes("ha long")) return "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1400&q=80";
  if (key.includes("hoi an")) return "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1400&q=80";
  if (key.includes("da nang")) return "https://images.unsplash.com/photo-1583395085371-2f9bdb8e3d26?auto=format&fit=crop&w=1400&q=80";
  if (key.includes("whale")) return "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1400&q=80";
  if (key.includes("ho chi")) return "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1400&q=80";
  return "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1400&q=80";
}
function dayCoverFromDay(d: ItineraryDay) {
  return cityCoverFromLabel(d.city);
}

// localStorage helpers
function loadLS<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
function saveLS<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

// ------------------------------------------------------------
// SMALL UI PRIMITIVES
// ------------------------------------------------------------
function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cx("rounded-3xl border bg-white p-5 shadow-sm", className)}>{children}</div>;
}

function IconBadge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-sm">
      <span className="opacity-70">{icon}</span>
      <span className="font-medium">{text}</span>
    </div>
  );
}

function Pill({ active, children, onClick }: { active?: boolean; children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cx(
        "rounded-full border px-4 py-2 text-sm transition",
        active ? "bg-black text-white" : "bg-white hover:bg-black/5"
      )}
    >
      {children}
    </button>
  );
}

const fmtDate = (iso: string) => {
  // iso: YYYY-MM-DD
  const [y, m, d] = iso.split("-").map((x) => Number(x));
  const date = new Date(Date.UTC(y, m - 1, d));
  const opts: Intl.DateTimeFormatOptions = { weekday: "short", day: "2-digit", month: "short" };
  return new Intl.DateTimeFormat("fr-FR", opts).format(date);
};

const sameCityKey = (city: string) => {
  const s = city.toLowerCase();
  if (s.includes("hanoi")) return "Hanoi";
  if (s.includes("ninh")) return "Ninh Binh";
  if (s.includes("ha long") || s.includes("halong")) return "Ha Long";
  if (s.includes("hoi an") || s.includes("hoian")) return "Hoi An";
  if (s.includes("da nang") || s.includes("danang")) return "Da Nang";
  if (s.includes("ho chi minh") || s.includes("hcmc") || s.includes("saigon")) return "Ho Chi Minh City";
  if (s.includes("whale")) return "Whale Island";
  return city;
};

// ------------------------------------------------------------
// MOMENT COVER FROM TEXT (robust mapping)
// ------------------------------------------------------------
const momentCoverFromText = (text?: string) => {
  const s = (text ?? "").toLowerCase();

  // ultra-specific first
  if (s.includes("train street")) return ASSETS.covers.moments.hanoi_train_street;
  if (s.includes("lan ong")) return ASSETS.covers.moments.hanoi_lan_ong;
  if (s.includes("hoan kiem")) return ASSETS.covers.moments.hanoi_hoan_kiem;
  if (s.includes("temple of literature")) return ASSETS.covers.moments.hanoi_temple_of_literature;

  if (s.includes("hang mua")) return ASSETS.covers.moments.ninhbinh_hang_mua;
  if (s.includes("trang an") || s.includes("tràng an")) return ASSETS.covers.moments.ninh_binh_trang_an;
  if (s.includes("tam coc")) return ASSETS.covers.moments.ninh_binh_tam_coc;

  if (s.includes("cruise")) return ASSETS.covers.moments.ha_long_cruise;
  if (s.includes("sunset")) return ASSETS.covers.moments.ha_long_sunset;

  if (s.includes("an bang") || s.includes("plage")) return ASSETS.covers.moments.hoi_an_an_bang;
  if (s.includes("lantern") || s.includes("lanterne") || s.includes("old town")) return ASSETS.covers.moments.hoi_an_old_town_night;

  if (s.includes("ben thanh")) return ASSETS.covers.moments.hcmc_ben_thanh;
  if (s.includes("central post") || s.includes("post office")) return ASSETS.covers.moments.hcmc_central_post_office;
  if (s.includes("war remnants")) return ASSETS.covers.moments.hcmc_war_museum;

  if (s.includes("whale") || s.includes("hon ong")) return ASSETS.covers.moments.whale_island_ponton;
  if (s.includes("dragon")) return ASSETS.covers.moments.pont_dragon_da_nang;

  // generic moments
  if (s.includes("arrivée") || s.includes("arrival")) return ASSETS.covers.moments.arrival;
  if (s.includes("transfert") || s.includes("transfer")) return ASSETS.covers.moments.transfer;
  if (s.includes("aéroport") || s.includes("airport")) return ASSETS.covers.moments.airport;
  if (s.includes("vol") || s.includes("plane")) return ASSETS.covers.moments.plane;
  if (s.includes("train")) return ASSETS.covers.moments.train;
  if (s.includes("nuit") || s.includes("night")) return ASSETS.covers.moments.night;
  if (s.includes("boat") || s.includes("bateau")) return ASSETS.covers.moments.boat;
  if (s.includes("market") || s.includes("marché")) return ASSETS.covers.moments.market;
  if (s.includes("coffee") || s.includes("café")) return ASSETS.covers.moments.coffee;
  if (s.includes("street food") || s.includes("streetfood")) return ASSETS.covers.moments.streetfood;
  if (s.includes("museum") || s.includes("musée")) return ASSETS.covers.moments.museum;
  if (s.includes("temple") || s.includes("pagode")) return ASSETS.covers.moments.temple;
  if (s.includes("massage")) return ASSETS.covers.moments.massage;
  if (s.includes("famille") || s.includes("kids")) return ASSETS.covers.moments.family;
  if (s.includes("love") || s.includes("amour")) return ASSETS.covers.moments.love;

  return ASSETS.covers.sections.home;
};

// ------------------------------------------------------------
// DAY COVER (FIXED) — NO undefined variables
// ------------------------------------------------------------
const dayCoverFromDay = (day: ItineraryDay) => {
  // Priority: moment cover based on blocks/theme, else city cover.
  const joined = [
    day.city,
    day.theme.join(" "),
    ...day.blocks.map((b) => `${b.label} ${b.plan}`),
  ].join(" | ");

  const moment = momentCoverFromText(joined);
  if (moment && moment !== ASSETS.covers.sections.home) return moment;

  return cityCoverFromLabel(day.city);
};

// ------------------------------------------------------------
// MONEY HELPERS
// ------------------------------------------------------------
const sumUsd = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
const moneyFmt = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

// ------------------------------------------------------------
// UI PRIMITIVES
// ------------------------------------------------------------
const cx = (...cls: Array<string | false | null | undefined>) => cls.filter(Boolean).join(" ");

function IconBadge({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm">
      <span className="opacity-80">{icon}</span>
      <span className="opacity-90">{text}</span>
    </span>
  );
}

function SectionHeader({
  title,
  subtitle,
  cover,
  right,
}: {
  title: string;
  subtitle?: string;
  cover?: string;
  right?: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border bg-white shadow-sm">
      {cover ? (
        <div className="absolute inset-0">
          <img src={cover} alt={title} className="h-full w-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/70 to-white" />
        </div>
      ) : null}
      <div className="relative flex flex-col gap-3 p-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {subtitle ? <p className="mt-1 text-sm opacity-80">{subtitle}</p> : null}
        </div>
        {right ? <div className="flex items-center gap-2">{right}</div> : null}
      </div>
    </div>
  );
}

function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cx("rounded-3xl border bg-white p-5 shadow-sm", className)}>{children}</div>;
}

function Button({
  children,
  onClick,
  variant = "primary",
  className,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "danger";
  className?: string;
  type?: "button" | "submit";
}) {
  const base = "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition";
  const styles =
    variant === "primary"
      ? "bg-black text-white hover:opacity-90"
      : variant === "danger"
      ? "bg-red-600 text-white hover:opacity-90"
      : "bg-transparent hover:bg-black/5";
  return (
    <button type={type} onClick={onClick} className={cx(base, styles, className)}>
      {children}
    </button>
  );
}

function Tabs({
  value,
  onChange,
  items,
}: {
  value: View;
  onChange: (v: View) => void;
  items: Array<{ id: View; label: string; icon: ReactNode }>;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {items.map((it) => (
        <button
          key={it.id}
          onClick={() => onChange(it.id)}
          className={cx(
            "inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm transition",
            value === it.id ? "bg-black text-white" : "bg-white hover:bg-black/5"
          )}
        >
          <span className={cx(value === it.id ? "text-white" : "opacity-70")}>{it.icon}</span>
          <span>{it.label}</span>
        </button>
      ))}
    </div>
  );
}

function Modal({
  open,
  title,
  children,
  onClose,
  footer,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  footer?: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-3 sm:items-center">
      <div className="w-full max-w-3xl overflow-hidden rounded-3xl border bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-4">
          <div className="text-sm font-semibold">{title}</div>
          <button onClick={onClose} className="rounded-xl p-2 hover:bg-black/5">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[75vh] overflow-auto p-5">{children}</div>
        {footer ? <div className="border-t p-4">{footer}</div> : null}
      </div>
    </div>
  );
}

function LinkPill({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm hover:bg-black/5"
    >
      <Navigation className="h-4 w-4 opacity-70" />
      <span>{label}</span>
    </a>
  );
}

// ------------------------------------------------------------
// SMALL UTILITIES
// ------------------------------------------------------------
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

const useLocalStorageState = <T,>(key: string, initial: T) => {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {}
  }, [key, state]);

  return [state, setState] as const;
};

// ------------------------------------------------------------
// APP-LEVEL TYPES (notes/checks)
// ------------------------------------------------------------
type ChecklistState = Record<string, boolean>;
type NotesState = Record<string, string>;

// ------------------------------------------------------------
// MAIN APP STATE HOOKS
// ------------------------------------------------------------
const NAV_ITEMS: Array<{ id: View; label: string; icon: ReactNode }> = [
  { id: "home", label: "Home", icon: <Sparkles className="h-4 w-4" /> },
  { id: "itinerary", label: "Itinerary", icon: <Calendar className="h-4 w-4" /> },
  { id: "hotels", label: "Hotels", icon: <Hotel className="h-4 w-4" /> },
  { id: "culture", label: "Culture", icon: <Landmark className="h-4 w-4" /> },
  { id: "guide", label: "Guide", icon: <BookOpen className="h-4 w-4" /> },
  { id: "tips", label: "Tips", icon: <Lightbulb className="h-4 w-4" /> },
  { id: "budget", label: "Budget", icon: <Wallet className="h-4 w-4" /> },
];

// ------------------------------------------------------------
// EXPORT PDF (simple print)
// ------------------------------------------------------------
const printPage = () => window.print();

// ------------------------------------------------------------
// FIXED: get section cover
// ------------------------------------------------------------
const sectionCover = (view: View) => {
  if (view === "home") return ASSETS.covers.sections.home;
  if (view === "itinerary") return ASSETS.covers.sections.itinerary;
  if (view === "hotels") return ASSETS.covers.sections.hotels;
  if (view === "culture") return ASSETS.covers.sections.guide;
  if (view === "guide") return ASSETS.covers.sections.guide;
  if (view === "tips") return ASSETS.covers.sections.tips;
  if (view === "budget") return ASSETS.covers.sections.budget;
  return ASSETS.covers.sections.home;
};

// ------------------------------------------------------------
// CHECKLIST KEYS
// ------------------------------------------------------------
const checklistItems = [
  { key: "passports", label: "Passeports / validité + copies" },
  { key: "insurance", label: "Assurance voyage + numéros" },
  { key: "sim", label: "eSIM / SIM Vietnam" },
  { key: "cash", label: "Cash + petites coupures" },
  { key: "meds", label: "Médicaments + trousse" },
  { key: "kids", label: "Kids kit: snacks, jeux, chargeurs" },
  { key: "transfers", label: "Transferts confirmés (aéroports/limousines)" },
  { key: "hotels_confirmed", label: "Hôtels confirmés + 2 chambres + lit 6 ans" },
  { key: "cruise", label: "Croisière confirmée + port + timing" },
] as const;

// ------------------------------------------------------------
// MAIN COMPONENT — App()
// PART 3 will include all views rendering
// ------------------------------------------------------------
export default function App() {
  const [view, setView] = useLocalStorageState<View>("vietnam_view", "home");
  const [search, setSearch] = useState("");
  const [mood, setMood] = useLocalStorageState<Mood>("vietnam_mood", "normal");
  const [checklist, setChecklist] = useLocalStorageState<ChecklistState>("vietnam_checklist", {});
  const [notes, setNotes] = useLocalStorageState<NotesState>("vietnam_notes", {});
  const [selectedHotel, setSelectedHotel] = useState<HotelItem | null>(null);
  const [selectedDay, setSelectedDay] = useState<ItineraryDay | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openHotel = (h: HotelItem) => {
    setSelectedHotel(h);
    setSelectedDay(null);
    setModalOpen(true);
  };

  const openDay = (d: ItineraryDay) => {
    setSelectedDay(d);
    setSelectedHotel(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedHotel(null);
    setSelectedDay(null);
  };

  const filteredHotels = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return TRIP_DATA.hotels;
    return TRIP_DATA.hotels.filter((h) => {
      return (
        h.city.toLowerCase().includes(q) ||
        h.name.toLowerCase().includes(q) ||
        (h.why ?? "").toLowerCase().includes(q)
      );
    });
  }, [search]);

  const filteredDays = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return TRIP_DATA.itinerary_days;
    return TRIP_DATA.itinerary_days.filter((d) => {
      const joined = [d.city, ...d.theme, ...d.blocks.map((b) => `${b.label} ${b.plan}`)].join(" ").toLowerCase();
      return joined.includes(q);
    });
  }, [search]);

  const budgetTotals = useMemo(() => {
    const hotelsUs = sumUsd(TRIP_DATA.hotels.map((h) => h.budget.us));
    const hotelsCl = sumUsd(TRIP_DATA.hotels.map((h) => h.budget.claudine));
    const flights = sumUsd(TRIP_DATA.internal_flights.map((f) => f.group_cost_usd));
    const transfers = sumUsd(TRIP_DATA.ground_transfers.map((t) => t.cost_usd));

    return {
      hotelsUs,
      hotelsCl,
      flights,
      transfers,
      grand: hotelsUs + hotelsCl + flights + transfers,
    };
  }, []);

  const moodLabel = mood === "fatigue" ? "Fatigue" : mood === "energy" ? "Energy" : "Normal";
  const moodIcon = mood === "fatigue" ? <Moon className="h-4 w-4" /> : mood === "energy" ? <Flame className="h-4 w-4" /> : <BatteryCharging className="h-4 w-4" />;

  // ------------------------------------------------------------
  // PART 3 will return the full JSX for every view
  // ------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#fafafa] text-black">
      <div className="mx-auto max-w-6xl p-4 sm:p-6">
        <div className="flex flex-col gap-4">
          <SectionHeader
            title={TRIP_DATA.meta.title}
            subtitle={`${TRIP_DATA.meta.travelers} • ${TRIP_DATA.meta.vibe.join(" · ")}`}
            cover={sectionCover(view)}
            right={
              <div className="flex flex-wrap items-center gap-2">
                <IconBadge icon={<Plane className="h-4 w-4" />} text={`Arrivée HAN ${TRIP_DATA.meta.flights.arrive_hanoi.date} ${TRIP_DATA.meta.flights.arrive_hanoi.time}`} />
                <IconBadge icon={moodIcon} text={`Mood: ${moodLabel}`} />
                <Button variant="ghost" onClick={printPage}>
                  <Printer className="h-4 w-4" />
                  Print
                </Button>
              </div>
            }
          />

          <Card className="flex flex-col gap-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Tabs value={view} onChange={setView} items={NAV_ITEMS} />

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search: city, hotel, plan..."
                    className="w-full rounded-2xl border bg-white py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-black/10 sm:w-72"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Button variant={mood === "fatigue" ? "primary" : "ghost"} onClick={() => setMood("fatigue")}>
                    <Moon className="h-4 w-4" />
                    Fatigue
                  </Button>
                  <Button variant={mood === "normal" ? "primary" : "ghost"} onClick={() => setMood("normal")}>
                    <BatteryCharging className="h-4 w-4" />
                    Normal
                  </Button>
                  <Button variant={mood === "energy" ? "primary" : "ghost"} onClick={() => setMood("energy")}>
                    <Flame className="h-4 w-4" />
                    Energy
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* PART 3 will render the selected view here */}

          <Modal
            open={modalOpen}
            title={selectedHotel ? `${selectedHotel.city} — ${selectedHotel.name}` : selectedDay ? `${fmtDate(selectedDay.date)} — ${selectedDay.city}` : "Details"}
            onClose={closeModal}
            footer={
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={closeModal}>
                  Close
                </Button>
              </div>
            }
          >
            {selectedHotel ? (
              <div className="space-y-4">
                <div className="overflow-hidden rounded-3xl border">
                  <img
                    src={selectedHotel.cover ?? cityCoverFromLabel(selectedHotel.city)}
                    alt={selectedHotel.name}
                    className="h-64 w-full object-cover"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Card className="p-4">
                    <div className="text-xs opacity-70">Dates</div>
                    <div className="mt-1 font-medium">{selectedHotel.dates}</div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-xs opacity-70">Budget</div>
                    <div className="mt-1 font-medium">
                      US: {moneyFmt(selectedHotel.budget.us)} • Claudine: {moneyFmt(selectedHotel.budget.claudine)}
                    </div>
                  </Card>
                </div>

                <Card className="p-4">
                  <div className="text-xs opacity-70">Why</div>
                  <div className="mt-1">{selectedHotel.why}</div>
                  {selectedHotel.note ? <div className="mt-2 text-sm opacity-70">{selectedHotel.note}</div> : null}
                </Card>

                <div className="flex flex-wrap gap-2">
                  {selectedHotel.booking_url ? <LinkPill href={selectedHotel.booking_url} label="Booking" /> : null}
                  {selectedHotel.official_url ? <LinkPill href={selectedHotel.official_url} label="Official site" /> : null}
                </div>
              </div>
            ) : selectedDay ? (
              <div className="space-y-4">
                <div className="overflow-hidden rounded-3xl border">
                  <img src={dayCoverFromDay(selectedDay)} alt={selectedDay.city} className="h-64 w-full object-cover" />
                </div>

                <Card className="p-4">
                  <div className="text-xs opacity-70">Theme</div>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {selectedDay.theme.map((t) => (
                      <span key={t} className="rounded-full border px-3 py-1 text-sm">
                        {t}
                      </span>
                    ))}
                  </div>
                </Card>

                <div className="space-y-3">
                  {selectedDay.blocks.map((b, i) => (
                    <Card key={`${b.label}-${i}`} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold">{b.label}</div>
                        <span className="text-xs opacity-60">
                          <MapPin className="inline h-4 w-4 -translate-y-[1px]" /> {sameCityKey(selectedDay.city)}
                        </span>
                      </div>
                      <div className="mt-2 text-sm">{b.plan}</div>
                      {b.links?.length ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {b.links.map((u) => (
                            <LinkPill key={u} href={u} label="Link" />
                          ))}
                        </div>
                      ) : null}
                    </Card>
                  ))}
                </div>
              </div>
            ) : null}
          </Modal>
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// VIEW: HOME
// ------------------------------------------------------------
function HomeView({
  checklist,
  setChecklist,
  notes,
  setNotes,
  budgetTotals,
}: {
  checklist: ChecklistState;
  setChecklist: React.Dispatch<React.SetStateAction<ChecklistState>>;
  notes: NotesState;
  setNotes: React.Dispatch<React.SetStateAction<NotesState>>;
  budgetTotals: { hotelsUs: number; hotelsCl: number; flights: number; transfers: number; grand: number };
}) {
  const toggle = (key: string) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const progress = useMemo(() => {
    const total = checklistItems.length;
    const done = checklistItems.filter((i) => checklist[i.key]).length;
    return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
  }, [checklist]);

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm opacity-70">At-a-glance</div>
            <div className="mt-1 text-xl font-semibold">Ready status</div>
            <div className="mt-2 text-sm opacity-80">
              Checklist: <span className="font-semibold">{progress.done}</span> / {progress.total} ({progress.pct}%)
            </div>
          </div>
          <div className="w-28">
            <div className="h-2 overflow-hidden rounded-full bg-black/10">
              <div className="h-full bg-black" style={{ width: `${clamp(progress.pct, 0, 100)}%` }} />
            </div>
            <div className="mt-2 text-right text-xs opacity-60">Progress</div>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {checklistItems.map((it) => (
            <button
              key={it.key}
              onClick={() => toggle(it.key)}
              className={cx(
                "flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition",
                checklist[it.key] ? "bg-black text-white" : "bg-white hover:bg-black/5"
              )}
            >
              <div className="flex items-center gap-3">
                {checklist[it.key] ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5 opacity-60" />}
                <div className="text-sm font-medium">{it.label}</div>
              </div>
              <ChevronRight className={cx("h-4 w-4", checklist[it.key] ? "opacity-90" : "opacity-40")} />
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Card className="p-4">
            <div className="text-xs opacity-70">Hotels subtotal</div>
            <div className="mt-1 text-lg font-semibold">
              US {moneyFmt(budgetTotals.hotelsUs)} • Claudine {moneyFmt(budgetTotals.hotelsCl)}
            </div>
            <div className="mt-1 text-sm opacity-70">Excludes meals, activities, shopping.</div>
          </Card>
          <Card className="p-4">
            <div className="text-xs opacity-70">Transport subtotal</div>
            <div className="mt-1 text-lg font-semibold">
              Flights {moneyFmt(budgetTotals.flights)} • Transfers {moneyFmt(budgetTotals.transfers)}
            </div>
            <div className="mt-1 text-sm opacity-70">Internal flights + ground transfers.</div>
          </Card>
        </div>
      </Card>

      <Card>
        <div className="text-sm opacity-70">Scratchpad</div>
        <div className="mt-1 text-xl font-semibold">Notes</div>
        <textarea
          value={notes["home_notes"] ?? ""}
          onChange={(e) => setNotes((p) => ({ ...p, home_notes: e.target.value }))}
          placeholder="Anything important: confirmations, WhatsApp numbers, last-minute changes..."
          className="mt-4 h-64 w-full resize-none rounded-2xl border bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
        />
        <div className="mt-3 text-xs opacity-60">Saved automatically in your browser.</div>
      </Card>
    </div>
  );
}

// ------------------------------------------------------------
// VIEW: ITINERARY
// ------------------------------------------------------------
function ItineraryView({
  days,
  onOpenDay,
}: {
  days: ItineraryDay[];
  onOpenDay: (d: ItineraryDay) => void;
}) {
  return (
    <div className="grid gap-4">
      <Card>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm opacity-70">Timeline</div>
            <div className="mt-1 text-xl font-semibold">Day by day plan</div>
            <div className="mt-2 text-sm opacity-70">Click a day to see full blocks and links.</div>
          </div>
          <IconBadge icon={<Calendar className="h-4 w-4" />} text={`${days.length} days`} />
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {days.map((d) => (
          <button
            key={d.date}
            onClick={() => onOpenDay(d)}
            className="group text-left"
          >
            <div className="overflow-hidden rounded-3xl border bg-white shadow-sm transition group-hover:shadow-md">
              <div className="relative h-44">
                <img src={dayCoverFromDay(d)} alt={d.city} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <div className="text-xs text-white/80">{fmtDate(d.date)}</div>
                      <div className="text-lg font-semibold text-white">{d.city}</div>
                    </div>
                    <div className="flex gap-2">
                      {d.theme.slice(0, 3).map((t) => (
                        <span key={t} className="rounded-full bg-white/15 px-2 py-1 text-xs text-white backdrop-blur">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="grid gap-2">
                  {d.blocks.slice(0, 3).map((b, i) => (
                    <div key={`${b.label}-${i}`} className="flex items-start justify-between gap-3">
                      <div className="text-sm font-medium">{b.label}</div>
                      <div className="text-sm opacity-70 line-clamp-1">{b.plan}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="text-xs opacity-60">{d.blocks.length} blocks</div>
                  <span className="inline-flex items-center gap-1 text-sm font-medium">
                    Open <ChevronRight className="h-4 w-4 opacity-70" />
                  </span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// VIEW: HOTELS
// ------------------------------------------------------------
function HotelsView({
  hotels,
  onOpenHotel,
}: {
  hotels: HotelItem[];
  onOpenHotel: (h: HotelItem) => void;
}) {
  return (
    <div className="grid gap-4">
      <Card>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-sm opacity-70">Stays</div>
            <div className="mt-1 text-xl font-semibold">Hotels & resorts</div>
            <div className="mt-2 text-sm opacity-70">2 rooms required + child bed option. Click to open details.</div>
          </div>
          <IconBadge icon={<Hotel className="h-4 w-4" />} text={`${hotels.length} options`} />
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {hotels.map((h) => (
          <button key={`${h.city}-${h.name}`} onClick={() => onOpenHotel(h)} className="group text-left">
            <div className="overflow-hidden rounded-3xl border bg-white shadow-sm transition group-hover:shadow-md">
              <div className="relative h-44">
                <img
                  src={h.cover ?? cityCoverFromLabel(h.city)}
                  alt={h.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="text-xs text-white/80">{h.dates}</div>
                  <div className="text-lg font-semibold text-white">{h.name}</div>
                  <div className="text-sm text-white/80">{h.city}</div>
                </div>
              </div>

              <div className="p-4">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border px-3 py-1 text-xs">
                    US {moneyFmt(h.budget.us)}
                  </span>
                  <span className="rounded-full border px-3 py-1 text-xs">
                    Claudine {moneyFmt(h.budget.claudine)}
                  </span>
                  {h.booking_url ? (
                    <span className="rounded-full border px-3 py-1 text-xs">Booking</span>
                  ) : null}
                  {h.official_url ? (
                    <span className="rounded-full border px-3 py-1 text-xs">Official</span>
                  ) : null}
                </div>

                <div className="mt-3 text-sm opacity-80 line-clamp-2">{h.why}</div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="text-xs opacity-60">{sameCityKey(h.city)}</div>
                  <span className="inline-flex items-center gap-1 text-sm font-medium">
                    Open <ChevronRight className="h-4 w-4 opacity-70" />
                  </span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// VIEW: CULTURE
// ------------------------------------------------------------
function CultureView({ culture }: { culture: CultureItem[] }) {
  // Group by city
  const groups = useMemo(() => {
    const map = new Map<string, CultureItem[]>();
    for (const c of culture) {
      const k = sameCityKey(c.city);
      map.set(k, [...(map.get(k) ?? []), c]);
    }
    return Array.from(map.entries());
  }, [culture]);

  return (
    <div className="grid gap-4">
      <Card>
        <div className="text-sm opacity-70">Culture</div>
        <div className="mt-1 text-xl font-semibold">Must-sees & context</div>
        <div className="mt-2 text-sm opacity-70">Short list for “meaning + beauty” without overplanning.</div>
      </Card>

      <div className="grid gap-4">
        {groups.map(([city, items]) => (
          <Card key={city}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={cityCoverFromLabel(city)}
                  alt={city}
                  className="h-14 w-14 rounded-2xl object-cover"
                />
                <div>
                  <div className="text-lg font-semibold">{city}</div>
                  <div className="text-sm opacity-70">{items.length} spots</div>
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {items.map((c) => (
                <div key={`${city}-${c.title}`} className="rounded-2xl border p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-sm font-semibold">{c.title}</div>
                    {c.link ? (
                      <a href={c.link} target="_blank" rel="noreferrer" className="rounded-xl p-2 hover:bg-black/5">
                        <ExternalLink className="h-4 w-4 opacity-70" />
                      </a>
                    ) : null}
                  </div>
                  <div className="mt-2 text-sm opacity-80">{c.why}</div>
                  {c.tip ? <div className="mt-2 text-xs opacity-60">{c.tip}</div> : null}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// VIEW: GUIDE
// ------------------------------------------------------------
function GuideView({ notes, setNotes }: { notes: NotesState; setNotes: React.Dispatch<React.SetStateAction<NotesState>> }) {
  const guide = TRIP_DATA.guide_sections;

  return (
    <div className="grid gap-4">
      <Card>
        <div className="text-sm opacity-70">Guide</div>
        <div className="mt-1 text-xl font-semibold">How to travel “smooth + wow”</div>
        <div className="mt-2 text-sm opacity-70">Rules of the game for Vietnam with kids.</div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {guide.map((g) => (
          <Card key={g.title}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-lg font-semibold">{g.title}</div>
                <div className="mt-2 text-sm opacity-80">{g.content}</div>
              </div>
              <div className="opacity-70">
                <BookOpen className="h-5 w-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <div className="text-sm opacity-70">Your custom rules</div>
        <div className="mt-1 text-xl font-semibold">Notes that matter</div>
        <textarea
          value={notes["guide_rules"] ?? ""}
          onChange={(e) => setNotes((p) => ({ ...p, guide_rules: e.target.value }))}
          placeholder="Example: avoid >3h30 road, always 2 rooms, 6yo must have bed, no chaos mornings..."
          className="mt-4 h-48 w-full resize-none rounded-2xl border bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
        />
      </Card>
    </div>
  );
}

// ------------------------------------------------------------
// VIEW: TIPS
// ------------------------------------------------------------
function TipsView({ tips, notes, setNotes }: { tips: TipItem[]; notes: NotesState; setNotes: React.Dispatch<React.SetStateAction<NotesState>> }) {
  return (
    <div className="grid gap-4">
      <Card>
        <div className="text-sm opacity-70">Tips</div>
        <div className="mt-1 text-xl font-semibold">Practical shortcuts</div>
        <div className="mt-2 text-sm opacity-70">Stuff that prevents friction (and saves energy).</div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {tips.map((t) => (
          <Card key={t.title}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-lg font-semibold">{t.title}</div>
                <div className="mt-2 text-sm opacity-80">{t.content}</div>
                {t.bullets?.length ? (
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-sm opacity-80">
                    {t.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
              <Lightbulb className="h-5 w-5 opacity-60" />
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <div className="text-sm opacity-70">Logbook</div>
        <div className="mt-1 text-xl font-semibold">Things to remember on the fly</div>
        <textarea
          value={notes["tips_logbook"] ?? ""}
          onChange={(e) => setNotes((p) => ({ ...p, tips_logbook: e.target.value }))}
          placeholder="Numbers, addresses, do/don’t, reminders..."
          className="mt-4 h-44 w-full resize-none rounded-2xl border bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
        />
      </Card>
    </div>
  );
}

// ------------------------------------------------------------
// VIEW: BUDGET
// ------------------------------------------------------------
function BudgetView({
  totals,
  hotels,
  flights,
  transfers,
}: {
  totals: { hotelsUs: number; hotelsCl: number; flights: number; transfers: number; grand: number };
  hotels: HotelItem[];
  flights: FlightItem[];
  transfers: TransferItem[];
}) {
  const rowsHotels = hotels.map((h) => ({
    label: `${sameCityKey(h.city)} — ${h.name}`,
    us: h.budget.us,
    cl: h.budget.claudine,
  }));

  return (
    <div className="grid gap-4">
      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-sm opacity-70">Budget</div>
            <div className="mt-1 text-xl font-semibold">Totals & breakdown</div>
            <div className="mt-2 text-sm opacity-70">This is just what’s in the dataset (hotels + internal transport).</div>
          </div>
          <IconBadge icon={<Wallet className="h-4 w-4" />} text={`Grand total ${moneyFmt(totals.grand)}`} />
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <div className="text-xs opacity-70">Hotels (US)</div>
          <div className="mt-1 text-2xl font-semibold">{moneyFmt(totals.hotelsUs)}</div>
          <div className="mt-2 text-xs opacity-60">You / Marilyne / kids</div>
        </Card>
        <Card>
          <div className="text-xs opacity-70">Hotels (Claudine)</div>
          <div className="mt-1 text-2xl font-semibold">{moneyFmt(totals.hotelsCl)}</div>
          <div className="mt-2 text-xs opacity-60">Her share</div>
        </Card>
        <Card>
          <div className="text-xs opacity-70">Transport</div>
          <div className="mt-1 text-2xl font-semibold">{moneyFmt(totals.flights + totals.transfers)}</div>
          <div className="mt-2 text-xs opacity-60">Flights + ground transfers</div>
        </Card>
      </div>

      <Card>
        <div className="text-lg font-semibold">Hotels breakdown</div>
        <div className="mt-3 overflow-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2 pr-3">Item</th>
                <th className="py-2 pr-3">US</th>
                <th className="py-2 pr-3">Claudine</th>
                <th className="py-2 pr-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {rowsHotels.map((r) => (
                <tr key={r.label} className="border-b">
                  <td className="py-2 pr-3">{r.label}</td>
                  <td className="py-2 pr-3">{moneyFmt(r.us)}</td>
                  <td className="py-2 pr-3">{moneyFmt(r.cl)}</td>
                  <td className="py-2 pr-3 font-medium">{moneyFmt(r.us + r.cl)}</td>
                </tr>
              ))}
              <tr>
                <td className="py-3 pr-3 font-semibold">Subtotal</td>
                <td className="py-3 pr-3 font-semibold">{moneyFmt(totals.hotelsUs)}</td>
                <td className="py-3 pr-3 font-semibold">{moneyFmt(totals.hotelsCl)}</td>
                <td className="py-3 pr-3 font-semibold">{moneyFmt(totals.hotelsUs + totals.hotelsCl)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="text-lg font-semibold">Internal flights</div>
          <div className="mt-3 overflow-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2 pr-3">Route</th>
                  <th className="py-2 pr-3">Cost</th>
                  <th className="py-2 pr-3">Notes</th>
                </tr>
              </thead>
              <tbody>
                {flights.map((f) => (
                  <tr key={f.route} className="border-b">
                    <td className="py-2 pr-3">{f.route}</td>
                    <td className="py-2 pr-3">{moneyFmt(f.group_cost_usd)}</td>
                    <td className="py-2 pr-3 opacity-70">{f.note ?? ""}</td>
                  </tr>
                ))}
                <tr>
                  <td className="py-3 pr-3 font-semibold">Subtotal</td>
                  <td className="py-3 pr-3 font-semibold">{moneyFmt(totals.flights)}</td>
                  <td className="py-3 pr-3" />
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <div className="text-lg font-semibold">Ground transfers</div>
          <div className="mt-3 overflow-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2 pr-3">Route</th>
                  <th className="py-2 pr-3">Cost</th>
                  <th className="py-2 pr-3">Notes</th>
                </tr>
              </thead>
              <tbody>
                {transfers.map((t) => (
                  <tr key={t.route} className="border-b">
                    <td className="py-2 pr-3">{t.route}</td>
                    <td className="py-2 pr-3">{moneyFmt(t.cost_usd)}</td>
                    <td className="py-2 pr-3 opacity-70">{t.note ?? ""}</td>
                  </tr>
                ))}
                <tr>
                  <td className="py-3 pr-3 font-semibold">Subtotal</td>
                  <td className="py-3 pr-3 font-semibold">{moneyFmt(totals.transfers)}</td>
                  <td className="py-3 pr-3" />
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// INJECT THIS INTO App() RETURN — REPLACE THE PLACEHOLDER COMMENT
// ------------------------------------------------------------
// Find this in App() (PART 2):
//   {/* PART 3 will render the selected view here */}
// Replace with the following block:

/*
<Card className="p-0 border-0 bg-transparent shadow-none">
  {view === "home" ? (
    <HomeView checklist={checklist} setChecklist={setChecklist} notes={notes} setNotes={setNotes} budgetTotals={budgetTotals} />
  ) : null}

  {view === "itinerary" ? (
    <ItineraryView days={filteredDays} onOpenDay={openDay} />
  ) : null}

  {view === "hotels" ? (
    <HotelsView hotels={filteredHotels} onOpenHotel={openHotel} />
  ) : null}

  {view === "culture" ? (
    <CultureView culture={TRIP_DATA.culture} />
  ) : null}

  {view === "guide" ? (
    <GuideView notes={notes} setNotes={setNotes} />
  ) : null}

  {view === "tips" ? (
    <TipsView tips={TRIP_DATA.tips} notes={notes} setNotes={setNotes} />
  ) : null}

  {view === "budget" ? (
    <BudgetView totals={budgetTotals} hotels={TRIP_DATA.hotels} flights={TRIP_DATA.internal_flights} transfers={TRIP_DATA.ground_transfers} />
  ) : null}
</Card>
*/
