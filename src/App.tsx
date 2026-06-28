import { useEffect, useMemo, useState } from "react";
import { Star, Calendar, Hotel, Sparkles, Utensils, Lightbulb, Wallet } from "lucide-react";

import { TRIP_DATA } from "./data/trip";
import type { Mood, View, PlannedActivity } from "./data/types";
import { uniqCitiesByOrder } from "./lib/city";
import { toISO, MS_DAY } from "./lib/dates";
import { clamp } from "./lib/utils";
import { computeBudget, type BudgetFilters, type BudgetTab } from "./lib/budget";
import { buildTripContext } from "./lib/tripContext";

import { QuickSheet } from "./components/QuickSheet";
import { MrTang } from "./components/MrTang";
import { HomeView } from "./views/HomeView";
import { ItineraryView } from "./views/ItineraryView";
import { HotelsView } from "./views/HotelsView";
import { FlightsView } from "./views/FlightsView";
import { ActivitiesView } from "./views/ActivitiesView";
import { GuideView } from "./views/GuideView";
import { TipsView } from "./views/TipsView";
import { BudgetView } from "./views/BudgetView";

// ============================================================
// APP — orchestration: state, persistence, derived values,
// view routing, bottom nav and the Mr. Tang concierge.
// ============================================================
export default function App() {
  const [view, setView] = useState<View>("home");
  const [mood, setMood] = useState<Mood>(() => {
    const m = localStorage.getItem("trip_mood");
    return m ? (m as Mood) : "normal";
  });
  const [quickOpen, setQuickOpen] = useState(false);

  // Budget filters (FR)
  const [budgetTab, setBudgetTab] = useState<BudgetTab>(() => {
    const t = localStorage.getItem("trip_budget_tab_v3");
    return t ? (t as BudgetTab) : "overview";
  });
  const [filters, setFilters] = useState<BudgetFilters>(() => {
    const f = localStorage.getItem("trip_budget_filters_v3");
    return f
      ? JSON.parse(f)
      : { inclureConfirmes: true, inclureEstimes: true, seulementJaCosmo: false, recherche: "" };
  });

  const cities = useMemo(() => uniqCitiesByOrder(TRIP_DATA.itinerary_days), []);
  const [activeCity, setActiveCity] = useState(() => localStorage.getItem("trip_active_city") || cities[0] || "Hanoi");

  const todayISO = toISO(new Date());
  const tripStart = TRIP_DATA.itinerary_days[0]?.date;
  const tripEnd = TRIP_DATA.itinerary_days[TRIP_DATA.itinerary_days.length - 1]?.date;
  const isWithinTrip = tripStart && tripEnd ? todayISO >= tripStart && todayISO <= tripEnd : false;

  const todayIndex = useMemo(() => {
    const idx = TRIP_DATA.itinerary_days.findIndex((d) => d.date === todayISO);
    return idx >= 0 ? idx : 0;
  }, [todayISO]);

  // Hydrate the focused day from localStorage on first render, unless the
  // trip is live (then snap to today) — same result as the original load
  // effect, but without a flash of the default.
  const [focusDayIndex, setFocusDayIndex] = useState(() => {
    if (isWithinTrip) return todayIndex;
    const saved = localStorage.getItem("trip_focus_day");
    return saved ? Number(saved) : todayIndex;
  });
  const focusDay = TRIP_DATA.itinerary_days[clamp(focusDayIndex, 0, TRIP_DATA.itinerary_days.length - 1)];

  // Persist
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
    const list = TRIP_DATA.planned_activities;
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
  }, []);

  return (
    <div className="min-h-screen bg-app font-sans text-ink-900 pb-36 overflow-x-clip">
      <QuickSheet open={quickOpen} onClose={() => setQuickOpen(false)} onGoto={(v) => setView(v)} />

      {/* HOME */}
      {view === "home" && (
        <HomeView
          onOpenQuick={() => setQuickOpen(true)}
          activeCity={activeCity}
          daysTo={daysTo}
          dayNo={dayNo}
          tripLen={tripLen}
          isWithinTrip={isWithinTrip}
          todayDay={todayDay}
          todayIndex={todayIndex}
          nextTransfer={nextTransfer}
          mood={mood}
          setMood={setMood}
          focusDay={focusDay}
          focusDayIndex={focusDayIndex}
          setFocusDayIndex={setFocusDayIndex}
          lastDay={lastDay}
          setCityFromFocus={setCityFromFocus}
          goView={goView}
        />
      )}

      {/* ITINERARY */}
      {view === "itinerary" && (
        <ItineraryView cities={cities} activeCity={activeCity} setActiveCity={setActiveCity} mood={mood} goView={goView} />
      )}

      {/* HOTELS */}
      {view === "hotels" && <HotelsView goView={goView} />}

      {/* FLIGHTS */}
      {view === "flights" && <FlightsView goView={goView} />}

      {/* ACTIVITIES */}
      {view === "activities" && <ActivitiesView groups={activitiesByCity} goView={goView} />}

      {/* GUIDE */}
      {view === "guide" && <GuideView goView={goView} />}

      {/* TIPS */}
      {view === "tips" && <TipsView goView={goView} />}

      {/* BUDGET */}
      {view === "budget" && (
        <BudgetView budgetTab={budgetTab} setBudgetTab={setBudgetTab} filters={filters} setFilters={setFilters} budget={budget} goView={goView} />
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
                <Icon size={18} aria-hidden="true" />
                <span className="text-[10px] font-bold tracking-tight leading-none">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <MrTang tripContext={tripContext} today={todayISO} />
    </div>
  );
}
