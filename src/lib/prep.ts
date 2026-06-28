// ============================================================
// PREP MODE — "what's left to settle" before departure.
// Derives from the existing expenses + hotels (no duplication).
// ============================================================
import type { ExpenseItemUSD, HotelItem } from "../data/types";

export type HotelToSettle = { hotel: HotelItem; reason: string };

export type ToSettle = {
  /** Expenses still flagged ESTIMATE (not yet confirmed/settled). */
  estimates: ExpenseItemUSD[];
  estimatesTotal: number;
  /** Hotels not fully paid (no payer, or a paidNote that mentions "à régler"). */
  hotels: HotelToSettle[];
};

const STILL_DUE = /à régler|a régler|reste/i;

export const selectToSettle = (expenses: ExpenseItemUSD[], hotels: HotelItem[]): ToSettle => {
  const estimates = expenses.filter((e) => e.status === "ESTIMATE");
  const estimatesTotal = estimates.reduce((acc, e) => acc + e.price_total_usd, 0);

  const hotelsToSettle: HotelToSettle[] = [];
  for (const h of hotels) {
    if (!h.paidBy) {
      hotelsToSettle.push({ hotel: h, reason: "À régler" });
    } else if (h.paidNote && STILL_DUE.test(h.paidNote)) {
      hotelsToSettle.push({ hotel: h, reason: h.paidNote });
    }
  }

  return { estimates, estimatesTotal, hotels: hotelsToSettle };
};
