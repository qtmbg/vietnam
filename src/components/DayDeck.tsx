import { useLayoutEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayDeckCard } from "./DayDeckCard";
import { DayContext } from "./DayContext";
import { DayDetail, type DayDetailState } from "./DayDetail";
import { DetailSheet } from "./DetailSheet";
import { selectDay, type DaySelection } from "../lib/day";
import { dayCoverFromDay } from "../lib/assets";
import { safeDateLabel } from "../lib/dates";
import type { ItineraryDay } from "../data/types";

const reducedMotion = () => typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const baseCity = (label: string) => label.split("→").map((s) => s.trim())[0];

// The day-by-day DECK: one full card per day, swiped horizontally (scroll-snap,
// no JS lib). Opens on the current day with no tap. Dots jump, arrows back up.
export const DayDeck = ({ days, startIndex }: { days: ItineraryDay[]; startIndex: number }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(startIndex);
  const [practical, setPractical] = useState<{ day: ItineraryDay; sel: DaySelection } | null>(null);
  const [detail, setDetail] = useState<DayDetailState | null>(null);

  // Arrive on the current day automatically, before paint (no flash, no scroll
  // animation). `index` already initialises to startIndex, so no setState here.
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollLeft = startIndex * el.clientWidth;
  }, [startIndex]);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    setIndex((prev) => (i !== prev ? i : prev));
  };

  const goTo = (i: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(days.length - 1, i));
    el.scrollTo({ left: clamped * el.clientWidth, behavior: reducedMotion() ? "auto" : "smooth" });
  };

  // Each activity is surfaced once, at its first stop (no day-to-day repeats).
  const seen = new Set<string>();
  const sels = days.map((d) => {
    const s = selectDay(d.date);
    const activities = s.activities.filter((a) => !seen.has(a.id));
    activities.forEach((a) => seen.add(a.id));
    return { ...s, activities };
  });

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="flex h-[68vh] snap-x snap-mandatory overflow-x-auto overscroll-x-contain no-scrollbar"
      >
        {days.map((day, i) => (
          <div key={day.date} className="snap-center shrink-0 w-full h-full px-1.5">
            <DayDeckCard
              day={day}
              dayNumber={i + 1}
              dayTotal={days.length}
              coverSrc={dayCoverFromDay(day)}
              onOpenPractical={() => setPractical({ day, sel: sels[i] })}
            />
          </div>
        ))}
      </div>

      {/* Backup arrows — large, tactile */}
      {index > 0 && (
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          aria-label="Jour précédent"
          className="absolute left-0 top-[23%] w-11 h-11 rounded-full bg-white/90 shadow-card ring-1 ring-ink-200 flex items-center justify-center active:scale-90 transition-transform"
        >
          <ChevronLeft size={22} className="text-ink-700" aria-hidden="true" />
        </button>
      )}
      {index < days.length - 1 && (
        <button
          type="button"
          onClick={() => goTo(index + 1)}
          aria-label="Jour suivant"
          className="absolute right-0 top-[23%] w-11 h-11 rounded-full bg-white/90 shadow-card ring-1 ring-ink-200 flex items-center justify-center active:scale-90 transition-transform"
        >
          <ChevronRight size={22} className="text-ink-700" aria-hidden="true" />
        </button>
      )}

      {/* Position dots — also the compact jump index */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {days.map((d, i) => (
          <button
            key={d.date}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Aller au jour ${i + 1}`}
            aria-current={i === index ? "true" : undefined}
            className={`h-2 rounded-full transition-all duration-300 ${i === index ? "w-6 bg-clay-600" : "w-2 bg-ink-300 active:bg-ink-400"}`}
          />
        ))}
      </div>

      {/* Détails pratiques — dense, on demand */}
      <DetailSheet
        open={!!practical}
        title={practical ? `Jour ${days.indexOf(practical.day) + 1} · ${baseCity(practical.day.city)}` : ""}
        onClose={() => setPractical(null)}
      >
        {practical && (
          <div className="space-y-7">
            <section>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500 mb-2">Programme</p>
              <div className="border-t border-ink-200">
                {practical.day.blocks.map((b, i) => (
                  <div key={i} className="py-3 border-b border-ink-200 flex gap-4">
                    <span className="w-[4.5rem] shrink-0 pt-0.5 text-[12px] font-semibold uppercase tracking-[0.1em] text-ink-600">{b.label}</span>
                    <p className="flex-1 text-[15px] text-ink-800 leading-relaxed">{b.plan}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500 mb-2">
                Logistique · {safeDateLabel(practical.day.date)}
              </p>
              <DayContext
                day={practical.sel}
                onHotel={(hotel) => setDetail({ kind: "hotel", hotel })}
                onActivity={(activity) => setDetail({ kind: "activity", activity })}
                onTransfer={(expense) => setDetail({ kind: "transfer", expense })}
              />
            </section>
          </div>
        )}
      </DetailSheet>

      <DayDetail detail={detail} onClose={() => setDetail(null)} />
    </div>
  );
};
