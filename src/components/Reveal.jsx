import { useEffect, useRef, useState } from "react";

/**
 * 스크롤 시 뷰포트에 들어오면 부드럽게 등장시키는 래퍼.
 * 무거운 애니메이션 라이브러리 없이 IntersectionObserver만 사용.
 *
 * 사용: <Reveal delay={120}> ... </Reveal>
 */
function Reveal({ children, as: Tag = "div", delay = 0, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.unobserve(entry.target); // 한 번만 등장
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

export default Reveal;
