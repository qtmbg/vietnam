// ============================================================
// MAPS — Google Maps deep links.
// ============================================================
export const googleMapsSearchUrl = (q: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

// Turn-by-turn route between two places, for a given travel mode. Used to give
// a quick "trajet depuis l'hôtel" (en voiture / à pied) for each idea.
export const googleMapsDirectionsUrl = (origin: string, destination: string, mode: "driving" | "walking") =>
  `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(
    destination
  )}&travelmode=${mode}`;
