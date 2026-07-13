import { Plane, BedDouble, Ticket } from "lucide-react";
import { Segmented } from "../components/Segmented";
import { FoodGuide } from "../components/FoodGuide";
import { RestaurantGuide } from "../components/RestaurantGuide";
import { ThingsGuide } from "../components/ThingsGuide";
import { FlightLegCard } from "../components/FlightLegCard";
import { DocCard } from "../components/DocCard";
import { AirportGlossaryCard } from "../components/AirportGlossaryCard";
import { PhrasebookCard } from "../components/PhrasebookCard";
import { TipsChecklist } from "../components/TipsChecklist";
import { SimpleListCard } from "../components/SimpleListCard";
import { BudgetSection } from "../components/BudgetSection";
import { CurrencyConverter } from "../components/CurrencyConverter";
import { FOOD_GUIDE, FLIGHTS, MONEY_TIPS, TRIP_DATA } from "../data/trip";
import { RESTAURANTS, THINGS_TODO } from "../data/guide";
import { INTL_TICKETS, DOHA_DOCS, ACTIVITY_DOCS } from "../data/documents";
import type { BudgetComputed } from "../lib/budget";

export type GuideTab = "cuisine" | "afaire" | "vols" | "budget" | "infos" | "conseils";

// Small uppercase section divider used inside a tab to separate sub-sections.
const SectionLabel = ({ children }: { children: string }) => (
  <p className="mb-3 mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-500">{children}</p>
);

// The "Guide" tab merges cuisine + à faire + vols + budget + infos + conseils
// into one sectioned reference view. Budget lives here now (no longer its own tab).
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
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-600">Food · à faire · vols · budget</p>
        <h2 className="mt-1.5 font-display font-semibold text-[2.8rem] text-ink-900 leading-[0.9] tracking-[-0.02em]">Guide</h2>
      </div>

      <Segmented
        value={tab}
        onChange={(id) => setTab(id as GuideTab)}
        items={[
          { id: "cuisine", label: "Cuisine" },
          { id: "afaire", label: "À faire" },
          { id: "vols", label: "Vols" },
          { id: "budget", label: "Budget" },
          { id: "infos", label: "Infos" },
          { id: "conseils", label: "Conseils" },
        ]}
      />

      <div className="mt-10 pb-20">
        {tab === "cuisine" && (
          <div className="space-y-8">
            <div>
              <SectionLabel>Les plats à goûter</SectionLabel>
              <FoodGuide groups={FOOD_GUIDE} />
            </div>
            <div>
              <SectionLabel>Où manger · nos adresses</SectionLabel>
              <RestaurantGuide groups={RESTAURANTS} />
            </div>
          </div>
        )}

        {tab === "afaire" && (
          <div>
            <p className="mb-5 text-[15px] text-ink-600 leading-relaxed">
              Un <b>menu d'idées</b> par étape — rien n'est réservé ni figé. On pioche au fil de l'envie, de la météo et de
              l'énergie du jour. Le badge 👶 repère simplement les sorties qui plaisent le plus à Aydann & Milann.
            </p>
            <ThingsGuide groups={THINGS_TODO} />
          </div>
        )}

        {tab === "vols" && (
          <div className="space-y-4">
            {FLIGHTS.map((leg, i) => (
              <FlightLegCard key={i} leg={leg} />
            ))}

            <DocCard
              title="Billets internationaux"
              note="E-ticket Qatar Airways par voyageur (réf X6CPNI) — touchez pour ouvrir le PDF."
              docs={INTL_TICKETS}
              icon={Plane}
            />

            <DocCard
              title="Escale Doha — hôtel"
              note="Hôtel offert par Qatar Airways pendant l'escale (~14 h)."
              docs={DOHA_DOCS}
              icon={BedDouble}
            />

            <DocCard
              title="Billets activités"
              note="Réservés & payés — voucher à présenter sur place (retrait au guichet ~10 min avant)."
              docs={ACTIVITY_DOCS}
              icon={Ticket}
            />

            <p className="mt-2 pl-3.5 border-l-2 border-jade-400 text-[15px] text-ink-600 leading-relaxed">
              Tous les vols sont confirmés et payés : billet Qatar Airways émis (réf X6CPNI) et les 4 vols VietJet internes réglés. Chaque vol interne a son billet PDF directement sur la ligne du segment.
            </p>
          </div>
        )}

        {tab === "budget" && (
          <div className="space-y-4">
            <CurrencyConverter />
            <BudgetSection budget={budget} />
          </div>
        )}

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
