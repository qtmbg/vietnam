import type { Dispatch, SetStateAction } from "react";
import { Segmented } from "../components/Segmented";
import { Toggle } from "../components/Toggle";
import { StatChip } from "../components/StatChip";
import { ExpenseRow } from "../components/ExpenseRow";
import { formatUSD0, usdToVndLabel } from "../lib/money";
import type { BudgetFilters, BudgetComputed, BudgetTab } from "../lib/budget";
import type { View } from "../data/types";

const RESET: BudgetFilters = { inclureConfirmes: true, inclureEstimes: true, seulementJaCosmo: false, recherche: "" };

const Empty = ({ label, onReset }: { label: string; onReset: () => void }) => (
  <div className="border border-dashed border-ink-300 rounded-[3px] p-8 text-center">
    <p className="text-[14px] text-ink-600">{label}</p>
    <button
      type="button"
      onClick={onReset}
      className="mt-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-900 underline underline-offset-4 decoration-clay-400"
    >
      Réinitialiser les filtres
    </button>
  </div>
);

export const BudgetView = ({
  budgetTab,
  setBudgetTab,
  filters,
  setFilters,
  budget,
  goView,
}: {
  budgetTab: BudgetTab;
  setBudgetTab: (t: BudgetTab) => void;
  filters: BudgetFilters;
  setFilters: Dispatch<SetStateAction<BudgetFilters>>;
  budget: BudgetComputed;
  goView: (v: View) => void;
}) => (
  <div className="motion-safe:animate-fade-up px-7 pt-12">
    <div className="flex items-start justify-between gap-4 mb-9">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-600">USD · sans hôtels · sans food</p>
        <h2 className="mt-1.5 font-display font-light text-[2.8rem] text-ink-900 leading-[0.9] tracking-[-0.02em]">Budget</h2>
      </div>
      <button
        type="button"
        onClick={() => goView("home")}
        aria-label="Retour à l'accueil"
        className="shrink-0 mt-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-ink-600 active:text-ink-900 transition-colors"
      >
        ← Accueil
      </button>
    </div>

    <Segmented
      value={budgetTab}
      onChange={(id) => setBudgetTab(id as BudgetTab)}
      items={[
        { id: "overview", label: "Vue" },
        { id: "transport", label: "Transports" },
        { id: "activities", label: "Activités" },
      ]}
    />

    {/* Filters */}
    <section className="mt-8">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-600 mb-3">Filtres · affecte les totaux</p>
      <input
        value={filters.recherche}
        onChange={(e) => setFilters((f) => ({ ...f, recherche: e.target.value }))}
        placeholder="id, opérateur, trajet, notes, tag…"
        className="w-full bg-transparent border-b border-ink-300 py-2.5 text-[15px] text-ink-900 placeholder:text-ink-500 focus:border-clay-500 outline-none transition-colors"
      />
      <div className="mt-1 border-t border-ink-200 divide-y divide-ink-200">
        <Toggle label="Inclure confirmés" hint="Données confirmées" value={filters.inclureConfirmes} onChange={(v) => setFilters((f) => ({ ...f, inclureConfirmes: v }))} />
        <Toggle label="Inclure estimés" hint="Montants non confirmés" value={filters.inclureEstimes} onChange={(v) => setFilters((f) => ({ ...f, inclureEstimes: v }))} />
        <Toggle label="Uniquement Ja Cosmo" hint="Transferts opérés" value={filters.seulementJaCosmo} onChange={(v) => setFilters((f) => ({ ...f, seulementJaCosmo: v }))} />
      </div>
    </section>

    {/* Overview */}
    {budgetTab === "overview" && (
      <section className="mt-10 pb-20">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-600">Total (scope)</p>
        <p className="mt-2 font-display font-light text-[3.4rem] text-ink-900 leading-none tabular-nums tracking-[-0.02em]">{formatUSD0(budget.grand.total)}</p>
        <p className="mt-1.5 text-[14px] text-ink-500 tabular-nums">{usdToVndLabel(budget.grand.total)}</p>
        <p className="mt-2.5 text-[13px] text-ink-600">Transports + activités (USD uniquement). Hôtels / food exclus.</p>

        <div className="mt-7 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-ink-200 pt-6">
          <StatChip label="Claudine" value={formatUSD0(budget.grand.claudine_total)} accent="brand" />
          <StatChip label="Nous" value={formatUSD0(budget.grand.nous_total)} accent="ink" />
          <StatChip label="Transports" value={formatUSD0(budget.transport.total)} accent="jade" />
          <StatChip label="Activités" value={formatUSD0(budget.activities.total)} accent="sun" />
        </div>

        <div className="mt-8 border-t border-ink-200 pt-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-600 mb-3">Les règles</p>
          <ol className="space-y-2 text-[13.5px] text-ink-700 leading-relaxed">
            <li>1 — Transports : Claudine 20 % · Nous 80 %.</li>
            <li>2 — Activités : répartition explicite si disponible.</li>
            <li>3 — Confirmé vs estimé : dépend des filtres.</li>
          </ol>
        </div>
      </section>
    )}

    {/* Transport */}
    {budgetTab === "transport" && (
      <section className="mt-10 pb-20">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-600">Transports (filtrés)</p>
        <p className="mt-2 font-display text-[2.6rem] text-ink-900 leading-none tabular-nums">{formatUSD0(budget.transport.total)}</p>
        <p className="mt-1.5 text-[13px] text-ink-500 tabular-nums">{usdToVndLabel(budget.transport.total)}</p>
        <p className="mt-2.5 text-[13px] text-ink-600">
          Claudine {formatUSD0(budget.transport.claudine_total)} · Nous {formatUSD0(budget.transport.nous_total)}
        </p>
        <div className="mt-6 space-y-4">
          {budget.transport.items.length === 0 ? (
            <Empty label="Aucun transport pour ces filtres." onReset={() => setFilters(RESET)} />
          ) : (
            budget.transport.items.map((item) => <ExpenseRow key={item.id} item={item} showAlloc />)
          )}
        </div>
      </section>
    )}

    {/* Activities */}
    {budgetTab === "activities" && (
      <section className="mt-10 pb-20">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-600">Activités (filtrées)</p>
        <p className="mt-2 font-display text-[2.6rem] text-ink-900 leading-none tabular-nums">{formatUSD0(budget.activities.total)}</p>
        <p className="mt-1.5 text-[13px] text-ink-500 tabular-nums">{usdToVndLabel(budget.activities.total)}</p>
        <p className="mt-2.5 text-[13px] text-ink-600">
          Claudine {formatUSD0(budget.activities.claudine_total)} · Nous {formatUSD0(budget.activities.nous_total)}
        </p>
        <div className="mt-6 space-y-4">
          {budget.activities.items.length === 0 ? (
            <Empty label="Aucune activité pour ces filtres." onReset={() => setFilters(RESET)} />
          ) : (
            budget.activities.items.map((item) => <ExpenseRow key={item.id} item={item} showAlloc />)
          )}
        </div>
      </section>
    )}
  </div>
);
