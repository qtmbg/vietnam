import { X } from "lucide-react";
import type { ReactNode } from "react";

// Generic bottom-sheet modal — reuses the concierge/quick-sheet pattern so
// any existing card (HotelCard, ActivityCard, ExpenseRow…) can be shown as a
// tap-through detail without rewriting it.
export const DetailSheet = ({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end">
      <button type="button" aria-label="Fermer" onClick={onClose} className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm" />
      <div className="relative w-full max-h-[88vh] bg-white rounded-t-[2rem] shadow-float flex flex-col motion-safe:animate-fade-up">
        <div className="flex items-center justify-between gap-3 p-4 border-b border-ink-100">
          <p className="font-display text-xl text-ink-900 leading-none">{title}</p>
          <button type="button" aria-label="Fermer" onClick={onClose} className="w-9 h-9 rounded-full bg-ink-100 text-ink-500 flex items-center justify-center active:scale-90 transition-transform">
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">{children}</div>
      </div>
    </div>
  );
};
