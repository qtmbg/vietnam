import { SmartImage } from "./SmartImage";
import { ASSETS } from "../lib/assets";
import { safeDateLabel } from "../lib/dates";
import type { ItineraryDay, Mood } from "../data/types";

// Day spread: graded photo with a glass info panel (clear "Jour x / total" +
// date + city), then the schedule on a clean white card.
export const DayCardMobile = ({
  day,
  coverSrc,
  mood,
  dayNumber,
  dayTotal,
}: {
  day: ItineraryDay;
  coverSrc: string;
  mood: Mood;
  dayNumber?: number;
  dayTotal?: number;
}) => {
  const isFatigue = mood === "fatigue";

  return (
    <article className="motion-safe:animate-rise-in">
      <div className="relative overflow-hidden rounded-hero shadow-card">
        <SmartImage
          src={coverSrc}
          alt={day.city}
          fallback={ASSETS.covers.sections.itinerary}
          className="h-80"
          overlay={<div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/15 to-transparent" />}
        />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="glass-on-photo rounded-[1.25rem] px-4 py-3.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sand-50/85">
              {dayNumber != null ? `Jour ${dayNumber}${dayTotal ? ` / ${dayTotal}` : ""} · ` : ""}
              {safeDateLabel(day.date)}
            </p>
            <h3 className="mt-1 font-display font-semibold text-sand-50 text-[2rem] leading-[0.98] tracking-[-0.01em]">{day.city}</h3>
            {day.theme.length > 0 && (
              <p className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10.5px] font-medium uppercase tracking-[0.16em] text-sand-50/70">
                {day.theme.map((t, i) => (
                  <span key={t} className="flex items-center gap-2.5">
                    {i > 0 && <span className="text-sand-50/35">·</span>}
                    {t}
                  </span>
                ))}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Schedule */}
      <div className="mt-4 rounded-card border border-ink-200 bg-sand-50 shadow-soft px-5 py-1.5">
        {day.blocks.map((b, idx) => {
          const rest = isFatigue && b.label === "Soir" && !b.plan.toLowerCase().includes("repos");
          const last = idx === day.blocks.length - 1;
          return (
            <div key={idx} className={`py-4 flex gap-4 ${last ? "" : "border-b border-ink-200"}`}>
              <span className="w-[4.5rem] shrink-0 pt-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-500">{b.label}</span>
              {rest ? (
                <p className="flex-1 italic text-[16px] text-ink-500 leading-relaxed">Repos suggéré ce soir.</p>
              ) : (
                <div className="flex-1">
                  <p className="text-[16px] text-ink-800 leading-relaxed">{b.plan}</p>
                  {b.links?.length ? (
                    <div className="mt-2 flex flex-wrap gap-x-4">
                      {b.links.map((l, i) => (
                        <a
                          key={i}
                          href={l}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[12px] font-semibold uppercase tracking-[0.12em] text-clay-600 underline underline-offset-4 decoration-clay-300"
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
        <p className="mt-4 pl-3.5 border-l-2 border-clay-300 italic text-[16px] text-ink-600 leading-relaxed">
          Énergie au max : un café caché, puis une balade.
        </p>
      )}
    </article>
  );
};
