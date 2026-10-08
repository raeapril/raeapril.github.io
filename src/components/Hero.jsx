import { revealStyle } from "../lib/motion";

/**
 * 히어로. 실제 "WEB PUBLISHER" 타이포는 WebGL 배경에 그려지고,
 * 아래 h1 은 three.js 가 뜨기 전(또는 실패 시)과 스크린리더를 위한 대체 헤드라인이다.
 */
function Hero({ sceneReady, revealed = true, textLayout = null }) {
  return (
    <section id="top" className="relative flex h-screen min-h-[560px] flex-col justify-end">
      <h1
        className={`site-display absolute inset-x-[4vw] top-1/2 m-0 -translate-y-[55%] text-[clamp(56px,15vw,300px)] leading-[0.86] text-cream transition-opacity duration-[600ms] ease-in-out ${
          sceneReady ? "opacity-0" : "opacity-100"
        }`}
      >
        WEB
        <br />
        PUBLISHER
      </h1>
      {/* 모바일: 소개 문구는 배경 타이포 "PUBLISHER" 바로 아래에 붙이고,
          하단에는 이름(왼쪽) | Scroll(오른쪽)만 둔다.
          900px 이상: 이름 | Scroll(가운데) | 소개 문구(오른쪽) 한 줄 */}
      <div
        className="site-x grid grid-cols-[minmax(0,1fr)_auto] items-end gap-x-6 gap-y-4 pb-[clamp(24px,4vh,48px)] font-mono text-xs uppercase tracking-[0.04em] text-dim min-[900px]:grid-cols-3"
        style={revealStyle(revealed)}
      >
        <p
          className={`m-0 font-sans text-[15px] normal-case leading-normal tracking-normal text-sub min-[900px]:static min-[900px]:col-span-1 min-[900px]:col-start-3 min-[900px]:row-start-1 min-[900px]:text-right min-[900px]:text-sm ${
            // 타이포 위치를 아직 모르면(WebGL 미지원 등) 하단 블록 맨 위에 둔다
            textLayout
              ? "absolute left-[var(--tag-x)] right-[var(--tag-x)] top-[var(--tag-y)]"
              : "col-span-2"
          }`}
          style={
            textLayout && {
              "--tag-x": `${textLayout.left}px`,
              "--tag-y": `${textLayout.bottom + 20}px`,
            }
          }
        >
          디자인을 생동감 있는 웹으로 번역합니다.
        </p>
        <div className="flex flex-col gap-1.5 min-[900px]:col-start-1 min-[900px]:row-start-1">
          <span className="text-cream">Meerae Shin — 신미래</span>
          <span>Web Publisher · Seoul, KR</span>
        </div>
        <span
          aria-hidden="true"
          className="flex items-center gap-2.5 justify-self-end min-[900px]:col-start-2 min-[900px]:row-start-1 min-[900px]:justify-self-center"
        >
          Scroll
          <span className="inline-block h-px w-7 bg-dim" />
        </span>
      </div>
    </section>
  );
}

export default Hero;
