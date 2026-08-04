import { memo, useMemo, useRef } from "react";
import flowerImg from "../assets/flower.jpg";
import { clamp } from "../utils/math";
import { useScrollProgress } from "../hooks/useScrollProgress";

/**
 * 히어로 — 정중앙 '비 내리는 아치 창문'이 스크롤에 따라 전체 화면으로 확장된다.
 * 진행도 p(0~1): 창문이 커지고 → 창틀/빗방울이 사라지며 → flower.png 가
 * bg_flower.png(전체 꽃 이미지)로 전환되어 배경 가득 펼쳐진다.
 */
const rand = (min, max) => Math.random() * (max - min) + min;

const CURRENT_YEAR = new Date().getFullYear();

// 한 글자를 감싸는 클리핑 박스 — 정적이므로 상수로 (글자마다 재생성 방지)
const CHAR_CLIP_STYLE = {
  display: "inline-block",
  overflow: "hidden",
  verticalAlign: "top",
};

// 두 도로록 문구가 공유하는 기본 클래스 (위치/겹침만 각 호출부에서 덧붙임)
const HERO_TEXT_BASE =
  "display pointer-events-none absolute z-20 whitespace-nowrap text-4xl text-accent sm:text-5xl md:text-6xl";

/**
 * 글자를 한 자씩 '도로록' 굴려서 드러내는 텍스트.
 * progress(0~1)에 따라 각 글자가 클리핑된 박스 안에서 위(below)/아래(above)로 밀려 올라온다.
 * from="below" → 아래에서 위로, from="above" → 위에서 아래로.
 */
const RollText = memo(function RollText({ text, progress, from = "below", breakMobile = false, className = "", style }) {
  const chars = [...text];
  const n = chars.length;
  const charDur = 0.55; // 글자 하나가 진행되는 데 쓰는 progress 비율
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

  // 구간별 순차 진행: ① 원형→네모 → ② 창틀 → ③ 비 → ④ 뿌연 프레임 → ⑤ 넓이 확장 → ⑥ 문구
  const range = (a, b) => clamp((p - a) / (b - a));
  const round = 1 - range(0, 0.08); // 1→0: 위 둥근 모서리가 네모로
  const frame = 1 - range(0.08, 0.16); // 1→0: 창틀 사라짐
  const rain = 1 - range(0.16, 0.26); // 1→0: 비 사라짐
  const haze = 1 - range(0.26, 0.4); // 1→0: 흰 뿌연 오버레이 사라짐
  const size = range(0.4, 0.56); // 0→1: 마스크 넓이 300px → 630px (이미지는 고정)
  // 확장이 끝난 뒤 문구가 순차로 도로록 등장
  const webText = range(0.6, 0.78); // WEB PUBLISHING — 좌측 하단
  const meeraeText = range(0.82, 0.98); // MEERAE — 우측 상단
  const scrollHint = 1 - range(0, 0.06); // 메인 진입 안내 — 스크롤 시작하면 사라짐

  return (
    <section ref={trackRef} className="relative h-[420vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        {/* 양옆 세로 텍스트 — 확장되며 사라짐 */}
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

        {/* 아치 창문 → 전체 배경 (+ 확장 완료 후 도로록 등장하는 문구) */}
        <div className="relative">
          <div
            className="hero-window"
            style={{ "--size": size, "--frame": frame, "--round": round }}
          >
            <img src={flowerImg} alt="" className="hero-window__img" />
            {/* 흰 뿌연 오버레이(간유리 느낌) */}
            <div className="hero-window__haze" style={{ opacity: 0.4 * haze }} />
            <div className="hero-window__glass" style={{ opacity: rain }}>
              {rainDrops}
            </div>
          </div>

          {/* 이미지 좌측 하단 가장자리에 반쯤 걸침 */}
          <RollText
            text="WEB PUBLISHER"
            progress={webText}
            from="below"
            breakMobile
            className={`${HERO_TEXT_BASE} bottom-[7%] left-0 -translate-x-[6%] min-[1200px]:bottom-[12%] min-[1200px]:-translate-x-1/2`}
          />

          {/* 이미지 우측 상단 가장자리에 반쯤 걸침 */}
          <RollText
            text="PORTFOLIO"
            progress={meeraeText}
            from="above"
            className={`${HERO_TEXT_BASE} right-0 top-[-7%] translate-x-[6%] min-[1200px]:top-[12%] min-[1200px]:translate-x-1/2`}
          />

          {/* 메인 진입 안내 — 창 모양 아래 작은 scroll 큐 */}
          <span
            className="scroll-cue pointer-events-none absolute left-1/2 top-full z-20 mt-8 flex -translate-x-1/2 flex-col items-center gap-3 text-[0.65rem] uppercase tracking-[0.3em] text-muted"
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
