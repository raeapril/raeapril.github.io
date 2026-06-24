import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

/**
 * 라우트 전환 시 화면을 쓸어내리는 커튼 효과.
 * 새 페이지는 즉시 렌더되고, 그 위로 ink 패널이 wipe 한다.
 */
function RouteTransition({ children }) {
  const { pathname } = useLocation();
  const [active, setActive] = useState(false);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false; // 최초 진입은 인트로가 담당
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setActive(true);
    const t = setTimeout(() => setActive(false), 700);
    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <>
      <div className={`curtain ${active ? "curtain--active" : ""}`} aria-hidden="true" />
      {children}
    </>
  );
}

export default RouteTransition;
