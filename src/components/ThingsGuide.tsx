import { useState } from "react";
import { MapPin, Baby, ExternalLink } from "lucide-react";
import { AskTang } from "./AskTang";
import { googleMapsSearchUrl } from "../lib/maps";
import type { ThingsCity } from "../data/types";

// "À faire" — things to do, one section per city. A top toggle filters to the
// kid-friendly highlights (for Aydann 12 & Milann 6). Each spot shows its kind,
// a hook, ages/duration, a Maps link and an optional booking link.
export const ThingsGuide = ({ groups }: { groups: ThingsCity[] }) => {
  const [kidsOnly, setKidsOnly] = useState(false);

  return (
    <div>
      {/* Kids filter — friendly, prominent */}
      <div className="mb-5 flex items-center justify-between gap-3 card rounded-card px-4 py-3">
        <span className="inline-flex items-center gap-2 text-[14px] font-semibold text-ink-800">
          <Baby size={17} className="text-accent-600" aria-hidden="true" />
          Avec Aydann & Milann
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={kidsOnly}
          onClick={() => setKidsOnly((v) => !v)}
          className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300 ${kidsOnly ? "bg-accent-600" : "bg-ink-300"}`}
        >
          <span
            className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-soft transition-transform duration-300 ${kidsOnly ? "translate-x-[1.4rem]" : "translate-x-0.5"}`}
          />
        </button>
      </div>

      <div className="space-y-4">
        {groups.map((g) => {
          const spots = kidsOnly ? g.spots.filter((s) => s.forKids) : g.spots;
          if (spots.length === 0) return null;
          return (
            <section key={g.city} className="card rounded-card px-5 py-4">
              <div className="flex items-baseline gap-2.5">
                <span aria-hidden="true" className="text-[1.5rem] leading-none">{g.emoji}</span>
                <h3 className="font-display text-[1.7rem] font-semibold text-ink-900 leading-none tracking-[-0.01em]">{g.city}</h3>
              </div>

              <div className="mt-3 border-t border-ink-200">
                {spots.map((s) => (
                  <div key={s.name} className="py-4 border-b border-ink-200">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="rounded-full bg-ink-100 px-2.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-ink-600">
                        {s.kind}
                      </span>
                      {s.forKids && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-accent-50 px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-accent-600">
                          <Baby size={11} aria-hidden="true" /> Kids
                        </span>
                      )}
                      {s.ages && <span className="text-[11px] font-medium text-ink-500">· {s.ages}</span>}
                    </div>

                    <h4 className="mt-2 font-display text-[1.3rem] font-semibold text-ink-900 leading-tight tracking-[-0.01em]">{s.name}</h4>
                    <p className="mt-1 text-[14px] text-ink-700 leading-snug">{s.why}</p>

                    <div className="mt-2.5 flex items-center flex-wrap gap-x-4 gap-y-2">
                      {s.duration && <span className="text-[12px] font-medium text-ink-500">⏱ {s.duration}</span>}
                      {s.bookUrl && (
                        <a
                          href={s.bookUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-900 underline underline-offset-4 decoration-accent-400 decoration-1 active:text-accent-600 transition-colors"
                        >
                          Réserver <ExternalLink size={12} aria-hidden="true" />
                        </a>
                      )}
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
                <AskTang question={`Que faire d'autre à ${g.city} avec des enfants de 6 et 12 ans ? Donne des idées concrètes (lieux, durée, prix indicatif).`} />
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};
