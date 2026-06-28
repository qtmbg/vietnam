import { X, Calendar, Wallet, Utensils, Map } from "lucide-react";
import type { View } from "../data/types";

export const QuickSheet = ({
  open,
  onClose,
  onGoto,
  onBudget,
}: {
  open: boolean;
  onClose: () => void;
  onGoto: (v: View) => void;
  onBudget: () => void;
}) => {
  if (!open) return null;

  const tiles = [
    { key: "voyage", icon: Calendar, label: "Voyage", sub: "Jour par jour", tint: "text-clay-600", run: () => onGoto("voyage") },
    { key: "carte", icon: Map, label: "Carte", sub: "Tous les lieux", tint: "text-jade-600", run: () => onGoto("carte") },
    { key: "guide", icon: Utensils, label: "Guide", sub: "Food + vols + pratique", tint: "text-brand-500", run: () => onGoto("guide") },
    { key: "budget", icon: Wallet, label: "Budget", sub: "Reste à payer", tint: "text-sun-500", run: onBudget },
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-white/55 backdrop-blur-2xl p-8 flex flex-col">
      <div className="flex justify-between items-center mb-12">
        <h3 className="font-display text-3xl font-semibold text-ink-900 tracking-[-0.02em]">Accès rapide</h3>
        <button type="button" onClick={onClose} aria-label="Fermer" className="w-11 h-11 rounded-full glass flex items-center justify-center text-ink-700 active:scale-90 transition-transform">
          <X size={22} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {tiles.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => {
                t.run();
                onClose();
              }}
              className="glass rounded-[1.5rem] p-6 text-left aspect-square flex flex-col justify-between active:scale-[0.97] transition-transform"
            >
              <Icon size={30} className={t.tint} />
              <div>
                <p className="font-semibold text-[18px] leading-tight mb-0.5 text-ink-900">{t.label}</p>
                <p className="text-[13px] font-medium text-ink-500">{t.sub}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-auto">
        <p className="text-center text-ink-400 text-[12px] font-semibold uppercase tracking-[0.2em]">Vietnam Trip 2026</p>
      </div>
    </div>
  );
};
