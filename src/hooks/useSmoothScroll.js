import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// 현재 Lenis 인스턴스 (라우트 변경 시 스크롤 리셋 등 외부에서 접근용).
let lenisInstance = null;
export const getLenis = () => lenisInstance;

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
    lenisInstance = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    // 히어로 이미지 등 늦게 로드되는 리소스로 레이아웃이 밀리면 ScrollTrigger 의
    // start 위치가 어긋나 인입 애니메이션이 화면 밖에서 재생될 수 있다 → 로드 후 refresh.
    const onLoad = () => ScrollTrigger.refresh();
    if (document.readyState === "complete") ScrollTrigger.refresh();
    else window.addEventListener("load", onLoad);

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
      window.removeEventListener("load", onLoad);
      gsap.ticker.remove(onTick);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);
}
