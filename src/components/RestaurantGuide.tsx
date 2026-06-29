import { MapPin, Baby, Leaf } from "lucide-react";
import { AskTang } from "./AskTang";
import { googleMapsSearchUrl } from "../lib/maps";
import type { RestaurantCity } from "../data/types";

// "Où manger" — a Time Out-style where-to-eat list. One section per city, each
// spot ruled and scannable: name + price tier, cuisine · area, the dish to
// order, a one-line hook, kid/veg badges and a one-tap Maps link.
const Badge = ({ icon: Icon, label, tone }: { icon: typeof Baby; label: string; tone: "kids" | "veg" }) => (
  <span
    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] ${
      tone === "kids" ? "bg-accent-50 text-accent-600" : "bg-jade-50 text-jade-700"
    }`}
  >
    <Icon size={11} aria-hidden="true" /> {label}
  </span>
);

export const RestaurantGuide = ({ groups }: { groups: RestaurantCity[] }) => (
  <div className="space-y-4">
    {groups.map((g) => (
      <section key={g.city} className="card rounded-card px-5 py-4">
        <div className="flex items-baseline gap-2.5">
          <span aria-hidden="true" className="text-[1.5rem] leading-none">{g.emoji}</span>
          <h3 className="font-display text-[1.7rem] font-semibold text-ink-900 leading-none tracking-[-0.01em]">{g.city}</h3>
        </div>
        {g.blurb && <p className="mt-2 text-[13.5px] text-ink-600 leading-snug">{g.blurb}</p>}

        <div className="mt-3 border-t border-ink-200">
          {g.spots.map((s) => (
            <div key={s.name} className="py-4 border-b border-ink-200">
              <div className="flex items-baseline justify-between gap-3">
                <h4 className="font-display text-[1.25rem] font-semibold text-ink-900 leading-tight tracking-[-0.01em]">{s.name}</h4>
                <span className="shrink-0 text-[14px] font-bold text-jade-600 tabular-nums">{s.price}</span>
              </div>
              <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-500">
                {s.cuisine} · {s.area}
              </p>

              <p className="mt-2 text-[14px] text-ink-700 leading-snug">{s.why}</p>
              <p className="mt-1.5 text-[13px] text-ink-800 leading-snug">
                <span className="font-semibold text-accent-600">À commander :</span> {s.signature}
              </p>

              <div className="mt-2.5 flex items-center flex-wrap gap-x-3 gap-y-2">
                {s.kids && <Badge icon={Baby} label="Kids" tone="kids" />}
                {s.veg && <Badge icon={Leaf} label="Végé ok" tone="veg" />}
                <a
                  href={googleMapsSearchUrl(s.mapsQuery ?? `${s.name} ${g.city}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-900 underline underline-offset-4 decoration-accent-400 decoration-1 active:text-accent-600 transition-colors"
                >
                  <MapPin size={12} aria-hidden="true" /> Carte
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3.5">
          <AskTang question={`Donne-moi 3 autres bonnes adresses pour manger à ${g.city} (vrais restos locaux, avec le plat à goûter), adaptées à une famille avec enfants.`} />
        </div>
      </section>
    ))}
  </div>
);
