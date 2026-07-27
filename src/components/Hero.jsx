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
// 가운데 세리프 헤드라인
const HEADLINE = "Detail is Everything.";

// 타이핑 효과로 순환할 문구들
const TYPE_PHRASES = [
  "Web Publishing",
  "Cross Browsing",
  "Web Accessibility",
];

// 흩뿌려진 사진들 (가장자리 배치). pos = 시작 위치/크기, drift = 스크롤 시 흩어질 방향
// mobile = 모바일(≤768px)에서 덮어쓸 위치/크기. width·height만 바꿔도 되고 left·top까지 조정해도 됨.
const SCATTER = [
  {
    src: "https://picsum.photos/seed/rae-a/600/800",
    pos: { left: "13%", top: "7%", width: "14vw", height: "33vh" },
    mobile: { left: "6%", top: "6%", width: "34vw", height: "22vh" },
    drift: { x: -10, y: -6 },
  },
  {
    src: "https://picsum.photos/seed/rae-b/700/500",
    pos: { left: "8%", top: "48%", width: "16vw", height: "20vh" },
    mobile: { left: "5%", top: "44%", width: "36vw", height: "18vh" },
    drift: { x: -12, y: 4 },
  },
  {
    src: "https://picsum.photos/seed/rae-c/600/450",
    pos: { left: "16%", top: "73%", width: "11vw", height: "15vh" },
    mobile: { left: "8%", top: "74%", width: "30vw", height: "14vh" },
    drift: { x: -8, y: 8 },
  },
  {
    src: "https://picsum.photos/seed/rae-d/900/600",
    pos: { left: "62%", top: "15%", width: "25vw", height: "26vh" },
    mobile: { left: "58%", top: "8%", width: "38vw", height: "20vh" },
    drift: { x: 12, y: -6 },
  },
  {
    src: "https://picsum.photos/seed/rae-e/700/900",
    pos: { left: "71%", top: "50%", width: "15vw", height: "25vh" },
    mobile: { left: "60%", top: "46%", width: "34vw", height: "22vh" },
    drift: { x: 12, y: 5 },
  },
];

// 풀스크린으로 커질 맨 아래 중앙 사진
const HERO_IMG = "https://picsum.photos/seed/rae-hero-main/1800/1100";

const clamp = (v, min = 0, max = 1) => Math.min(Math.max(v, min), max);

/**
 * 타이핑 효과 훅 — 문구를 한 글자씩 타이핑 → 잠깐 멈춤 → 지우기 → 다음 문구 반복.
 * 비활성(intro 진행 중) 동안은 첫 문구가 완성된 상태로 보이고,
 * 활성화되는 순간 그 첫 문구를 지우는 것부터 시작한다.
 * @param {string[]} phrases  순환할 문구 배열
 * @param {boolean}  active   false면 첫 문구를 정적으로 표시(인트로 중 / 모션 최소화)
 */
function useTypewriter(phrases, active = true) {
  const [text, setText] = useState(phrases[0] ?? "");

  useEffect(() => {
    if (!active) {
      setText(phrases[0] ?? "");
      return;
    }

    // 이미 화면에 보이던 첫 문구를 '지우기'부터 시작
    let phrase = 0;
    let char = phrases[0].length;
    let deleting = true;
    let timer = 0;

    const tick = () => {
      const current = phrases[phrase];
      char += deleting ? -1 : 1;
      setText(current.slice(0, char));

      let delay = deleting ? 45 : 90; // 지울 땐 빠르게
      if (!deleting && char === current.length) {
        deleting = true;
        delay = 1400; // 다 쓴 뒤 멈춤
      } else if (deleting && char === 0) {
        deleting = false;
        phrase = (phrase + 1) % phrases.length;
        delay = 350; // 다음 문구 전 짧은 멈춤
      }
      timer = window.setTimeout(tick, delay);
    };

    timer = window.setTimeout(tick, 600);
    return () => window.clearTimeout(timer);
  }, [phrases, active]);

  return text;
}

function Hero() {
  const trackRef = useRef(null);
  const [p, setP] = useState(0);
  const [reduce, setReduce] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  // 인트로가 끝난 뒤에 타이핑 시작
  const [introDone, setIntroDone] = useState(
    () => typeof window !== "undefined" && window.__introDone === true
  );
  const typed = useTypewriter(TYPE_PHRASES, introDone && !reduce);

  useEffect(() => {
    if (window.__introDone) {
      setIntroDone(true);
      return;
    }
    const onDone = () => setIntroDone(true);
    window.addEventListener("intro:done", onDone);
    return () => window.removeEventListener("intro:done", onDone);
  }, []);

  // 모바일 여부 감지 (≤768px) — SCATTER/히어로 시작 크기를 모바일 값으로 전환
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

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
          <p className="mt-5 text-sm text-muted md:text-base">
            {typed}
            <span className="type-caret" aria-hidden="true">&nbsp;</span>
          </p>
        </div>
      </section>
    );
  }

  // 진행도 기반 파생값 — 시작 크기는 모바일에서 더 크게(가로 화면 대비 잘 보이도록)
  const heroStartW = isMobile ? 62 : 26; // 모바일 시작 넓이(vw)
  const heroStartH = isMobile ? 30 : 34; // 모바일 시작 높이(vh)
  const heroW = heroStartW + p * (100 - heroStartW); // → 100vw
  const heroH = heroStartH + p * (100 - heroStartH); // → 100vh
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
          MEERAE SHIN
        </span>

        {/* 흩뿌린 사진들 */}
        {SCATTER.map((img, i) => (
          <img
            key={i}
            src={img.src}
            alt=""
            loading="lazy"
            className="absolute object-cover"
            style={{
              ...(isMobile && img.mobile ? img.mobile : img.pos),
              transform: `translate(${img.drift.x * p}vw, ${
                img.drift.y * p
              }vh) scale(${1 - p * 0.1})`,
              filter: `blur(${scatterBlur}px)`,
              opacity: scatterFade,
            }}
          />
        ))}

        {/* 가운데 세리프 헤드라인 — 인트로 MEERAE가 사라질 때 한 글자씩 위→아래로 등장 */}
        <div
          className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
          style={{ opacity: centerOpacity }}
        >
          <h1
            className="font-serif text-3xl font-normal leading-[1.05] tracking-tight sm:text-4xl md:text-5xl lg:text-[3.2vw]"
            style={{ mixBlendMode: "difference" }}
          >
            {HEADLINE.split("").map((ch, i) =>
              ch === " " ? (
                <span key={i} style={{ display: "inline-block", width: "0.28em" }} />
              ) : (
                <span
                  key={i}
                  className="hero-char"
                  style={{
                    transitionDelay: `${i * 34}ms`,
                    opacity: introDone ? 1 : 0,
                    transform: introDone ? "translateY(0)" : "translateY(-0.55em)",
                  }}
                >
                  {ch}
                </span>
              )
            )}
          </h1>
          <p
            className="mt-5 min-h-[1.5em] text-sm font-medium text-muted md:text-base"
            style={{
              opacity: introDone ? 1 : 0,
              transition: "opacity 0.6s ease 0.5s",
            }}
          >
            {typed}
            <span className="type-caret" aria-hidden="true">&nbsp;</span>
          </p>
        </div>

        {/* 맨 아래 중앙 사진 → 풀스크린 (레퍼런스처럼 각진 모서리, 그림자 없음) */}
        <div
          data-nav="dark"
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
