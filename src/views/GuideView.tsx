import { X, Utensils, Plane, ChevronRight } from "lucide-react";
import { FoodGuide } from "../components/FoodGuide";
import { AirportGlossaryCard } from "../components/AirportGlossaryCard";
import { PhrasebookCard } from "../components/PhrasebookCard";
import { FOOD_GUIDE, TRIP_DATA } from "../data/trip";
import type { View } from "../data/types";

export const GuideView = ({ goView }: { goView: (v: View) => void }) => (
  <div className="motion-safe:animate-fade-up px-6 pt-12">
    <div className="flex justify-between items-center mb-12">
      <div>
        <h2 className="font-display text-[2.5rem] text-ink-900 leading-none mb-1">Guide</h2>
        <p className="text-xs font-bold text-ink-400 uppercase tracking-widest">Food + aéroports</p>
      </div>
      <button type="button" onClick={() => goView("home")} aria-label="Retour à l'accueil" className="w-10 h-10 rounded-full bg-ink-100 flex items-center justify-center text-ink-500 active:scale-90 transition-transform">
        <X size={20} />
      </button>
    </div>

    <div className="mb-4 flex items-center gap-2.5">
      <div className="p-3 rounded-2xl bg-jade-50 text-jade-600">
        <Utensils size={22} />
      </div>
      <div>
        <h3 className="font-display text-2xl text-ink-900 leading-none">Cuisine</h3>
        <p className="text-[13px] font-semibold text-ink-400">Les incontournables, région par région</p>
      </div>
    </div>
    <FoodGuide groups={FOOD_GUIDE} />

    <button
      type="button"
      onClick={() => goView("flights")}
      className="w-full mb-8 bg-white rounded-card border border-ink-100 shadow-card p-5 flex items-center gap-4 active:scale-[.99] transition-transform"
    >
      <div className="w-11 h-11 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
        <Plane size={20} />
      </div>
      <div className="min-w-0 flex-1 text-left">
        <p className="text-base font-bold text-ink-900 leading-tight">Tous les vols</p>
        <p className="text-[13px] font-semibold text-ink-400">Aller, internes &amp; retour — détaillés</p>
      </div>
      <ChevronRight size={18} className="text-ink-300 shrink-0" />
    </button>

    <AirportGlossaryCard items={TRIP_DATA.airport_glossary} />
    <PhrasebookCard items={TRIP_DATA.phrasebook} />
  </div>
);
