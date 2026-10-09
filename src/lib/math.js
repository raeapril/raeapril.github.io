export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const ease = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
export const lerp = (a, b, t) => a + (b - a) * t;
/** 두 자리 번호 (1 → "01") */
export const pad2 = (n) => String(n).padStart(2, "0");
