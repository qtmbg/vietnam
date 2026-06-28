import { X } from "lucide-react";
import { CityTimeline } from "../components/CityTimeline";
import { DayCardMobile } from "../components/DayCardMobile";
import { TRIP_DATA } from "../data/trip";
import { dayCoverFromDay } from "../lib/assets";
import type { Mood, View } from "../data/types";

export const ItineraryView = ({
  cities,
  activeCity,
  setActiveCity,
  mood,
  goView,
}: {
  cities: string[];
  activeCity: string;
  setActiveCity: (c: string) => void;
  mood: Mood;
  goView: (v: View) => void;
}) => (
  <div className="motion-safe:animate-fade-up px-6 pt-12">
    <div className="flex justify-between items-center mb-10">
      <div>
        <h2 className="font-display text-[2.5rem] text-ink-900 leading-none mb-1">Itinéraire</h2>
        <p className="text-xs font-bold text-ink-400 uppercase tracking-widest">Carte par carte</p>
      </div>
      <button type="button" onClick={() => goView("home")} aria-label="Retour à l'accueil" className="w-10 h-10 rounded-full bg-ink-100 flex items-center justify-center text-ink-500 active:scale-90 transition-transform">
        <X size={20} />
      </button>
    </div>

    <div className="mb-10">
      <p className="text-[13px] font-black text-ink-400 uppercase tracking-widest mb-4 ml-2">Filtrer par ville</p>
      <CityTimeline cities={cities} activeCity={activeCity} onSelect={setActiveCity} />
    </div>

    <div className="space-y-12 pb-20">
      {TRIP_DATA.itinerary_days
        .filter((d) => d.city.toLowerCase().includes(activeCity.toLowerCase()))
        .map((day) => (
          <DayCardMobile key={day.date} day={day} coverSrc={dayCoverFromDay(day)} mood={mood} />
        ))}
    </div>
  </div>
);
