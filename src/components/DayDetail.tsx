import { DetailSheet } from "./DetailSheet";
import { HotelCard } from "./HotelCard";
import { ActivityCard } from "./ActivityCard";
import { ExpenseRow } from "./ExpenseRow";
import type { HotelItem, PlannedActivity, ExpenseItemUSD } from "../data/types";

// What a day element opens into. Reuses the existing cards verbatim.
export type DayDetailState =
  | { kind: "hotel"; hotel: HotelItem }
  | { kind: "activity"; activity: PlannedActivity }
  | { kind: "transfer"; expense: ExpenseItemUSD };

export const DayDetail = ({ detail, onClose }: { detail: DayDetailState | null; onClose: () => void }) => {
  const title = detail?.kind === "hotel" ? "Hôtel" : detail?.kind === "activity" ? "Activité" : "Transfert";
  return (
    <DetailSheet open={!!detail} title={title} onClose={onClose}>
      {detail?.kind === "hotel" && <HotelCard hotel={detail.hotel} />}
      {detail?.kind === "activity" && <ActivityCard a={detail.activity} />}
      {detail?.kind === "transfer" && (
        <ExpenseRow item={{ ...detail.expense, alloc_claudine: 0, alloc_nous: 0 }} showAlloc={false} />
      )}
    </DetailSheet>
  );
};
