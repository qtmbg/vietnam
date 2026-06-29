import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { googleMapsSearchUrl } from "../lib/maps";
import type { DriverInfo } from "../data/types";

// "À montrer au chauffeur" — the on-the-ground hand-off card.
// Big, high-contrast type meant to be read at arm's length from a taxi seat:
// the place name + address in Vietnamese, copyable in one tap, plus a Maps link.
export const DriverCard = ({ driver, fallbackName }: { driver: DriverInfo; fallbackName: string }) => {
  const [copied, setCopied] = useState(false);
  const name = driver.nameVi || fallbackName;
  const copyText = `${name}\n${driver.address}`;
  const query = `${name}, ${driver.address}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* presse-papiers indisponible — le lien Maps reste utilisable */
    }
  };

  return (
    <section className="mt-6 rounded-[6px] border border-ink-300 bg-ink-50 p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-600">À montrer au chauffeur</p>

      <p lang="vi" className="mt-3 font-display text-[1.75rem] leading-[1.12] text-ink-900 tracking-[-0.01em]">
        {name}
      </p>
      <p lang="vi" className="mt-2 text-[1.25rem] font-medium leading-snug text-ink-800">
        {driver.address}
      </p>

      {driver.note && <p className="mt-3 text-[14px] leading-relaxed text-ink-600">{driver.note}</p>}

      <div className="mt-4 flex items-center gap-4">
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "Adresse copiée" : "Copier le nom et l'adresse"}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-ink-900 text-surface-50 text-[14px] font-semibold active:scale-95 transition-transform"
        >
          {copied ? <Check size={15} /> : <Copy size={15} />} {copied ? "Copié" : "Copier"}
        </button>
        <a
          href={googleMapsSearchUrl(query)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-900 underline underline-offset-4 decoration-accent-400 decoration-1 active:text-accent-600 transition-colors"
        >
          Ouvrir Maps →
        </a>
      </div>
    </section>
  );
};
