// Apple-style segmented control: a glass pill track with a white chip under the
// active item. Pass `accent` (a hex) to tint the active label — used by the
// mood selector so each energy level reads differently.
export const Segmented = ({
  items,
  value,
  onChange,
  accent,
}: {
  items: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
  accent?: string;
}) => (
  <div className="bg-ink-100 rounded-full p-1 flex items-stretch gap-1 overflow-x-auto no-scrollbar">
    {items.map((it) => {
      const on = value === it.id;
      return (
        <button
          key={it.id}
          type="button"
          onClick={() => onChange(it.id)}
          style={on && accent ? { color: accent } : undefined}
          className={`flex-1 min-w-0 flex items-center justify-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-semibold whitespace-nowrap transition-all duration-300 ${
            on ? `bg-white shadow-soft${accent ? "" : " text-accent-600"}` : "text-ink-500 active:text-ink-700"
          }`}
        >
          {it.label}
        </button>
      );
    })}
  </div>
);
