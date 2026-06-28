// Editorial stat: small-caps label + a Fraunces figure. Accent tints the figure.
export const StatChip = ({
  label,
  value,
  accent = "brand",
}: {
  label: string;
  value: string;
  accent?: "brand" | "jade" | "sun" | "ink";
}) => {
  const fig =
    accent === "jade" ? "text-jade-600" : accent === "sun" ? "text-clay-600" : "text-ink-900";
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-500">{label}</p>
      <p className={`mt-1 font-display text-[1.7rem] leading-none tabular-nums ${fig}`}>{value}</p>
    </div>
  );
};
