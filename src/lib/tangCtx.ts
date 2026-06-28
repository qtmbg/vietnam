import { createContext, useContext } from "react";

// Lets any card open Mr. Tang with a question already typed into the input.
// The global trip context (buildTripContext) is unchanged — this only carries
// a per-card prefill for the input field.
export type TangContextValue = {
  open: boolean;
  prefill: string;
  openTang: (prefill?: string) => void;
  closeTang: () => void;
};

export const TangContext = createContext<TangContextValue | null>(null);

export const useTang = () => {
  const ctx = useContext(TangContext);
  if (!ctx) throw new Error("useTang must be used within a <TangContext.Provider>");
  return ctx;
};
