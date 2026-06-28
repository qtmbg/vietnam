import { useState } from "react";
import { Segmented } from "../components/Segmented";
import { DayCardMobile } from "../components/DayCardMobile";
import { DayContext } from "../components/DayContext";
import { DayDetail, type DayDetailState } from "../components/DayDetail";
import { AskTang } from "../components/AskTang";
import { TRIP_DATA } from "../data/trip";
import { selectDay } from "../lib/day";
import { longDateLabel } from "../lib/dates";
import { dayCoverFromDay } from "../lib/assets";
import type { Mood, View } from "../data/types";

// Destination city of a day label ("Hanoi → Ninh Binh" → "Ninh Binh") — where
// you actually spend the day, so the day's Tang question points to the right place.
const dayDestCity = (label: string) => label.split("→").map((s) => s.trim()).filter(Boolean).pop() ?? label;

// The "Voyage" tab: one editorial column, day by day, each day in context via
// selectDay. Taps open the detail of the touched element.
export const VoyageView = ({
  mood,
  setMood,
  goView,
}: {
  mood: Mood;
  setMood: (m: Mood) => void;
  goView: (v: View) => void;
}) => {
  const [detail, setDetail] = useState<DayDetailState | null>(null);

  return (
    <div className="motion-safe:animate-fade-up px-7 pt-12">
      <div className="flex items-start justify-between gap-4 mb-9">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-600">Jour par jour</p>
          <h2 className="mt-1.5 font-display font-semibold text-[2.8rem] text-ink-900 leading-[0.9] tracking-[-0.02em]">Voyage</h2>
        </div>
        <button
          type="button"
          onClick={() => goView("home")}
          aria-label="Retour à l'accueil"
          className="shrink-0 mt-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-ink-600 active:text-ink-900 transition-colors"
        >
          ← Accueil
        </button>
      </div>

      <div className="mb-12">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-600 mb-3">Énergie du jour</p>
        <Segmented
          value={mood}
          onChange={(id) => setMood(id as Mood)}
          items={[
            { id: "fatigue", label: "Doux" },
            { id: "normal", label: "Normal" },
            { id: "energy", label: "À fond" },
          ]}
        />
      </div>

      <div className="pb-20">
        {TRIP_DATA.itinerary_days.map((day, i) => {
          const sel = selectDay(day.date);
          return (
            <div key={day.date} className="mb-16">
              <DayCardMobile day={day} coverSrc={dayCoverFromDay(day)} mood={mood} dayNumber={i + 1} dayTotal={TRIP_DATA.itinerary_days.length} />
              <div className="mt-6">
                <DayContext
                  day={sel}
                  onHotel={(hotel) => setDetail({ kind: "hotel", hotel })}
                  onActivity={(activity) => setDetail({ kind: "activity", activity })}
                  onTransfer={(expense) => setDetail({ kind: "transfer", expense })}
                />
              </div>
              <div className="mt-5">
                <AskTang question={`Que faire à ${dayDestCity(day.city)} le ${longDateLabel(day.date)} ?`} />
              </div>
            </div>
          );
        })}
      </div>

      <DayDetail detail={detail} onClose={() => setDetail(null)} />
    </div>
  );
};
