import type { AirportGlossaryItem } from "../data/types";

// Editorial airports: code in display type, details as a ruled list. No icons.
export const AirportGlossaryCard = ({ items }: { items: AirportGlossaryItem[] }) => (
  <section>
    <h3 className="font-display text-[1.7rem] text-ink-900 leading-none tracking-[-0.01em]">Aéroports</h3>
    <p className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-ink-500">Codes + trajets estimés</p>
    <div className="mt-4 border-t border-ink-200">
      {items.map((a, i) => (
        <div key={i} className="py-4 border-b border-ink-200">
          <div className="flex items-baseline gap-2.5">
            <span className="font-display text-[1.4rem] text-ink-900 leading-none">{a.code}</span>
            <span className="font-display italic text-[15px] text-ink-600">{a.city}</span>
          </div>
          <p className="mt-1.5 text-[14px] text-ink-600">{a.airport}</p>
          <div className="mt-2.5 flex items-baseline justify-between gap-4">
            <p className="text-[14px] text-ink-700">
              <span className="text-[11px] uppercase tracking-[0.12em] text-ink-500">Depuis </span>
              {a.fromHotel}
            </p>
            <p className="shrink-0 text-[12px] font-semibold uppercase tracking-[0.12em] text-jade-600 tabular-nums">{a.eta}</p>
          </div>
          {a.note && <p className="mt-1.5 font-display italic text-[14px] text-clay-600">{a.note}</p>}
        </div>
      ))}
    </div>
  </section>
);
