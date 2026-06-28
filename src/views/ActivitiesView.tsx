import { X, MapPin } from "lucide-react";
import { ActivityCard } from "../components/ActivityCard";
import { googleMapsSearchUrl } from "../lib/maps";
import { VND_PER_USD } from "../lib/money";
import type { PlannedActivity, View } from "../data/types";

export const ActivitiesView = ({
  groups,
  goView,
}: {
  groups: { city: string; items: PlannedActivity[] }[];
  goView: (v: View) => void;
}) => (
  <div className="motion-safe:animate-fade-up px-6 pt-12">
    <div className="flex justify-between items-center mb-10">
      <div>
        <h2 className="font-display text-[2.5rem] text-ink-900 leading-none mb-1">Activités</h2>
        <p className="text-xs font-bold text-ink-400 uppercase tracking-widest">
          Prix arrondis • USD via 1$ ≈ {VND_PER_USD.toLocaleString("fr-FR")} VND
        </p>
      </div>
      <button type="button" onClick={() => goView("home")} aria-label="Retour à l'accueil" className="w-10 h-10 rounded-full bg-ink-100 flex items-center justify-center text-ink-500 active:scale-90 transition-transform">
        <X size={20} />
      </button>
    </div>

    <div className="space-y-10 pb-20">
      {groups.map((group) => (
        <div key={group.city} className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div>
              <p className="text-[13px] font-black text-ink-400 uppercase tracking-widest">Ville</p>
              <h3 className="text-2xl font-black text-ink-900 tracking-tighter">{group.city}</h3>
            </div>
            <a
              href={googleMapsSearchUrl(group.city)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-ink-100 text-ink-700 text-xs font-black"
            >
              <MapPin size={16} />
              Carte
            </a>
          </div>

          <div className="space-y-4">
            {group.items.map((a) => (
              <ActivityCard key={a.id} a={a} />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);
