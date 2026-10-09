import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { prefersReducedMotion } from "../lib/motion";

/**
 * Lenis 스무스 스크롤 + 해시 앵커(#work 등) 부드럽게 이동.
 * 3D 배경은 window.scrollY 를 매 프레임 읽으므로 별도 동기화가 필요 없다.
 * paused 동안(인트로 로더)은 스크롤을 멈춘다 — Lenis 는 body overflow 잠금을 무시하기 때문.
 * scrollToHash 면 주소에 섹션 해시(/#work)가 붙어 들어올 때, 멈춤이 처음 풀리는 순간 그 섹션으로 이동한다
 * (상세 페이지의 "← Work"). 상세 페이지는 해시를 프로젝트 id 로 쓰므로 끈다.
 * Lenis 인스턴스 ref 를 돌려준다(동작 줄이기면 비어 있음).
 */
export function useLenis(paused = false, { scrollToHash = false } = {}) {
  const lenisRef = useRef(null);
  const hashScrolled = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenisRef.current = lenis;

    let raf = 0;
    const loop = (t) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onAnchorClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href");
      if (id.length > 1 && document.querySelector(id)) {
        e.preventDefault();
        lenis.scrollTo(id);
      }
    };
    document.addEventListener("click", onAnchorClick);

    return () => {
      document.removeEventListener("click", onAnchorClick);
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (paused) return lenis.stop();
    lenis.start();
    if (!scrollToHash || hashScrolled.current) return;
    hashScrolled.current = true;
    const hash = window.location.hash;
    if (/^#[\w-]+$/.test(hash) && document.querySelector(hash)) lenis.scrollTo(hash);
  }, [paused, scrollToHash]);

  return lenisRef;
}
