// Editorial list: Fraunces title + ruled items. No icon.
export const SimpleListCard = ({ title, items }: { title: string; items: string[] }) => (
  <section className="glass rounded-card px-5 py-4">
    <h3 className="font-display text-[1.7rem] font-semibold text-ink-900 leading-none tracking-[-0.01em]">{title}</h3>
    <div className="mt-4 border-t border-ink-200">
      {items.map((t, i) => (
        <p key={i} className="py-3.5 border-b border-ink-200 text-[15.5px] text-ink-700 leading-relaxed">{t}</p>
      ))}
    </div>
  </section>
);
