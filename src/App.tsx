import { useEffect, useMemo, useState } from "react";
import { Calendar, Wallet, BookOpen, Map } from "lucide-react";

import { TRIP_DATA } from "./data/trip";
import type { Mood, View, ModeOverride, TripMode } from "./data/types";
import { toISO, MS_DAY } from "./lib/dates";
import { computeBudget, type BudgetFilters, type BudgetTab } from "./lib/budget";
import { selectDay } from "./lib/day";
import { selectToSettle } from "./lib/prep";
import { buildTripContext } from "./lib/tripContext";

import { QuickSheet } from "./components/QuickSheet";
import { MrTang } from "./components/MrTang";
import { HomeView } from "./views/HomeView";
import { VoyageView } from "./views/VoyageView";
import { BudgetView } from "./views/BudgetView";
import { GuideView } from "./views/GuideView";
import { CarteView } from "./views/CarteView";

const baseCity = (label: string) => label.split("→").map((s) => s.trim())[0];

// ============================================================
// APP — orchestration: state, persistence, PREP/TRAVEL mode,
// 4-tab routing, bottom nav and the Mr. Tang concierge.
// ============================================================
export default function App() {
  const [view, setView] = useState<View>("home");
  const [mood, setMood] = useState<Mood>(() => {
    const m = localStorage.getItem("trip_mood");
    return m ? (m as Mood) : "normal";
  });
  const [quickOpen, setQuickOpen] = useState(false);
  // Discreet override to preview the other home mode.
  const [modeOverride, setModeOverride] = useState<ModeOverride>(() => {
    const o = localStorage.getItem("trip_mode_override");
    return o ? (o as ModeOverride) : "auto";
  });

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

  // Persist
  useEffect(() => localStorage.setItem("trip_budget_filters_v3", JSON.stringify(filters)), [filters]);
  useEffect(() => localStorage.setItem("trip_budget_tab_v3", budgetTab), [budgetTab]);
  useEffect(() => localStorage.setItem("trip_mood", mood), [mood]);
  useEffect(() => localStorage.setItem("trip_mode_override", modeOverride), [modeOverride]);

  // ---- Trip window + mode ----
  const days = TRIP_DATA.itinerary_days;
  const todayISO = toISO(new Date());
  const firstDayISO = days[0].date;
  const lastDayISO = days[days.length - 1].date;
  const DEPART = TRIP_DATA.meta.flights.outbound.date; // 2026-07-24
  const tripLen = days.length;

  const autoMode: TripMode = todayISO < DEPART ? "prep" : "travel";
  const mode: TripMode = modeOverride === "auto" ? autoMode : modeOverride;

  const daysToDeparture = Math.max(0, Math.ceil((+new Date(DEPART) - +new Date(todayISO)) / MS_DAY));

  // The "current day" of the trip — clamp today into the trip, then take the
  // last itinerary day on or before it (itinerary dates aren't consecutive).
  const refISO = todayISO < firstDayISO ? firstDayISO : todayISO > lastDayISO ? lastDayISO : todayISO;
  const currentDayIndex = useMemo(() => {
    let idx = 0;
    for (let i = 0; i < days.length; i++) {
      if (days[i].date <= refISO) idx = i;
    }
    return idx;
  }, [days, refISO]);
  const currentDayDate = days[currentDayIndex].date;
  const dayNo = currentDayIndex + 1;
  const currentDay = useMemo(() => selectDay(currentDayDate), [currentDayDate]);
  const firstCity = baseCity(days[0].city);

  // Strictly AFTER the current day, so it isn't the same transfer already
  // shown inside the current day's context.
  const nextTransfer = useMemo(
    () =>
      TRIP_DATA.expenses_usd
        .filter((e) => e.category === "transport" && e.date && e.date > currentDayDate)
        .sort((a, b) => (a.date! < b.date! ? -1 : 1))[0] ?? null,
    [currentDayDate]
  );

  const toSettle = useMemo(() => selectToSettle(TRIP_DATA.expenses_usd, TRIP_DATA.hotels), []);
  const budget = useMemo(() => computeBudget(TRIP_DATA.expenses_usd, filters), [filters]);
  const tripContext = useMemo(() => buildTripContext(todayISO), [todayISO]);

  const goView = (v: View) => {
    setView(v);
    requestAnimationFrame(() => window.scrollTo({ top: 0 }));
  };

  const TabsList = [
    { id: "voyage", icon: Calendar, label: "Voyage" },
    { id: "budget", icon: Wallet, label: "Budget" },
    { id: "guide", icon: BookOpen, label: "Guide" },
    { id: "carte", icon: Map, label: "Carte" },
  ] as const;

  return (
    <div className="min-h-screen bg-app font-sans text-ink-900 pb-36 overflow-x-clip">
      <QuickSheet open={quickOpen} onClose={() => setQuickOpen(false)} onGoto={(v) => setView(v)} />

      {/* HOME — mode-driven accueil */}
      {view === "home" && (
        <HomeView
          mode={mode}
          override={modeOverride}
          setOverride={setModeOverride}
          onOpenQuick={() => setQuickOpen(true)}
          daysToDeparture={daysToDeparture}
          dayNo={dayNo}
          tripLen={tripLen}
          currentDay={currentDay}
          firstCity={firstCity}
          toSettle={toSettle}
          nextTransfer={nextTransfer}
          goView={goView}
        />
      )}

      {/* VOYAGE — day by day, unified Day model */}
      {view === "voyage" && <VoyageView mood={mood} setMood={setMood} goView={goView} />}

      {/* BUDGET */}
      {view === "budget" && (
        <BudgetView budgetTab={budgetTab} setBudgetTab={setBudgetTab} filters={filters} setFilters={setFilters} budget={budget} goView={goView} />
      )}

      {/* GUIDE — food + vols + aéroports + phrases + conseils */}
      {view === "guide" && <GuideView goView={goView} />}

      {/* CARTE */}
      {view === "carte" && <CarteView goView={goView} />}

      {/* MOBILE NAV — 4 tabs */}
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
