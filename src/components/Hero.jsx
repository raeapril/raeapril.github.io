import { memo, useEffect, useMemo, useRef, useState } from "react";
import flowerImg from "../assets/flower.jpg";
import { clamp } from "../utils/math";
import { useScrollProgress } from "../hooks/useScrollProgress";

const rand = (min, max) => Math.random() * (max - min) + min;

const CURRENT_YEAR = new Date().getFullYear();

const CHAR_CLIP_STYLE = {
  display: "inline-block",
  overflow: "hidden",
  verticalAlign: "top",
};

const HERO_TEXT_BASE =
  "display pointer-events-none absolute z-20 whitespace-nowrap text-5xl text-accent md:text-6xl";

  
const RollText = memo(function RollText({ text, progress, from = "below", breakMobile = false, className = "", style }) {
  const chars = [...text];
  const n = chars.length;
  const charDur = 0.55;
  const stagger = (1 - charDur) / Math.max(n - 1, 1);
  const sign = from === "above" ? -1 : 1;
  return (
    <span className={className} style={style} aria-label={text} role="text">
      {chars.map((c, i) => {
        const local = clamp((progress - i * stagger) / charDur);
        const isSpace = c === " ";
        // 1200px 이하에서 공백을 줄바꿈으로: 좁은 화면은 <br>, 1200px 초과는 공백
        if (isSpace && breakMobile) {
          return (
            <span key={i} aria-hidden="true">
              <br className="min-[1200px]:hidden" />
              <span
                className="hidden min-[1200px]:inline"
                style={{ whiteSpace: "pre" }}
              >
                {" "}
              </span>
            </span>
          );
        }
        return (
          <span
            key={i}
            aria-hidden="true"
            style={CHAR_CLIP_STYLE}
          >
            <span
              style={{
                display: "inline-block",
                transform: `translateY(${sign * (1 - local) * 100}%)`,
                opacity: clamp(local * 1.4),
                whiteSpace: "pre",
              }}
            >
              {isSpace ? " " : c}
            </span>
          </span>
        );
      })}
    </span>
  );
});

function Hero() {
  const trackRef = useRef(null);
  const p = useScrollProgress(trackRef);

  // 인트로(로더 + RAE 마크)가 완전히 사라져 스크롤이 가능해진 뒤에만 스크롤 큐를 노출한다.
  const [introDone, setIntroDone] = useState(() => !!window.__introDone);
  useEffect(() => {
    if (window.__introDone) return;
    const onDone = () => setIntroDone(true);
    window.addEventListener("intro:done", onDone);
    return () => window.removeEventListener("intro:done", onDone);
  }, []);

  // 빗방울 — 한 번만 생성 후 렌더 결과까지 메모 (스크롤 프레임마다 재생성 방지)
  const rainDrops = useMemo(
    () =>
      Array.from({ length: 120 }, (_, i) => (
        <span
          key={i}
          className="rd-drop"
          style={{
            left: `${rand(0, 100)}%`,
            height: `${rand(26, 54)}px`,
            opacity: rand(0.3, 0.7),
            animationDuration: `${rand(0.5, 0.95)}s`,
            animationDelay: `${-rand(0, 1.2)}s`,
          }}
        />
      )),
    []
  );

  // 구간별 순차 진행: 창틀 - 비 - 프레임 - 넓이 - 문구
  const range = (a, b) => clamp((p - a) / (b - a));
  const round = 1 - range(0, 0.08);
  const frame = 1 - range(0.08, 0.16);
  const rain = 1 - range(0.16, 0.26);
  const haze = 1 - range(0.26, 0.4);
  const size = range(0.4, 0.56);
  const webText = range(0.6, 0.78);
  const meeraeText = range(0.82, 0.98);
  const scrollHint = introDone ? 1 - range(0, 0.06) : 0;

  return (
    <section ref={trackRef} className="relative h-[420vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        {/* 양옆 세로 텍스트 */}
        <span
          className="absolute left-4 top-1/2 z-10 hidden -translate-y-1/2 text-xs tracking-widest text-muted [writing-mode:vertical-rl] md:block"
          style={{ opacity: rain }}
        >
          © {CURRENT_YEAR}
        </span>
        <span
          className="absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 rotate-180 text-xs tracking-widest text-muted [writing-mode:vertical-rl] md:block"
          style={{ opacity: rain }}
        >
          MEERAE SHIN
        </span>

        {/* 아치 창문 */}
        <div className="relative">
          <div
            className="hero-window"
            style={{ "--size": size, "--frame": frame, "--round": round }}
          >
            <img src={flowerImg} alt="" className="hero-window__img" />
            <div className="hero-window__haze" style={{ opacity: 0.4 * haze }} />
            <div className="hero-window__glass" style={{ opacity: rain }}>
              {rainDrops}
            </div>
          </div>

          {/* 메인 텍스트 1 */}
          <RollText
            text="WEB PUBLISHER"
            progress={webText}
            from="below"
            breakMobile
            className={`${HERO_TEXT_BASE}`}
          />

          {/* 메인 텍스트 2 */}
          <RollText
            text="PORTFOLIO"
            progress={meeraeText}
            from="above"
            className={`${HERO_TEXT_BASE}`}
          />

          {/* scroll 큐 */}
          <span
            className="scroll-cue pointer-events-none absolute left-1/2 top-full z-20 mt-8 flex -translate-x-1/2 flex-col items-center gap-3 text-xs uppercase tracking-[0.3em] text-muted"
            style={{ opacity: scrollHint }}
          >
            scroll
            <span className="scroll-cue__line" />
          </span>
        </div>
      </div>
    </section>
  );
}

export default Hero;
