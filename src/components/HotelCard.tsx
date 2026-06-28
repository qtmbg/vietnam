import { SmartImage } from "./SmartImage";
import { AskTang } from "./AskTang";
import { P, ASSETS } from "../lib/assets";
import { formatUSD0, usdToVndLabel } from "../lib/money";
import { googleMapsSearchUrl } from "../lib/maps";
import type { HotelItem } from "../data/types";

const linkCls =
  "text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-900 underline underline-offset-4 decoration-clay-400 decoration-1 active:text-clay-600 transition-colors";

export const HotelCard = ({ hotel }: { hotel: HotelItem }) => {
  const link = hotel.booking_url || hotel.official_url;
  const city = hotel.city.replace(/\(.*?\)/g, "").trim();

  return (
    <article>
      {hotel.cover && (
        <div className="relative overflow-hidden rounded-[3px]">
          <SmartImage
            src={P(hotel.cover)}
            alt={hotel.name}
            fallback={ASSETS.covers.sections.hotels}
            className="h-52"
            overlay={
              <>
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/55 via-transparent to-transparent" />
                <p className="absolute bottom-4 left-5 text-[11px] font-medium uppercase tracking-[0.2em] text-sand-50/85">{hotel.city}</p>
              </>
            }
          />
        </div>
      )}

      <h3 className="mt-5 font-display text-[1.9rem] text-ink-900 leading-tight tracking-[-0.01em]">{hotel.name}</h3>
      <p className="mt-1.5 text-[12px] font-medium uppercase tracking-[0.16em] text-ink-600">{hotel.dates}</p>

      <p className={`mt-3 text-[12px] font-semibold uppercase tracking-[0.14em] ${hotel.paidBy ? "text-jade-600" : "text-clay-600"}`}>
        {hotel.paidBy ? `Payé · ${hotel.paidBy}` : "À régler"}
      </p>
      {hotel.paidNote && <p className="mt-1 text-[13px] text-ink-600 leading-snug">{hotel.paidNote}</p>}

      <p className="mt-5 font-display italic text-[17px] text-ink-700 leading-relaxed">« {hotel.why} »</p>

      {hotel.note && (
        <p className="mt-4 pl-3.5 border-l-2 border-clay-300 text-[14px] text-ink-600 leading-relaxed">{hotel.note}</p>
      )}

      <div className="mt-6 border-y border-ink-200 divide-y divide-ink-200">
        <div className="py-3 flex items-baseline justify-between gap-4">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-600">Nous</span>
          <span className="text-right">
            <span className="block font-display text-[1.4rem] text-ink-900 leading-none tabular-nums">{formatUSD0(hotel.budget.us)}</span>
            <span className="block mt-1 text-[12px] text-ink-500 tabular-nums">{usdToVndLabel(hotel.budget.us)}</span>
          </span>
        </div>
        <div className="py-3 flex items-baseline justify-between gap-4">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-600">Claudine</span>
          <span className="text-right">
            <span className="block font-display text-[1.4rem] text-ink-900 leading-none tabular-nums">{formatUSD0(hotel.budget.claudine)}</span>
            <span className="block mt-1 text-[12px] text-ink-500 tabular-nums">{usdToVndLabel(hotel.budget.claudine)}</span>
          </span>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
        {link && (
          <a href={link} target="_blank" rel="noopener noreferrer" className={linkCls}>
            Voir la réservation →
          </a>
        )}
        <a href={googleMapsSearchUrl(hotel.name)} target="_blank" rel="noopener noreferrer" className={linkCls}>
          Carte →
        </a>
      </div>

      <div className="mt-4">
        <AskTang question={`Que faire et où bien manger près de ${hotel.name} à ${city} ?`} />
      </div>
    </article>
  );
};
