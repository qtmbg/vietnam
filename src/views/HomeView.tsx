import { useState } from "react";
import { CinemaHero } from "../components/CinemaHero";
import { FamilyStrip } from "../components/FamilyStrip";
import { DayContext } from "../components/DayContext";
import { DayDetail, type DayDetailState } from "../components/DayDetail";
import { TipsChecklist } from "../components/TipsChecklist";
import { FAMILY_MEMBERS, FLIGHTS } from "../data/trip";
import { cityCoverFromLabel, dayCoverFromDay } from "../lib/assets";
import { safeDateLabel } from "../lib/dates";
import { formatUSD0 } from "../lib/money";
import type { DaySelection } from "../lib/day";
import type { ToSettle } from "../lib/prep";
import type { TripMode, ModeOverride, View } from "../data/types";

const baseCity = (label: string) => label.split("→").map((s) => s.trim())[0];

const Kicker = ({ children }: { children: string }) => (
  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-600">{children}</p>
);

// Discreet override to preview the other mode (handy before the trip).
const ModePreview = ({ value, onChange }: { value: ModeOverride; onChange: (o: ModeOverride) => void }) => (
  <div className="flex items-center justify-end gap-3 text-[11px] font-medium uppercase tracking-[0.18em]">
    <span className="text-ink-500">Aperçu</span>
    {([["auto", "Auto"], ["prep", "Prép"], ["travel", "Voyage"]] as const).map(([v, l]) => (
      <button
        key={v}
        type="button"
        onClick={() => onChange(v)}
        className={
          value === v
            ? "text-ink-900 underline underline-offset-4 decoration-clay-500 decoration-1"
            : "text-ink-500 active:text-ink-600 transition-colors"
        }
      >
        {l}
      </button>
    ))}
  </div>
);

export const HomeView = ({
  mode,
  override,
  setOverride,
  onOpenQuick,
  daysToDeparture,
  dayNo,
  tripLen,
  currentDay,
  firstCity,
  toSettle,
  nextTransfer,
  goView,
  openBudget,
}: {
  mode: TripMode;
  override: ModeOverride;
  setOverride: (o: ModeOverride) => void;
  onOpenQuick: () => void;
  daysToDeparture: number;
  dayNo: number;
  tripLen: number;
  currentDay: DaySelection;
  firstCity: string;
  toSettle: ToSettle;
  nextTransfer: DaySelection["transfers"][number] | null;
  goView: (v: View) => void;
  openBudget: () => void;
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
        onOpenQuick={onOpenQuick}
        activeCity={heroCity}
        coverSrc={heroCover}
        daysTo={daysToDeparture}
        dayNo={dayNo}
        tripLen={tripLen}
        isWithinTrip={travel}
      />

      <div className="px-7 pt-11 space-y-12">
        <ModePreview value={override} onChange={setOverride} />

        {!travel && (
          <>
            {/* Prochain jalon — le grand départ */}
            <button type="button" onClick={() => goView("guide")} className="w-full text-left group">
              <Kicker>Prochain jalon</Kicker>
              <div className="h-px w-full bg-ink-200 my-3.5" />
              <div className="flex items-end justify-between gap-5">
                <div className="min-w-0">
                  <h2 className="font-display text-[2.1rem] text-ink-900 leading-[1.0] tracking-[-0.015em]">Le grand départ</h2>
                  <p className="mt-2 text-[15px] font-medium text-ink-600">Marrakech → Hanoi · {aller.segs[0]?.dep}</p>
                </div>
                <span className="shrink-0 text-ink-300 text-xl leading-none group-active:translate-x-0.5 transition-transform">›</span>
              </div>
            </button>

            {/* Reste à régler */}
            <section>
              <Kicker>À régler avant le départ</Kicker>
              <div className="mt-3 border-y border-ink-200 divide-y divide-ink-200">
                <button type="button" onClick={openBudget} className="w-full py-3.5 flex items-baseline gap-4 text-left group">
                  <span className="flex-1 text-[16px] font-medium text-ink-900">Transferts privés · reste à payer</span>
                  <span className="shrink-0 text-[15px] font-semibold text-clay-600 tabular-nums">{formatUSD0(toSettle.transportToPay)}</span>
                  <span className="shrink-0 text-ink-300 text-lg leading-none group-active:translate-x-0.5 transition-transform">›</span>
                </button>
                {toSettle.hotels.map(({ hotel, reason }) => (
                  <button
                    key={hotel.name}
                    type="button"
                    onClick={() => setDetail({ kind: "hotel", hotel })}
                    className="w-full py-3.5 flex items-baseline gap-4 text-left group"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-[16px] font-medium text-ink-900 leading-snug">{hotel.name}</span>
                      <span className="block mt-0.5 text-[12.5px] text-ink-600 leading-snug">{reason}</span>
                    </span>
                    <span className="shrink-0 text-ink-300 text-lg leading-none group-active:translate-x-0.5 transition-transform">›</span>
                  </button>
                ))}
              </div>
              <p className="mt-2.5 text-[12px] text-ink-500">
                {toSettle.transferCount} transferts · {toSettle.hotels.length} hôtels · activités à payer sur place
              </p>
            </section>

            {/* Essentiels */}
            <TipsChecklist />
          </>
        )}

        {travel && (
          <>
            {/* Aujourd'hui — le jour courant via selectDay */}
            <section>
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
              <button type="button" onClick={() => setDetail({ kind: "transfer", expense: nextTransfer })} className="w-full text-left group">
                <Kicker>Prochain transfert</Kicker>
                <div className="h-px w-full bg-ink-200 my-3.5" />
                <div className="flex items-end justify-between gap-5">
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
          className="w-full flex items-baseline justify-between gap-4 border-t border-ink-300 pt-4 text-left group"
        >
          <span className="font-display text-[1.6rem] text-ink-900 leading-none tracking-[-0.01em]">Le voyage, jour par jour</span>
          <span className="shrink-0 text-ink-500 text-xl leading-none group-active:translate-x-0.5 transition-transform">→</span>
        </button>

        {/* Équipage */}
        <section className="pb-4">
          <div className="flex items-baseline justify-between mb-4 border-t border-ink-200 pt-4">
            <h3 className="font-display text-[1.7rem] text-ink-900 leading-none">Équipage</h3>
            <p className="font-display italic text-[14px] text-ink-600">les aventuriers</p>
          </div>
          <FamilyStrip members={FAMILY_MEMBERS} />
        </section>
      </div>

      <DayDetail detail={detail} onClose={() => setDetail(null)} />
    </div>
  );
};
