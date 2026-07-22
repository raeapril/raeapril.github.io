import { useEffect, useRef } from "react";

/**
 * letsplayfight recent-works 스타일 틸트.
 * 프레임(부모)은 고정되어 있고, 그 안의 이미지(children)만
 * 커서 위치에 따라 은은하게 3D 틸트 + 미세 확대된다.
 *
 * 성능을 위해 state 없이 ref + rAF 로 transform 을 직접 갱신 (리렌더 없음).
 */
function TiltCard({ children, className = "", max = 7 }) {
  const ref = useRef(null);
  const st = useRef({
    hx: 0,
    hy: 0,
    tHX: 0,
    tHY: 0,
    scale: 1,
    tScale: 1,
    raf: 0,
  });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const s = st.current;
    const loop = () => {
      // 타깃으로 부드럽게 붙는 스프링 보간
      s.hx += (s.tHX - s.hx) * 0.12;
      s.hy += (s.tHY - s.hy) * 0.12;
      s.scale += (s.tScale - s.scale) * 0.12;
      if (ref.current) {
        ref.current.style.transform = `perspective(700px) rotateX(${s.hy}deg) rotateY(${s.hx}deg) scale(${s.scale})`;
      }
      s.raf = requestAnimationFrame(loop);
    };
    s.raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(s.raf);
  }, []);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5; // -0.5~0.5
    const py = (e.clientY - r.top) / r.height - 0.5;
    const s = st.current;
    s.tHX = px * max; // rotateY
    s.tHY = -py * max; // rotateX
    s.tScale = 1.06; // 틸트 시 가장자리 빈틈 방지용 미세 확대
  };
  const onLeave = () => {
    const s = st.current;
    s.tHX = 0;
    s.tHY = 0;
    s.tScale = 1;
  };

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ willChange: "transform" }}
    >
      {children}
    </div>
  );
}

export default TiltCard;
