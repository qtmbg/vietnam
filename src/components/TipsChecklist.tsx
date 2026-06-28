import { useState } from "react";
import { ESSENTIALS_CHECKLIST } from "../data/trip";

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

  const progress = Math.round((checked.length / ESSENTIALS_CHECKLIST.length) * 100);

  return (
    <section>
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="font-display text-[1.7rem] text-ink-900 leading-none tracking-[-0.01em]">Essentiels</h3>
        <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-ink-600 tabular-nums">{progress}% prêt</p>
      </div>
      <div className="border-t border-ink-200">
        {ESSENTIALS_CHECKLIST.map((item) => {
          const on = checked.includes(item);
          return (
            <button
              key={item}
              type="button"
              onClick={() => toggle(item)}
              className="w-full flex items-center gap-3.5 py-3 border-b border-ink-200 text-left"
            >
              <span
                className={`w-[18px] h-[18px] shrink-0 flex items-center justify-center border text-[11px] leading-none transition-colors ${
                  on ? "bg-clay-600 border-clay-600 text-sand-50" : "border-ink-300 text-transparent"
                }`}
              >
                ✓
              </span>
              <span className={`text-[15px] font-medium transition-colors ${on ? "text-ink-500 line-through" : "text-ink-800"}`}>{item}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
