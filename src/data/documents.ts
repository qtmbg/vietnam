// ============================================================
// TRAVEL DOCUMENTS — the real PDFs (flight tickets + Doha hotel),
// served from /public/docs and opened in a new tab in one tap.
// ============================================================
import { P } from "../lib/assets";
import type { TravelDoc } from "./types";

// International flight — one e-ticket per traveller (Qatar Airways, réf X6CPNI).
export const INTL_TICKETS: TravelDoc[] = [
  { label: "Nizzar", sub: "Billet Qatar Airways · RAK → HAN", file: P("/docs/flights/intl/nizzar.pdf") },
  { label: "Marilyne", sub: "Billet Qatar Airways · RAK → HAN", file: P("/docs/flights/intl/marilyne.pdf") },
  { label: "Aydann", sub: "Billet Qatar Airways · RAK → HAN", file: P("/docs/flights/intl/aydann.pdf") },
  { label: "Milann", sub: "Billet Qatar Airways · RAK → HAN", file: P("/docs/flights/intl/milann.pdf") },
  { label: "Claudine", sub: "Billet Qatar Airways · RAK → HAN", file: P("/docs/flights/intl/claudine.pdf") },
];

// Internal VietJet legs — itinerary per flight, keyed by reservation code so a
// flight segment can link straight to its own ticket.
export const INTERNAL_DOC_BY_RESA: Record<string, string> = {
  "7BYD6X": P("/docs/flights/internal/vj723-hph-dad.pdf"), // VJ723 · HPH → DAD
  GPXYYA: P("/docs/flights/internal/vj581-dad-cxr.pdf"), // VJ581 · DAD → CXR
  E9UN3Z: P("/docs/flights/internal/vj601-cxr-sgn.pdf"), // VJ601 · CXR → SGN
  FCRQ6G: P("/docs/flights/internal/vj136-sgn-han.pdf"), // VJ136 · SGN → HAN
};

export const INTERNAL_TICKETS: TravelDoc[] = [
  { label: "VJ723 · HPH → DAD", sub: "01 août · réf 7BYD6X", file: INTERNAL_DOC_BY_RESA["7BYD6X"] },
  { label: "VJ581 · DAD → CXR", sub: "08 août · réf GPXYYA", file: INTERNAL_DOC_BY_RESA.GPXYYA },
  { label: "VJ601 · CXR → SGN", sub: "12 août · réf E9UN3Z", file: INTERNAL_DOC_BY_RESA.E9UN3Z },
  { label: "VJ136 · SGN → HAN", sub: "15 août · réf FCRQ6G", file: INTERNAL_DOC_BY_RESA.FCRQ6G },
];

// Doha stopover — hotel offered by Qatar Airways during the ~14 h layover.
export const DOHA_DOCS: TravelDoc[] = [
  { label: "Confirmation hôtel — chambre 1", sub: "Escale Doha · 25 juil", file: P("/docs/doha/receipt-1.pdf") },
  { label: "Confirmation hôtel — chambre 2", sub: "Escale Doha · 25 juil", file: P("/docs/doha/receipt-2.pdf") },
  { label: "Confirmation hôtel — chambre 3", sub: "Escale Doha · 25 juil", file: P("/docs/doha/receipt-3.pdf") },
];
