// ============================================================
// BUDGET ENGINE (USD only, no hotels, no food)
// - Transport: 20% Claudine / 80% Nous (on the included transport set)
// - Activities: explicit split if provided else adult_equal_split fallback
// ============================================================
import type { ExpenseItemUSD } from "../data/types";
import { sum } from "./utils";

export type BudgetTab = "overview" | "transport" | "activities";

export type BudgetFilters = {
  inclureConfirmes: boolean;
  inclureEstimes: boolean;
  seulementJaCosmo: boolean;
  recherche: string;
};

type AllocatedExpense = ExpenseItemUSD & { alloc_claudine: number; alloc_nous: number };

export type BudgetComputed = {
  transport: {
    total: number;
    items: AllocatedExpense[];
    claudine_total: number;
    nous_total: number;
  };
  activities: {
    total: number;
    items: AllocatedExpense[];
    claudine_total: number;
    nous_total: number;
  };
  grand: {
    total: number;
    claudine_total: number;
    nous_total: number;
  };
};

export const computeBudget = (expenses: ExpenseItemUSD[], filters: BudgetFilters): BudgetComputed => {
  const q = filters.recherche.trim().toLowerCase();

  const filtered = expenses.filter((e) => {
    if (!filters.inclureConfirmes && e.status === "CONFIRMED") return false;
    if (!filters.inclureEstimes && e.status === "ESTIMATE") return false;
    if (filters.seulementJaCosmo && !e.operated_by_ja_cosmo) return false;

    if (q) {
      const blob = [
        e.id,
        e.category,
        e.mode,
        e.operator,
        e.status,
        e.title,
        e.from ?? "",
        e.to ?? "",
        (e.tags ?? []).join(" "),
        e.notes ?? "",
      ]
        .join(" ")
        .toLowerCase();
      if (!blob.includes(q)) return false;
    }
    return true;
  });

  const transports = filtered.filter((e) => e.category === "transport");
  const activities = filtered.filter((e) => e.category === "activity");

  const transportTotal = sum(transports.map((t) => t.price_total_usd));
  const transportClaudine = transportTotal * 0.2;
  const transportNous = transportTotal * 0.8;

  const transportItems = transports.map((t) => {
    const ratio = transportTotal > 0 ? t.price_total_usd / transportTotal : 0;
    return {
      ...t,
      alloc_claudine: transportClaudine * ratio,
      alloc_nous: transportNous * ratio,
    };
  });

  const activityItems = activities.map((a) => {
    if (a.payer_rule === "split_given") {
      return { ...a, alloc_claudine: a.claudine_usd ?? 0, alloc_nous: a.nous_usd ?? 0 };
    }
    const each = a.price_total_usd / 3; // fallback
    return { ...a, alloc_claudine: each, alloc_nous: a.price_total_usd - each };
  });

  const activitiesTotal = sum(activityItems.map((a) => a.price_total_usd));
  const activitiesClaudine = sum(activityItems.map((a) => a.alloc_claudine));
  const activitiesNous = sum(activityItems.map((a) => a.alloc_nous));

  const grandTotal = transportTotal + activitiesTotal;
  const grandClaudine = transportClaudine + activitiesClaudine;
  const grandNous = transportNous + activitiesNous;

  return {
    transport: { total: transportTotal, items: transportItems, claudine_total: transportClaudine, nous_total: transportNous },
    activities: { total: activitiesTotal, items: activityItems, claudine_total: activitiesClaudine, nous_total: activitiesNous },
    grand: { total: grandTotal, claudine_total: grandClaudine, nous_total: grandNous },
  };
};
