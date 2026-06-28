import { Plane, Car, Navigation, Sparkles, BadgeCheck, Tag } from "lucide-react";
import { badgeForStatus } from "../lib/status";
import { formatUSD0 } from "../lib/money";
import type { ExpenseItemUSD } from "../data/types";

export const ExpenseRow = ({
  item,
  showAlloc,
}: {
  item: ExpenseItemUSD & { alloc_claudine: number; alloc_nous: number };
  showAlloc: boolean;
}) => {
  const badge = badgeForStatus(item.status);

  const Icon =
    item.mode === "flight_domestic"
      ? Plane
      : item.mode === "private_car_7_seater"
      ? Car
      : item.mode === "limousine_or_private_van"
      ? Navigation
      : Sparkles;

  return (
    <div className="bg-white rounded-[32px] border border-ink-100 shadow-sm p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${item.operated_by_ja_cosmo ? "bg-jade-50 text-jade-700" : "bg-ink-50 text-ink-600"}`}>
            <Icon size={18} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-black text-ink-900 tracking-tight">{item.title}</p>
              {item.operated_by_ja_cosmo && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-jade-600 text-white text-[13px] font-black uppercase tracking-widest">
                  <BadgeCheck size={12} /> Ja Cosmo
                </span>
              )}
            </div>

            <p className="text-[13px] font-bold text-ink-400 uppercase tracking-widest mt-1">
              {item.id} • {item.operator} • {item.mode.replaceAll("_", " ")}
            </p>

            {(item.from || item.to) && (
              <p className="mt-2 text-xs font-bold text-ink-600">
                {item.from ? item.from : "—"} <span className="text-ink-300 mx-1">→</span> {item.to ? item.to : "—"}
              </p>
            )}

            {item.notes && <p className="mt-2 text-[13px] font-semibold text-ink-500 leading-relaxed">{item.notes}</p>}

            {item.tags?.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {item.tags.slice(0, 4).map((t) => (
                  <span key={t} className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-ink-100 text-[13px] font-black text-ink-600">
                    <Tag size={12} /> {t}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="shrink-0 text-right">
          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[13px] font-black ${badge.cls}`}>
            {badge.icon} {badge.label}
          </div>
          <p className="mt-2 text-xl font-black text-ink-900">{formatUSD0(item.price_total_usd)}</p>
          {item.date && <p className="text-[13px] font-black text-ink-400 uppercase tracking-widest mt-1">{item.date}</p>}
        </div>
      </div>

      {showAlloc && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-ink-50 border border-ink-100">
            <p className="text-[12px] font-black text-ink-400 uppercase tracking-widest mb-1">Claudine</p>
            <p className="text-sm font-black text-ink-900">{formatUSD0(item.alloc_claudine)}</p>
          </div>
          <div className="p-4 rounded-2xl bg-ink-50 border border-ink-100">
            <p className="text-[12px] font-black text-ink-400 uppercase tracking-widest mb-1">Nous</p>
            <p className="text-sm font-black text-ink-900">{formatUSD0(item.alloc_nous)}</p>
          </div>
        </div>
      )}
    </div>
  );
};
