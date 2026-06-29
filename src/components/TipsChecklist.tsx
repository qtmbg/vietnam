import { useState } from "react";
import { ESSENTIALS_GROUPS } from "../data/trip";

const ALL_ITEMS = ESSENTIALS_GROUPS.flatMap((g) => g.items);

export const TipsChecklist = () => {
  // Hydrate from localStorage on first render (no flash of the empty list).
  const [checked, setChecked] = useState<string[]>(() => {
    const saved = localStorage.getItem("trip_tips_checklist");
    return saved ? JSON.parse(saved) : [];
  });

  const toggle = (item: string) => {
    const next = checked.includes(item) ? checked.filter((i) => i !== item) : [...checked, item];
    setChecked(next);
    localStorage.setItem("trip_tips_checklist", JSON.stringify(next));
  };

  const done = ALL_ITEMS.filter((i) => checked.includes(i)).length;
  const progress = Math.round((done / ALL_ITEMS.length) * 100);

  return (
    <section className="card rounded-card px-5 py-4">
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="font-display text-[1.7rem] font-semibold text-ink-900 leading-none tracking-[-0.01em]">Essentiels</h3>
        <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-ink-600 tabular-nums">{progress}% prêt</p>
      </div>

      <div className="space-y-5">
        {ESSENTIALS_GROUPS.map((group) => (
          <div key={group.title}>
            <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-ink-600">{group.title}</p>
            {group.note && <p className="mt-1 text-[14px] text-ink-500 leading-snug">{group.note}</p>}
            <div className="mt-2 border-t border-ink-200">
              {group.items.map((item) => {
                const on = checked.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggle(item)}
                    className="w-full flex items-center gap-3.5 py-3 border-b border-ink-200 text-left"
                  >
                    <span
                      className={`w-[20px] h-[20px] shrink-0 flex items-center justify-center rounded-md border text-[12px] leading-none transition-colors ${
                        on ? "bg-clay-600 border-clay-600 text-white" : "border-ink-300 text-transparent"
                      }`}
                    >
                      ✓
                    </span>
                    <span className={`text-[16px] font-medium transition-colors ${on ? "text-ink-500 line-through" : "text-ink-800"}`}>{item}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
