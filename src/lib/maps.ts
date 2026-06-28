// ============================================================
// MAPS — Google Maps deep links.
// ============================================================
export const googleMapsSearchUrl = (q: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
