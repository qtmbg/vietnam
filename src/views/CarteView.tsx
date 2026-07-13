import { useState } from "react";
import { ChevronRight, Car, Footprints, MapPin } from "lucide-react";
import { DayDetail, type DayDetailState } from "../components/DayDetail";
import { StarRating } from "../components/StarRating";
import { TRIP_DATA } from "../data/trip";
import { CITY_IDEAS } from "../data/guide";
import { uniqCityTokensByOrder, cityMatches } from "../lib/city";
import { googleMapsSearchUrl, googleMapsDirectionsUrl } from "../lib/maps";

// A place that opens its full detail (with the "à montrer au chauffeur" DriverCard).
const NavRow = ({ kind, label, sub, onClick }: { kind: string; label: string; sub?: string; onClick: () => void }) => (
  <button type="button" onClick={onClick} className="group w-full flex items-baseline gap-4 py-3.5 text-left">
    <span className="w-[4.5rem] shrink-0 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-600">{kind}</span>
    <span className="min-w-0 flex-1">
      <span className="block text-[16px] font-medium text-ink-900 leading-snug">{label}</span>
      {sub && <span className="block mt-0.5 text-[12.5px] text-ink-500 leading-snug">{sub}</span>}
    </span>
    <ChevronRight size={18} className="shrink-0 text-ink-300 group-active:translate-x-0.5 transition-transform" aria-hidden="true" />
  </button>
);

const trajetLink =
  "inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-800 underline underline-offset-4 decoration-accent-400 decoration-1 active:text-accent-600 transition-colors";

// "Trajet depuis l'hôtel" — en voiture + à pied (Google Maps directions), pour
// avoir une idée de la distance. Plus un lien Carte direct vers le lieu.
const Trajet = ({ origin, destination }: { origin?: string; destination: string }) => (
  <div className="mt-2 flex items-center flex-wrap gap-x-3 gap-y-1.5">
    {origin && (
      <>
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-400">Depuis l'hôtel</span>
        <a href={googleMapsDirectionsUrl(origin, destination, "driving")} target="_blank" rel="noopener noreferrer" className={trajetLink}>
          <Car size={13} aria-hidden="true" /> Voiture
        </a>
        <a href={googleMapsDirectionsUrl(origin, destination, "walking")} target="_blank" rel="noopener noreferrer" className={trajetLink}>
          <Footprints size={13} aria-hidden="true" /> À pied
        </a>
      </>
    )}
    <a href={googleMapsSearchUrl(destination)} target="_blank" rel="noopener noreferrer" className={`${trajetLink} ml-auto`}>
      <MapPin size={13} aria-hidden="true" /> Carte
    </a>
  </div>
);

