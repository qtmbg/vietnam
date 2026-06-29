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
import { MOOD_THEME } from "../lib/mood";
import type { Mood } from "../data/types";

// Destination city of a day label ("Hanoi → Ninh Binh" → "Ninh Binh") — where
// you actually spend the day, so the day's Tang question points to the right place.
const dayDestCity = (label: string) => label.split("→").map((s) => s.trim()).filter(Boolean).pop() ?? label;

// The "Voyage" tab: one editorial column, day by day, each day in context via
// selectDay. Taps open the detail of the touched element.
export const VoyageView = ({
  mood,
  setMood,
}: {
  mood: Mood;
  setMood: (m: Mood) => void;
}) => {
  const [detail, setDetail] = useState<DayDetailState | null>(null);
  const moodTheme = MOOD_THEME[mood];

  // Activities are city-level OPTIONS, not date-locked — so each one is shown
  // once, on the first day of its stop, instead of repeating on every day in
  // the same city (which read like an error).
  const seenActivities = new Set<string>();

  return (
    <div className="relative motion-safe:animate-fade-up px-7 pt-12">
      {/* Mood ambiance — a soft colour wash that changes with the energy level. */}
      <div
        key={mood}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[480px] -z-10 motion-safe:animate-fade-up"
        style={{ background: `radial-gradient(95% 100% at 50% 0%, ${moodTheme.wash} 0%, transparent 72%)` }}
      />
      <div className="mb-9">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-600">Jour par jour</p>
        <h2 className="mt-1.5 font-display font-semibold text-[2.8rem] text-ink-900 leading-[0.9] tracking-[-0.02em]">Voyage</h2>
      </div>

      <div className="mb-12">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-600 mb-3">Énergie du jour</p>
        <Segmented
          value={mood}
          onChange={(id) => setMood(id as Mood)}
          accent={moodTheme.tint}
          items={[
            { id: "fatigue", label: "Doux" },
            { id: "normal", label: "Normal" },
            { id: "energy", label: "À fond" },
          ]}
        />
        <p className="mt-3 text-[14px] leading-snug">
          <span className="font-semibold" style={{ color: moodTheme.tint }}>{moodTheme.label}.</span>{" "}
          <span className="text-ink-600">{moodTheme.tagline}</span>
        </p>
      </div>

      <div className="pb-20">
        {TRIP_DATA.itinerary_days.map((day, i) => {
          const sel = selectDay(day.date);
          // Keep only activities not already surfaced on an earlier day.
          const activities = sel.activities.filter((a) => !seenActivities.has(a.id));
          activities.forEach((a) => seenActivities.add(a.id));
          return (
            <div key={day.date} className="mb-16">
              <DayCardMobile day={day} coverSrc={dayCoverFromDay(day)} mood={mood} dayNumber={i + 1} dayTotal={TRIP_DATA.itinerary_days.length} />
              <div className="mt-6">
                <DayContext
                  day={{ ...sel, activities }}
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
