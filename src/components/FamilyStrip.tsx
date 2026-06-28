import { SmartImage } from "./SmartImage";
import { P } from "../lib/assets";
import { crew } from "../theme";
import type { FamilyMember } from "../data/types";

// Editorial contact-sheet: graded portraits, a thin crew-tint marker, name in
// Inter and role as a Fraunces italic caption. No status dots.
export const FamilyStrip = ({ members }: { members: FamilyMember[] }) => (
  <div className="flex gap-5 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
    {members.map((m) => (
      <figure key={m.name} className="flex flex-col items-center shrink-0 w-[72px] m-0">
        <SmartImage src={P(m.src)} alt={m.name} fallback={m.fallback} className="w-[62px] h-[76px] rounded-[3px] ring-1 ring-ink-200" />
        <span className="mt-2.5 h-px w-5" style={{ backgroundColor: crew[m.id] }} />
        <figcaption className="mt-2 text-center leading-none">
          <p className="text-[14px] font-semibold text-ink-900">{m.name}</p>
          <p className="mt-1 font-display italic text-[12px] text-ink-600">{m.desc}</p>
        </figcaption>
      </figure>
    ))}
  </div>
);
