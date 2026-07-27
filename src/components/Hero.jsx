import { useMemo } from "react";
import flowerImg from "../assets/flower.png";

/**
 * 히어로 — 흰 배경 정중앙에 '비 내리는 반원형(아치) 창문'.
 * 창문은 처음부터 자리에 있고, 인트로의 검정 배경이 걷히면 그 위에 겹쳐 있던
 * MEERAE 가 도로록 사라지며 창문이 드러난다.
 * 비 효과: 얇은 물방울들이 랜덤 위치에서 떨어짐. (참고: codepen aureliendotpro/kVwyVe)
 */
const rand = (min, max) => Math.random() * (max - min) + min;

function RainWindow() {
  // 창문에 뿌릴 빗방울들 — 한 번만 생성(리렌더 시 위치가 튀지 않도록 useMemo)
  const drops = useMemo(
    () =>
      Array.from({ length: 120 }, () => ({
        left: rand(0, 100),
        height: rand(26, 54),
        duration: rand(0.5, 0.95),
        delay: -rand(0, 1.2),
        opacity: rand(0.3, 0.7),
      })),
    []
  );

  return (
    <div className="rain-window">
      <img src={flowerImg} alt="" className="rain-window__bg" />
      <div className="rain-window__glass">
        {drops.map((d, i) => (
          <span
            key={i}
            className="rd-drop"
            style={{
              left: `${d.left}%`,
              height: `${d.height}px`,
              opacity: d.opacity,
              animationDuration: `${d.duration}s`,
              animationDelay: `${d.delay}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center px-6">
      {/* 양옆 세로 텍스트 */}
      <span className="absolute left-4 top-1/2 hidden -translate-y-1/2 text-xs tracking-widest text-muted [writing-mode:vertical-rl] md:block">
        © {new Date().getFullYear()}
      </span>
      <span className="absolute right-4 top-1/2 hidden -translate-y-1/2 rotate-180 text-xs tracking-widest text-muted [writing-mode:vertical-rl] md:block">
        MEERAE SHIN
      </span>

      {/* 정중앙 창문 — 처음부터 자리에 있고, 인트로 배경이 걷히며 드러남 */}
      <RainWindow />
    </section>
  );
}

export default Hero;
