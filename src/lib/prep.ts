// ============================================================
// PREP MODE — "what's left to settle" before departure.
// Derives from the existing expenses + hotels (no duplication).
// ============================================================
import type { ExpenseItemUSD, HotelItem } from "../data/types";
import { sum } from "./utils";
import { formatUSD0 } from "./money";

export type HotelToSettle = { hotel: HotelItem; reason: string };

export type ToSettle = {
  /** Private transfers still to pay (van/boat — excludes already-paid flights). */
  transferCount: number;
  transportToPay: number;
  /** Hotels still owed money (HotelItem.toPayUSD > 0). */
  hotels: HotelToSettle[];
};

export const selectToSettle = (expenses: ExpenseItemUSD[], hotels: HotelItem[]): ToSettle => {
  const transfers = expenses.filter((e) => e.category === "transport" && e.mode !== "flight_domestic" && !e.paid);
  const transportToPay = sum(transfers.map((e) => e.price_total_usd));

  const hotelsToSettle: HotelToSettle[] = hotels
    .filter((h) => (h.toPayUSD ?? 0) > 0)
    .map((h) => ({ hotel: h, reason: h.paidNote ?? `À régler · ${formatUSD0(h.toPayUSD as number)}` }));

  return { transferCount: transfers.length, transportToPay, hotels: hotelsToSettle };
};
