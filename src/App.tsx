import { useCallback, useEffect, useMemo, useState } from "react";
import { Home, Calendar, BookOpen, Map } from "lucide-react";

import { TangContext } from "./lib/tangCtx";
import { TRIP_DATA } from "./data/trip";
import type { Mood, View, TripMode } from "./data/types";
import { toISO, MS_DAY } from "./lib/dates";
import { computeBudget } from "./lib/budget";
import { selectDay } from "./lib/day";
import { buildTripContext } from "./lib/tripContext";

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

  // Which Guide sub-section is open (Cuisine / Vols / Budget / Infos / Conseils).
  const [guideTab, setGuideTab] = useState<GuideTab>(() => {
    const t = localStorage.getItem("trip_guide_tab");
    return t ? (t as GuideTab) : "cuisine";
  });

  // Persist
  useEffect(() => localStorage.setItem("trip_guide_tab", guideTab), [guideTab]);
  useEffect(() => localStorage.setItem("trip_mood", mood), [mood]);

  // ---- Trip window + mode ----
  const days = TRIP_DATA.itinerary_days;
  const todayISO = toISO(new Date());
  const firstDayISO = days[0].date;
  const lastDayISO = days[days.length - 1].date;
  const DEPART = TRIP_DATA.meta.flights.outbound.date; // 2026-07-24
  const tripLen = days.length;

  // Date-driven: prep before departure, travel during the trip.
  const mode: TripMode = todayISO < DEPART ? "prep" : "travel";

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

  const budget = useMemo(() => computeBudget(TRIP_DATA.expenses_usd, TRIP_DATA.hotels), []);
  const tripContext = useMemo(() => buildTripContext(todayISO), [todayISO]);

  const goView = (v: View) => {
    setView(v);
    requestAnimationFrame(() => window.scrollTo({ top: 0 }));
  };

  // Flights live inside Guide — this jumps straight to that section.
  const openFlights = useCallback(() => {
    setGuideTab("vols");
    setView("guide");
    requestAnimationFrame(() => window.scrollTo({ top: 0 }));
  }, []);

  const TabsList = [
    { id: "home", icon: Home, label: "Accueil" },
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
      {/* HOME — mode-driven accueil */}
      {view === "home" && (
        <HomeView
          mode={mode}
          daysToDeparture={daysToDeparture}
          dayNo={dayNo}
          tripLen={tripLen}
          currentDay={currentDay}
          firstCity={firstCity}
          goView={goView}
          openFlights={openFlights}
        />
      )}

      {/* VOYAGE — day by day, unified Day model */}
      {view === "voyage" && <VoyageView mood={mood} setMood={setMood} currentDayIndex={currentDayIndex} />}

      {/* GUIDE — cuisine + vols + budget + infos + conseils */}
      {view === "guide" && <GuideView tab={guideTab} setTab={setGuideTab} budget={budget} />}

      {/* CARTE */}
      {view === "carte" && <CarteView />}

      {/* MOBILE NAV — Accueil + 3 sections, floating clear of the system bar */}
      <nav
        aria-label="Navigation principale"
        className="fixed inset-x-0 z-[90] px-3 bottom-[calc(env(safe-area-inset-bottom)+0.75rem)]"
      >
        <div className="mx-auto max-w-md glass rounded-[2rem] p-1.5 flex items-stretch justify-between gap-1">
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
                className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 rounded-[1.4rem] transition-all duration-300 ${
                  active ? "bg-white text-clay-600 shadow-soft" : "text-ink-500 active:scale-95"
                }`}
              >
                <Icon size={21} aria-hidden="true" />
                <span className="text-[11px] font-semibold tracking-tight leading-none">{tab.label}</span>
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
