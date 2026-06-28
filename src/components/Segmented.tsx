import type { ReactNode } from "react";

export const Segmented = ({
  items,
  value,
  onChange,
}: {
  items: { id: string; label: string; icon?: ReactNode }[];
  value: string;
  onChange: (id: string) => void;
}) => (
  <div className="bg-ink-100 p-1 rounded-2xl flex gap-1">
    {items.map((it) => (
      <button
        key={it.id}
        onClick={() => onChange(it.id)}
        className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
          value === it.id ? "bg-white text-ink-900 shadow" : "text-ink-500 hover:text-ink-700"
        }`}
      >
        {it.icon}
        {it.label}
      </button>
    ))}
  </div>
);
