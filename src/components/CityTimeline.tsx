export const CityTimeline = ({ cities, activeCity, onSelect }: { cities: string[]; activeCity: string; onSelect: (c: string) => void }) => (
  <div className="flex items-center gap-2 overflow-x-auto pb-4 px-6 no-scrollbar">
    {cities.map((c) => (
      <button
        key={c}
        onClick={() => onSelect(c)}
        className={`whitespace-nowrap px-6 py-3 rounded-full text-sm font-black transition-all ${
          activeCity === c ? "bg-brand-600 text-white shadow-lg shadow-brand-200 -rotate-2" : "bg-white text-ink-400 border border-ink-100"
        }`}
      >
        {c}
      </button>
    ))}
  </div>
);
