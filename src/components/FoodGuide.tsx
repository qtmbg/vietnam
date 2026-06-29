import { SmartImage } from "./SmartImage";
import { cityCoverFromLabel } from "../lib/assets";
import type { FoodCity } from "../data/types";

// Food guide: photo-forward so you choose a dish by sight. Two dishes per row,
// each with its photo (falls back to the region cover), name, VN name, a short
// description and where to eat it.
export const FoodGuide = ({ groups }: { groups: FoodCity[] }) => (
  <div className="space-y-4">
    {groups.map((g) => {
      const cover = cityCoverFromLabel(g.city);
      return (
        <section key={g.city} className="card rounded-card px-5 py-4">
          <h3 className="font-display text-[1.7rem] font-semibold text-ink-900 leading-none tracking-[-0.01em]">{g.city}</h3>
          <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-5">
            {g.dishes.map((d) => (
              <div key={d.name} className="min-w-0">
                <div className="overflow-hidden rounded-xl shadow-soft">
                  <SmartImage src={d.img ?? cover} alt={d.name} fallback={cover} className="aspect-[4/3] w-full" />
                </div>
                <p className="mt-2 text-[15px] font-semibold text-ink-900 leading-tight">{d.name}</p>
                <p className="text-[13px] font-display italic text-jade-600 leading-tight">{d.vi}</p>
                <p className="mt-1 text-[13px] text-ink-600 leading-snug">{d.desc}</p>
                {d.where && <p className="mt-1.5 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-accent-600 leading-snug">{d.where}</p>}
              </div>
            ))}
          </div>
        </section>
      );
    })}
  </div>
);
