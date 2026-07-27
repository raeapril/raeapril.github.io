import { useEffect, useMemo, useRef, useState } from "react";
import flowerImg from "../assets/flower.jpg";

/**
 * 히어로 — 정중앙 '비 내리는 아치 창문'이 스크롤에 따라 전체 화면으로 확장된다.
 * 진행도 p(0~1): 창문이 커지고 → 창틀/빗방울이 사라지며 → flower.png 가
 * bg_flower.png(전체 꽃 이미지)로 전환되어 배경 가득 펼쳐진다.
 */
const rand = (min, max) => Math.random() * (max - min) + min;
const clamp = (v, min = 0, max = 1) => Math.min(Math.max(v, min), max);

function Hero() {
  const trackRef = useRef(null);
  const [p, setP] = useState(0);

  // 빗방울 — 한 번만 생성
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

  // 스크롤 진행도 계산
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = clamp(-rect.top, 0, total);
      setP(total > 0 ? scrolled / total : 0);
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
  }, []);

  // 구간별 순차 진행: ① 원형→네모 → ② 창틀 → ③ 비 → ④ 뿌연 프레임 → ⑤ 넓이 확장
  const range = (a, b) => clamp((p - a) / (b - a));
  const round = 1 - range(0, 0.12); // 1→0: 위 둥근 모서리가 네모로
  const frame = 1 - range(0.12, 0.24); // 1→0: 창틀 사라짐
  const rain = 1 - range(0.24, 0.36); // 1→0: 비 사라짐
  const haze = 1 - range(0.36, 0.52); // 1→0: 흰 뿌연 오버레이 사라짐
  const size = range(0.52, 1); // 0→1: 마스크 넓이 300px → 630px (이미지는 고정)

  return (
    <section ref={trackRef} className="relative h-[220vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        {/* 양옆 세로 텍스트 — 확장되며 사라짐 */}
        <span
          className="absolute left-4 top-1/2 z-10 hidden -translate-y-1/2 text-xs tracking-widest text-muted [writing-mode:vertical-rl] md:block"
          style={{ opacity: rain }}
        >
          © {new Date().getFullYear()}
        </span>
        <span
          className="absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 rotate-180 text-xs tracking-widest text-muted [writing-mode:vertical-rl] md:block"
          style={{ opacity: rain }}
        >
          MEERAE SHIN
        </span>

        {/* 아치 창문 → 전체 배경 */}
        <div
          className="hero-window"
          style={{ "--size": size, "--frame": frame, "--round": round }}
        >
          <img src={flowerImg} alt="" className="hero-window__img" />
          {/* 흰 뿌연 오버레이(간유리 느낌) */}
          <div className="hero-window__haze" style={{ opacity: 0.4 * haze }} />
          <div className="hero-window__glass" style={{ opacity: rain }}>
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
      </div>
    </section>
  );
}

export default Hero;
