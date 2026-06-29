import { useEffect, useRef, useState } from "react";
import { X, Send, Loader2, Compass, WifiOff } from "lucide-react";
import { TANG_SUGGESTIONS } from "../data/trip";
import { useTang } from "../lib/tangCtx";
import { useOnline } from "../lib/useOnline";

const TangAvatar = ({ size = 48, className = "" }: { size?: number; className?: string }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} className={className} aria-hidden="true">
    <defs>
      <linearGradient id="tang-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#10b981" />
        <stop offset="1" stopColor="#0ea5e9" />
      </linearGradient>
    </defs>
    <circle cx="24" cy="24" r="24" fill="url(#tang-grad)" />
    <circle cx="24" cy="27" r="10.5" fill="#fde9c8" />
    <path d="M24 7 L35 21 Q24 24.5 13 21 Z" fill="#f3cd86" stroke="#e0a948" strokeWidth="1" strokeLinejoin="round" />
    <ellipse cx="24" cy="21" rx="11.5" ry="2.2" fill="#e7b75f" />
    <circle cx="20.3" cy="27" r="1.5" fill="#3b2f2f" />
    <circle cx="27.7" cy="27" r="1.5" fill="#3b2f2f" />
    <path d="M20.5 31 Q24 33.6 27.5 31" fill="none" stroke="#3b2f2f" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

type TangMsg = { role: "user" | "assistant"; content: string; sources?: { title: string; url: string }[] };

