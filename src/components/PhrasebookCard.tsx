import { Languages } from "lucide-react";
import type { PhraseItem } from "../data/types";

export const PhrasebookCard = ({ items }: { items: PhraseItem[] }) => (
  <div className="bg-white rounded-[40px] border border-ink-100 shadow-xl p-8 mb-8">
    <div className="flex items-center gap-3 mb-8">
      <div className="p-3 rounded-2xl bg-jade-50 text-jade-600">
        <Languages size={24} />
      </div>
      <h4 className="text-2xl font-black text-ink-900 tracking-tighter leading-none">Mots utiles</h4>
    </div>
    <div className="space-y-6">
      {items.map((p) => (
        <div key={p.fr}>
          <p className="text-[13px] font-black text-ink-400 uppercase tracking-widest mb-1">{p.fr}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-lg font-black text-ink-900">{p.vi}</p>
            <p className="text-xs font-bold text-jade-500 italic">• {p.phon}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);
