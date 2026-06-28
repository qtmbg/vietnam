// ============================================================
// MONEY — currency conversion + USD formatting.
// VND → USD uses a fixed hypothesis for the app: 1 USD ≈ 25 970 VND.
// ============================================================
export const VND_PER_USD = 25970;

export const vndToUsdRounded = (vnd: number) => Math.round(vnd / VND_PER_USD);
export const usdRounded = (usd: number) => Math.round(usd);

export const formatUSD0 = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
