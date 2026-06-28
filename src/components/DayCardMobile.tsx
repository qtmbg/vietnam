import { Calendar, Info, Moon, Sparkles } from "lucide-react";
import { SmartImage } from "./SmartImage";
import { ASSETS } from "../lib/assets";
import { accentColorForCity } from "../lib/city";
import { safeDateLabel } from "../lib/dates";
import type { ItineraryDay, Mood } from "../data/types";

export const DayCardMobile = ({
  day,
  coverSrc,
  mood,
}: {
  day: ItineraryDay;
  coverSrc: string;
  mood: Mood;
}) => {
  const isFatigue = mood === "fatigue";

  return (
    <div className="group relative w-full mb-8 last:mb-0">
      <SmartImage
        src={coverSrc}
        alt={day.city}
        fallback={ASSETS.covers.sections.itinerary}
        className="h-64 rounded-hero shadow-float"
        imgClassName="motion-safe:transition-transform motion-safe:group-hover:scale-110 duration-700"
        overlay={
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/25 to-transparent" />
            <div className="absolute bottom-7 left-7 right-7">
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={12} style={{ color: accentColorForCity(day.city) }} />
                <p className="text-[13px] font-semibold text-white/85 uppercase tracking-widest">{safeDateLabel(day.date)}</p>
              </div>
              <h4 className="font-display text-3xl text-white leading-none mb-3">{day.city}</h4>
              <div className="flex flex-wrap gap-1.5">
                {day.theme.map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/15 text-[13px] font-semibold text-white tracking-wide">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </>
        }
      />

      <div className="mt-6 px-4 space-y-4">
        {day.blocks.map((b, idx) => {
          if (isFatigue && b.label === "Soir" && !b.plan.toLowerCase().includes("repos")) {
            return (
              <div key={idx} className="p-4 rounded-3xl bg-brand-50/50 border border-brand-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600">
                  <Moon size={16} />
                </div>
                <p className="text-xs font-bold text-brand-700 italic">Repos suggéré ce soir 😴</p>
              </div>
            );
          }

          return (
            <div key={idx} className="relative pl-6 border-l-2 border-ink-100">
              <div className="absolute top-0 left-[-5px] w-2 h-2 rounded-full bg-ink-200" />
              <p className="text-[12px] font-black text-ink-400 uppercase tracking-widest mb-1">{b.label}</p>
              <p className="text-sm font-bold text-ink-800 leading-relaxed">{b.plan}</p>
              {b.links?.length ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {b.links.map((l, i) => (
                    <a
                      key={i}
                      href={l}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ink-100 text-[13px] font-extrabold text-ink-600"
                    >
                      <Info size={10} />
                      Lien
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {mood === "energy" && (
        <div className="mt-6 mx-4 p-4 rounded-3xl bg-sun-50 border border-sun-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-sun-100 flex items-center justify-center text-sun-600">
            <Sparkles size={16} />
          </div>
          <p className="text-xs font-bold text-sun-800">Énergie au max : un café caché + balade.</p>
        </div>
      )}
    </div>
  );
};
