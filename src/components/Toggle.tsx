// Editorial toggle: a clean labelled row with a slim terracotta switch.
export const Toggle = ({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  hint?: string;
}) => (
  <div className="flex items-center justify-between gap-4 py-3.5">
    <div className="min-w-0">
      <p className="text-[14px] font-semibold text-ink-900 leading-tight">{label}</p>
      {hint && <p className="mt-0.5 text-[12px] text-ink-600">{hint}</p>}
    </div>
    <button
      type="button"
      onClick={() => onChange(!value)}
      aria-label={label}
      className={`shrink-0 w-11 h-6 rounded-full p-0.5 transition-colors ${value ? "bg-clay-600" : "bg-ink-300"}`}
    >
      <div className={`w-5 h-5 bg-sand-50 rounded-full shadow-sm transition-transform ${value ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  </div>
);
