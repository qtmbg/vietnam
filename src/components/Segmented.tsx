import type { ReactNode } from "react";

// Editorial section tabs: a hairline-ruled row, active item underlined in clay.
export const Segmented = ({
  items,
  value,
  onChange,
}: {
  items: { id: string; label: string; icon?: ReactNode }[];
  value: string;
  onChange: (id: string) => void;
}) => (
  <div className="flex items-stretch gap-6 border-b border-ink-200 overflow-x-auto no-scrollbar">
    {items.map((it) => {
      const on = value === it.id;
      return (
        <button
          key={it.id}
          type="button"
          onClick={() => onChange(it.id)}
          className={`shrink-0 -mb-px flex items-center gap-2 pb-2.5 border-b-2 text-[12px] font-semibold uppercase tracking-[0.14em] transition-colors ${
            on ? "border-clay-500 text-ink-900" : "border-transparent text-ink-400 active:text-ink-600"
          }`}
        >
          {it.icon}
          {it.label}
        </button>
      );
    })}
  </div>
);
