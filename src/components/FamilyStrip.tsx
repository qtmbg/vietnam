import { SmartImage } from "./SmartImage";
import { P } from "../lib/assets";
import { crew } from "../theme";
import type { FamilyMember } from "../data/types";

export const FamilyStrip = ({ members }: { members: FamilyMember[] }) => (
  <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
    {members.map((m) => (
      <div key={m.name} className="flex flex-col items-center gap-1.5 shrink-0 w-[68px]">
        <div className="relative">
          <SmartImage src={P(m.src)} alt={m.name} fallback={m.fallback} className="w-16 h-16 rounded-full ring-2 ring-white shadow-card" />
          <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-sm">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: crew[m.id] }} />
          </div>
        </div>
        <div className="text-center leading-tight">
          <p className="text-[13px] font-bold text-ink-900 truncate w-full">{m.name}</p>
          <p className="text-[12px] font-semibold text-ink-400 truncate w-full">{m.desc}</p>
        </div>
      </div>
    ))}
  </div>
);
