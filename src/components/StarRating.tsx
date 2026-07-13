import { Star } from "lucide-react";

// A 1–5 star rating — how much a spot is "à ne pas rater". Filled = importance,
// empty = the rest. Purely informative (not interactive).
export const StarRating = ({ value, size = 13 }: { value: number; size?: number }) => (
  <span className="inline-flex items-center gap-0.5" role="img" aria-label={`${value} sur 5`} title={`${value}/5`}>
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        size={size}
        aria-hidden="true"
        strokeWidth={2}
        className={i <= value ? "text-accent-500" : "text-ink-300"}
        fill={i <= value ? "currentColor" : "none"}
      />
    ))}
  </span>
);
