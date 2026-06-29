import { Bed, UtensilsCrossed, Sailboat, Bus, Plane, Umbrella, Landmark, Mountain, ShoppingBasket, Sparkles, Footprints, Coffee, ChevronRight, type LucideIcon } from "lucide-react";
import { SmartImage } from "./SmartImage";
import { ASSETS } from "../lib/assets";
import { safeDateLabel } from "../lib/dates";
import { dayEssence, dayMoments, SLOT_LABEL, type MomentKind } from "../lib/moments";
import type { ItineraryDay } from "../data/types";

// One constant pictogram per moment kind — kids read the day by icons alone.
const KIND_ICON: Record<MomentKind, LucideIcon> = {
  sleep: Bed,
  eat: UtensilsCrossed,
  boat: Sailboat,
  transfer: Bus,
  flight: Plane,
  beach: Umbrella,
  culture: Landmark,
  nature: Mountain,
  market: ShoppingBasket,
  show: Sparkles,
  walk: Footprints,
  coffee: Coffee,
};

// A full-screen, glanceable day card for the deck. Default layer = image +
// huge city + day number + one-line essence + ≤3 icon moments. Everything
// practical is folded behind "Détails pratiques" (opened via onOpenPractical).
export const DayDeckCard = ({
  day,
  dayNumber,
  dayTotal,
  coverSrc,
  onOpenPractical,
}: {
  day: ItineraryDay;
  dayNumber: number;
  dayTotal: number;
  coverSrc: string;
  onOpenPractical: () => void;
}) => {
  const moments = dayMoments(day);

  return (
    <article className="h-full flex flex-col overflow-hidden rounded-[2rem] bg-sand-50 shadow-card">
      {/* Image + essence (liquid glass lives here, on the photo) */}
      <div className="relative h-[46%] min-h-[230px] shrink-0">
        <SmartImage
          src={coverSrc}
          alt={day.city}
          fallback={ASSETS.covers.sections.itinerary}
          className="absolute inset-0 h-full w-full"
          overlay={<div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/15 to-transparent" />}
        />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="glass-on-photo rounded-[1.6rem] px-5 py-4">
            <p className="text-[14px] font-semibold uppercase tracking-[0.12em] text-sand-50 tabular-nums">
              Jour {String(dayNumber).padStart(2, "0")} / {dayTotal} · {safeDateLabel(day.date)}
            </p>
            <h2 className="mt-1 font-display font-semibold text-sand-50 text-[2.6rem] leading-[0.95] tracking-[-0.01em]">
              {day.city}
            </h2>
            <p className="mt-1.5 text-[16px] font-medium text-sand-50 leading-snug">{dayEssence(day)}</p>
          </div>
        </div>
      </div>

      {/* Glanceable moments — big icons + short labels (no backdrop-filter on white) */}
      <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col">
        <div className="flex-1 space-y-3">
          {moments.map((m) => {
            const Icon = KIND_ICON[m.kind];
            return (
              <div key={m.slot} className="flex items-center gap-4">
                <span className="w-14 h-14 shrink-0 rounded-2xl bg-ink-100 flex items-center justify-center">
                  <Icon size={28} className="text-ink-800" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-[15px] font-semibold uppercase tracking-[0.08em] text-ink-700">{SLOT_LABEL[m.slot]}</p>
                  <p className="text-[19px] font-semibold text-ink-900 leading-tight">{m.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onOpenPractical}
          className="mt-4 w-full rounded-2xl bg-ink-100 px-5 py-4 flex items-center justify-between gap-3 active:scale-[0.98] transition-transform"
        >
          <span className="text-[16px] font-semibold text-ink-900">Détails pratiques</span>
          <ChevronRight size={20} className="shrink-0 text-ink-500" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
};
