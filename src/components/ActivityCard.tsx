import { SmartImage } from "./SmartImage";
import { AskTang } from "./AskTang";
import { DriverCard } from "./DriverCard";
import { P, ACT_COVERS, cityCoverFromLabel } from "../lib/assets";
import { usdRounded, usdToVnd, formatVND0 } from "../lib/money";
import { googleMapsSearchUrl } from "../lib/maps";
import type { PlannedActivity } from "../data/types";

const linkCls =
  "text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-900 underline underline-offset-4 decoration-clay-400 decoration-1 active:text-clay-600 transition-colors";

const Spec = ({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) => (
  <div className="py-3 flex items-baseline gap-4">
    <span className="w-[4.5rem] shrink-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-600">{label}</span>
    <span className={`flex-1 text-[15px] leading-snug ${accent ? "font-semibold text-clay-600" : "font-medium text-ink-800"}`}>{value}</span>
  </div>
);

export const ActivityCard = ({ a }: { a: PlannedActivity }) => {
  const priceLine = (() => {
    if (a.pricing.estimatedUSD_range) {
      const [min, max] = a.pricing.estimatedUSD_range;
      return `$${min}–$${max} (arrondi)`;
    }
    if (typeof a.pricing.estimatedUSD_adult === "number") return `$${a.pricing.estimatedUSD_adult} (arrondi)`;
    if (a.pricing.usd_range) {
      const [min, max] = a.pricing.usd_range;
      return `$${usdRounded(min)}–$${usdRounded(max)} (arrondi)`;
    }
    if (typeof a.pricing.usd_adult === "number") return `$${usdRounded(a.pricing.usd_adult)} (arrondi)`;
    return "—";
  })();

  // The dong line: the exact local price when known, otherwise an instant
  // "≈ …" conversion from the USD figure — so every activity shows VND.
  const rawLine = (() => {
    if (a.pricing.vnd_range) {
      const [min, max] = a.pricing.vnd_range;
      return `${min.toLocaleString("vi-VN")}–${max.toLocaleString("vi-VN")} VND`;
    }
    if (typeof a.pricing.vnd_adult === "number") return `${a.pricing.vnd_adult.toLocaleString("vi-VN")} VND`;
    if (a.pricing.usd_range) {
      const [min, max] = a.pricing.usd_range;
      return `≈ ${formatVND0(usdToVnd(min))}–${formatVND0(usdToVnd(max))}`;
    }
    const usd = a.pricing.usd_adult ?? a.pricing.estimatedUSD_adult;
    if (typeof usd === "number") return `≈ ${formatVND0(usdToVnd(usd))}`;
    return "";
  })();

  return (
    <article>
      <div className="relative overflow-hidden rounded-2xl">
        <SmartImage
          src={ACT_COVERS[a.id] ? P(ACT_COVERS[a.id]) : cityCoverFromLabel(a.city)}
          alt={a.name}
          fallback={cityCoverFromLabel(a.city)}
          className="h-44"
          overlay={
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/45 via-transparent to-transparent" />
              <p className="absolute bottom-4 left-5 text-[11px] font-medium uppercase tracking-[0.2em] text-sand-50/85">
                {a.city}
                {a.window ? ` · ${a.window}` : ""}
              </p>
            </>
          }
        />
      </div>

      <h3 className="mt-5 font-display text-[1.8rem] text-ink-900 leading-tight tracking-[-0.01em]">{a.name}</h3>
      <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.18em] text-ink-500">
        {a.category}
        {a.payMode ? ` · ${a.payMode}` : ""} · {a.provider}
      </p>

      <div className="mt-4 border-y border-ink-200 divide-y divide-ink-200">
        <div className="py-3 flex items-baseline gap-4">
          <span className="w-[4.5rem] shrink-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-600">Prix</span>
          <span className="flex-1">
            <span className="block text-[16px] font-semibold text-clay-600">{priceLine}</span>
            {rawLine && <span className="block mt-0.5 text-[14px] text-ink-600 tabular-nums">{rawLine}</span>}
          </span>
        </div>
        {a.duration && <Spec label="Durée" value={a.duration} />}
        {a.kidsRule && <Spec label="Enfants" value={a.kidsRule} />}
      </div>

      {a.notes && <p className="mt-4 text-[15px] text-ink-600 leading-relaxed">{a.notes}</p>}

      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
        {a.sourceUrl && (
          <a href={a.sourceUrl} target="_blank" rel="noopener noreferrer" className={linkCls}>
            Source →
          </a>
        )}
        <a href={googleMapsSearchUrl(a.name + " " + a.city)} target="_blank" rel="noopener noreferrer" className={linkCls}>
          Carte →
        </a>
      </div>

      {a.driver && <DriverCard driver={a.driver} fallbackName={a.name} />}

      <div className="mt-4">
        <AskTang question={`Comment bien profiter de ${a.name} à ${a.city} ? Horaires, astuces et pièges à éviter avec des enfants.`} />
      </div>
    </article>
  );
};
