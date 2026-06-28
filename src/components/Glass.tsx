import type { ReactNode } from "react";

export const Glass = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`backdrop-blur-xl bg-white/75 border border-white/60 shadow-card overflow-hidden ${className}`}>{children}</div>
);
