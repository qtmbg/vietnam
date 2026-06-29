import { formatUSD0, usdToVndLabel } from "../lib/money";
import type { ExpenseItemUSD } from "../data/types";

// Expense row: status + Ja Cosmo as small-caps, the figure on the right.
export const ExpenseRow = ({
  item,
  showAlloc,
}: {
  item: ExpenseItemUSD & { alloc_claudine: number; alloc_nous: number };
  showAlloc: boolean;
}) => {
  const confirmed = item.status === "CONFIRMED";

  return (
    <div className="border border-ink-200 rounded-2xl p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <p className="text-[16px] font-semibold text-ink-900 leading-snug">{item.title}</p>
            {item.operated_by_ja_cosmo && (
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-jade-600">Ja Cosmo</span>
            )}
          </div>

          <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.13em] text-ink-500">
            {item.id} · {item.operator} · {item.mode.replaceAll("_", " ")}
          </p>

          {(item.from || item.to) && (
            <p className="mt-2 text-[14px] font-medium text-ink-700">
              {item.from ?? "—"} <span className="text-ink-500">→</span> {item.to ?? "—"}
            </p>
          )}

          {item.notes && <p className="mt-2 text-[14px] text-ink-600 leading-relaxed">{item.notes}</p>}

          {item.tags?.length ? (
            <p className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1 text-[10.5px] font-medium uppercase tracking-[0.12em] text-ink-500">
              {item.tags.slice(0, 4).map((t) => (
                <span key={t}>{t}</span>
              ))}
            </p>
          ) : null}
        </div>

        <div className="shrink-0 text-right">
          <p className={`text-[10px] font-bold uppercase tracking-[0.14em] ${confirmed ? "text-jade-600" : "text-accent-600"}`}>
            {confirmed ? "Confirmé" : "Estimé"}
          </p>
          <p className="mt-1.5 font-display text-[1.5rem] text-ink-900 leading-none tabular-nums">{formatUSD0(item.price_total_usd)}</p>
          <p className="mt-1 text-[11px] text-ink-500 tabular-nums">{usdToVndLabel(item.price_total_usd)}</p>
          {item.date && <p className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-ink-500 tabular-nums">{item.date}</p>}
        </div>
      </div>

      {showAlloc && (
        <div className="mt-3.5 pt-3.5 border-t border-ink-200 flex gap-10">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-600">Claudine</p>
            <p className="mt-1 font-display text-[1.15rem] text-ink-900 leading-none tabular-nums">{formatUSD0(item.alloc_claudine)}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-600">Nous</p>
            <p className="mt-1 font-display text-[1.15rem] text-ink-900 leading-none tabular-nums">{formatUSD0(item.alloc_nous)}</p>
          </div>
        </div>
      )}
    </div>
  );
};
