import { useState } from "react";
import { X, Utensils, Plane, Info, Wallet, BadgeCheck } from "lucide-react";
import { Segmented } from "../components/Segmented";
import { FoodGuide } from "../components/FoodGuide";
import { FlightLegCard } from "../components/FlightLegCard";
import { AirportGlossaryCard } from "../components/AirportGlossaryCard";
import { PhrasebookCard } from "../components/PhrasebookCard";
import { TipsChecklist } from "../components/TipsChecklist";
import { SimpleListCard } from "../components/SimpleListCard";
import { FOOD_GUIDE, FLIGHTS, MONEY_TIPS, TRIP_DATA } from "../data/trip";
import type { View } from "../data/types";

type GuideTab = "cuisine" | "vols" | "infos" | "conseils";

// The "Guide" tab merges the old guide + flights + airports + phrasebook +
// tips/conseils into one sectioned reference view.
export const GuideView = ({ goView }: { goView: (v: View) => void }) => {
  const [tab, setTab] = useState<GuideTab>("cuisine");

  return (
    <div className="motion-safe:animate-fade-up px-6 pt-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="font-display text-[2.5rem] text-ink-900 leading-none mb-1">Guide</h2>
          <p className="text-xs font-bold text-ink-400 uppercase tracking-widest">Food · vols · pratique</p>
        </div>
        <button type="button" onClick={() => goView("home")} aria-label="Retour à l'accueil" className="w-10 h-10 rounded-full bg-ink-100 flex items-center justify-center text-ink-500 active:scale-90 transition-transform">
          <X size={20} />
        </button>
      </div>

      <div className="mb-8">
        <Segmented
          value={tab}
          onChange={(id) => setTab(id as GuideTab)}
          items={[
            { id: "cuisine", label: "Cuisine", icon: <Utensils size={15} /> },
            { id: "vols", label: "Vols", icon: <Plane size={15} /> },
            { id: "infos", label: "Infos", icon: <Info size={15} /> },
            { id: "conseils", label: "Conseils", icon: <Wallet size={15} /> },
          ]}
        />
      </div>

      <div className="pb-20">
        {tab === "cuisine" && <FoodGuide groups={FOOD_GUIDE} />}

        {tab === "vols" && (
          <div>
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
        )}

        {tab === "infos" && (
          <div>
            <AirportGlossaryCard items={TRIP_DATA.airport_glossary} />
            <PhrasebookCard items={TRIP_DATA.phrasebook} />
          </div>
        )}

        {tab === "conseils" && (
          <div>
            <TipsChecklist />
            <div className="h-8" />
            <SimpleListCard title="Argent" icon={<Wallet size={24} />} items={MONEY_TIPS} />
            <SimpleListCard title="Rappels" icon={<Info size={24} />} items={TRIP_DATA.glossary.map((g) => `${g.term}: ${g.note}`)} />
          </div>
        )}
      </div>
    </div>
  );
};
