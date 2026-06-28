import { BedDouble, Car, Plane, Sparkles, Wallet, ChevronRight } from "lucide-react";
import { formatUSD0 } from "../lib/money";
import type { DaySelection } from "../lib/day";
import type { HotelItem, PlannedActivity, ExpenseItemUSD } from "../data/types";

// The unified per-day context (from selectDay): where you sleep, the day's
// activities, the dated transfer(s) and the aggregated day cost. Each element
// is tappable and opens its detail via the supplied callbacks.
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
    <div className="space-y-2.5">
      {day.hotels.map((h) => (
        <button
          key={h.name}
          type="button"
          onClick={() => onHotel(h)}
          className="w-full flex items-center gap-3 p-3 rounded-2xl bg-ink-50 border border-ink-100 text-left active:scale-[.99] transition-transform"
        >
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-brand-600 shadow-soft shrink-0">
            <BedDouble size={16} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-bold uppercase tracking-widest text-ink-400">Où on dort</p>
            <p className="text-sm font-bold text-ink-800 truncate">{h.name}</p>
          </div>
          <ChevronRight size={16} className="text-ink-300 shrink-0" />
        </button>
      ))}

      {day.transfers.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onTransfer(t)}
          className="w-full flex items-center gap-3 p-3 rounded-2xl bg-ink-50 border border-ink-100 text-left active:scale-[.99] transition-transform"
        >
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-brand-600 shadow-soft shrink-0">
            {t.mode === "flight_domestic" ? <Plane size={16} /> : <Car size={16} />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-bold uppercase tracking-widest text-ink-400">Transfert</p>
            <p className="text-sm font-bold text-ink-800 truncate">
              {t.from} → {t.to}
            </p>
          </div>
          <ChevronRight size={16} className="text-ink-300 shrink-0" />
        </button>
      ))}

      {day.activities.length > 0 && (
        <div className="p-3 rounded-2xl bg-ink-50 border border-ink-100">
          <p className="text-[12px] font-bold uppercase tracking-widest text-ink-400 mb-2 flex items-center gap-1.5">
            <Sparkles size={12} /> Activités
          </p>
          <div className="flex flex-wrap gap-2">
            {day.activities.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => onActivity(a)}
                className="px-3 py-1.5 rounded-full bg-white border border-ink-100 text-[13px] font-semibold text-ink-700 active:scale-95 transition-transform"
              >
                {a.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {day.cost.total > 0 && (
        <div className="flex items-center justify-between p-3 rounded-2xl bg-sun-50 border border-sun-100">
          <p className="text-[12px] font-bold uppercase tracking-widest text-sun-700 flex items-center gap-1.5">
            <Wallet size={12} /> Coût du jour
          </p>
          <p className="text-sm font-black text-ink-900">{formatUSD0(day.cost.total)}</p>
        </div>
      )}
    </div>
  );
};
