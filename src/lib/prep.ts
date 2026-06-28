// ============================================================
// PREP MODE — "what's left to settle" before departure.
// Derives from the existing expenses + hotels (no duplication).
// ============================================================
import type { ExpenseItemUSD, HotelItem } from "../data/types";
import { sum } from "./utils";

export type HotelToSettle = { hotel: HotelItem; reason: string };

export type ToSettle = {
  /** Private transfers still to pay (van/boat — excludes already-paid flights). */
  transferCount: number;
  transportToPay: number;
  /** All unpaid transport + activities (USD). */
  toPayTotal: number;
  /** Hotels not fully paid (no payer, or a paidNote that mentions "à régler"). */
  hotels: HotelToSettle[];
};

const STILL_DUE = /à régler|a régler|reste/i;

export const selectToSettle = (expenses: ExpenseItemUSD[], hotels: HotelItem[]): ToSettle => {
  const unpaid = expenses.filter((e) => !e.paid);
  const transfers = unpaid.filter((e) => e.category === "transport" && e.mode !== "flight_domestic");
  const transportToPay = sum(transfers.map((e) => e.price_total_usd));
  const toPayTotal = sum(unpaid.map((e) => e.price_total_usd));

  const hotelsToSettle: HotelToSettle[] = [];
  for (const h of hotels) {
    if (!h.paidBy) {
      hotelsToSettle.push({ hotel: h, reason: "À régler" });
    } else if (h.paidNote && STILL_DUE.test(h.paidNote)) {
      hotelsToSettle.push({ hotel: h, reason: h.paidNote });
    }
  }

  return { transferCount: transfers.length, transportToPay, toPayTotal, hotels: hotelsToSettle };
};
