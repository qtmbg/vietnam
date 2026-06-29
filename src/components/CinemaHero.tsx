import { SmartImage } from "./SmartImage";
import { ASSETS } from "../lib/assets";

// Cover: full-bleed graded photo with reading gradients,
// masthead + "Index" text link, asymmetric title block with the countdown /
// day treated as display typography. No glass pill, no accent chip, no icons.
export const CinemaHero = ({
  activeCity,
  coverSrc,
  daysTo,
  dayNo,
  tripLen,
  isWithinTrip,
}: {
  activeCity: string;
  coverSrc?: string;
  daysTo: number;
  dayNo: number;
  tripLen: number;
  isWithinTrip: boolean;
}) => {
  const src = coverSrc || ASSETS.covers.sections.home;

  return (
    <section className="relative h-[88vh] w-full bg-ink-950 overflow-hidden">
      <SmartImage
        src={src}
        alt={`Vietnam — ${activeCity}`}
        fallback={ASSETS.covers.sections.home}
        eager
        className="absolute inset-0 h-full w-full"
        overlay={
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/25 to-ink-950/10" />
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink-950/55 to-transparent" />
          </>
        }
      />

      {/* Masthead */}
      <div className="absolute inset-x-0 top-0 px-7 pt-14">
        <p className="text-[11px] font-medium uppercase tracking-[0.34em] text-surface-50/75">Carnet de voyage</p>
        <div className="mt-2.5 h-px w-10 bg-surface-50/40" />
      </div>

      {/* Title block */}
      <div className="absolute inset-x-0 bottom-0 px-7 pb-12">
        {/* Countdown / day as a display figure with a magazine caption */}
        <div className="mb-5 inline-flex items-baseline gap-3 glass-on-photo rounded-[1.25rem] px-4 py-2.5">
          {isWithinTrip ? (
            <>
              <span className="font-display text-surface-50 text-[clamp(2.4rem,12vw,3.4rem)] leading-none tabular-nums">
                {String(dayNo).padStart(2, "0")}
              </span>
              <span className="pb-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-surface-50/65 leading-tight">
                Jour
                <br />/ {tripLen}
              </span>
            </>
          ) : daysTo > 0 ? (
            <>
              <span className="font-display text-surface-50 text-[clamp(2.4rem,12vw,3.4rem)] leading-none tabular-nums">{daysTo}</span>
              <span className="pb-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-surface-50/65 leading-tight">
                jours avant
                <br />le départ
              </span>
            </>
          ) : (
            <span className="font-display italic text-surface-50/90 text-2xl leading-none">De retour</span>
          )}
        </div>

        <h1 className="font-display font-semibold text-surface-50 text-[clamp(3.6rem,19vw,5.6rem)] leading-[0.82] tracking-[-0.02em]">
          Vietnam
        </h1>

        <div className="mt-6 h-px w-full bg-surface-50/25" />
        <div className="mt-4 flex items-center justify-between gap-4">
          <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-surface-50/75">24 juillet – 18 août 2026</p>
          <p className="shrink-0 text-[12px] font-medium uppercase tracking-[0.2em] text-surface-50/55">{activeCity}</p>
        </div>
      </div>
    </section>
  );
};
