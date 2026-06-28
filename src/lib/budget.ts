// ============================================================
// BUDGET ENGINE (USD only, no hotels, no food)
// Simple by design — no filters. Splits the trip's variable cost
// (transport + activities) into "déjà payé" and "reste à payer",
// and into Claudine / Nous shares.
//   • Transport: Claudine 20% / Nous 80%
//   • Activities: explicit split if given, else adult_equal_split (÷3)
//   • paid === true (domestic flights) → already settled
// ============================================================
import type { ExpenseItemUSD } from "../data/types";
import { sum } from "./utils";

export type AllocatedExpense = ExpenseItemUSD & { alloc_claudine: number; alloc_nous: number };

export type BudgetGroup = {
  total: number; // everything in the group
  paid: number; // already settled
  toPay: number; // still to settle
  claudine: number; // Claudine share over the whole group
  nous: number; // Nous share over the whole group
  claudineToPay: number; // Claudine share, unpaid items only
  nousToPay: number; // Nous share, unpaid items only
  items: AllocatedExpense[];
};

export type BudgetComputed = {
  transport: BudgetGroup;
  activities: BudgetGroup;
  grand: {
    total: number;
    paid: number;
    toPay: number;
    claudineToPay: number;
    nousToPay: number;
  };
};

const allocTransport = (t: ExpenseItemUSD): AllocatedExpense => ({
  ...t,
  alloc_claudine: t.price_total_usd * 0.2,
  alloc_nous: t.price_total_usd * 0.8,
});

const allocActivity = (a: ExpenseItemUSD): AllocatedExpense => {
  if (a.payer_rule === "split_given") {
    return { ...a, alloc_claudine: a.claudine_usd ?? 0, alloc_nous: a.nous_usd ?? 0 };
  }
  const each = a.price_total_usd / 3; // adult_equal_split fallback
  return { ...a, alloc_claudine: each, alloc_nous: a.price_total_usd - each };
};

const group = (items: AllocatedExpense[]): BudgetGroup => {
  const unpaid = items.filter((i) => !i.paid);
  const paidItems = items.filter((i) => i.paid);
  return {
    total: sum(items.map((i) => i.price_total_usd)),
    paid: sum(paidItems.map((i) => i.price_total_usd)),
    toPay: sum(unpaid.map((i) => i.price_total_usd)),
    claudine: sum(items.map((i) => i.alloc_claudine)),
    nous: sum(items.map((i) => i.alloc_nous)),
    claudineToPay: sum(unpaid.map((i) => i.alloc_claudine)),
    nousToPay: sum(unpaid.map((i) => i.alloc_nous)),
    items,
  };
};

export const computeBudget = (expenses: ExpenseItemUSD[]): BudgetComputed => {
  const transport = group(expenses.filter((e) => e.category === "transport").map(allocTransport));
  const activities = group(expenses.filter((e) => e.category === "activity").map(allocActivity));

  return {
    transport,
    activities,
    grand: {
      total: transport.total + activities.total,
      paid: transport.paid + activities.paid,
      toPay: transport.toPay + activities.toPay,
      claudineToPay: transport.claudineToPay + activities.claudineToPay,
      nousToPay: transport.nousToPay + activities.nousToPay,
    },
  };
};
