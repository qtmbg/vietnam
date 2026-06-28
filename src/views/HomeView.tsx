import { useState } from "react";
import { Plane, Car, ChevronRight, Wallet, BedDouble } from "lucide-react";
import { CinemaHero } from "../components/CinemaHero";
import { Glass } from "../components/Glass";
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

// Discreet override so the other mode can be previewed (handy before the trip).
const ModePreview = ({ value, onChange }: { value: ModeOverride; onChange: (o: ModeOverride) => void }) => (
  <div className="flex items-center justify-end gap-2">
    <span className="text-[12px] font-bold uppercase tracking-widest text-ink-400">Aperçu</span>
    <div className="inline-flex rounded-full bg-ink-100 p-0.5">
      {([["auto", "Auto"], ["prep", "Prép"], ["travel", "Voyage"]] as const).map(([v, l]) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={`px-3 py-1 rounded-full text-[12px] font-black transition-colors ${value === v ? "bg-white text-ink-900 shadow-sm" : "text-ink-500"}`}
        >
          {l}
        </button>
      ))}
    </div>
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

      <div className="relative -mt-12 px-5 space-y-7">
        <ModePreview value={override} onChange={setOverride} />

        {!travel && (
          <>
            {/* Prochain jalon — le grand départ */}
            <button
              type="button"
              onClick={() => goView("guide")}
              className="w-full text-left bg-white rounded-card border border-ink-100 shadow-card p-5 flex items-center gap-4 active:scale-[.99] transition-transform"
            >
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                <Plane size={22} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-bold uppercase tracking-widest text-ink-400">Prochain jalon</p>
                <p className="text-base font-bold text-ink-900 leading-tight">{aller.title}</p>
                <p className="text-[13px] font-semibold text-jade-600">{aller.segs[0]?.dep}</p>
              </div>
              <ChevronRight size={18} className="text-ink-300 shrink-0" />
            </button>

            {/* Reste à régler */}
            <div className="bg-white rounded-card border border-ink-100 shadow-card p-6">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="p-2.5 rounded-2xl bg-sun-50 text-sun-600">
                  <Wallet size={20} />
                </div>
                <div>
                  <h3 className="font-display text-2xl text-ink-900 leading-none">Reste à régler</h3>
                  <p className="text-[13px] font-semibold text-ink-400">Avant le départ</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => goView("budget")}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-sun-50 border border-sun-100 mb-2.5 active:scale-[.99] transition-transform"
              >
                <div className="text-left min-w-0">
                  <p className="text-[12px] font-bold uppercase tracking-widest text-sun-700">Estimations à confirmer</p>
                  <p className="text-sm font-bold text-ink-800">
                    {toSettle.estimates.length} poste(s) · ~{formatUSD0(toSettle.estimatesTotal)}
                  </p>
                </div>
                <ChevronRight size={16} className="text-ink-300 shrink-0" />
              </button>

              {toSettle.hotels.map(({ hotel, reason }) => (
                <button
                  key={hotel.name}
                  type="button"
                  onClick={() => setDetail({ kind: "hotel", hotel })}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl bg-ink-50 border border-ink-100 mb-2.5 last:mb-0 text-left active:scale-[.99] transition-transform"
                >
                  <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-brand-600 shadow-soft shrink-0">
                    <BedDouble size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-ink-800 truncate">{hotel.name}</p>
                    <p className="text-[12px] font-semibold text-ink-400 truncate">{reason}</p>
                  </div>
                  <ChevronRight size={16} className="text-ink-300 shrink-0" />
                </button>
              ))}
            </div>

            {/* Essentiels */}
            <TipsChecklist />
          </>
        )}

        {travel && (
          <>
            {/* Aujourd'hui — le jour courant via selectDay */}
            <Glass className="rounded-hero p-6 ring-1 ring-white/60">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-jade-500/60 motion-safe:animate-ping" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-jade-500" />
                  </span>
                  <p className="text-[13px] font-bold uppercase tracking-widest text-jade-600">Aujourd'hui</p>
                </div>
                <p className="text-[13px] font-semibold text-ink-400">Jour {dayNo} / {tripLen}</p>
              </div>
              <p className="text-[13px] font-bold uppercase tracking-widest text-ink-400">{safeDateLabel(currentDay.date)}</p>
              <p className="font-display text-2xl text-ink-900 leading-tight mb-4">{currentDay.city}</p>
              <DayContext
                day={currentDay}
                onHotel={(hotel) => setDetail({ kind: "hotel", hotel })}
                onActivity={(activity) => setDetail({ kind: "activity", activity })}
                onTransfer={(expense) => setDetail({ kind: "transfer", expense })}
              />
            </Glass>

            {/* Prochain transfert avec adresse */}
            {nextTransfer && (
              <button
                type="button"
                onClick={() => setDetail({ kind: "transfer", expense: nextTransfer })}
                className="w-full text-left bg-white rounded-card border border-ink-100 shadow-card p-5 flex items-center gap-4 active:scale-[.99] transition-transform"
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                  {nextTransfer.mode === "flight_domestic" ? <Plane size={22} /> : <Car size={22} />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-bold uppercase tracking-widest text-ink-400">
                    Prochain transfert{nextTransfer.date ? ` · ${safeDateLabel(nextTransfer.date)}` : ""}
                  </p>
                  <p className="text-sm font-bold text-ink-900 truncate">
                    {nextTransfer.from} → {nextTransfer.to}
                  </p>
                </div>
                <ChevronRight size={18} className="text-ink-300 shrink-0" />
              </button>
            )}
          </>
        )}

        {/* Le reste — accès au voyage complet + équipage */}
        <button
          type="button"
          onClick={() => goView("voyage")}
          className="w-full py-4 rounded-card bg-ink-900 text-white text-xs font-bold uppercase tracking-widest active:scale-[.99] transition-transform"
        >
          Voir le voyage jour par jour
        </button>

        <div className="pb-6">
          <div className="mb-4">
            <h3 className="font-display text-3xl text-ink-900 leading-none">Équipage</h3>
            <p className="text-xs font-semibold text-ink-400 italic">Les aventuriers</p>
          </div>
          <FamilyStrip members={FAMILY_MEMBERS} />
        </div>
      </div>

      <DayDetail detail={detail} onClose={() => setDetail(null)} />
    </div>
  );
};
