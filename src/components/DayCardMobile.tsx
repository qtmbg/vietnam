import { SmartImage } from "./SmartImage";
import { ASSETS } from "../lib/assets";
import { safeDateLabel } from "../lib/dates";
import type { ItineraryDay, Mood } from "../data/types";

// Editorial day spread: graded photo with the day number in display type, the
// city in Fraunces, theme as small-caps, and the schedule as a ruled list.
export const DayCardMobile = ({
  day,
  coverSrc,
  mood,
  dayNumber,
}: {
  day: ItineraryDay;
  coverSrc: string;
  mood: Mood;
  dayNumber?: number;
}) => {
  const isFatigue = mood === "fatigue";

  return (
    <article className="motion-safe:animate-rise-in">
      <div className="relative overflow-hidden rounded-[3px]">
        <SmartImage
          src={coverSrc}
          alt={day.city}
          fallback={ASSETS.covers.sections.itinerary}
          className="h-80"
          overlay={<div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/20 to-ink-950/5" />}
        />
        <div className="absolute inset-x-0 bottom-0 p-6">
          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-sand-50/75">{safeDateLabel(day.date)}</p>
              <h3 className="font-display font-light text-sand-50 text-[2.5rem] leading-[0.9] tracking-[-0.01em]">{day.city}</h3>
            </div>
            {dayNumber != null && (
              <span className="shrink-0 font-display text-sand-50/90 text-[3.2rem] leading-none tabular-nums">{String(dayNumber).padStart(2, "0")}</span>
            )}
          </div>
          {day.theme.length > 0 && (
            <p className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px] font-medium uppercase tracking-[0.2em] text-sand-50/65">
              {day.theme.map((t, i) => (
                <span key={t} className="flex items-center gap-3">
                  {i > 0 && <span className="text-sand-50/30">/</span>}
                  {t}
                </span>
              ))}
            </p>
          )}
        </div>
      </div>

      {/* Schedule */}
      <div className="mt-6 border-t border-ink-200">
        {day.blocks.map((b, idx) => {
          const rest = isFatigue && b.label === "Soir" && !b.plan.toLowerCase().includes("repos");
          return (
            <div key={idx} className="py-4 border-b border-ink-200 flex gap-4">
              <span className="w-[4.5rem] shrink-0 pt-0.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-500">{b.label}</span>
              {rest ? (
                <p className="flex-1 font-display italic text-[15px] text-ink-500 leading-relaxed">Repos suggéré ce soir.</p>
              ) : (
                <div className="flex-1">
                  <p className="text-[15px] text-ink-800 leading-relaxed">{b.plan}</p>
                  {b.links?.length ? (
                    <div className="mt-2 flex flex-wrap gap-x-4">
                      {b.links.map((l, i) => (
                        <a
                          key={i}
                          href={l}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[12px] font-semibold uppercase tracking-[0.14em] text-clay-600 underline underline-offset-4 decoration-clay-300"
                        >
                          Lien
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {mood === "energy" && (
        <p className="mt-4 pl-3 border-l-2 border-clay-300 font-display italic text-[15px] text-ink-500 leading-relaxed">
          Énergie au max : un café caché, puis une balade.
        </p>
      )}
    </article>
  );
};
