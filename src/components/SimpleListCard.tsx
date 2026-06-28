import type { ReactNode } from "react";

export const SimpleListCard = ({ title, icon, items }: { title: string; icon: ReactNode; items: string[] }) => (
  <div className="bg-white rounded-[40px] border border-ink-100 shadow-xl p-8 mb-8">
    <div className="flex items-center gap-3 mb-8">
      <div className="p-3 rounded-2xl bg-brand-50 text-brand-600">{icon}</div>
      <h4 className="text-2xl font-black text-ink-900 tracking-tighter leading-none">{title}</h4>
    </div>
    <div className="space-y-4">
      {items.map((t, i) => (
        <div key={i} className="flex gap-4">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-400 mt-2 shrink-0" />
          <p className="text-sm font-bold text-ink-700 leading-relaxed">{t}</p>
        </div>
      ))}
    </div>
  </div>
);
