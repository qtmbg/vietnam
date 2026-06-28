import { useCallback, useEffect, useMemo, useState } from "react";
import { Calendar, BookOpen, Map } from "lucide-react";

import { TangContext } from "./lib/tangCtx";
import { TRIP_DATA } from "./data/trip";
import type { Mood, View, ModeOverride, TripMode } from "./data/types";
import { toISO, MS_DAY } from "./lib/dates";
import { computeBudget } from "./lib/budget";
import { selectDay } from "./lib/day";
import { selectToSettle } from "./lib/prep";
import { buildTripContext } from "./lib/tripContext";

import { QuickSheet } from "./components/QuickSheet";
import { MrTang } from "./components/MrTang";
import { HomeView } from "./views/HomeView";
import { VoyageView } from "./views/VoyageView";
import { GuideView, type GuideTab } from "./views/GuideView";
import { CarteView } from "./views/CarteView";

const baseCity = (label: string) => label.split("→").map((s) => s.trim())[0];

// ============================================================
// APP — orchestration: state, persistence, PREP/TRAVEL mode,
// 3-tab routing (budget folded into Guide) and the Mr. Tang concierge.
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

  // Which Guide sub-section is open (Cuisine / Vols / Budget / Infos / Conseils).
  const [guideTab, setGuideTab] = useState<GuideTab>(() => {
    const t = localStorage.getItem("trip_guide_tab");
    return t ? (t as GuideTab) : "cuisine";
  });

  // Persist
  useEffect(() => localStorage.setItem("trip_guide_tab", guideTab), [guideTab]);
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
  const budget = useMemo(() => computeBudget(TRIP_DATA.expenses_usd), []);
  const tripContext = useMemo(() => buildTripContext(todayISO), [todayISO]);

  const goView = (v: View) => {
    setView(v);
    requestAnimationFrame(() => window.scrollTo({ top: 0 }));
  };

  // Budget now lives inside Guide — this jumps straight to its section.
  const openBudget = useCallback(() => {
    setGuideTab("budget");
    setView("guide");
    requestAnimationFrame(() => window.scrollTo({ top: 0 }));
  }, []);

  const TabsList = [
    { id: "voyage", icon: Calendar, label: "Voyage" },
    { id: "guide", icon: BookOpen, label: "Guide" },
    { id: "carte", icon: Map, label: "Carte" },
  ] as const;

  // Mr. Tang open/prefill — lets any card invoke him with a question ready.
  const [tangOpen, setTangOpen] = useState(false);
  const [tangPrefill, setTangPrefill] = useState("");
  const openTang = useCallback((p = "") => {
    setTangPrefill(p);
    setTangOpen(true);
  }, []);
  const closeTang = useCallback(() => setTangOpen(false), []);

  return (
    <TangContext.Provider value={{ open: tangOpen, prefill: tangPrefill, openTang, closeTang }}>
    <div className="min-h-screen bg-app font-sans text-ink-900 pb-36 overflow-x-clip">
      <QuickSheet open={quickOpen} onClose={() => setQuickOpen(false)} onGoto={(v) => setView(v)} onBudget={openBudget} />

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
          openBudget={openBudget}
        />
      )}

      {/* VOYAGE — day by day, unified Day model */}
      {view === "voyage" && <VoyageView mood={mood} setMood={setMood} goView={goView} />}

      {/* GUIDE — cuisine + vols + budget + infos + conseils */}
      {view === "guide" && <GuideView tab={guideTab} setTab={setGuideTab} budget={budget} goView={goView} />}

      {/* CARTE */}
      {view === "carte" && <CarteView goView={goView} />}

      {/* MOBILE NAV — 3 tabs, floating clear of the system bar */}
      <nav
        aria-label="Navigation principale"
        className="fixed inset-x-0 z-[90] px-3 bottom-[calc(env(safe-area-inset-bottom)+0.75rem)]"
      >
        <div className="mx-auto max-w-md backdrop-blur-2xl bg-ink-900/95 rounded-[2rem] border border-white/10 p-1.5 flex items-stretch justify-between gap-1 shadow-float">
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
                className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 rounded-2xl transition-all duration-300 ${
                  active ? "bg-white text-ink-900 shadow-float" : "text-white/60 active:scale-90"
                }`}
              >
                <Icon size={20} aria-hidden="true" />
                <span className="text-[11px] font-bold tracking-tight leading-none">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <MrTang tripContext={tripContext} today={todayISO} />
    </div>
    </TangContext.Provider>
  );
}
