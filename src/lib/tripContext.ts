// ============================================================
// TRIP CONTEXT — flattens the whole trip into a text brief for
// Mr. Tang (the concierge sends this with every request).
// ============================================================
import { TRIP_DATA } from "../data/trip";

export const buildTripContext = (today: string) => {
  const d = TRIP_DATA;
  const flights =
    "Vols internationaux (Qatar Airways, réf X6CPNI) : Marrakech 24/07 18:15 → escale 14h à Doha (hôtel offert par Qatar Airways) → arrivée Hanoi 26/07 07:15 (vol QR982). Retour : Hanoi 17/08 19:30 (QR977) → Doha → Casablanca → Marrakech 18/08 09:20.";
  const internal = d.expenses_usd
    .filter((e) => e.mode === "flight_domestic")
    .map((e) => `${e.title} (${e.date}) ${e.notes ?? ""}`)
    .join(" ; ");
  const hotels = d.hotels.map((h) => `${h.city} — ${h.name} (${h.dates})${h.paidBy ? `, payé par ${h.paidBy}` : ""}`).join("\n");
  const days = d.itinerary_days
    .map((x) => `${x.date} ${x.city} [${x.theme.join(", ")}] : ${x.blocks.map((b) => `${b.label}: ${b.plan}`).join(" | ")}`)
    .join("\n");
  const acts = d.planned_activities
    .map(
      (a) =>
        `${a.city} — ${a.name}${a.window ? ` [${a.window}]` : ""} (${a.duration ?? ""}, ${a.bestTime ?? ""})${a.booked ? " — RÉSERVÉ & PAYÉ, billets en poche" : ""}`
    )
    .join(" ; ");
  const transfers = d.expenses_usd
    .filter((e) => e.category === "transport" && e.mode !== "flight_domestic")
    .map((e) => `${e.date ?? "?"} ${e.from}→${e.to}`)
    .join(" ; ");
  return [
    `Voyageurs : ${d.meta.travelers}.`,
    `Date du jour : ${today}.`,
    flights,
    `Vols internes (VietJet) : ${internal}.`,
    `Hôtels :\n${hotels}`,
    `Itinéraire jour par jour :\n${days}`,
    `Transferts privés : ${transfers}.`,
    `Activités prévues : ${acts}.`,
    "Budget (transports + activités, hors hôtels/repas) : transferts privés en van 16 places confirmés et à régler sur place ; vols internes VietJet déjà payés ; activités payées sur place (billets). Répartition : transports Claudine 20% / le reste de la famille 80% ; activités à parts égales entre adultes (1 $ ≈ 25 970 VND).",
  ].join("\n\n");
};
