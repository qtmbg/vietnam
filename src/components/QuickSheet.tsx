import { X, Calendar, Wallet, Utensils, Map } from "lucide-react";
import type { View } from "../data/types";

export const QuickSheet = ({
  open,
  onClose,
  onGoto,
}: {
  open: boolean;
  onClose: () => void;
  onGoto: (v: View) => void;
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-ink-900/90 backdrop-blur-xl p-8 flex flex-col">
      <div className="flex justify-between items-center mb-12">
        <h3 className="text-3xl font-black text-white">Accès rapide</h3>
        <button onClick={onClose} className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white">
          <X size={24} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => {
            onGoto("voyage");
            onClose();
          }}
          className="p-6 rounded-3xl bg-brand-500 text-white text-left aspect-square flex flex-col justify-between"
        >
          <Calendar size={32} />
          <div>
            <p className="font-black text-lg leading-tight mb-1">Voyage</p>
            <p className="text-xs font-medium text-white/70">Jour par jour</p>
          </div>
        </button>

        <button
          onClick={() => {
            onGoto("carte");
            onClose();
          }}
          className="p-6 rounded-3xl bg-jade-500 text-white text-left aspect-square flex flex-col justify-between"
        >
          <Map size={32} />
          <div>
            <p className="font-black text-lg leading-tight mb-1">Carte</p>
            <p className="text-xs font-medium text-white/70">Tous les lieux</p>
          </div>
        </button>

        <button
          onClick={() => {
            onGoto("guide");
            onClose();
          }}
          className="p-6 rounded-3xl bg-ink-100 text-ink-900 text-left aspect-square flex flex-col justify-between"
        >
          <Utensils size={32} />
          <div>
            <p className="font-black text-lg leading-tight mb-1">Guide</p>
            <p className="text-xs font-medium text-ink-600">Food + vols + pratique</p>
          </div>
        </button>

        <button
          onClick={() => {
            onGoto("budget");
            onClose();
          }}
          className="p-6 rounded-3xl bg-sun-500 text-white text-left aspect-square flex flex-col justify-between"
        >
          <Wallet size={32} />
          <div>
            <p className="font-black text-lg leading-tight mb-1">Budget</p>
            <p className="text-xs font-medium text-white/70">USD uniquement</p>
          </div>
        </button>
      </div>

      <div className="mt-auto">
        <p className="text-center text-white/40 text-[13px] font-bold uppercase tracking-[0.2em]">
          Vietnam Trip 2026 — Hub Mobile
        </p>
      </div>
    </div>
  );
};
