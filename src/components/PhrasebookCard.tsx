import type { PhraseItem } from "../data/types";

// Editorial phrasebook: FR as a small-caps label, VN in bold, phonetics in
// Fraunces italic. Ruled list, no icons.
export const PhrasebookCard = ({ items }: { items: PhraseItem[] }) => (
  <section className="glass rounded-card px-5 py-4">
    <h3 className="font-display text-[1.7rem] font-semibold text-ink-900 leading-none tracking-[-0.01em]">Mots utiles</h3>
    <div className="mt-4 border-t border-ink-200">
      {items.map((p) => (
        <div key={p.fr} className="py-3.5 border-b border-ink-200 flex items-baseline gap-4">
          <span className="w-[7.5rem] shrink-0 text-[11px] font-semibold uppercase tracking-[0.13em] text-ink-600">{p.fr}</span>
          <span className="flex-1 text-[17px] font-semibold text-ink-900">{p.vi}</span>
          <span className="shrink-0 font-display italic text-[14px] text-jade-600">{p.phon}</span>
        </div>
      ))}
    </div>
  </section>
);
