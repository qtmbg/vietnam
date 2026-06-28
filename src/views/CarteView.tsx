import { X, MapPin, BedDouble, Sparkles, Plane } from "lucide-react";
import { Card } from "../components/Card";
import { TRIP_DATA } from "../data/trip";
import { uniqCityTokensByOrder, cityMatches } from "../lib/city";
import { googleMapsSearchUrl } from "../lib/maps";
import type { View } from "../data/types";

type Place = { icon: typeof MapPin; label: string; query: string };

const PlaceRow = ({ place }: { place: Place }) => {
  const Icon = place.icon;
  return (
    <a
      href={googleMapsSearchUrl(place.query)}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-3 rounded-2xl bg-ink-50 border border-ink-100 active:scale-[.99] transition-transform"
    >
      <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-brand-600 shadow-soft shrink-0">
        <Icon size={16} />
      </div>
      <p className="min-w-0 flex-1 text-sm font-bold text-ink-800 truncate">{place.label}</p>
      <MapPin size={16} className="text-ink-300 shrink-0" />
    </a>
  );
};

// "Carte" tab: every place of the trip as a tappable Google Maps link, grouped
// by city in itinerary order (all tokens, so pass-through cities like Da Nang
// appear), plus a dedicated airports section. List fallback for a real map —
// reuses the Maps links already present elsewhere, no new dependency.
export const CarteView = ({ goView }: { goView: (v: View) => void }) => {
  const cities = uniqCityTokensByOrder(TRIP_DATA.itinerary_days);

  return (
    <div className="motion-safe:animate-fade-up px-6 pt-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="font-display text-[2.5rem] text-ink-900 leading-none mb-1">Carte</h2>
          <p className="text-xs font-bold text-ink-400 uppercase tracking-widest">Tous les lieux du voyage</p>
        </div>
        <button type="button" onClick={() => goView("home")} aria-label="Retour à l'accueil" className="w-10 h-10 rounded-full bg-ink-100 flex items-center justify-center text-ink-500 active:scale-90 transition-transform">
          <X size={20} />
        </button>
      </div>

      <p className="mb-6 text-[13px] font-semibold text-ink-500 leading-relaxed">
        Touchez un lieu pour l’ouvrir dans Google Maps.
      </p>

      <div className="space-y-6 pb-20">
        {cities.map((city) => {
          const places: Place[] = [];
          for (const h of TRIP_DATA.hotels) {
            if (cityMatches(h.city, city)) places.push({ icon: BedDouble, label: h.name, query: h.name });
          }
          for (const a of TRIP_DATA.planned_activities) {
            if (cityMatches(a.city, city)) places.push({ icon: Sparkles, label: a.name, query: `${a.name} ${a.city}` });
          }

          return (
            <Card key={city} className="p-6">
              <div className="flex items-center justify-between gap-3 mb-4">
                <h3 className="font-display text-[22px] text-ink-900 leading-none">{city}</h3>
                <a
                  href={googleMapsSearchUrl(city + " Vietnam")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-brand-600 text-white text-xs font-black active:scale-95 transition-transform"
                >
                  <MapPin size={15} /> Ville
                </a>
              </div>

              {places.length === 0 ? (
                <p className="text-[13px] font-semibold text-ink-400 italic">Étape de transit.</p>
              ) : (
                <div className="space-y-2.5">
                  {places.map((p, i) => (
                    <PlaceRow key={i} place={p} />
                  ))}
                </div>
              )}
            </Card>
          );
        })}

        {/* Aéroports — listed separately so every airport (incl. HPH/CXR) appears. */}
        <Card className="p-6">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="p-2.5 rounded-2xl bg-sun-50 text-sun-600">
              <Plane size={20} />
            </div>
            <h3 className="font-display text-[22px] text-ink-900 leading-none">Aéroports</h3>
          </div>
          <div className="space-y-2.5">
            {TRIP_DATA.airport_glossary.map((ap) => (
              <PlaceRow
                key={ap.code}
                place={{ icon: Plane, label: `${ap.airport} (${ap.code}) · ${ap.city}`, query: `${ap.airport} ${ap.city}` }}
              />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
