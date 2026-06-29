import { FileText, ExternalLink } from "lucide-react";
import type { TravelDoc } from "../data/types";

// A titled group of real documents (PDFs). Each row opens its file in a new tab
// in one tap — flight e-tickets, hotel confirmations. Files are served from
// /public/docs and cached by the service worker, so they also work offline once
// opened. `icon` lets the caller swap the leading glyph (plane, bed…).
export const DocCard = ({
  title,
  note,
  docs,
  icon,
}: {
  title: string;
  note?: string;
  docs: TravelDoc[];
  icon?: typeof FileText;
}) => {
  const Icon = icon ?? FileText;
  return (
    <section className="card rounded-card px-5 py-4">
      <h4 className="font-display text-[1.5rem] font-semibold text-ink-900 leading-tight tracking-[-0.01em]">{title}</h4>
      {note && <p className="mt-1 text-[13px] text-ink-600 leading-snug">{note}</p>}

      <div className="mt-3 border-t border-ink-200">
        {docs.map((d) => (
          <a
            key={d.file}
            href={d.file}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3.5 py-3.5 border-b border-ink-200 active:bg-ink-50 -mx-1 px-1 rounded-lg transition-colors"
          >
            <span className="w-10 h-10 shrink-0 rounded-xl bg-ink-100 text-ink-700 flex items-center justify-center">
              <Icon size={18} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[16px] font-semibold text-ink-900 leading-snug">{d.label}</span>
              {d.sub && <span className="block text-[12.5px] text-ink-500 leading-snug">{d.sub}</span>}
            </span>
            <span className="shrink-0 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent-600">
              PDF <ExternalLink size={13} className="group-active:translate-x-0.5 transition-transform" aria-hidden="true" />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
};
