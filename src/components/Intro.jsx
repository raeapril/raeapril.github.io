import { useEffect, useState } from "react";

/**
 * 도입부 프리로더: 0 → 100 숫자 카운팅 후 위로 슬라이드되며 사라짐.
 * (Playfight 스타일 인트로) 모션 최소화 선호 시 즉시 스킵.
 */
function Intro() {
  const [count, setCount] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setHidden(true);
      return;
    }

    document.body.style.overflow = "hidden";
    let current = 0;
    let timer;

    const tick = () => {
      // 끝으로 갈수록 천천히 (ease-out 느낌)
      current += Math.max(1, Math.ceil((100 - current) / 10));
      if (current >= 100) {
        setCount(100);
        timer = setTimeout(() => setLeaving(true), 450); // 잠깐 멈췄다가
        timer = setTimeout(() => {
          setHidden(true);
          document.body.style.overflow = "";
        }, 1500); // 슬라이드 아웃 후 제거
        return;
      }
      setCount(current);
      timer = setTimeout(tick, 80);
    };

    timer = setTimeout(tick, 250);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, []);

  if (hidden) return null;

  return (
    <div className={`intro ${leaving ? "intro--leaving" : ""}`} aria-hidden="true">
      <div className="intro__inner">
        <span className="intro__label">RAE APRIL — Loading</span>
        <span className="intro__count">{String(count).padStart(3, "0")}</span>
        <div className="intro__bar">
          <span style={{ transform: `scaleX(${count / 100})` }} />
        </div>
      </div>
    </div>
  );
}

export default Intro;
