export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** 인트로가 끝난 뒤 헤더·히어로 정보를 페이드인 */
export const revealStyle = (revealed) => ({
  opacity: revealed ? 1 : 0,
  transition: "opacity 0.9s ease 0.5s",
});
