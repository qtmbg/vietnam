import { X } from "lucide-react";
import { HotelCard } from "../components/HotelCard";
import { TRIP_DATA } from "../data/trip";
import type { View } from "../data/types";

export const HotelsView = ({ goView }: { goView: (v: View) => void }) => (
  <div className="motion-safe:animate-fade-up px-6 pt-12">
    <div className="flex justify-between items-center mb-12">
      <div>
        <h2 className="font-display text-[2.5rem] text-ink-900 leading-none mb-1">Hôtels</h2>
        <p className="text-xs font-bold text-ink-400 uppercase tracking-widest">Repos & logistique</p>
      </div>
      <button type="button" onClick={() => goView("home")} aria-label="Retour à l'accueil" className="w-10 h-10 rounded-full bg-ink-100 flex items-center justify-center text-ink-500 active:scale-90 transition-transform">
        <X size={20} />
      </button>
    </div>

    <div className="pb-20">{TRIP_DATA.hotels.map((h, i) => <HotelCard key={i} hotel={h} />)}</div>
  </div>
);
