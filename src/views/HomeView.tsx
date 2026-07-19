import { useState } from "react";
import { Utensils, Sparkles, Plane, ArrowRightLeft, BedDouble } from "lucide-react";
import { CinemaHero } from "../components/CinemaHero";
import { FamilyStrip } from "../components/FamilyStrip";
import { DayDeck } from "../components/DayDeck";
import { DayDetail, type DayDetailState } from "../components/DayDetail";
import { FlightLegCard } from "../components/FlightLegCard";
import { SmartImage } from "../components/SmartImage";
import { FAMILY_MEMBERS, FLIGHTS, TRIP_DATA } from "../data/trip";
import { ASSETS, P, cityCoverFromLabel, dayCoverFromDay } from "../lib/assets";
import type { DaySelection } from "../lib/day";
import type { HotelItem, TripMode, View } from "../data/types";
import type { GuideTab } from "./GuideView";

const baseCity = (label: string) => label.split("→").map((s) => s.trim())[0];

const Kicker = ({ children }: { children: string }) => (
  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-600">{children}</p>
);

// The next international leg, in full — real segments, times, codes, "Payé".
// A ticket, not a teaser: this IS the flight, not a link promising one.
const NextFlight = ({ leg, onSeeAll }: { leg: (typeof FLIGHTS)[number]; onSeeAll: () => void }) => (
  <div>
    <div className="mb-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <Plane size={17} className="text-accent-600" aria-hidden="true" />
        <Kicker>Prochain vol</Kicker>
      </div>
      <button
        type="button"
        onClick={onSeeAll}
        className="shrink-0 text-[12px] font-semibold uppercase tracking-[0.14em] text-accent-600 active:text-accent-700"
      >
        Tous les vols →
      </button>
    </div>
    <div className="[&>section]:mb-0">
      <FlightLegCard leg={leg} />
    </div>
  </div>
);

// Where we sleep, as a swipeable strip of real photos — the whole chain at a
// glance. One tap opens the full HotelCard (address, driver, booking link)
// via the shared DayDetail sheet: an action away, never a dead end.
const StayStrip = ({ hotels, onOpen }: { hotels: HotelItem[]; onOpen: (h: HotelItem) => void }) => (
  <div>
    <div className="mb-3 flex items-center gap-2.5">
      <BedDouble size={17} className="text-accent-600" aria-hidden="true" />
      <Kicker>{`Logement · ${hotels.length} étapes`}</Kicker>
    </div>
    <div className="-mx-7 flex gap-3.5 overflow-x-auto no-scrollbar snap-x snap-mandatory px-7 pb-1">
      {hotels.map((h) => (
        <button
          key={h.name}
          type="button"
          onClick={() => onOpen(h)}
          className="relative h-[13rem] w-[76%] max-w-[19rem] shrink-0 snap-start overflow-hidden rounded-[1.6rem] text-left active:scale-[0.98] transition-transform"
        >
          <SmartImage
            src={h.cover ? P(h.cover) : ASSETS.covers.sections.hotels}
            alt={h.name}
            fallback={ASSETS.covers.sections.hotels}
            className="absolute inset-0 h-full w-full"
            overlay={<div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/15 to-transparent" />}
          />
          <div className="absolute inset-x-0 bottom-0 p-3.5">
            <div className="glass-on-photo rounded-[1.2rem] px-4 py-3">
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-surface-50/80">{h.city}</p>
              <p className="mt-1 font-display text-[1.3rem] text-surface-50 leading-tight truncate">{h.name}</p>
              <p className="mt-1 text-[12px] font-medium text-surface-50/85">{h.dates}</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  </div>
);

// Quick access into the Guide's richest sections — one tap from the accueil.
const QuickLinks = ({ openGuide }: { openGuide: (t: GuideTab) => void }) => {
  const links: { tab: GuideTab; label: string; icon: typeof Utensils }[] = [
    { tab: "afaire", label: "À faire", icon: Sparkles },
    { tab: "cuisine", label: "Restos", icon: Utensils },
    { tab: "vols", label: "Vols & docs", icon: Plane },
    { tab: "budget", label: "€ ↔ ₫", icon: ArrowRightLeft },
  ];
  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
      {links.map(({ tab, label, icon: Icon }) => (
        <button
          key={tab}
          type="button"
          onClick={() => openGuide(tab)}
          className="card rounded-full px-3.5 py-2 text-[13px] font-semibold text-accent-600 inline-flex items-center gap-1.5 whitespace-nowrap active:scale-95 transition-transform"
        >
          <Icon size={15} aria-hidden="true" /> {label}
        </button>
      ))}
    </div>
  );
};

export const HomeView = ({
  mode,
  daysToDeparture,
  dayNo,
  tripLen,
  currentDay,
  firstCity,
  goView,
  openGuide,
}: {
  mode: TripMode;
  daysToDeparture: number;
  dayNo: number;
  tripLen: number;
  currentDay: DaySelection;
  firstCity: string;
  goView: (v: View) => void;
  openGuide: (t: GuideTab) => void;
}) => {
  const travel = mode === "travel";
  const [detail, setDetail] = useState<DayDetailState | null>(null);

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

      <div className="px-7 pt-11 space-y-6">
        <QuickLinks openGuide={openGuide} />

        {/* Avant le départ, l'accueil EST le tableau de bord pratique : vol, puis logement. */}
        {!travel && (
          <>
            <NextFlight leg={aller} onSeeAll={() => openGuide("vols")} />

            <StayStrip hotels={TRIP_DATA.hotels} onOpen={(h) => setDetail({ kind: "hotel", hotel: h })} />

            <button
              type="button"
              onClick={() => goView("voyage")}
              className="card rounded-card px-5 py-4 w-full flex items-baseline justify-between gap-4 text-left group"
            >
              <span className="font-display text-[1.6rem] font-semibold text-ink-900 leading-none tracking-[-0.01em]">Le voyage, jour par jour</span>
              <span className="shrink-0 text-ink-500 text-xl leading-none group-active:translate-x-0.5 transition-transform">→</span>
            </button>

            <DayDetail detail={detail} onClose={() => setDetail(null)} />
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
