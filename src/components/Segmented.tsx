import type { ReactNode } from "react";

// Apple-style segmented control: a glass pill track with a white chip sliding
// under the active item.
export const Segmented = ({
  items,
  value,
  onChange,
}: {
  items: { id: string; label: string; icon?: ReactNode }[];
  value: string;
  onChange: (id: string) => void;
}) => (
  <div className="glass rounded-full p-1 flex items-stretch gap-1 overflow-x-auto no-scrollbar">
    {items.map((it) => {
      const on = value === it.id;
      return (
        <button
          key={it.id}
          type="button"
          onClick={() => onChange(it.id)}
          className={`flex-1 min-w-0 flex items-center justify-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-semibold whitespace-nowrap transition-all duration-300 ${
            on ? "bg-white text-clay-600 shadow-soft" : "text-ink-500 active:text-ink-700"
          }`}
        >
          {it.icon}
          {it.label}
        </button>
      );
    })}
  </div>
);
