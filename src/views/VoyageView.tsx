import { Segmented } from "../components/Segmented";
import { DayDeck } from "../components/DayDeck";
import { TRIP_DATA } from "../data/trip";
import { MOOD_THEME } from "../lib/mood";
import type { Mood } from "../data/types";

// The "Voyage" tab is a swipeable DECK of full day cards. It opens on the
// current day; one swipe moves to the next. Mood tints the page ambiance.
export const VoyageView = ({
  mood,
  setMood,
  currentDayIndex,
}: {
  mood: Mood;
  setMood: (m: Mood) => void;
  currentDayIndex: number;
}) => {
  const moodTheme = MOOD_THEME[mood];

  return (
    <div className="relative motion-safe:animate-fade-up pt-9">
      {/* Mood ambiance — a soft colour wash that changes with the energy level. */}
      <div
        key={mood}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[460px] -z-10 motion-safe:animate-fade-up"
        style={{ background: `radial-gradient(95% 100% at 50% 0%, ${moodTheme.wash} 0%, transparent 72%)` }}
      />

      <div className="px-7 mb-5">
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
        <p className="mt-3 text-[15px] leading-snug">
          <span className="font-semibold" style={{ color: moodTheme.tint }}>{moodTheme.label}.</span>{" "}
          <span className="text-ink-700">{moodTheme.tagline}</span>
        </p>
      </div>

      <div className="px-4 pb-8">
        <DayDeck days={TRIP_DATA.itinerary_days} startIndex={currentDayIndex} />
      </div>
    </div>
  );
};
