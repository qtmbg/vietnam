import type { ReactNode } from "react";

export const Card = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`bg-white rounded-card border border-ink-100 shadow-card overflow-hidden ${className}`}>{children}</div>
);
