import { Segmented } from "../components/Segmented";
import { FoodGuide } from "../components/FoodGuide";
import { FlightLegCard } from "../components/FlightLegCard";
import { AirportGlossaryCard } from "../components/AirportGlossaryCard";
import { PhrasebookCard } from "../components/PhrasebookCard";
import { TipsChecklist } from "../components/TipsChecklist";
import { SimpleListCard } from "../components/SimpleListCard";
import { BudgetSection } from "../components/BudgetSection";
import { FOOD_GUIDE, FLIGHTS, MONEY_TIPS, TRIP_DATA } from "../data/trip";
import type { BudgetComputed } from "../lib/budget";

export type GuideTab = "cuisine" | "vols" | "budget" | "infos" | "conseils";

// The "Guide" tab merges cuisine + vols + budget + infos + conseils into one
// sectioned reference view. Budget lives here now (no longer its own tab).
export const GuideView = ({
  tab,
  setTab,
  budget,
}: {
  tab: GuideTab;
  setTab: (t: GuideTab) => void;
  budget: BudgetComputed;
}) => {
  return (
    <div className="motion-safe:animate-fade-up px-7 pt-12">
      <div className="mb-9">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-600">Food · vols · budget · pratique</p>
        <h2 className="mt-1.5 font-display font-semibold text-[2.8rem] text-ink-900 leading-[0.9] tracking-[-0.02em]">Guide</h2>
      </div>

      <Segmented
        value={tab}
        onChange={(id) => setTab(id as GuideTab)}
        items={[
          { id: "cuisine", label: "Cuisine" },
          { id: "vols", label: "Vols" },
          { id: "budget", label: "Budget" },
          { id: "infos", label: "Infos" },
          { id: "conseils", label: "Conseils" },
        ]}
      />

      <div className="mt-10 pb-20">
        {tab === "cuisine" && <FoodGuide groups={FOOD_GUIDE} />}

        {tab === "vols" && (
          <div>
            {FLIGHTS.map((leg, i) => (
              <FlightLegCard key={i} leg={leg} />
            ))}
            <p className="mt-2 pl-3.5 border-l-2 border-jade-400 text-[15px] text-ink-600 leading-relaxed">
              Tous les vols sont confirmés et payés : billet Qatar Airways émis (réf X6CPNI) et les 4 vols VietJet internes réglés.
            </p>
          </div>
        )}

        {tab === "budget" && <BudgetSection budget={budget} />}

        {tab === "infos" && (
          <div className="space-y-4">
            <AirportGlossaryCard items={TRIP_DATA.airport_glossary} />
            <PhrasebookCard items={TRIP_DATA.phrasebook} />
          </div>
        )}

        {tab === "conseils" && (
          <div className="space-y-4">
            <TipsChecklist />
            <SimpleListCard title="Argent" items={MONEY_TIPS} />
            <SimpleListCard title="Rappels" items={TRIP_DATA.glossary.map((g) => `${g.term} — ${g.note}`)} />
          </div>
        )}
      </div>
    </div>
  );
};
