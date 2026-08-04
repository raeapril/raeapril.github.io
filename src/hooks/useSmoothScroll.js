import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis 스무스 스크롤을 켜고 GSAP ScrollTrigger 와 동기화한다 (레퍼런스 사이트 방식).
 * - Lenis 스크롤이 갱신될 때마다 ScrollTrigger.update() 호출
 * - GSAP ticker 로 Lenis 의 rAF 를 구동 (별도 rAF 루프 없이 프레임 일치)
 * App 최상단에서 한 번만 사용한다.
 */
export function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    // 앵커 이동(#about 등)도 Lenis 로 부드럽게
    const onAnchorClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href");
      if (id.length > 1 && document.querySelector(id)) {
        e.preventDefault();
        lenis.scrollTo(id, { offset: 0 });
      }
    };
    document.addEventListener("click", onAnchorClick);

    return () => {
      document.removeEventListener("click", onAnchorClick);
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, []);
}
