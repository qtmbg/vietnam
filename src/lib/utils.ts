// ============================================================
// UTILS — small generic numeric helpers.
// ============================================================
export const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
export const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
