import type { Dispatch, SetStateAction } from "react";
import { X, Wallet, Car, Sparkles, Search, BadgeCheck, BadgeHelp, RotateCcw } from "lucide-react";
import { Glass } from "../components/Glass";
import { Segmented } from "../components/Segmented";
import { Toggle } from "../components/Toggle";
import { StatChip } from "../components/StatChip";
import { ExpenseRow } from "../components/ExpenseRow";
import { formatUSD0 } from "../lib/money";
import type { BudgetFilters, BudgetComputed, BudgetTab } from "../lib/budget";
import type { View } from "../data/types";

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
  <div className="motion-safe:animate-fade-up px-6 pt-12">
    <div className="flex justify-between items-center mb-10">
      <div>
        <h2 className="font-display text-[2.5rem] text-ink-900 leading-none mb-1">Budget</h2>
        <p className="text-xs font-bold text-ink-400 uppercase tracking-widest">USD uniquement • sans hôtels • sans food</p>
      </div>
      <button type="button" onClick={() => goView("home")} aria-label="Retour à l'accueil" className="w-10 h-10 rounded-full bg-ink-100 flex items-center justify-center text-ink-500 active:scale-90 transition-transform">
        <X size={20} />
      </button>
    </div>

    <div className="mb-8">
      <Segmented
        value={budgetTab}
        onChange={(id) => setBudgetTab(id as BudgetTab)}
        items={[
          { id: "overview", label: "Vue d’ensemble", icon: <Wallet size={16} /> },
          { id: "transport", label: "Transports", icon: <Car size={16} /> },
          { id: "activities", label: "Activités", icon: <Sparkles size={16} /> },
        ]}
      />
    </div>

    {/* Filters */}
    <div className="mb-8 bg-white rounded-[40px] border border-ink-100 shadow-xl p-7">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-ink-50 border border-ink-100 flex items-center justify-center text-ink-600">
            <Search size={18} />
          </div>
          <div>
            <p className="text-sm font-black text-ink-900">Filtres</p>
            <p className="text-[13px] font-bold text-ink-400 uppercase tracking-widest">Affecte les totaux</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <div className="p-4 rounded-3xl bg-ink-50 border border-ink-100">
          <p className="text-[13px] font-black text-ink-400 uppercase tracking-widest mb-2">Recherche</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white border border-ink-200 flex items-center justify-center text-ink-500">
              <Search size={18} />
            </div>
            <input
              value={filters.recherche}
              onChange={(e) => setFilters((f) => ({ ...f, recherche: e.target.value }))}
              placeholder="id, opérateur, trajet, notes, tag…"
              className="w-full bg-white border border-ink-200 rounded-2xl px-4 py-3 text-sm font-bold text-ink-900"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Toggle
            label="Inclure confirmés"
            icon={<BadgeCheck size={18} />}
            value={filters.inclureConfirmes}
            onChange={(v) => setFilters((f) => ({ ...f, inclureConfirmes: v }))}
            hint="Données confirmées"
          />
          <Toggle
            label="Inclure estimés"
            icon={<BadgeHelp size={18} />}
            value={filters.inclureEstimes}
            onChange={(v) => setFilters((f) => ({ ...f, inclureEstimes: v }))}
            hint="Montants non confirmés"
          />
          <Toggle
            label="Uniquement Ja Cosmo"
            icon={<BadgeCheck size={18} />}
            value={filters.seulementJaCosmo}
            onChange={(v) => setFilters((f) => ({ ...f, seulementJaCosmo: v }))}
            hint="Transferts opérés"
          />
        </div>
      </div>
    </div>

    {/* Overview */}
    {budgetTab === "overview" && (
      <div className="space-y-6 pb-20">
        <Glass className="rounded-[40px] p-8">
          <p className="text-[13px] font-black text-sun-500 uppercase tracking-widest mb-4">Total (scope)</p>
          <p className="text-5xl font-black text-ink-900 tracking-tighter mb-3">{formatUSD0(budget.grand.total)}</p>
          <p className="text-xs font-bold text-ink-500">Transports + activités (USD uniquement). Hôtels/food exclus.</p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <StatChip label="Claudine" value={formatUSD0(budget.grand.claudine_total)} accent="brand" />
            <StatChip label="Nous" value={formatUSD0(budget.grand.nous_total)} accent="ink" />
            <StatChip label="Transports" value={formatUSD0(budget.transport.total)} accent="jade" />
            <StatChip label="Activités" value={formatUSD0(budget.activities.total)} accent="sun" />
          </div>

          <div className="mt-6 p-5 rounded-[28px] bg-ink-50 border border-ink-100">
            <p className="text-[13px] font-black uppercase tracking-widest text-ink-400 mb-2">Règles</p>
            <div className="space-y-2">
              <p className="text-xs font-bold text-ink-700">1) Transports : Claudine 20% • Nous 80%</p>
              <p className="text-xs font-bold text-ink-700">2) Activités : répartition explicite si disponible</p>
              <p className="text-xs font-bold text-ink-700">3) Confirmé vs estimé : dépend des filtres</p>
            </div>
          </div>
        </Glass>
      </div>
    )}

    {/* Transport */}
    {budgetTab === "transport" && (
      <div className="space-y-5 pb-20">
        <Glass className="rounded-[40px] p-8">
          <p className="text-[13px] font-black text-jade-600 uppercase tracking-widest mb-3">Transports (filtrés)</p>
          <p className="text-4xl font-black text-ink-900 tracking-tighter">{formatUSD0(budget.transport.total)}</p>
          <p className="mt-2 text-xs font-bold text-ink-500">
            Répartition : Claudine {formatUSD0(budget.transport.claudine_total)} • Nous {formatUSD0(budget.transport.nous_total)}
          </p>
        </Glass>

        {budget.transport.items.length === 0 ? (
          <div className="rounded-card border border-dashed border-ink-200 p-8 text-center">
            <p className="text-sm font-semibold text-ink-500">Aucun transport pour ces filtres.</p>
            <button
              type="button"
              onClick={() => setFilters((f) => ({ ...f, recherche: "", inclureConfirmes: true, inclureEstimes: true, seulementJaCosmo: false }))}
              className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ink-100 text-ink-700 text-xs font-bold active:scale-95 transition-transform"
            >
              <RotateCcw size={14} /> Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {budget.transport.items.map((item) => (
              <ExpenseRow key={item.id} item={item} showAlloc />
            ))}
          </div>
        )}
      </div>
    )}

    {/* Activities */}
    {budgetTab === "activities" && (
      <div className="space-y-5 pb-20">
        <Glass className="rounded-[40px] p-8">
          <p className="text-[13px] font-black text-sun-600 uppercase tracking-widest mb-3">Activités (filtrées)</p>
          <p className="text-4xl font-black text-ink-900 tracking-tighter">{formatUSD0(budget.activities.total)}</p>
          <p className="mt-2 text-xs font-bold text-ink-500">
            Répartition : Claudine {formatUSD0(budget.activities.claudine_total)} • Nous {formatUSD0(budget.activities.nous_total)}
          </p>
        </Glass>

        {budget.activities.items.length === 0 ? (
          <div className="rounded-card border border-dashed border-ink-200 p-8 text-center">
            <p className="text-sm font-semibold text-ink-500">Aucune activité pour ces filtres.</p>
            <button
              type="button"
              onClick={() => setFilters((f) => ({ ...f, recherche: "", inclureConfirmes: true, inclureEstimes: true, seulementJaCosmo: false }))}
              className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ink-100 text-ink-700 text-xs font-bold active:scale-95 transition-transform"
            >
              <RotateCcw size={14} /> Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {budget.activities.items.map((item) => (
              <ExpenseRow key={item.id} item={item} showAlloc />
            ))}
          </div>
        )}
      </div>
    )}
  </div>
);
