import { TRIP_DATA } from "../data/trip";
import { uniqCityTokensByOrder, cityMatches } from "../lib/city";
import { googleMapsSearchUrl } from "../lib/maps";
import type { View } from "../data/types";

type Place = { kind: string; label: string; query: string };

const PlaceRow = ({ place }: { place: Place }) => (
  <a
    href={googleMapsSearchUrl(place.query)}
    target="_blank"
    rel="noopener noreferrer"
    className="group flex items-baseline gap-4 py-3.5 border-b border-ink-200"
  >
    <span className="w-[4.75rem] shrink-0 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-500">{place.kind}</span>
    <span className="flex-1 text-[15px] font-medium text-ink-900 leading-snug">{place.label}</span>
    <span className="shrink-0 text-ink-300 text-sm group-active:translate-x-0.5 transition-transform">↗</span>
  </a>
);

// "Carte" tab: every place as a tappable Google Maps link, grouped by city in
// itinerary order (all tokens, so Da Nang appears) + an airports section.
// Editorial ruled lists, no icons. List fallback for a real map, no new deps.
export const CarteView = ({ goView }: { goView: (v: View) => void }) => {
  const cities = uniqCityTokensByOrder(TRIP_DATA.itinerary_days);

  return (
    <div className="motion-safe:animate-fade-up px-7 pt-12">
      <div className="flex items-start justify-between gap-4 mb-7">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-500">Tous les lieux</p>
          <h2 className="mt-1.5 font-display font-light text-[2.8rem] text-ink-900 leading-[0.9] tracking-[-0.02em]">Carte</h2>
        </div>
        <button
          type="button"
          onClick={() => goView("home")}
          aria-label="Retour à l'accueil"
          className="shrink-0 mt-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-ink-500 active:text-ink-900 transition-colors"
        >
          ← Accueil
        </button>
      </div>

      <p className="mb-8 text-[14px] text-ink-500 leading-relaxed">Touchez un lieu pour l’ouvrir dans Google Maps.</p>

      <div className="space-y-10 pb-20">
        {cities.map((city) => {
          const places: Place[] = [];
          for (const h of TRIP_DATA.hotels) {
            if (cityMatches(h.city, city)) places.push({ kind: "Hôtel", label: h.name, query: h.name });
          }
          for (const a of TRIP_DATA.planned_activities) {
            if (cityMatches(a.city, city)) places.push({ kind: "Activité", label: a.name, query: `${a.name} ${a.city}` });
          }

          return (
            <section key={city}>
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-display text-[1.7rem] text-ink-900 leading-none tracking-[-0.01em]">{city}</h3>
                <a
                  href={googleMapsSearchUrl(city + " Vietnam")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-900 underline underline-offset-4 decoration-clay-400 decoration-1"
                >
                  Ville ↗
                </a>
              </div>
              {places.length === 0 ? (
                <p className="mt-2.5 text-[13px] font-display italic text-ink-400">Étape de transit.</p>
              ) : (
                <div className="mt-3 border-t border-ink-200">
                  {places.map((p, i) => (
                    <PlaceRow key={i} place={p} />
                  ))}
                </div>
              )}
            </section>
          );
        })}

        {/* Aéroports — every airport, incl. HPH / CXR */}
        <section>
          <h3 className="font-display text-[1.7rem] text-ink-900 leading-none tracking-[-0.01em]">Aéroports</h3>
          <div className="mt-3 border-t border-ink-200">
            {TRIP_DATA.airport_glossary.map((ap) => (
              <PlaceRow key={ap.code} place={{ kind: "Aéroport", label: `${ap.airport} (${ap.code}) · ${ap.city}`, query: `${ap.airport} ${ap.city}` }} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
