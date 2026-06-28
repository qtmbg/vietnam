import { useState } from "react";
import { CinemaHero } from "../components/CinemaHero";
import { FamilyStrip } from "../components/FamilyStrip";
import { DayContext } from "../components/DayContext";
import { DayDetail, type DayDetailState } from "../components/DayDetail";
import { TipsChecklist } from "../components/TipsChecklist";
import { FAMILY_MEMBERS, FLIGHTS } from "../data/trip";
import { cityCoverFromLabel, dayCoverFromDay } from "../lib/assets";
import { safeDateLabel } from "../lib/dates";
import type { DaySelection } from "../lib/day";
import type { TripMode, View } from "../data/types";

const baseCity = (label: string) => label.split("→").map((s) => s.trim())[0];

const Kicker = ({ children }: { children: string }) => (
  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-600">{children}</p>
);

// One clean quick-access to the flights — white glass, accent text (no locked fill).
const FlightsLink = ({ onFlights }: { onFlights: () => void }) => (
  <div className="flex justify-end">
    <button
      type="button"
      onClick={onFlights}
      className="glass rounded-full px-4 py-2 text-[13px] font-semibold text-clay-600 inline-flex items-center gap-1.5 active:scale-95 transition-transform"
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
  nextTransfer,
  goView,
  openFlights,
}: {
  mode: TripMode;
  daysToDeparture: number;
  dayNo: number;
  tripLen: number;
  currentDay: DaySelection;
  firstCity: string;
  nextTransfer: DaySelection["transfers"][number] | null;
  goView: (v: View) => void;
  openFlights: () => void;
}) => {
  const [detail, setDetail] = useState<DayDetailState | null>(null);
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
            <button type="button" onClick={openFlights} className="glass rounded-card px-5 py-4 w-full text-left group">
              <Kicker>Prochain jalon</Kicker>
              <div className="mt-3 flex items-end justify-between gap-5">
                <div className="min-w-0">
                  <h2 className="font-display text-[2.1rem] text-ink-900 leading-[1.0] tracking-[-0.015em]">Le grand départ</h2>
                  <p className="mt-2 text-[15px] font-medium text-ink-600">Marrakech → Hanoi · {aller.segs[0]?.dep}</p>
                </div>
                <span className="shrink-0 text-ink-300 text-xl leading-none group-active:translate-x-0.5 transition-transform">›</span>
              </div>
            </button>

            {/* Essentiels */}
            <TipsChecklist />
          </>
        )}

        {travel && (
          <>
            {/* Aujourd'hui — le jour courant via selectDay */}
            <section className="glass rounded-card px-5 py-4">
              <div className="flex items-baseline justify-between mb-1.5">
                <Kicker>Aujourd'hui</Kicker>
                <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-ink-600 tabular-nums">
                  Jour {String(dayNo).padStart(2, "0")} / {tripLen}
                </p>
              </div>
              <h2 className="font-display text-[2.3rem] text-ink-900 leading-[0.98] tracking-[-0.02em]">{currentCity}</h2>
              <p className="mt-1.5 text-[12.5px] font-medium uppercase tracking-[0.14em] text-ink-600">{safeDateLabel(currentDay.date)}</p>
              <div className="mt-5">
                <DayContext
                  day={currentDay}
                  onHotel={(hotel) => setDetail({ kind: "hotel", hotel })}
                  onActivity={(activity) => setDetail({ kind: "activity", activity })}
                  onTransfer={(expense) => setDetail({ kind: "transfer", expense })}
                />
              </div>
            </section>

            {/* Prochain transfert avec adresse */}
            {nextTransfer && (
              <button type="button" onClick={() => setDetail({ kind: "transfer", expense: nextTransfer })} className="glass rounded-card px-5 py-4 w-full text-left group">
                <Kicker>Prochain transfert</Kicker>
                <div className="mt-3 flex items-end justify-between gap-5">
                  <div className="min-w-0">
                    <p className="text-[16px] font-medium text-ink-900 leading-snug">
                      {nextTransfer.from} <span className="text-ink-500">→</span> {nextTransfer.to}
                    </p>
                    {nextTransfer.date && <p className="mt-1.5 text-[14px] text-ink-600">{safeDateLabel(nextTransfer.date)}</p>}
                  </div>
                  <span className="shrink-0 text-ink-300 text-xl leading-none group-active:translate-x-0.5 transition-transform">›</span>
                </div>
              </button>
            )}
          </>
        )}

        {/* Le voyage complet */}
        <button
          type="button"
          onClick={() => goView("voyage")}
          className="glass rounded-card px-5 py-4 w-full flex items-baseline justify-between gap-4 text-left group"
        >
          <span className="font-display text-[1.6rem] font-semibold text-ink-900 leading-none tracking-[-0.01em]">Le voyage, jour par jour</span>
          <span className="shrink-0 text-ink-500 text-xl leading-none group-active:translate-x-0.5 transition-transform">→</span>
        </button>

        {/* Équipage */}
        <section className="glass rounded-card px-5 py-4">
          <h3 className="mb-4 font-display text-[1.7rem] font-semibold text-ink-900 leading-none">Équipage</h3>
          <FamilyStrip members={FAMILY_MEMBERS} />
        </section>
      </div>

      <DayDetail detail={detail} onClose={() => setDetail(null)} />
    </div>
  );
};
