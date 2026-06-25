import { useEffect, useRef, useState } from "react";

/**
 * 스크롤 고정(sticky) 히어로 — Playfight 스타일.
 * - 처음엔 사진들이 화면 가장자리에 흩뿌려져(scatter) 있고 가운데 세리프 헤드라인
 * - 스크롤할수록 흩뿌린 사진들은 블러 + 페이드 + 바깥으로 흩어지고
 * - 맨 아래 중앙 사진이 풀스크린으로 확대됨
 *
 * 높이 260vh 트랙을 스크롤하는 동안 안쪽 100vh 박스를 sticky 로 고정,
 * 진행도 p(0~1)로 모든 값을 보간.
 *
 * TODO: 사진(picsum)을 본인 작업물 이미지로 교체하세요.
 */

// 가운데 세리프 헤드라인 (자유롭게 수정)
const HEADLINE = "Detail is Everything.";
const SUBCOPY = "Frontend Publishing · Made with care in Seoul";

// 흩뿌려진 사진들 (가장자리 배치). pos = 시작 위치/크기, drift = 스크롤 시 흩어질 방향
const SCATTER = [
  {
    src: "https://picsum.photos/seed/rae-a/600/800",
    pos: { left: "13%", top: "7%", width: "14vw", height: "42vh" },
    drift: { x: -10, y: -6 },
  },
  {
    src: "https://picsum.photos/seed/rae-b/700/500",
    pos: { left: "8%", top: "48%", width: "16vw", height: "20vh" },
    drift: { x: -12, y: 4 },
  },
  {
    src: "https://picsum.photos/seed/rae-c/600/450",
    pos: { left: "16%", top: "73%", width: "11vw", height: "15vh" },
    drift: { x: -8, y: 8 },
  },
  {
    src: "https://picsum.photos/seed/rae-d/900/600",
    pos: { left: "62%", top: "9%", width: "25vw", height: "26vh" },
    drift: { x: 12, y: -6 },
  },
  {
    src: "https://picsum.photos/seed/rae-e/700/900",
    pos: { left: "71%", top: "42%", width: "15vw", height: "25vh" },
    drift: { x: 12, y: 5 },
  },
];

// 풀스크린으로 커질 맨 아래 중앙 사진
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

  // 모션 최소화: 정적 히어로
  if (reduce) {
    return (
      <section className="relative flex min-h-screen items-center justify-center px-6 text-center">
        <div>
          <h1 className="font-serif text-3xl font-normal leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-[3.2vw]">{HEADLINE}</h1>
          <p className="mt-5 text-sm text-muted md:text-base">{SUBCOPY}</p>
        </div>
      </section>
    );
  }

  // 진행도 기반 파생값
  const heroW = 26 + p * 74; // 26vw → 100vw
  const heroH = 34 + p * 66; // 34vh → 100vh
  const heroLeft = (100 - heroW) / 2; // 항상 가로 중앙
  const heroTop = 62 * (1 - p); // 62vh → 0

  const centerOpacity = clamp(1 - p * 1.8); // 가운데 헤드라인 (사라짐)
  const endOpacity = clamp((p - 0.6) * 2.8); // 풀스크린 타이틀 (등장)
  const scatterBlur = p * 16;
  const scatterFade = clamp(1 - p * 1.6);

  return (
    <section ref={trackRef} className="relative h-[260vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-paper">
        {/* 양옆 세로 텍스트 */}
        <span
          className="absolute left-4 top-1/2 hidden -translate-y-1/2 text-xs tracking-widest text-muted [writing-mode:vertical-rl] md:block"
          style={{ opacity: scatterFade }}
        >
          © {new Date().getFullYear()}
        </span>
        <span
          className="absolute right-4 top-1/2 hidden -translate-y-1/2 rotate-180 text-xs tracking-widest text-muted [writing-mode:vertical-rl] md:block"
          style={{ opacity: scatterFade }}
        >
          Made in Seoul
        </span>

        {/* 흩뿌린 사진들 — 레퍼런스(Playfight)처럼 각진 모서리 + 그림자 없음 */}
        {SCATTER.map((img, i) => (
          <img
            key={i}
            src={img.src}
            alt=""
            loading="lazy"
            className="absolute object-cover"
            style={{
              ...img.pos,
              transform: `translate(${img.drift.x * p}vw, ${
                img.drift.y * p
              }vh) scale(${1 - p * 0.1})`,
              filter: `blur(${scatterBlur}px)`,
              opacity: scatterFade,
            }}
          />
        ))}

        {/* 가운데 세리프 헤드라인 */}
        <div
          className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
          style={{ opacity: centerOpacity }}
        >
          <h1 className="font-serif text-3xl font-normal leading-[1.05] tracking-tight sm:text-4xl md:text-5xl lg:text-[3.2vw]">
            {HEADLINE}
          </h1>
          <p className="mt-5 text-sm font-medium text-muted md:text-base">
            {SUBCOPY}
          </p>
        </div>

        {/* 맨 아래 중앙 사진 → 풀스크린 (레퍼런스처럼 각진 모서리, 그림자 없음) */}
        <div
          className="absolute overflow-hidden bg-ink"
          style={{
            left: `${heroLeft}vw`,
            top: `${heroTop}vh`,
            width: `${heroW}vw`,
            height: `${heroH}vh`,
          }}
        >
          <img
            src={HERO_IMG}
            alt="Featured work"
            className="h-full w-full object-cover"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent"
            style={{ opacity: endOpacity }}
          />
          <div
            className="absolute inset-0 flex items-end justify-center pb-[12vh] text-center text-paper"
            style={{ opacity: endOpacity }}
          >
            <h2 className="font-serif text-5xl md:text-7xl">{HEADLINE}</h2>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
