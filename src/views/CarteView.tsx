import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { DayDetail, type DayDetailState } from "../components/DayDetail";
import { TRIP_DATA } from "../data/trip";
import { uniqCityTokensByOrder, cityMatches } from "../lib/city";
import { googleMapsSearchUrl } from "../lib/maps";

// A place that opens its full detail (with the "à montrer au chauffeur" DriverCard).
const NavRow = ({ kind, label, sub, onClick }: { kind: string; label: string; sub?: string; onClick: () => void }) => (
  <button type="button" onClick={onClick} className="group w-full flex items-baseline gap-4 py-3.5 border-b border-ink-200 text-left">
    <span className="w-[4.5rem] shrink-0 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-600">{kind}</span>
    <span className="min-w-0 flex-1">
      <span className="block text-[16px] font-medium text-ink-900 leading-snug">{label}</span>
      {sub && <span className="block mt-0.5 text-[12.5px] text-ink-500 leading-snug">{sub}</span>}
    </span>
    <ChevronRight size={18} className="shrink-0 text-ink-300 group-active:translate-x-0.5 transition-transform" aria-hidden="true" />
  </button>
);

// "Carte" — a smart listing (no map lib): the steps in itinerary order, each
// with its hotel (+ dates) and key places. Tap any to get its address to show
// a driver (DriverCard) and open Maps. Airports kept as direct Maps links.
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
        Touchez un lieu pour son adresse à montrer au chauffeur (en vietnamien, à copier) et l'ouvrir dans Maps.
      </p>

      <div className="space-y-4 pb-20">
        {cities.map((city) => {
          const hotels = TRIP_DATA.hotels.filter((h) => cityMatches(h.city, city));
          const acts = TRIP_DATA.planned_activities.filter((a) => cityMatches(a.city, city));
          const empty = hotels.length === 0 && acts.length === 0;

          return (
            <section key={city} className="card rounded-card px-5 py-4">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-display text-[1.7rem] font-semibold text-ink-900 leading-none tracking-[-0.01em]">{city}</h3>
                <a
                  href={googleMapsSearchUrl(city + " Vietnam")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-[12px] font-semibold uppercase tracking-[0.14em] text-clay-600 underline underline-offset-4 decoration-clay-300 decoration-1"
                >
                  Ville ↗
                </a>
              </div>

              {empty ? (
                <p className="mt-2.5 text-[14px] italic text-ink-500">Étape de transit.</p>
              ) : (
                <div className="mt-3 border-t border-ink-200">
                  {hotels.map((h) => (
                    <NavRow key={h.name} kind="Hôtel" label={h.name} sub={h.dates} onClick={() => setDetail({ kind: "hotel", hotel: h })} />
                  ))}
                  {acts.map((a) => (
                    <NavRow key={a.id} kind="Lieu" label={a.name} sub={a.window} onClick={() => setDetail({ kind: "activity", activity: a })} />
                  ))}
                </div>
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
