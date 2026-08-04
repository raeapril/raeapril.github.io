import { useEffect, useState } from "react";
import { clamp } from "../utils/math";

/**
 * sticky 트랙의 스크롤 진행도 p(0~1)를 반환하는 훅.
 * ref 로 받은 트랙 요소가 뷰포트를 지나가는 정도를 rAF 로 throttle 하며 계산한다.
 * (Hero·Work 처럼 섹션을 sticky 고정하고 p 로 transform 을 구동하는 패턴 공용화)
 */
export function useScrollProgress(ref) {
  const [p, setP] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = clamp(-rect.top, 0, total);
      const next = total > 0 ? scrolled / total : 0;
      // 값이 그대로면 상태 갱신을 건너뛰어 불필요한 리렌더를 막는다
      setP((prev) => (prev === next ? prev : next));
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
  }, [ref]);

  return p;
}
