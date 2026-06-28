import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

// Generic bottom-sheet modal — reuses the concierge/quick-sheet pattern so
// any existing card (HotelCard, ActivityCard, ExpenseRow…) can be shown as a
// tap-through detail without rewriting it.
// Rendered through a portal to <body> so the fixed overlay escapes the view
// wrappers' transform (animate-fade-up), which would otherwise trap it and
// leave only the blurred backdrop visible.
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
  // Lock background scroll while the sheet is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-[100] flex flex-col justify-end">
      <button type="button" aria-label="Fermer" onClick={onClose} className="absolute inset-0 bg-ink-950/30 backdrop-blur-md" />
      <div className="relative w-full max-h-[88vh] glass-strong rounded-t-[1.5rem] flex flex-col motion-safe:animate-fade-up">
        <div className="mx-auto mt-2.5 h-1.5 w-10 rounded-full bg-ink-300" />
        <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-ink-200">
          <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-ink-600">{title}</p>
          <button type="button" aria-label="Fermer" onClick={onClose} className="w-9 h-9 rounded-full bg-ink-100 text-ink-600 flex items-center justify-center active:scale-90 transition-transform">
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">{children}</div>
      </div>
    </div>,
    document.body
  );
};
