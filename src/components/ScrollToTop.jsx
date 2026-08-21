import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getLenis } from "../hooks/useSmoothScroll";

// 라우트 변경 시 스크롤 제어.
// - 특정 섹션으로(예: 상세 → BACK): navigate("/", { state: { scrollTo: "work" } }) 로 오면
//   URL 에 해시를 남기지 않고 해당 섹션으로 이동. (해시 앵커 진입도 함께 지원)
//   마운트 직후엔 문서 높이가 아직 다 안 커져(GSAP 핀 등) 대상 위치가 작게 잡히므로,
//   위치가 '충분히 크고 안정될 때까지' 가볍게 폴링한 뒤 정확한 좌표로 한 번 이동한다.
// - 그 외: 맨 위로. Lenis 가 활성화면 window.scrollTo 는 되돌려지므로 lenis.scrollTo 로 리셋.
function ScrollToTop() {
  const { pathname, hash, state } = useLocation();

  // 새로고침 때 브라우저가 이전 스크롤 위치를 복원하지 않도록(항상 우리가 제어).
  // main.jsx 에서 먼저 설정하지만 react-router(history) 초기화가 이를 "auto" 로 되돌리므로,
  // 마운트 후(라우터 초기화 뒤) 다시 "manual" 로 확정한다.
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    const lenis = getLenis();
    const targetSel = state?.scrollTo ? `#${state.scrollTo}` : hash;

    if (targetSel) {
      let timer = 0;
      let tries = 0;
      let lastTop = -1;
      const wait = () => {
        const el = document.querySelector(targetSel);
        const top = el
          ? Math.round(el.getBoundingClientRect().top + window.scrollY)
          : 0;
        // 마운트 직후엔 레이아웃이 덜 부풀어 top 이 작게 잡힌다(≈ 뷰포트 이내).
        // top 이 '뷰포트 2배 이상 + 직전과 동일(안정)'이 되면 진짜 위치로 보고 이동.
        const ready = el && top > window.innerHeight * 2 && top === lastTop;
        if (!ready && tries < 40) {
          lastTop = top;
          tries += 1;
          timer = window.setTimeout(wait, 60);
          return;
        }
        if (el) {
          const y = Math.max(0, top - 80); // nav 높이만큼 위 여백
          if (lenis) {
            lenis.resize(); // 라우트 변경으로 늘어난 문서 높이를 Lenis 에 반영(clamp 방지)
            lenis.scrollTo(y, { immediate: true });
          } else {
            window.scrollTo(0, y);
          }
        }
      };
      timer = window.setTimeout(wait, 60);
      return () => window.clearTimeout(timer);
    }

    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname, hash, state]);

  return null;
}

export default ScrollToTop;
