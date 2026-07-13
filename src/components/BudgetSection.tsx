import { formatUSD0, usdToVndLabel } from "../lib/money";
import { safeDateLabel } from "../lib/dates";
import type { BudgetComputed } from "../lib/budget";

// Shorten a verbose transfer endpoint: airports → "Aéroport XXX", venues lose
// their parenthetical so routes stay on one tidy line on a phone.
const AIRPORT = /\(([A-Z]{3})\)/;
const shortPlace = (s = "") => {
  const m = s.match(AIRPORT);
  if (m && /airport|aéroport/i.test(s)) return `Aéroport ${m[1]}`;
  return s.replace(/\s*\(.*?\)\s*$/, "").trim();
};

const cardCls = "rounded-card card px-5 py-4";

const Head = ({ title, amount }: { title: string; amount?: string }) => (
  <div className="flex items-baseline justify-between gap-3">
    <h3 className="font-display text-[1.3rem] font-semibold text-ink-900 tracking-[-0.01em] leading-none">{title}</h3>
    {amount && <span className="font-display text-[1.3rem] font-semibold text-ink-900 tabular-nums leading-none">{amount}</span>}
  </div>
);

// One ruled line: title (+ optional sub) left, price right.
const Row = ({ title, sub, amount }: { title: string; sub?: string; amount: string }) => (
  <div className="py-3 flex items-baseline gap-4">
    <span className="min-w-0 flex-1">
      <span className="block text-[15px] font-medium text-ink-900 leading-snug">{title}</span>
      {sub && <span className="block mt-1 text-[12px] font-medium text-ink-500 leading-snug">{sub}</span>}
    </span>
    <span className="shrink-0 font-display text-[1.1rem] font-semibold text-ink-900 tabular-nums leading-none">{amount}</span>
  </div>
);

// Budget = a calm cost ESTIMATE, not an upfront bill. Hotels & land transfers
// are settled in advance or on-site (our call) — nothing is due before departure.
export const BudgetSection = ({ budget }: { budget: BudgetComputed }) => {
  const { hotels, transport, activities, grand } = budget;

  return (
    <div className="space-y-4">
      {/* Estimate headline */}
      <section className="card rounded-card px-6 py-7">
        <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-ink-500">Budget · estimation · USD</p>
        <p className="mt-2 font-display font-semibold text-[3.2rem] text-ink-900 leading-none tabular-nums tracking-[-0.03em]">
          {formatUSD0(grand.toPay)}
        </p>
        <p className="mt-2 text-[14px] text-ink-500 tabular-nums">{usdToVndLabel(grand.toPay)}</p>
        <p className="mt-3 text-[14px] text-ink-600 leading-relaxed">
          Estimation à prévoir — hôtels, transferts privés et activités. Réglés en amont ou sur place selon les cas,
          rien n'est dû avant le départ. Vols internes déjà payés.
        </p>
      </section>

      {/* Hôtels */}
      <section className={cardCls}>
        <Head title="Hôtels" amount={formatUSD0(hotels.toPay)} />
        <div className="mt-1 divide-y divide-ink-200">
          {hotels.toPayItems.map(({ hotel, amount }) => (
            <Row key={hotel.name} title={hotel.name} sub={hotel.paidNote ?? hotel.dates} amount={formatUSD0(amount)} />
          ))}
        </div>
        {hotels.paidItems.length > 0 && (
          <div className="mt-2 pt-3 border-t border-ink-200 space-y-2">
            {hotels.paidItems.map((h) => (
              <div key={h.name} className="flex items-baseline justify-between gap-3">
                <span className="min-w-0 flex-1 text-[14px] text-ink-500 leading-snug truncate">{h.name}</span>
                <span className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.12em] text-jade-500">
                  Payé{h.paidBy ? ` · ${h.paidBy}` : ""}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Transferts privés */}
      <section className={cardCls}>
        <Head title="Transferts privés" amount={formatUSD0(transport.toPay)} />
        <p className="mt-1 text-[12px] text-ink-500">{transport.items.length} trajets · van 16 places</p>
        <div className="mt-1 divide-y divide-ink-200">
          {transport.items.map((t) => (
            <Row
              key={t.id}
              title={`${shortPlace(t.from)} → ${shortPlace(t.to)}`}
              sub={t.date ? safeDateLabel(t.date) : undefined}
              amount={formatUSD0(t.price_total_usd)}
            />
          ))}
        </div>
        {transport.paid > 0 && (
          <div className="mt-2 pt-3 border-t border-ink-200 flex items-baseline justify-between gap-3">
            <span className="min-w-0 flex-1 text-[14px] text-ink-500 leading-snug">Vols internes VietJet</span>
            <span className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.12em] text-jade-500">Payé</span>
          </div>
        )}
      </section>

      {/* Activités */}
      <section className={cardCls}>
        <Head title="Activités" amount={formatUSD0(activities.total)} />
        <p className="mt-1 text-[12px] text-ink-500">Estimations · billets sur place (5 pers)</p>
        <div className="mt-1 divide-y divide-ink-200">
          {activities.items.map((a) => (
            <Row key={a.id} title={a.title} amount={formatUSD0(a.price_total_usd)} />
          ))}
        </div>
        {activities.paidItems.length > 0 && (
          <div className="mt-2 pt-3 border-t border-ink-200 space-y-2">
            {activities.paidItems.map((a) => (
              <div key={a.id} className="flex items-baseline justify-between gap-3">
                <span className="min-w-0 flex-1 text-[14px] text-ink-500 leading-snug truncate">{a.title}</span>
                <span className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.12em] text-jade-500">Payé ✓</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Ce qui est compté */}
      <section className={cardCls}>
        <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-ink-500">Comment lire ce budget</p>
        <ol className="mt-3 space-y-2 text-[14px] text-ink-700 leading-relaxed">
          <li>Une estimation, pas une facture : on règle en amont ou sur place selon les cas.</li>
          <li>Les vols internes VietJet sont déjà payés.</li>
          <li>Repas, vols internationaux et extras ne sont pas comptés ici.</li>
        </ol>
      </section>
    </div>
  );
};
