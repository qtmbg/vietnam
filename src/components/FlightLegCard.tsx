import { Plane, BadgeCheck, ArrowRight } from "lucide-react";
import { Card } from "./Card";
import type { FlightLeg } from "../data/types";

export const FlightLegCard = ({ leg }: { leg: FlightLeg }) => (
  <Card className="p-6 mb-6">
    <div className="flex items-start justify-between gap-3 mb-5">
      <div className="min-w-0">
        <h4 className="font-display text-[22px] text-ink-900 leading-tight">{leg.title}</h4>
        <p className="text-[13px] font-semibold text-ink-400 mt-0.5">{leg.sub}</p>
      </div>
      <span className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-jade-600 text-white text-[12px] font-bold uppercase tracking-wide">
        <BadgeCheck size={13} /> {leg.paid ? "Payé" : "Confirmé"}
      </span>
    </div>
    <div className="space-y-5">
      {leg.segs.map((s, i) => (
        <div key={i} className="relative pl-7">
          <div className="absolute left-[5px] top-2 bottom-2 w-px bg-ink-200" />
          <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-brand-600 ring-4 ring-brand-50" />
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-ink-900 text-white text-[12px] font-bold">
              <Plane size={12} /> {s.code}
            </span>
            <span className="text-[12px] font-semibold text-ink-400">{s.carrier}</span>
            {s.resa && <span className="text-[12px] font-bold text-brand-700">Réf {s.resa}</span>}
          </div>
          <div className="flex items-start gap-3">
            <div>
              <p className="font-display text-xl text-ink-900 leading-none">{s.fromCode}</p>
              <p className="text-[12px] font-semibold text-ink-500">{s.fromCity}</p>
              <p className="text-[13px] font-bold text-ink-700 mt-1">{s.dep}</p>
            </div>
            <ArrowRight size={18} className="text-ink-300 mt-1.5 shrink-0" />
            <div>
              <p className="font-display text-xl text-ink-900 leading-none">{s.toCode}</p>
              <p className="text-[12px] font-semibold text-ink-500">{s.toCity}</p>
              <p className="text-[13px] font-bold text-ink-700 mt-1">{s.arr}</p>
            </div>
          </div>
          {s.note && <p className="mt-2 text-[13px] font-medium text-ink-500 leading-snug">{s.note}</p>}
        </div>
      ))}
    </div>
  </Card>
);
