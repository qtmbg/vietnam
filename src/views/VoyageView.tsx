import { useState } from "react";
import { X, Moon, Star, Sparkles } from "lucide-react";
import { Segmented } from "../components/Segmented";
import { DayCardMobile } from "../components/DayCardMobile";
import { DayContext } from "../components/DayContext";
import { DayDetail, type DayDetailState } from "../components/DayDetail";
import { TRIP_DATA } from "../data/trip";
import { selectDay } from "../lib/day";
import { dayCoverFromDay } from "../lib/assets";
import type { Mood, View } from "../data/types";

// The "Voyage" tab: one column, day by day, each day showing everything in
// context via selectDay. Taps open the detail of the touched element.
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
    <div className="motion-safe:animate-fade-up px-6 pt-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="font-display text-[2.5rem] text-ink-900 leading-none mb-1">Voyage</h2>
          <p className="text-xs font-bold text-ink-400 uppercase tracking-widest">Jour par jour, en contexte</p>
        </div>
        <button type="button" onClick={() => goView("home")} aria-label="Retour à l'accueil" className="w-10 h-10 rounded-full bg-ink-100 flex items-center justify-center text-ink-500 active:scale-90 transition-transform">
          <X size={20} />
        </button>
      </div>

      <div className="mb-10">
        <p className="text-[13px] font-black text-ink-400 uppercase tracking-widest mb-3 ml-1">Énergie du jour</p>
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

      <div className="pb-20">
        {TRIP_DATA.itinerary_days.map((day) => {
          const sel = selectDay(day.date);
          return (
            <div key={day.date} className="mb-12">
              <DayCardMobile day={day} coverSrc={dayCoverFromDay(day)} mood={mood} />
              <div className="mt-5 px-1">
                <DayContext
                  day={sel}
                  onHotel={(hotel) => setDetail({ kind: "hotel", hotel })}
                  onActivity={(activity) => setDetail({ kind: "activity", activity })}
                  onTransfer={(expense) => setDetail({ kind: "transfer", expense })}
                />
              </div>
            </div>
          );
        })}
      </div>

      <DayDetail detail={detail} onClose={() => setDetail(null)} />
    </div>
  );
};
