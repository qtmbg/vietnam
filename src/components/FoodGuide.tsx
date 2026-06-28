import { MapPin } from "lucide-react";
import { Card } from "./Card";
import type { FoodCity } from "../data/types";

export const FoodGuide = ({ groups }: { groups: FoodCity[] }) => (
  <div className="space-y-6 mb-8">
    {groups.map((g) => (
      <Card key={g.city} className="p-6">
        <div className="flex items-center gap-2.5 mb-4">
          <span className="text-2xl">{g.emoji}</span>
          <h4 className="font-display text-[22px] text-ink-900 leading-none">{g.city}</h4>
        </div>
        <div className="space-y-4">
          {g.dishes.map((d) => (
            <div key={d.name} className="pb-4 border-b border-ink-100 last:border-0 last:pb-0">
              <div className="flex items-baseline gap-2 flex-wrap">
                <p className="text-base font-bold text-ink-900">{d.name}</p>
                <p className="text-[13px] font-semibold text-jade-600 italic">{d.vi}</p>
              </div>
              <p className="mt-1 text-[14px] font-medium text-ink-600 leading-relaxed">{d.desc}</p>
              {d.where && (
                <p className="mt-1.5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-700">
                  <MapPin size={13} className="shrink-0" /> {d.where}
                </p>
              )}
            </div>
          ))}
        </div>
      </Card>
    ))}
  </div>
);
