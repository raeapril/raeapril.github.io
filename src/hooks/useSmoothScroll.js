import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// 현재 Lenis 인스턴스 (라우트 변경 시 스크롤 리셋 등 외부에서 접근용).
let lenisInstance = null;
export const getLenis = () => lenisInstance;

/**
 * Lenis 스무스 스크롤을 켜고 GSAP ScrollTrigger 와 동기화한다.
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

    // 새로고침으로 스크롤이 복원됐더라도 Lenis 는 항상 최상단에서 시작하게 맞춘다.
    // (해시 앵커로 직접 진입한 경우는 ScrollToTop 이 따로 처리하므로 제외)
    if (!window.location.hash) {
      window.scrollTo(0, 0);
      lenis.scrollTo(0, { immediate: true });
    }

    // 인트로가 재생되는 동안엔 스크롤을 잠근다(Lenis 는 body overflow:hidden 을 무시하므로
    // 직접 멈춰야 인트로 중 스크롤이 쌓이지 않는다). intro:done 에서 해제.
    if (!window.__introDone) lenis.stop();

    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    // 히어로 이미지 등 늦게 로드되는 리소스로 레이아웃이 밀리면 ScrollTrigger 의
    // start 위치가 어긋나 인입 애니메이션이 화면 밖에서 재생될 수 있다 → 로드 후 refresh.
    // 이 시점에 브라우저가 뒤늦게 스크롤을 복원하는 경우도 있어 최상단으로 한 번 더 고정.
    const resetTop = () => {
      if (!window.location.hash) {
        window.scrollTo(0, 0);
        lenis.scrollTo(0, { immediate: true });
      }
      ScrollTrigger.refresh();
    };
    const onLoad = resetTop;
    if (document.readyState === "complete") resetTop();
    else window.addEventListener("load", onLoad);

    // 인트로 프리로더가 body.overflow 를 잠근 채 끝나며 레이아웃이 확정되므로,
    // 인트로 종료 후 다시 refresh 해 트리거 start 위치를 바로잡는다.
    let introRefreshTimer;
    const onIntroDone = () => {
      // 잠갔던 스크롤을 풀기 전, 인트로 중 혹시 남은 스크롤을 최상단으로 정리.
      if (!window.location.hash) lenis.scrollTo(0, { immediate: true });
      lenis.start();
      ScrollTrigger.refresh();
      // overflow 해제 등 마무리 레이아웃까지 반영되도록 한 번 더.
      introRefreshTimer = setTimeout(() => ScrollTrigger.refresh(), 800);
    };
    if (window.__introDone) onIntroDone();
    else window.addEventListener("intro:done", onIntroDone);

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
      window.removeEventListener("intro:done", onIntroDone);
      clearTimeout(introRefreshTimer);
      gsap.ticker.remove(onTick);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);
}