// "Carte" — a smart listing (no map lib): the steps in itinerary order, each
// with its hotel (+ dates), the places we've pinned (with the "à montrer au
// chauffeur" address) and a rated bank of ideas. Every spot shows the trajet
// depuis l'hôtel (voiture + à pied) so distances are tangible. Nothing here is
// locked — the ideas are noted 1–5 ★ by how much they'd be a shame to miss.
export const CarteView = () => {
  const cities = uniqCityTokensByOrder(TRIP_DATA.itinerary_days);
  const [detail, setDetail] = useState<DayDetailState | null>(null);

  return (
    <div className="motion-safe:animate-fade-up px-7 pt-12">
      <div className="mb-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-600">Où on est, où on va</p>
        <h2 className="mt-1.5 font-display font-semibold text-[2.8rem] text-ink-900 leading-[0.9] tracking-[-0.02em]">Carte</h2>
      </div>

      <p className="mb-6 text-[15px] text-ink-600 leading-relaxed">
        Vols et hôtels sont réservés — vos points d'ancrage. Le reste, ce sont des <b>idées</b> à piocher, notées
        de 1 à 5 <b>★</b> selon l'envie de ne pas les rater. Touchez un lieu épinglé pour l'adresse à montrer au chauffeur,
        et suivez le trajet depuis l'hôtel (🚗 / 🚶) pour jauger la distance.
      </p>

      <div className="space-y-4 pb-20">
        {cities.map((city) => {
          const hotels = TRIP_DATA.hotels.filter((h) => cityMatches(h.city, city));
          const acts = TRIP_DATA.planned_activities.filter((a) => cityMatches(a.city, city));
          const ideas = (CITY_IDEAS.find((g) => cityMatches(g.city, city))?.ideas ?? [])
            .slice()
            .sort((a, b) => b.stars - a.stars);
          const empty = hotels.length === 0 && acts.length === 0 && ideas.length === 0;

          // Trajet origin = the city's hotel (its driver address when we have it).
          const hotel = hotels[0];
          const origin = hotel?.driver?.address ?? hotel?.name;

          return (
            <section key={city} className="card rounded-card px-5 py-4">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-display text-[1.7rem] font-semibold text-ink-900 leading-none tracking-[-0.01em]">{city}</h3>
                <a
                  href={googleMapsSearchUrl(city + " Vietnam")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-[12px] font-semibold uppercase tracking-[0.14em] text-accent-600 underline underline-offset-4 decoration-accent-300 decoration-1"
                >
                  Ville ↗
                </a>
              </div>

              {empty ? (
                <p className="mt-2.5 text-[14px] italic text-ink-500">Étape de transit.</p>
              ) : (
                <>
                  {/* Hôtels — la base réservée (aussi le point de départ des trajets) */}
                  {hotels.length > 0 && (
                    <div className="mt-3 border-t border-ink-200 divide-y divide-ink-200">
                      {hotels.map((h) => (
                        <NavRow key={h.name} kind="Hôtel" label={h.name} sub={h.dates} onClick={() => setDetail({ kind: "hotel", hotel: h })} />
                      ))}
                    </div>
                  )}

                  {/* Lieux épinglés — adresse chauffeur + trajet depuis l'hôtel */}
                  {acts.length > 0 && (
                    <div className="mt-4">
                      <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-ink-500">À voir · adresse chauffeur</p>
                      <div className="mt-1 border-t border-ink-200 divide-y divide-ink-200">
                        {acts.map((a) => (
                          <div key={a.id} className="py-1">
                            <NavRow kind="Lieu" label={a.name} sub={a.window} onClick={() => setDetail({ kind: "activity", activity: a })} />
                            <div className="pb-2.5">
                              <Trajet origin={origin} destination={a.driver?.address ?? `${a.name} ${city}`} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Idées notées ★ — la réserve à piocher */}
                  {ideas.length > 0 && (
                    <div className="mt-4">
                      <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-ink-500">Idées · notées ★</p>
                      <div className="mt-1 border-t border-ink-200 divide-y divide-ink-200">
                        {ideas.map((idea) => (
                          <div key={idea.name} className="py-3.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <StarRating value={idea.stars} />
                              <span className="rounded-full bg-ink-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-600">
                                {idea.kind}
                              </span>
                            </div>
                            <p className="mt-1.5 text-[16px] font-medium text-ink-900 leading-snug">{idea.name}</p>
                            <p className="mt-0.5 text-[13px] text-ink-600 leading-snug">{idea.why}</p>
                            <Trajet origin={origin} destination={idea.mapsQuery ?? `${idea.name} ${city}`} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </section>
          );
        })}

        {/* Aéroports — direct Maps (pas de chauffeur dédié) */}
        <section className="card rounded-card px-5 py-4">
          <h3 className="font-display text-[1.7rem] font-semibold text-ink-900 leading-none tracking-[-0.01em]">Aéroports</h3>
          <div className="mt-3 border-t border-ink-200">
            {TRIP_DATA.airport_glossary.map((ap) => (
              <a
                key={ap.code}
                href={googleMapsSearchUrl(`${ap.airport} ${ap.city}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-baseline gap-4 py-3.5 border-b border-ink-200"
              >
                <span className="w-[4.5rem] shrink-0 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-600">{ap.code}</span>
                <span className="flex-1 text-[16px] font-medium text-ink-900 leading-snug">
                  {ap.airport} · {ap.city}
                </span>
                <span className="shrink-0 text-ink-300 text-sm group-active:translate-x-0.5 transition-transform">↗</span>
              </a>
            ))}
          </div>
        </section>
      </div>

      <DayDetail detail={detail} onClose={() => setDetail(null)} />
    </div>
  );
};
