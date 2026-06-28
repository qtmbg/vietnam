import { formatUSD0 } from "../lib/money";
import type { DaySelection } from "../lib/day";
import type { HotelItem, PlannedActivity, ExpenseItemUSD } from "../data/types";

const Label = ({ children }: { children: string }) => (
  <span className="w-[5.5rem] shrink-0 pt-0.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-600">{children}</span>
);

// The unified per-day context (selectDay) rendered as an editorial specs list:
// where you sleep, the day's activities, the dated transfer(s), the day cost.
// Thin rules, no icons; each row taps through to its detail.
export const DayContext = ({
  day,
  onHotel,
  onActivity,
  onTransfer,
}: {
  day: DaySelection;
  onHotel: (h: HotelItem) => void;
  onActivity: (a: PlannedActivity) => void;
  onTransfer: (e: ExpenseItemUSD) => void;
}) => {
  const hasAnything = day.hotels.length || day.activities.length || day.transfers.length || day.cost.total > 0;
  if (!hasAnything) return null;

  return (
    <div className="border-y border-ink-200 divide-y divide-ink-200">
      {day.hotels.map((h) => (
        <button key={h.name} type="button" onClick={() => onHotel(h)} className="group w-full py-3.5 flex items-baseline gap-4 text-left">
          <Label>Où on dort</Label>
          <span className="flex-1 text-[15px] font-medium text-ink-900 leading-snug">{h.name}</span>
          <span className="shrink-0 text-ink-300 text-lg leading-none group-active:translate-x-0.5 transition-transform">›</span>
        </button>
      ))}

      {day.transfers.map((t) => (
        <button key={t.id} type="button" onClick={() => onTransfer(t)} className="group w-full py-3.5 flex items-baseline gap-4 text-left">
          <Label>Transfert</Label>
          <span className="flex-1 text-[15px] font-medium text-ink-900 leading-snug">
            {t.from} <span className="text-ink-500">→</span> {t.to}
          </span>
          <span className="shrink-0 text-ink-300 text-lg leading-none group-active:translate-x-0.5 transition-transform">›</span>
        </button>
      ))}

      {day.activities.length > 0 && (
        <div className="py-3.5 flex items-baseline gap-4">
          <Label>Activités</Label>
          <div className="flex-1 flex flex-wrap gap-x-3 gap-y-1.5">
            {day.activities.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => onActivity(a)}
                className="text-[15px] font-medium text-ink-900 underline underline-offset-4 decoration-ink-300 decoration-1 active:text-clay-600 transition-colors text-left"
              >
                {a.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {day.cost.total > 0 && (
        <div className="py-3.5 flex items-baseline gap-4">
          <Label>Coût du jour</Label>
          <span className="flex-1 text-[15px] font-semibold text-clay-600 tabular-nums">{formatUSD0(day.cost.total)}</span>
        </div>
      )}
    </div>
  );
};
