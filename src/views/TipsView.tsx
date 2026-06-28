import { X, Wallet, Info } from "lucide-react";
import { TipsChecklist } from "../components/TipsChecklist";
import { SimpleListCard } from "../components/SimpleListCard";
import { MONEY_TIPS, TRIP_DATA } from "../data/trip";
import type { View } from "../data/types";

export const TipsView = ({ goView }: { goView: (v: View) => void }) => (
  <div className="motion-safe:animate-fade-up px-6 pt-12">
    <div className="flex justify-between items-center mb-12">
      <div>
        <h2 className="font-display text-[2.5rem] text-ink-900 leading-none mb-1">Conseils</h2>
        <p className="text-xs font-bold text-ink-400 uppercase tracking-widest">Pratique</p>
      </div>
      <button type="button" onClick={() => goView("home")} aria-label="Retour à l'accueil" className="w-10 h-10 rounded-full bg-ink-100 flex items-center justify-center text-ink-500 active:scale-90 transition-transform">
        <X size={20} />
      </button>
    </div>

    <TipsChecklist />
    <div className="h-8" />
    <SimpleListCard title="Argent" icon={<Wallet size={24} />} items={MONEY_TIPS} />
    <SimpleListCard title="Rappels" icon={<Info size={24} />} items={TRIP_DATA.glossary.map((g) => `${g.term}: ${g.note}`)} />
  </div>
);
