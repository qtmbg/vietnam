import { useState } from "react";
import { ArrowRightLeft } from "lucide-react";
import { VND_PER_USD, USD_PER_EUR } from "../lib/money";

// Convertisseur malin € / $ / ₫ — trois champs LIÉS : on tape dans n'importe
// lequel, les deux autres suivent en direct (pas de sens "de → vers" à choisir).
// Pensé pour la rue : chips des prix courants en dong + repères concrets.
type Cur = "eur" | "usd" | "vnd";

// Tolerant parse: accepts "1,5", "100 000", "100.000" (VND grouping) …
const parseAmount = (s: string) => {
  let t = s.replace(/\s/g, "").replace(/[^\d.,-]/g, "");
  const lastComma = t.lastIndexOf(",");
  const lastDot = t.lastIndexOf(".");
  // The LAST separator is the decimal mark; every other one is grouping.
  const dec = Math.max(lastComma, lastDot);
  if (dec >= 0) {
    const intPart = t.slice(0, dec).replace(/[.,]/g, "");
    const frac = t.slice(dec + 1).replace(/[.,]/g, "");
    // "100.000" reads as VND grouping (3 digits), not as decimals.
    t = frac.length === 3 && lastComma === -1 ? intPart + frac : `${intPart}.${frac}`;
  }
  const n = parseFloat(t);
  return Number.isFinite(n) ? n : null;
};

const fmt = (cur: Cur, usd: number) => {
  if (cur === "vnd") {
    const vnd = usd * VND_PER_USD;
    // Round big amounts to the nearest 1 000 ₫ (street reality), small ones to the unit.
    const rounded = vnd >= 10_000 ? Math.round(vnd / 1000) * 1000 : Math.round(vnd);
    return rounded.toLocaleString("fr-FR");
  }
  const v = cur === "usd" ? usd : usd / USD_PER_EUR;
  return v.toLocaleString("fr-FR", { maximumFractionDigits: 2 });
};

const toUsd = (cur: Cur, n: number) => (cur === "usd" ? n : cur === "eur" ? n * USD_PER_EUR : n / VND_PER_USD);

const ROWS: { cur: Cur; symbol: string; label: string }[] = [
  { cur: "vnd", symbol: "₫", label: "Dong" },
  { cur: "eur", symbol: "€", label: "Euro" },
  { cur: "usd", symbol: "$", label: "Dollar" },
];

// Prix de rue courants — un tap et on "voit" le prix en € / $.
const QUICK_VND = [
  { label: "25k", vnd: 25_000 },
  { label: "50k", vnd: 50_000 },
  { label: "100k", vnd: 100_000 },
  { label: "500k", vnd: 500_000 },
  { label: "1M", vnd: 1_000_000 },
];

export const CurrencyConverter = () => {
  // 100 000 ₫ préfixé : le billet le plus courant, converti dès l'ouverture.
  const [values, setValues] = useState<Record<Cur, string>>(() => {
    const usd = toUsd("vnd", 100_000);
    return { vnd: fmt("vnd", usd), eur: fmt("eur", usd), usd: fmt("usd", usd) };
  });

  const edit = (cur: Cur, raw: string) => {
    const n = parseAmount(raw);
    if (n === null) {
      setValues((v) => ({ ...v, [cur]: raw }));
      return;
    }
    const usd = toUsd(cur, n);
    setValues({
      vnd: cur === "vnd" ? raw : fmt("vnd", usd),
      eur: cur === "eur" ? raw : fmt("eur", usd),
      usd: cur === "usd" ? raw : fmt("usd", usd),
    });
  };

  const setVnd = (vnd: number) => {
    const usd = toUsd("vnd", vnd);
    setValues({ vnd: fmt("vnd", usd), eur: fmt("eur", usd), usd: fmt("usd", usd) });
  };

  return (
    <section className="card rounded-card px-5 py-4">
      <div className="flex items-center gap-2.5">
        <span className="w-9 h-9 rounded-xl bg-jade-50 text-jade-600 flex items-center justify-center">
          <ArrowRightLeft size={17} aria-hidden="true" />
        </span>
        <div>
          <h3 className="font-display text-[1.3rem] font-semibold text-ink-900 leading-none tracking-[-0.01em]">Convertisseur</h3>
          <p className="mt-1 text-[11.5px] text-ink-500">Tapez dans n'importe quel champ — les autres suivent.</p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {ROWS.map((r) => (
          <label key={r.cur} className="flex items-center gap-3 rounded-2xl bg-ink-50 border border-ink-100 px-4 py-3">
            <span className="w-7 shrink-0 text-center font-display text-[1.25rem] font-semibold text-jade-600">{r.symbol}</span>
            <input
              value={values[r.cur]}
              onChange={(e) => edit(r.cur, e.target.value)}
              onFocus={(e) => e.target.select()}
              inputMode="decimal"
              aria-label={r.label}
              className="min-w-0 flex-1 bg-transparent text-[19px] font-semibold text-ink-900 tabular-nums outline-none"
            />
            <span className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-500">{r.label}</span>
          </label>
        ))}
      </div>

      {/* Prix de rue en un tap */}
      <div className="mt-3 flex items-center gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
        {QUICK_VND.map((q) => (
          <button
            key={q.label}
            type="button"
            onClick={() => setVnd(q.vnd)}
            className="shrink-0 rounded-full bg-jade-50 border border-jade-100 px-3 py-1.5 text-[13px] font-semibold text-jade-700 active:scale-95 transition-transform"
          >
            {q.label} ₫
          </button>
        ))}
      </div>

      <p className="mt-3 text-[12px] text-ink-500 leading-relaxed">
        Repères : bánh mì ~25k ₫ · phở ~60k ₫ · taxi 5 km ~80k ₫. Taux indicatifs : 1 $ ≈ {VND_PER_USD.toLocaleString("fr-FR")} ₫ · 1 € ≈ {USD_PER_EUR.toLocaleString("fr-FR")} $.
      </p>
    </section>
  );
};
