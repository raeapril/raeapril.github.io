import { useEffect, useRef, useState } from "react";

/**
 * 스크롤 고정(sticky) 히어로.
 * - 처음엔 사진들이 방사형(부채꼴)로 펼쳐져 있음
 * - 스크롤할수록 뒤 사진들은 블러 + 페이드 + 바깥으로 퍼지고
 * - 맨 앞(중앙) 사진이 풀스크린으로 확대됨
 *
 * 동작 원리: 높이 250vh 구간을 스크롤 트랙으로 쓰고, 안의 100vh 박스를
 * position:sticky 로 고정. 트랙을 지나는 진행도 p(0~1)로 모든 값을 보간.
 *
 * TODO: 사진(picsum)을 본인 작업물 이미지로 교체하세요.
 */

// 뒤에서 부채꼴로 펼쳐질 사진들 (angle = 부채꼴 각도)
const FAN = [
  { src: "https://picsum.photos/seed/rae-fan1/700/900", angle: -46 },
  { src: "https://picsum.photos/seed/rae-fan2/700/900", angle: -23 },
  { src: "https://picsum.photos/seed/rae-fan3/700/900", angle: 23 },
  { src: "https://picsum.photos/seed/rae-fan4/700/900", angle: 46 },
];

// 풀스크린으로 커질 맨 앞 사진
const HERO_IMG = "https://picsum.photos/seed/rae-hero-main/1800/1100";

const clamp = (v, min = 0, max = 1) => Math.min(Math.max(v, min), max);

function Hero() {
  const trackRef = useRef(null);
  const [p, setP] = useState(0);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const prefersReduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    setReduce(prefersReduce);
    if (prefersReduce) return;

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

  // 모션 최소화: 정적인 단순 히어로
  if (reduce) {
    return (
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink text-paper">
        <img
          src={HERO_IMG}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="relative z-10 text-center">
          <h1 className="display text-[14vw] leading-[0.86] md:text-[10vw]">
            CRAFTING
            <br />
            CLEAN <span className="text-accent">UI</span>
          </h1>
        </div>
      </section>
    );
  }

  // 진행도 기반 파생값
  const heroW = 42 + p * 58; // 42vw → 100vw
  const heroH = 56 + p * 44; // 56vh → 100vh
  const heroRadius = (1 - p) * 20; // 20px → 0
  const introOpacity = clamp(1 - p * 2.2); // 펼쳐진 단계의 카피 (서서히 사라짐)
  const endOpacity = clamp((p - 0.55) * 2.6); // 풀스크린 단계의 타이틀 (서서히 등장)
  const fanBlur = p * 14; // 0 → 14px
  const fanFade = clamp(1 - p * 1.5); // 1 → 0

  return (
    <section ref={trackRef} className="relative h-[260vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden bg-paper">
        {/* 뒤 사진들 (방사형) */}
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-0 w-0">
          {FAN.map((f, i) => {
            // 스크롤할수록 더 벌어지고 위로 떠오름
            const angle = f.angle * (1 + p * 0.5);
            const lift = 30 + p * 18; // vmin
            return (
              <img
                key={i}
                src={f.src}
                alt=""
                className="absolute h-[40vmin] w-[28vmin] rounded-2xl object-cover shadow-2xl"
                style={{
                  left: 0,
                  bottom: 0,
                  transformOrigin: "bottom center",
                  transform: `translateX(-50%) rotate(${angle}deg) translateY(-${lift}vmin) scale(${
                    1 - p * 0.15
                  })`,
                  filter: `blur(${fanBlur}px)`,
                  opacity: fanFade,
                }}
              />
            );
          })}
        </div>

        {/* 맨 앞 사진 (풀스크린으로 확대) */}
        <div
          className="relative overflow-hidden bg-ink shadow-2xl"
          style={{
            width: `${heroW}vw`,
            height: `${heroH}vh`,
            borderRadius: `${heroRadius}px`,
          }}
        >
          <img
            src={HERO_IMG}
            alt="Featured work"
            className="h-full w-full object-cover"
          />
          {/* 풀스크린 단계에서 어둡게 깔리는 그라데이션 */}
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent"
            style={{ opacity: endOpacity }}
          />
          {/* 풀스크린 단계 타이틀 */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-end pb-[10vh] text-center text-paper"
            style={{ opacity: endOpacity }}
          >
            <h1 className="display text-[12vw] leading-[0.86] md:text-[9vw]">
              CRAFTING
              <br />
              CLEAN <span className="text-accent">UI</span>
            </h1>
          </div>
        </div>

        {/* 펼쳐진 단계의 인트로 카피 (위에 떠 있다가 사라짐) */}
        <div
          className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center text-center"
          style={{ opacity: introOpacity }}
        >
          <p className="eyebrow mb-6">Frontend Publisher · Seoul</p>
          <h2 className="display text-[14vw] leading-[0.86] md:text-[8vw]">
            CRAFTING <span className="text-accent">CLEAN</span> UI
          </h2>
          <p className="mt-6 max-w-md text-base text-muted">
            픽셀 하나까지 신경 쓰는 퍼블리셔.
            <br />
            스크롤해서 둘러보세요.
          </p>
          <span className="mt-10 animate-bounce text-2xl text-ink">↓</span>
        </div>
      </div>
    </section>
  );
}

export default Hero;
