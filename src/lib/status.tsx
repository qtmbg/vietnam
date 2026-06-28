// ============================================================
// STATUS — CONFIRMED / ESTIMATE badge descriptor (label + classes + icon).
// ============================================================
import { BadgeCheck, BadgeHelp } from "lucide-react";
import type { StatusTag } from "../data/types";

export const badgeForStatus = (s: StatusTag) => {
  if (s === "CONFIRMED") return { label: "CONFIRMÉ", cls: "bg-jade-600 text-white", icon: <BadgeCheck size={14} /> };
  return { label: "ESTIMÉ", cls: "bg-sun-500 text-white", icon: <BadgeHelp size={14} /> };
};
