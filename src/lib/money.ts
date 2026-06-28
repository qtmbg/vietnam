// ============================================================
// MONEY — currency conversion + USD formatting.
// VND → USD uses a fixed hypothesis for the app: 1 USD ≈ 25 970 VND.
// ============================================================
export const VND_PER_USD = 25970;

export const vndToUsdRounded = (vnd: number) => Math.round(vnd / VND_PER_USD);
export const usdRounded = (usd: number) => Math.round(usd);

// USD → VND, rounded to the nearest 1 000 ₫ (the "≈" makes the approximation honest).
export const usdToVnd = (usd: number) => Math.round((usd * VND_PER_USD) / 1000) * 1000;

export const formatUSD0 = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

// Vietnamese grouping (3.740.000) + the local "VND" suffix, matching the app's
// existing raw-VND lines. Used to print a price's dong equivalent next to it.
export const formatVND0 = (vnd: number) => `${vnd.toLocaleString("vi-VN")} VND`;

// Instant "≈ 3.740.000 VND" label to show beside a USD figure.
export const usdToVndLabel = (usd: number) => `≈ ${formatVND0(usdToVnd(usd))}`;
