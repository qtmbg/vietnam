import { useTang } from "../lib/tangCtx";

// Opens Mr. Tang with this card's question already in the input (ready to send/edit).
export const AskTang = ({ question, className = "" }: { question: string; className?: string }) => {
  const { openTang } = useTang();
  return (
    <button
      type="button"
      onClick={() => openTang(question)}
      className={`text-[12px] font-semibold uppercase tracking-[0.14em] text-jade-700 underline underline-offset-4 decoration-jade-300 decoration-1 active:text-jade-600 transition-colors ${className}`}
    >
      Demander à Mr. Tang →
    </button>
  );
};
