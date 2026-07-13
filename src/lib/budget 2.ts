// ============================================================
// BUDGET ENGINE (USD) — "reste à payer", no shares.
// Pulls the three variable buckets still to settle:
//   • Hôtels   — what's still owed (HotelItem.toPayUSD), paid ones flagged
//   • Transferts privés — road/boat transfers not yet paid
//   • Activités — on-site tickets (estimates)
// Domestic flights (paid:true) are shown as already settled.
// Hotels, meals & international flights are out of scope.
// ============================================================
import type { ExpenseItemUSD, HotelItem } from "../data/types";
import { sum } from "./utils";

export type HotelToPay = { hotel: HotelItem; amount: number };

export type BudgetComputed = {
  hotels: {
    toPay: number;
    toPayItems: HotelToPay[];
    paidItems: HotelItem[];
  };
  transport: {
    toPay: number;
    paid: number; // domestic flights, already paid
    items: ExpenseItemUSD[]; // unpaid transfers only (flights excluded)
  };
  activities: {
    total: number;
    items: ExpenseItemUSD[];
  };
  grand: { toPay: number };
};

export const computeBudget = (expenses: ExpenseItemUSD[], hotels: HotelItem[]): BudgetComputed => {
  // Hotels
  const toPayItems = hotels
    .filter((h) => (h.toPayUSD ?? 0) > 0)
    .map((h) => ({ hotel: h, amount: h.toPayUSD as number }));
  const paidItems = hotels.filter((h) => !(h.toPayUSD && h.toPayUSD > 0));
  const hotelsToPay = sum(toPayItems.map((i) => i.amount));

  // Transport: split flights (paid) from road/boat transfers (to pay)
  const transport = expenses.filter((e) => e.category === "transport");
  const flightsPaid = sum(transport.filter((e) => e.mode === "flight_domestic").map((e) => e.price_total_usd));
  const transferItems = transport
    .filter((e) => e.mode !== "flight_domestic" && !e.paid)
    .slice()
    .sort((a, b) => ((a.date ?? "") < (b.date ?? "") ? -1 : 1));
  const transfersToPay = sum(transferItems.map((e) => e.price_total_usd));

  // Activities: on-site tickets
  const activityItems = expenses.filter((e) => e.category === "activity");
  const activitiesTotal = sum(activityItems.map((e) => e.price_total_usd));

  return {
    hotels: { toPay: hotelsToPay, toPayItems, paidItems },
    transport: { toPay: transfersToPay, paid: flightsPaid, items: transferItems },
    activities: { total: activitiesTotal, items: activityItems },
    grand: { toPay: hotelsToPay + transfersToPay + activitiesTotal },
  };
};
