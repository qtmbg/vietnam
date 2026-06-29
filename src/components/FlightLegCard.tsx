import type { FlightLeg } from "../data/types";

// Editorial flight leg: Fraunces title, paid status as small-caps text, the
// segments as a ruled list with airport codes in display type. No icons.
export const FlightLegCard = ({ leg }: { leg: FlightLeg }) => (
  <section className="card rounded-card px-5 py-4 mb-4">
    <div className="flex items-baseline justify-between gap-3">
      <h4 className="font-display text-[1.6rem] font-semibold text-ink-900 leading-tight tracking-[-0.01em]">{leg.title}</h4>
      <span className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.14em] text-jade-600">{leg.paid ? "Payé" : "Confirmé"}</span>
    </div>
    <p className="mt-1 text-[12px] font-medium uppercase tracking-[0.14em] text-ink-500">{leg.sub}</p>

    <div className="mt-4 border-t border-ink-200">
      {leg.segs.map((s, i) => (
        <div key={i} className="py-4 border-b border-ink-200">
          <div className="flex items-baseline gap-2.5 flex-wrap">
            <span className="text-[14px] font-bold text-ink-900 tabular-nums">{s.code}</span>
            <span className="text-[12px] text-ink-600">{s.carrier}</span>
            {s.resa && <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-clay-600">Réf {s.resa}</span>}
          </div>
          <div className="mt-2.5 flex items-baseline gap-3">
            <div className="text-left">
              <p className="font-display text-[1.35rem] text-ink-900 leading-none">{s.fromCode}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-ink-500">{s.fromCity}</p>
            </div>
            <span className="text-ink-300 text-lg leading-none">→</span>
            <div className="text-left">
              <p className="font-display text-[1.35rem] text-ink-900 leading-none">{s.toCode}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-ink-500">{s.toCity}</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-[12.5px] font-medium text-ink-700 tabular-nums">{s.dep}</p>
              <p className="text-[12.5px] text-ink-600 tabular-nums">{s.arr}</p>
            </div>
          </div>
          {s.note && <p className="mt-2 text-[14px] text-ink-600 leading-relaxed">{s.note}</p>}
        </div>
      ))}
    </div>
  </section>
);
