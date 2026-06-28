import { Plane } from "lucide-react";
import type { AirportGlossaryItem } from "../data/types";

export const AirportGlossaryCard = ({ items }: { items: AirportGlossaryItem[] }) => (
  <div className="bg-white rounded-[40px] border border-ink-100 shadow-xl p-8 mb-8">
    <div className="flex items-center gap-3 mb-2">
      <div className="p-3 rounded-2xl bg-sun-50 text-sun-600">
        <Plane size={24} />
      </div>
      <h4 className="text-2xl font-black text-ink-900 tracking-tighter leading-none">Aéroports</h4>
    </div>
    <p className="text-[13px] font-bold text-ink-400 uppercase tracking-widest mb-8">Codes + trajets estimés</p>

    <div className="space-y-8">
      {items.map((a, i) => (
        <div key={i} className="relative pl-6 border-l-2 border-ink-100">
          <div className="absolute top-0 left-[-5px] w-2 h-2 rounded-full bg-ink-200" />
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-lg font-black text-ink-900 tracking-tight">{a.code}</span>
            <span className="text-xs font-bold text-brand-500 italic">• {a.city}</span>
          </div>
          <p className="text-xs font-bold text-ink-600 mb-2">{a.airport}</p>
          <div className="p-4 rounded-2xl bg-ink-50 border border-ink-100">
            <p className="text-[12px] font-black text-ink-400 uppercase mb-1">Depuis l’hôtel</p>
            <p className="text-[13px] font-bold text-ink-700 leading-tight">{a.fromHotel}</p>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-[12px] font-black text-ink-400 uppercase">Trajet</p>
              <p className="text-xs font-black text-jade-600 uppercase tracking-tighter">{a.eta}</p>
            </div>
            {a.note && <p className="mt-2 text-[12px] font-bold text-sun-600 italic">! {a.note}</p>}
          </div>
        </div>
      ))}
    </div>
  </div>
);
