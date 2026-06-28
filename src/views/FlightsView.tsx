import { X, BadgeCheck } from "lucide-react";
import { FlightLegCard } from "../components/FlightLegCard";
import { FLIGHTS } from "../data/trip";
import type { View } from "../data/types";

export const FlightsView = ({ goView }: { goView: (v: View) => void }) => (
  <div key="flights" className="motion-safe:animate-fade-up px-6 pt-12">
    <div className="flex justify-between items-center mb-8">
      <div>
        <h2 className="font-display text-[2.5rem] text-ink-900 leading-none mb-1">Vols</h2>
        <p className="text-[13px] font-bold text-ink-400 uppercase tracking-widest">Aller · internes · retour</p>
      </div>
      <button type="button" onClick={() => goView("home")} aria-label="Retour à l'accueil" className="w-10 h-10 rounded-full bg-ink-100 flex items-center justify-center text-ink-500 active:scale-90 transition-transform">
        <X size={20} />
      </button>
    </div>
    <div className="pb-20">
      {FLIGHTS.map((leg, i) => (
        <FlightLegCard key={i} leg={leg} />
      ))}
      <div className="rounded-card bg-jade-50 border border-jade-100 p-5 flex items-start gap-3">
        <BadgeCheck className="text-jade-600 shrink-0 mt-0.5" size={20} />
        <p className="text-[14px] font-semibold text-jade-800 leading-relaxed">
          Tous les vols sont confirmés et payés : billet Qatar Airways émis (réf X6CPNI) et les 4 vols VietJet internes réglés.
        </p>
      </div>
    </div>
  </div>
);
