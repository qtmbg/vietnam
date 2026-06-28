import { useState } from "react";
import { CheckSquare } from "lucide-react";
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
    <div className="bg-white rounded-[40px] border border-ink-100 shadow-xl p-8">
      <div className="flex justify-between items-end mb-8">
        <h4 className="text-2xl font-black text-ink-900 tracking-tighter leading-none">Essentiels</h4>
        <p className="text-xs font-black text-jade-500 uppercase tracking-widest">{progress}% prêt</p>
      </div>
      <div className="space-y-3">
        {ESSENTIALS_CHECKLIST.map((item) => (
          <button
            key={item}
            onClick={() => toggle(item)}
            className="w-full flex items-center gap-4 p-4 rounded-3xl border border-ink-50 bg-ink-50/50 transition-all active:scale-95"
          >
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                checked.includes(item) ? "bg-jade-500 border-jade-500" : "border-ink-200"
              }`}
            >
              {checked.includes(item) && <CheckSquare size={14} className="text-white" />}
            </div>
            <p className={`text-sm font-bold ${checked.includes(item) ? "text-ink-400 line-through" : "text-ink-700"}`}>{item}</p>
          </button>
        ))}
      </div>
    </div>
  );
};
