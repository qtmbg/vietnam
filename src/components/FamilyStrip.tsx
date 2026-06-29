import { SmartImage } from "./SmartImage";
import { P } from "../lib/assets";
import { crew } from "../theme";
import type { FamilyMember } from "../data/types";

// Contact-sheet: the whole crew at once (no scroll) — graded portraits, a thin
// crew-tint marker, name + role. Portraits scale to fit five across.
export const FamilyStrip = ({ members }: { members: FamilyMember[] }) => (
  <div className="grid grid-cols-5 gap-2">
    {members.map((m) => (
      <figure key={m.name} className="flex flex-col items-center m-0 min-w-0">
        <SmartImage src={P(m.src)} alt={m.name} fallback={m.fallback} className="w-full aspect-[5/6] rounded-xl ring-1 ring-ink-200" />
        <span className="mt-2 h-px w-5" style={{ backgroundColor: crew[m.id] }} />
        <figcaption className="mt-1.5 text-center leading-tight">
          <p className="text-[12px] font-semibold text-ink-900 leading-tight">{m.name}</p>
          <p className="mt-0.5 font-display italic text-[10.5px] text-ink-600 leading-tight">{m.desc}</p>
        </figcaption>
      </figure>
    ))}
  </div>
);
