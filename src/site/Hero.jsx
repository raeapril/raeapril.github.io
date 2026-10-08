/**
 * 히어로. 실제 "WEB PUBLISHER" 타이포는 WebGL 배경에 그려지고,
 * 아래 h1 은 three.js 가 뜨기 전(또는 실패 시)과 스크린리더를 위한 대체 헤드라인이다.
 */
function Hero({ sceneReady }) {
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
      <div className="site-x grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] items-end gap-6 pb-[clamp(24px,4vh,48px)] font-mono text-xs uppercase tracking-[0.04em] text-dim">
        <div className="flex flex-col gap-1.5">
          <span className="text-cream">Meerae Shin — 신미래</span>
          <span>Web Publisher · Seoul, KR</span>
        </div>
        <div className="flex justify-center">
          <span className="flex items-center gap-2.5">
            Scroll
            <span className="inline-block h-px w-7 bg-dim" />
          </span>
        </div>
        <div className="flex justify-end text-right font-sans text-sm normal-case leading-normal tracking-normal text-sub">
          디자인을 생동감 있는 웹으로 번역합니다.
        </div>
      </div>
    </section>
  );
}

export default Hero;
