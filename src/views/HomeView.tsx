import type { Dispatch, SetStateAction } from "react";
import { ArrowRight, ChevronRight, ChevronLeft, Plane, Car, Moon, Star, Sparkles, Wallet } from "lucide-react";
import { CinemaHero } from "../components/CinemaHero";
import { SmartImage } from "../components/SmartImage";
import { Glass } from "../components/Glass";
import { Segmented } from "../components/Segmented";
import { FamilyStrip } from "../components/FamilyStrip";
import { DayCardMobile } from "../components/DayCardMobile";
import { TRIP_DATA, FAMILY_MEMBERS } from "../data/trip";
import { cityCoverFromLabel, dayCoverFromDay } from "../lib/assets";
import { safeDateLabel } from "../lib/dates";
import { clamp } from "../lib/utils";
import type { ItineraryDay, ExpenseItemUSD, Mood, View } from "../data/types";

export const HomeView = ({
  onOpenQuick,
  activeCity,
  daysTo,
  dayNo,
  tripLen,
  isWithinTrip,
  todayDay,
  todayIndex,
  nextTransfer,
  mood,
  setMood,
  focusDay,
  focusDayIndex,
  setFocusDayIndex,
  lastDay,
  setCityFromFocus,
  goView,
}: {
  onOpenQuick: () => void;
  activeCity: string;
  daysTo: number;
  dayNo: number;
  tripLen: number;
  isWithinTrip: boolean;
  todayDay: ItineraryDay;
  todayIndex: number;
  nextTransfer: ExpenseItemUSD | null;
  mood: Mood;
  setMood: (m: Mood) => void;
  focusDay: ItineraryDay;
  focusDayIndex: number;
  setFocusDayIndex: Dispatch<SetStateAction<number>>;
  lastDay: number;
  setCityFromFocus: () => void;
  goView: (v: View) => void;
}) => (
  <div key="home" className="motion-safe:animate-fade-up">
    <CinemaHero
      onOpenQuick={onOpenQuick}
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
            <p className="text-[13px] font-bold uppercase tracking-widest text-jade-600">
              {isWithinTrip ? "Aujourd'hui" : "Prochainement"}
            </p>
          </div>
          <p className="text-[13px] font-semibold text-ink-400">
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
            <p className="text-[13px] font-bold uppercase tracking-widest text-ink-400">{safeDateLabel(todayDay.date)}</p>
            <p className="font-display text-xl text-ink-900 leading-tight truncate">{todayDay.city}</p>
            <p className="text-[13px] font-medium text-ink-500 truncate">{todayDay.blocks[0]?.plan}</p>
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
              <p className="text-[13px] font-bold uppercase tracking-widest text-ink-400">
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

      {/* Vos vols */}
      <button
        type="button"
        onClick={() => goView("flights")}
        className="w-full text-left bg-white rounded-card border border-ink-100 shadow-card p-5 flex items-center gap-4 active:scale-[.99] transition-transform"
      >
        <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
          <Plane size={22} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[12px] font-bold uppercase tracking-widest text-ink-400">Vos vols</p>
          <p className="text-base font-bold text-ink-900 leading-tight">Marrakech → Hanoi · retour le 17 août</p>
          <p className="text-[13px] font-semibold text-jade-600">+ 4 vols internes · confirmés &amp; payés ✓</p>
        </div>
        <ChevronRight size={18} className="text-ink-300 shrink-0" />
      </button>

      {/* Énergie / mood */}
      <div>
        <p className="text-[13px] font-bold uppercase tracking-widest text-ink-400 mb-3 ml-1">Énergie du jour</p>
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

      {/* Équipage */}
      <div>
        <div className="mb-4">
          <h3 className="font-display text-3xl text-ink-900 leading-none">Équipage</h3>
          <p className="text-xs font-semibold text-ink-400 italic">Les aventuriers</p>
        </div>
        <FamilyStrip members={FAMILY_MEMBERS} />
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
            (e.currentTarget as HTMLDivElement & { _swipeX?: number })._swipeX = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            const startX = (e.currentTarget as HTMLDivElement & { _swipeX?: number })._swipeX ?? null;
            if (startX === null) return;
            const delta = e.changedTouches[0].clientX - startX;
            if (Math.abs(delta) > 50) {
              setFocusDayIndex((i) => clamp(i + (delta < 0 ? 1 : -1), 0, lastDay));
            }
          }}
        >
          <div key={focusDayIndex} className="motion-safe:animate-fade-up">
            <DayCardMobile day={focusDay} coverSrc={dayCoverFromDay(focusDay)} mood={mood} />
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
          <p className="text-[13px] font-semibold text-jade-600">Par ville</p>
        </button>
        <button
          type="button"
          onClick={() => goView("budget")}
          className="p-6 rounded-card bg-sun-50 border border-sun-100 text-left active:scale-[.98] transition-transform"
        >
          <Wallet size={24} className="text-sun-600 mb-4" />
          <p className="text-sm font-bold text-ink-900">Budget</p>
          <p className="text-[13px] font-semibold text-sun-600">USD</p>
        </button>
      </div>
    </div>
  </div>
);
