import { StatChip } from "./StatChip";
import { formatUSD0, usdToVndLabel } from "../lib/money";
import { safeDateLabel } from "../lib/dates";
import type { BudgetComputed } from "../lib/budget";

const Kicker = ({ children }: { children: string }) => (
  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-600">{children}</p>
);

// One ruled line: a label (+ optional date) on the left, the figure on the right.
const Line = ({ label, sub, amount }: { label: string; sub?: string; amount: string }) => (
  <div className="py-3 flex items-baseline gap-4">
    <span className="min-w-0 flex-1">
      <span className="block text-[15px] font-medium text-ink-900 leading-snug">{label}</span>
      {sub && <span className="block mt-0.5 text-[12px] font-medium uppercase tracking-[0.1em] text-ink-500">{sub}</span>}
    </span>
    <span className="shrink-0 font-display text-[1.2rem] text-ink-900 tabular-nums leading-none">{amount}</span>
  </div>
);

// SIMPLE budget — "reste à payer", clear lists, one Claudine/Nous split per
// section. No filters, no per-item clutter. Lives inside the Guide tab.
export const BudgetSection = ({ budget }: { budget: BudgetComputed }) => {
  const transfers = budget.transport.items
    .filter((i) => i.mode !== "flight_domestic")
    .slice()
    .sort((a, b) => ((a.date ?? "") < (b.date ?? "") ? -1 : 1));
  const hasFlights = budget.transport.paid > 0;
  const activities = budget.activities.items;

  return (
    <div className="space-y-12">
      {/* Reste à payer — the one number that matters */}
      <section>
        <Kicker>Reste à payer · USD</Kicker>
        <p className="mt-2 font-display font-light text-[3.2rem] text-ink-900 leading-none tabular-nums tracking-[-0.02em]">
          {formatUSD0(budget.grand.toPay)}
        </p>
        <p className="mt-1.5 text-[14px] text-ink-500 tabular-nums">{usdToVndLabel(budget.grand.toPay)}</p>
        <p className="mt-2.5 text-[14px] text-ink-600 leading-relaxed">
          Transferts privés + activités. Hôtels & repas non inclus — les vols internes sont déjà payés.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-ink-200 pt-5">
          <StatChip label="Part Claudine" value={formatUSD0(budget.grand.claudineToPay)} accent="jade" />
          <StatChip label="Part famille (nous)" value={formatUSD0(budget.grand.nousToPay)} accent="ink" />
        </div>
      </section>

      {/* Transferts privés (16 places) */}
      <section>
        <div className="flex items-baseline justify-between gap-4 border-b border-ink-300 pb-2.5">
          <h3 className="font-display text-[1.55rem] text-ink-900 leading-none">Transferts privés</h3>
          <span className="font-display text-[1.55rem] text-ink-900 tabular-nums leading-none">{formatUSD0(budget.transport.toPay)}</span>
        </div>
        <p className="mt-2 text-[12px] text-ink-500">{transfers.length} trajets · van 16 places · à régler sur place</p>
        <div className="mt-1 divide-y divide-ink-200">
          {transfers.map((t) => (
            <Line
              key={t.id}
              label={`${t.from} → ${t.to}`}
              sub={t.date ? safeDateLabel(t.date) : undefined}
              amount={formatUSD0(t.price_total_usd)}
            />
          ))}
        </div>
        <p className="mt-3 text-[14px] text-ink-600">
          Claudine {formatUSD0(budget.transport.claudineToPay)} · Nous {formatUSD0(budget.transport.nousToPay)}{" "}
          <span className="text-ink-400">(20 / 80)</span>
        </p>
        {hasFlights && (
          <div className="mt-4 pt-3.5 border-t border-ink-200 flex items-baseline justify-between gap-4 text-ink-500">
            <span className="text-[14px]">Vols internes VietJet — déjà payés</span>
            <span className="font-display text-[1.1rem] tabular-nums leading-none line-through decoration-ink-300">{formatUSD0(budget.transport.paid)}</span>
          </div>
        )}
      </section>

      {/* Activités */}
      <section>
        <div className="flex items-baseline justify-between gap-4 border-b border-ink-300 pb-2.5">
          <h3 className="font-display text-[1.55rem] text-ink-900 leading-none">Activités</h3>
          <span className="font-display text-[1.55rem] text-ink-900 tabular-nums leading-none">{formatUSD0(budget.activities.total)}</span>
        </div>
        <p className="mt-2 text-[12px] text-ink-500">Estimations · billets à payer sur place (5 pers)</p>
        <div className="mt-1 divide-y divide-ink-200">
          {activities.map((a) => (
            <Line key={a.id} label={a.title} amount={formatUSD0(a.price_total_usd)} />
          ))}
        </div>
        <p className="mt-3 text-[14px] text-ink-600">
          Claudine {formatUSD0(budget.activities.claudine)} · Nous {formatUSD0(budget.activities.nous)}
        </p>
      </section>

      {/* La règle */}
      <section className="border-t border-ink-200 pt-5">
        <Kicker>Comment c'est réparti</Kicker>
        <ol className="mt-3 space-y-2 text-[14px] text-ink-700 leading-relaxed">
          <li>Transferts privés : Claudine 20 % · le reste de la famille 80 %.</li>
          <li>Activités : à parts égales entre adultes (enfants souvent gratuits ou réduits).</li>
          <li>Hôtels, repas et vols internationaux ne sont pas comptés ici.</li>
        </ol>
      </section>
    </div>
  );
};
