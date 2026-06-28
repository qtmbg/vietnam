import { Search, Compass } from "lucide-react";
import { SmartImage } from "./SmartImage";
import { ASSETS } from "../lib/assets";
import { accentColorForCity } from "../lib/city";

export const CinemaHero = ({
  onOpenQuick,
  activeCity,
  coverSrc,
  daysTo,
  dayNo,
  tripLen,
  isWithinTrip,
}: {
  onOpenQuick: () => void;
  activeCity: string;
  coverSrc?: string;
  daysTo: number;
  dayNo: number;
  tripLen: number;
  isWithinTrip: boolean;
}) => {
  const src = coverSrc || ASSETS.covers.sections.home;
  const accentColor = accentColorForCity(activeCity);
  return (
    <div className="relative h-[80vh] w-full bg-ink-950">
      <SmartImage
        src={src}
        alt={`Vietnam — ${activeCity}`}
        fallback={ASSETS.covers.sections.home}
        eager
        className="absolute inset-0 h-full w-full"
        overlay={
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-ink-950/10" />
            <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-ink-950/60 to-transparent" />
          </>
        }
      />

      <div className="absolute inset-0 flex flex-col justify-between px-6 pt-14 pb-10">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-white/55 mb-2">24 juil → 18 août 2026</p>
            <div className="inline-flex items-baseline gap-2 px-4 py-2 rounded-full bg-jade-500/15 ring-1 ring-jade-400/30 backdrop-blur-md">
              {isWithinTrip ? (
                <>
                  <span className="font-display text-2xl text-jade-300 tabular-nums leading-none">Jour {dayNo}</span>
                  <span className="text-[13px] font-semibold text-white/60 uppercase tracking-widest">/ {tripLen}</span>
                </>
              ) : daysTo > 0 ? (
                <>
                  <span className="font-display text-[28px] text-jade-300 tabular-nums leading-none">J−{daysTo}</span>
                  <span className="text-[13px] font-semibold text-white/60 uppercase tracking-widest">avant le départ</span>
                </>
              ) : (
                <span className="font-display text-xl text-jade-300 leading-none">De retour ✨</span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenQuick}
            aria-label="Recherche et accès rapide"
            className="shrink-0 w-11 h-11 rounded-full bg-white/15 backdrop-blur-md ring-1 ring-white/25 flex items-center justify-center text-white active:scale-90 transition-transform"
          >
            <Search size={20} />
          </button>
        </div>

        <div>
          <p className="text-[13px] font-semibold uppercase tracking-[0.3em] text-white/70 mb-2">Carnet de voyage famille</p>
          <h1 className="font-display text-[clamp(3.5rem,18vw,5rem)] leading-[0.82] text-white tracking-tight mb-5">Vietnam</h1>
          <div className="flex items-center gap-2">
            <Compass size={15} className="text-white/50" />
            <p className="text-[13px] font-semibold text-white/55 uppercase tracking-widest">Focus</p>
            <span
              className="inline-flex px-3 py-1.5 rounded-full text-sm font-semibold backdrop-blur-md bg-white/15 ring-1 ring-white/25"
              style={{ color: accentColor }}
            >
              {activeCity}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
