import { Clock, Users, Ticket, Tag, Info, MapPin } from "lucide-react";
import { SmartImage } from "./SmartImage";
import { P, ACT_COVERS, cityCoverFromLabel } from "../lib/assets";
import { usdRounded } from "../lib/money";
import { googleMapsSearchUrl } from "../lib/maps";
import type { PlannedActivity } from "../data/types";

export const ActivityCard = ({ a }: { a: PlannedActivity }) => {
  const priceLine = (() => {
    if (a.pricing.estimatedUSD_range) {
      const [min, max] = a.pricing.estimatedUSD_range;
      return `$${min}–$${max} (arrondi)`;
    }
    if (typeof a.pricing.estimatedUSD_adult === "number") {
      return `$${a.pricing.estimatedUSD_adult} (arrondi)`;
    }
    if (a.pricing.usd_range) {
      const [min, max] = a.pricing.usd_range;
      return `$${usdRounded(min)}–$${usdRounded(max)} (arrondi)`;
    }
    if (typeof a.pricing.usd_adult === "number") {
      return `$${usdRounded(a.pricing.usd_adult)} (arrondi)`;
    }
    return "—";
  })();

  const rawLine = (() => {
    if (a.pricing.vnd_range) {
      const [min, max] = a.pricing.vnd_range;
      return `${min.toLocaleString("vi-VN")}–${max.toLocaleString("vi-VN")} VND`;
    }
    if (typeof a.pricing.vnd_adult === "number") {
      return `${a.pricing.vnd_adult.toLocaleString("vi-VN")} VND`;
    }
    if (a.pricing.usd_range) {
      const [min, max] = a.pricing.usd_range;
      return `$${min}–$${max}`;
    }
    if (typeof a.pricing.usd_adult === "number") return `$${a.pricing.usd_adult}`;
    return "";
  })();

  return (
    <div className="bg-white rounded-card border border-ink-100 shadow-card overflow-hidden">
      <SmartImage
        src={ACT_COVERS[a.id] ? P(ACT_COVERS[a.id]) : cityCoverFromLabel(a.city)}
        alt={a.name}
        fallback={cityCoverFromLabel(a.city)}
        className="h-36"
        imgClassName="motion-safe:transition-transform motion-safe:hover:scale-105 duration-700"
        overlay={
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-ink-900/70 via-ink-900/10 to-transparent" />
            <div className="absolute bottom-4 left-5 right-5">
              <p className="text-[13px] font-semibold text-white/80 uppercase tracking-widest mb-0.5">
                {a.city}
                {a.window ? ` • ${a.window}` : ""}
              </p>
              <h4 className="font-display text-[22px] text-white leading-tight">{a.name}</h4>
            </div>
          </>
        }
      />
      <div className="p-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-jade-50 border border-jade-100">
            <p className="text-[13px] font-bold text-jade-700 uppercase tracking-widest mb-1">Prix</p>
            <p className="text-sm font-extrabold text-ink-900">{priceLine}</p>
            <p className="text-[13px] font-semibold text-jade-700/80 mt-1">{rawLine}</p>
          </div>
          <div className="p-4 rounded-2xl bg-ink-50 border border-ink-100">
            <p className="text-[13px] font-bold text-ink-500 uppercase tracking-widest mb-1">Cadre</p>
            <div className="flex items-center gap-2 text-ink-600">
              <Clock size={14} />
              <p className="text-xs font-semibold">{a.duration ?? "—"}</p>
            </div>
            <div className="flex items-start gap-2 text-ink-600 mt-2">
              <Users size={14} className="mt-0.5 shrink-0" />
              <p className="text-[13px] font-semibold leading-snug">{a.kidsRule ?? "—"}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-100 text-[13px] font-semibold text-brand-700 uppercase tracking-wide">
            <Ticket size={13} /> {a.category}
          </span>
          {a.payMode && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ink-50 border border-ink-100 text-[13px] font-semibold text-ink-600 uppercase tracking-wide">
              {a.payMode}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ink-50 border border-ink-100 text-[13px] font-semibold text-ink-600">
            <Tag size={13} /> {a.provider}
          </span>
        </div>

        {a.notes && <p className="mt-4 text-[13px] font-medium text-ink-600 leading-relaxed">{a.notes}</p>}

        <div className="mt-5 flex gap-2">
          {a.sourceUrl ? (
            <a
              href={a.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-ink-900 text-white text-xs font-bold"
            >
              <Info size={16} />
              Source
            </a>
          ) : (
            <div className="px-4 py-3 rounded-2xl bg-ink-100 text-ink-400 text-xs font-bold italic">Pas de source</div>
          )}

          <a
            href={googleMapsSearchUrl(a.name + " " + a.city)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-ink-100 text-ink-600"
            aria-label={`Voir ${a.name} sur Google Maps`}
          >
            <MapPin size={18} />
          </a>
        </div>
      </div>
    </div>
  );
};
