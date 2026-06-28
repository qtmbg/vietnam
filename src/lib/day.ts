// ============================================================
// UNIFIED DAY MODEL
//
// selectDay(date) joins, for one ISO date, the slices that the rest
// of the app keeps in separate arrays:
//   • the itinerary entry for that date (city, theme, blocks)
//   • the hotel(s) active that day (matched by city)
//   • the planned activities of the day's city
//   • the transfers (transport expenses) whose date matches
//   • the aggregated day cost (date-bound transfers, 20/80 split)
//
// It DERIVES everything from TRIP_DATA — it never duplicates data.
// ============================================================
import { TRIP_DATA } from "../data/trip";
import { cityMatches } from "./city";
import type { HotelItem, ItineraryDay, ExpenseItemUSD, PlannedActivity } from "../data/types";

export type DayCost = {
  /** Sum of the day's transfers (USD). The only genuinely date-bound cost. */
  transfersTotal: number;
  /** Claudine's share of transfers (20%, per the budget rule). */
  claudine: number;
  /** The rest-of-family share of transfers (80%). */
  nous: number;
  /** Grand total for the day (currently = transfersTotal). */
  total: number;
};

export type DaySelection = {
  date: string;
  /** The itinerary entry for this date, or null if the date is outside the trip. */
  itineraryDay: ItineraryDay | null;
  /** The day's city label (raw, e.g. "Hanoi → Ninh Binh"), or null. */
  city: string | null;
  /** Hotel(s) where you sleep that night (matched on the day's destination city). */
  hotels: HotelItem[];
  /** Planned activities located in the day's city. */
  activities: PlannedActivity[];
  /** Transport expenses (private transfers + domestic flights) dated this day. */
  transfers: ExpenseItemUSD[];
  /** Aggregated day cost, derived from the day's transfers. */
  cost: DayCost;
};

// The distinct city tokens of a day ("A → B" → ["A", "B"]).
const dayCityTokens = (city: string) => city.split("→").map((t) => t.trim()).filter(Boolean);

export const selectDay = (date: string): DaySelection => {
  const itineraryDay = TRIP_DATA.itinerary_days.find((d) => d.date === date) ?? null;
  const tokens = itineraryDay ? dayCityTokens(itineraryDay.city) : [];

  const inDayCity = (city: string) => tokens.some((t) => cityMatches(t, city));

  // Where you sleep = the day's destination (last token of "A → B"), so a
  // transit day shows the hotel you arrive at, not the one you left.
  const destToken = tokens[tokens.length - 1];
  const hotels = itineraryDay && destToken ? TRIP_DATA.hotels.filter((h) => cityMatches(destToken, h.city)) : [];
  const activities = itineraryDay ? TRIP_DATA.planned_activities.filter((a) => inDayCity(a.city)) : [];

  const transfers = TRIP_DATA.expenses_usd.filter((e) => e.category === "transport" && e.date === date);

  const transfersTotal = transfers.reduce((acc, e) => acc + e.price_total_usd, 0);
  const cost: DayCost = {
    transfersTotal,
    claudine: transfersTotal * 0.2,
    nous: transfersTotal * 0.8,
    total: transfersTotal,
  };

  return {
    date,
    itineraryDay,
    city: itineraryDay?.city ?? null,
    hotels,
    activities,
    transfers,
    cost,
  };
};
