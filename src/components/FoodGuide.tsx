import type { FoodCity } from "../data/types";

// Editorial food guide: Fraunces region headings, dishes as a ruled list with
// the VN name in italic and the address in small-caps. No emoji, no icons.
export const FoodGuide = ({ groups }: { groups: FoodCity[] }) => (
  <div className="space-y-4">
    {groups.map((g) => (
      <section key={g.city} className="card rounded-card px-5 py-4">
        <h3 className="font-display text-[1.7rem] font-semibold text-ink-900 leading-none tracking-[-0.01em]">{g.city}</h3>
        <div className="mt-4 border-t border-ink-200">
          {g.dishes.map((d) => (
            <div key={d.name} className="py-4 border-b border-ink-200">
              <div className="flex items-baseline gap-2.5 flex-wrap">
                <p className="text-[17px] font-semibold text-ink-900">{d.name}</p>
                <p className="font-display italic text-[15px] text-jade-600">{d.vi}</p>
              </div>
              <p className="mt-1.5 text-[15px] text-ink-600 leading-relaxed">{d.desc}</p>
              {d.where && <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.13em] text-clay-600">{d.where}</p>}
            </div>
          ))}
        </div>
      </section>
    ))}
  </div>
);
