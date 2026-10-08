import { useEffect, useState } from "react";

// 인트로가 끝났음을 다른 컴포넌트(Hero 등)에 알림
function signalIntroDone() {
  window.__introDone = true;
  window.dispatchEvent(new Event("intro:done"));
}

/**
 * 도입부 프리로더 — 분리→합체 (letsplayfight 방식).
 * 'RAE.' 를 좌(RA) / 우(E.) 두 조각으로 벌려 아래에서 떠올리고,
 * 그 사이에서 숫자 000→100 카운팅. 100이 되면 두 조각이 가운데로 모여
 * 합체되고 숫자는 사이로 사라진다. 이후 로더가 페이드되며 메인 등장.
 * 모션 최소화 선호 시 즉시 스킵.
 */
function Intro() {
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState("rise"); // rise → apart → join → plant → reveal
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setHidden(true);
      signalIntroDone();
      return;
    }

    document.body.style.overflow = "hidden";
    let current = 0;
    const timers = [];

    // 진입: 조각들이 아래에서 떠올라 벌어짐
    timers.push(setTimeout(() => setPhase("apart"), 60));

    const tick = () => {
      // 끝으로 갈수록 천천히 (ease-out 느낌)
      current += Math.max(1, Math.ceil((100 - current) / 10));
      if (current >= 100) {
        setCount(100);
        // 합체(join) → 배경 걷히며 RAE 박힘(plant) → RAE 사라짐(reveal) → 제거
        timers.push(setTimeout(() => setPhase("join"), 350));
        timers.push(setTimeout(() => setPhase("plant"), 1300));
        timers.push(setTimeout(() => setPhase("reveal"), 2150));
        timers.push(
          setTimeout(() => {
            setHidden(true);
            document.body.style.overflow = "";
            // 인트로(로더 + RAE 마크)가 완전히 사라진 뒤에야 스크롤 허용 + 스크롤 큐 노출.
            signalIntroDone();
          }, 2800)
        );
        return;
      }
      setCount(current);
      timers.push(setTimeout(tick, 80));
    };

    timers.push(setTimeout(tick, 450));
    return () => {
      timers.forEach(clearTimeout);
      document.body.style.overflow = "";
    };
  }, []);

  if (hidden) return null;

  return (
    <div className={`intro intro--${phase}`} aria-hidden="true">
      <div className="intro__bg" />
      <div className="intro__mark display">
        <span className="intro__piece intro__piece--l">
          {"MEE".split("").map((ch, i) => (
            <span
              key={i}
              className="intro__char"
              style={{ transitionDelay: `${i * 55}ms` }}
            >
              {ch}
            </span>
          ))}
        </span>
        <span className="intro__piece intro__piece--r">
          {"RAE".split("").map((ch, i) => (
            <span
              key={i}
              className="intro__char"
              style={{ transitionDelay: `${(i + 3) * 55}ms` }}
            >
              {ch}
            </span>
          ))}
        </span>
        <span className="intro__count">{String(count).padStart(3, "0")}</span>
      </div>
    </div>
  );
}

export default Intro;
