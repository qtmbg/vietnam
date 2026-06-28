import type { ReactNode } from "react";

export const Toggle = ({
  label,
  icon,
  value,
  onChange,
  hint,
}: {
  label: string;
  icon?: ReactNode;
  value: boolean;
  onChange: (v: boolean) => void;
  hint?: string;
}) => (
  <div className="flex items-center justify-between p-4 rounded-3xl bg-ink-50 border border-ink-100 shadow-sm">
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-2xl bg-white shadow-sm text-ink-600">{icon}</div>
      <div>
        <p className="text-sm font-extrabold text-ink-900">{label}</p>
        {hint && <p className="text-[13px] text-ink-500 font-medium">{hint}</p>}
      </div>
    </div>
    <button
      onClick={() => onChange(!value)}
      className={`w-12 h-7 rounded-full p-1 transition-colors ${value ? "bg-jade-500" : "bg-ink-200"}`}
      aria-label={label}
    >
      <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${value ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  </div>
);
