import type { ReactNode } from "react";

export const Glass = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`backdrop-blur-md bg-sand-50/85 border border-ink-200 shadow-soft overflow-hidden ${className}`}>{children}</div>
);