export const MrTang = ({ tripContext, today }: { tripContext: string; today: string }) => {
  const { open, prefill, openTang, closeTang } = useTang();
  const online = useOnline();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<TangMsg[]>(() => {
    const saved = localStorage.getItem("trip_tang_chat");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        /* ignore */
      }
    }
    return [];
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem("trip_tang_chat", JSON.stringify(messages.slice(-20)));
  }, [messages]);
  useEffect(() => {
    if (open) requestAnimationFrame(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }));
  }, [messages, open, loading]);
  // When opened from a card, drop that card's question into the input, ready to edit/send.
  useEffect(() => {
    if (open && prefill) {
      setInput(prefill);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open, prefill]);

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || loading) return;
    if (!online) return; // hors-ligne : le bandeau explique déjà la situation
    const next: TangMsg[] = [...messages, { role: "user", content: q }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const r = await fetch("/api/tang", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.map((m) => ({ role: m.role, content: m.content })), tripContext, today }),
      });
      const data = await r.json();
      setMessages((m) => [...m, { role: "assistant", content: data.reply || "…", sources: data.sources }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Je n'arrive pas à me connecter pour l'instant. Réessaie dans un moment — il faut une connexion internet (et que Mr. Tang soit activé sur le serveur)." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => openTang()}
          aria-label="Ouvrir Mr. Tang, votre concierge"
          className="fixed right-4 z-[95] bottom-[calc(env(safe-area-inset-bottom)+7rem)] w-14 h-14 rounded-full glass flex items-center justify-center active:scale-95 transition-transform motion-safe:animate-pop"
        >
          <TangAvatar size={40} />
          <span className={`absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full ring-2 ring-white ${online ? "bg-jade-400" : "bg-ink-400"}`} />
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end">
          <button type="button" aria-label="Fermer le concierge" onClick={closeTang} className="absolute inset-0 bg-ink-950/30 backdrop-blur-md" />
          <div className="relative w-full max-h-[82vh] glass-strong rounded-t-[2rem] flex flex-col motion-safe:animate-fade-up">
            <div className="mx-auto mt-2.5 h-1.5 w-10 rounded-full bg-ink-300" />
            <div className="flex items-center gap-3 p-4 border-b border-ink-200">
              <TangAvatar size={44} />
              <div className="flex-1 min-w-0">
                <p className="font-display text-xl text-ink-900 leading-none">Mr. Tang</p>
                <p className="text-[14px] font-semibold text-jade-600 flex items-center gap-1.5 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-jade-500" /> Votre concierge Vietnam
                </p>
              </div>
              <button type="button" aria-label="Fermer" onClick={closeTang} className="w-9 h-9 rounded-full bg-ink-100 text-ink-600 flex items-center justify-center active:scale-90 transition-transform">
                <X size={18} />
              </button>
            </div>

            {!online && (
              <div className="flex items-start gap-2.5 px-4 py-3 bg-accent-50 border-b border-accent-100 text-[14px] text-accent-800 leading-snug">
                <WifiOff size={16} className="shrink-0 mt-0.5 text-accent-600" />
                <p>
                  <b>Hors-ligne.</b> Mr. Tang a besoin d’une connexion internet pour répondre. Le reste du carnet — itinéraire, hôtels, transferts, budget, guide — reste consultable sans réseau.
                </p>
              </div>
            )}

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="flex gap-2.5">
                  <TangAvatar size={32} className="shrink-0 mt-0.5" />
                  <div className="rounded-2xl rounded-tl-md bg-ink-50 border border-ink-100 p-3 text-sm text-ink-700 leading-relaxed">
                    Xin chào ! Je suis <b>Mr. Tang</b>, votre concierge pour le Vietnam. Je connais tout votre voyage — itinéraire, hôtels, transferts, budget — et je peux aussi chercher en direct des idées : expos, restos, événements, météo… Posez-moi votre question !
                  </div>
                </div>
              )}
              {messages.map((m, i) =>
                m.role === "user" ? (
                  <div key={i} className="flex justify-end">
                    <div className="max-w-[82%] rounded-2xl rounded-tr-md bg-accent-600 text-white p-3 text-sm leading-relaxed whitespace-pre-wrap">{m.content}</div>
                  </div>
                ) : (
                  <div key={i} className="flex gap-2.5">
                    <TangAvatar size={32} className="shrink-0 mt-0.5" />
                    <div className="max-w-[82%]">
                      <div className="rounded-2xl rounded-tl-md bg-ink-50 border border-ink-100 p-3 text-sm text-ink-700 leading-relaxed whitespace-pre-wrap">{m.content}</div>
                      {m.sources && m.sources.length > 0 && (
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {m.sources.map((s, j) => (
                            <a key={j} href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-ink-100 text-[14px] font-semibold text-accent-700 max-w-[170px] truncate">
                              <Compass size={11} className="shrink-0" /> {s.title}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )
              )}
              {loading && (
                <div className="flex gap-2.5">
                  <TangAvatar size={32} className="shrink-0 mt-0.5" />
                  <div className="rounded-2xl rounded-tl-md bg-ink-50 border border-ink-100 p-3 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-ink-300 motion-safe:animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-ink-300 motion-safe:animate-bounce" style={{ animationDelay: "120ms" }} />
                    <span className="w-2 h-2 rounded-full bg-ink-300 motion-safe:animate-bounce" style={{ animationDelay: "240ms" }} />
                  </div>
                </div>
              )}
            </div>

            {messages.length === 0 && (
              <div className="px-4 pb-2 flex flex-wrap gap-2">
                {TANG_SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    disabled={!online}
                    className="px-3 py-2 rounded-full bg-jade-50 border border-jade-100 text-[14px] font-semibold text-jade-700 active:scale-95 transition-transform text-left disabled:opacity-40 disabled:active:scale-100"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="p-3 border-t border-ink-100 flex items-center gap-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={online ? "Demandez à Mr. Tang…" : "Hors-ligne — connexion requise"}
                className="flex-1 bg-ink-50 border border-ink-100 rounded-full px-4 py-3 text-sm text-ink-900 placeholder:text-ink-500"
              />
              <button
                type="submit"
                disabled={loading || !input.trim() || !online}
                aria-label={online ? "Envoyer" : "Hors-ligne"}
                className="w-11 h-11 rounded-full bg-accent-600 text-white flex items-center justify-center disabled:opacity-40 active:scale-90 transition-transform shrink-0"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : online ? <Send size={18} /> : <WifiOff size={18} />}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
