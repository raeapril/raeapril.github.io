import { useEffect, useRef } from "react";

/**
 * 스크롤에 따라 자식(주로 이미지)을 줌인시키는 래퍼.
 * 요소가 뷰포트를 통과하는 동안 scale을 from → to 로 보간.
 * 부모에 overflow-hidden 을 주면 컨테이너 안에서 줌되는 효과가 난다.
 */
function ScrollScale({ children, className = "", from = 1.05, to = 1.28 }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.transform = "scale(1)";
      return;
    }

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 요소가 아래에서 올라와 위로 빠져나갈 때까지 0 → 1
      const progress = Math.min(
        Math.max((vh - rect.top) / (vh + rect.height), 0),
        1
      );
      const scale = from + (to - from) * progress;
      el.style.transform = `scale(${scale.toFixed(4)})`;
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [from, to]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}

export default ScrollScale;
