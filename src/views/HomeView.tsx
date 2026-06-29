import { CinemaHero } from "../components/CinemaHero";
import { FamilyStrip } from "../components/FamilyStrip";
import { TipsChecklist } from "../components/TipsChecklist";
import { DayDeck } from "../components/DayDeck";
import { FAMILY_MEMBERS, FLIGHTS, TRIP_DATA } from "../data/trip";
import { cityCoverFromLabel, dayCoverFromDay } from "../lib/assets";
import type { DaySelection } from "../lib/day";
import type { TripMode, View } from "../data/types";

const baseCity = (label: string) => label.split("→").map((s) => s.trim())[0];

const Kicker = ({ children }: { children: string }) => (
  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-600">{children}</p>
);

// One clean quick-access to the flights — accent text on a white pill.
const FlightsLink = ({ onFlights }: { onFlights: () => void }) => (
  <div className="flex justify-end">
    <button
      type="button"
      onClick={onFlights}
      className="card rounded-full px-4 py-2 text-[13px] font-semibold text-clay-600 inline-flex items-center gap-1.5 active:scale-95 transition-transform"
    >
      Vols <span aria-hidden="true">↗</span>
    </button>
  </div>
);

export const HomeView = ({
  mode,
  daysToDeparture,
  dayNo,
  tripLen,
  currentDay,
  firstCity,
  goView,
  openFlights,
}: {
  mode: TripMode;
  daysToDeparture: number;
  dayNo: number;
  tripLen: number;
  currentDay: DaySelection;
  firstCity: string;
  goView: (v: View) => void;
  openFlights: () => void;
}) => {
  const travel = mode === "travel";

  const currentCity = currentDay.city ? baseCity(currentDay.city) : firstCity;
  const heroCity = travel ? currentCity : firstCity;
  const heroCover =
    travel && currentDay.itineraryDay ? dayCoverFromDay(currentDay.itineraryDay) : cityCoverFromLabel(heroCity);

  const aller = FLIGHTS[0];

  return (
    <div key="home" className="motion-safe:animate-fade-up">
      <CinemaHero
        activeCity={heroCity}
        coverSrc={heroCover}
        daysTo={daysToDeparture}
        dayNo={dayNo}
        tripLen={tripLen}
        isWithinTrip={travel}
      />

      <div className="px-7 pt-11 space-y-4">
        <FlightsLink onFlights={openFlights} />

        {!travel && (
          <>
            {/* Prochain jalon — le grand départ (ouvre les vols) */}
            <button type="button" onClick={openFlights} className="card rounded-card px-5 py-4 w-full text-left group">
              <Kicker>Prochain jalon</Kicker>
              <div className="mt-3 flex items-end justify-between gap-5">
                <div className="min-w-0">
                  <h2 className="font-display text-[2.1rem] text-ink-900 leading-[1.0] tracking-[-0.015em]">Le grand départ</h2>
                  <p className="mt-2 text-[15px] font-medium text-ink-600">Marrakech → Hanoi · {aller.segs[0]?.dep}</p>
                </div>
                <span className="shrink-0 text-ink-300 text-xl leading-none group-active:translate-x-0.5 transition-transform">›</span>
              </div>
            </button>

            <TipsChecklist />

            <button
              type="button"
              onClick={() => goView("voyage")}
              className="card rounded-card px-5 py-4 w-full flex items-baseline justify-between gap-4 text-left group"
            >
              <span className="font-display text-[1.6rem] font-semibold text-ink-900 leading-none tracking-[-0.01em]">Le voyage, jour par jour</span>
              <span className="shrink-0 text-ink-500 text-xl leading-none group-active:translate-x-0.5 transition-transform">→</span>
            </button>
          </>
        )}

        {/* En voyage, le cœur de l'accueil EST le deck (jour courant en premier). */}
        {travel && (
          <div className="-mx-3">
            <DayDeck days={TRIP_DATA.itinerary_days} startIndex={Math.max(0, dayNo - 1)} />
          </div>
        )}

        {/* Équipage */}
        <section className="card rounded-card px-5 py-4">
          <h3 className="mb-4 font-display text-[1.7rem] font-semibold text-ink-900 leading-none">Équipage</h3>
          <FamilyStrip members={FAMILY_MEMBERS} />
        </section>
      </div>
    </div>
  );
};
