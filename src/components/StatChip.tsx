export const StatChip = ({
  label,
  value,
  accent = "brand",
}: {
  label: string;
  value: string;
  accent?: "brand" | "jade" | "sun" | "ink";
}) => {
  const cls =
    accent === "jade"
      ? "bg-jade-50 border-jade-100 text-jade-700"
      : accent === "sun"
      ? "bg-sun-50 border-sun-100 text-sun-700"
      : accent === "ink"
      ? "bg-ink-50 border-ink-100 text-ink-700"
      : "bg-brand-50 border-brand-100 text-brand-700";
  return (
    <div className={`p-4 rounded-3xl border ${cls}`}>
      <p className="text-[12px] font-black uppercase tracking-widest opacity-70 mb-1">{label}</p>
      <p className="text-lg font-black">{value}</p>
    </div>
  );
};
