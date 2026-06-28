import { Calendar, BadgeCheck, BadgeHelp, Hotel, Navigation, MapPin } from "lucide-react";
import { SmartImage } from "./SmartImage";
import { P, ASSETS } from "../lib/assets";
import { formatUSD0 } from "../lib/money";
import { googleMapsSearchUrl } from "../lib/maps";
import type { HotelItem } from "../data/types";

export const HotelCard = ({ hotel }: { hotel: HotelItem }) => {
  const link = hotel.booking_url || hotel.official_url;

  return (
    <div className="group bg-white rounded-card border border-ink-100 shadow-card overflow-hidden mb-8">
      {hotel.cover ? (
        <SmartImage
          src={P(hotel.cover)}
          alt={hotel.name}
          fallback={ASSETS.covers.sections.hotels}
          className="h-48"
          imgClassName="motion-safe:transition-transform motion-safe:group-hover:scale-105 duration-700"
          overlay={
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/45 via-transparent to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-ink-900/70 backdrop-blur-md text-[13px] font-semibold text-white tracking-wide">{hotel.city}</span>
              </div>
            </>
          }
        />
      ) : (
        <div className="h-48 bg-ink-100 flex items-center justify-center text-ink-400">
          <Hotel size={48} />
        </div>
      )}

      <div className="p-8">
        <h4 className="font-display text-[26px] text-ink-900 leading-tight mb-1">{hotel.name}</h4>
        <div className="flex items-center gap-2 text-brand-600 mb-3">
          <Calendar size={14} />
          <p className="text-xs font-black">{hotel.dates}</p>
        </div>

        <div className="mb-6">
          {hotel.paidBy ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-jade-600 text-white text-[13px] font-black uppercase tracking-widest">
                <BadgeCheck size={12} /> Payé · {hotel.paidBy}
              </span>
              {hotel.paidNote && <span className="text-[13px] font-bold text-ink-500">{hotel.paidNote}</span>}
            </div>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ink-100 text-ink-500 text-[13px] font-black uppercase tracking-widest">
              <BadgeHelp size={12} /> À régler
            </span>
          )}
        </div>

        {hotel.note && (
          <div className="p-4 rounded-2xl bg-sun-50 border border-sun-100 text-[13px] font-bold text-sun-800 mb-6 leading-relaxed">
            {hotel.note}
          </div>
        )}

        <p className="text-sm font-bold text-ink-500 italic mb-8">“{hotel.why}”</p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-4 rounded-3xl bg-ink-50 border border-ink-100">
            <p className="text-[12px] font-black text-ink-400 uppercase mb-1">Nous</p>
            <p className="text-lg font-black text-ink-900 leading-none">{formatUSD0(hotel.budget.us)}</p>
          </div>
          <div className="p-4 rounded-3xl bg-ink-50 border border-ink-100">
            <p className="text-[12px] font-black text-ink-400 uppercase mb-1">Claudine</p>
            <p className="text-lg font-black text-ink-900 leading-none">{formatUSD0(hotel.budget.claudine)}</p>
          </div>
        </div>

        <div className="flex gap-2">
          {link ? (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-3xl bg-brand-600 text-white text-xs font-black shadow-lg shadow-brand-100 hover:scale-[1.02] transition-transform"
            >
              <Navigation size={14} />
              Voir la résa
            </a>
          ) : (
            <div className="flex-1 py-4 rounded-3xl bg-ink-100 text-ink-400 text-xs font-black text-center italic">Pas de lien</div>
          )}
          <a
            href={googleMapsSearchUrl(hotel.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 flex items-center justify-center rounded-3xl bg-ink-100 text-ink-600 hover:bg-ink-200 transition-colors"
          >
            <MapPin size={20} />
          </a>
        </div>
      </div>
    </div>
  );
};
