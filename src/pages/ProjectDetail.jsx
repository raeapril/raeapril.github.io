import { useEffect, useRef, useState } from "react";
import { WORK } from "../data/work";
import { useLenis } from "../hooks/useLenis";
import { useFrame } from "../hooks/useFrame";
import { clamp, ease } from "../lib/math";
import { prefersReducedMotion } from "../lib/motion";

/** 주소 해시(#rz)에 맞는 프로젝트 순번. 없으면 첫 프로젝트 */
const indexFromHash = () => {
  const i = WORK.findIndex((w) => w.id === window.location.hash.slice(1));
  return i < 0 ? 0 : i;
};

// 클로버는 자리(slot) 폭의 이만큼만 채운다
const CLOVER_SCALE = 0.7;

const MEDIA_RADIUS = "rounded-[clamp(16px,1.8vw,28px)]";
const SECTION_TITLE = "site-display m-0 text-[clamp(40px,5.6vw,104px)] leading-[0.9]";
const LABEL = "font-mono text-xs uppercase tracking-[0.04em] text-point";

/** 이미지 위 왼쪽 아래에 붙는 유리 캡션 */
function ShotCaption({ n, children }) {
  return (
    <figcaption className="pointer-events-none absolute inset-x-4 bottom-4 flex">
      <span
        className="flex items-center gap-2.5 rounded-full px-3.5 py-[9px] font-mono text-[11px] uppercase tracking-[0.04em] text-cream backdrop-blur-[14px] backdrop-saturate-[1.6]"
        style={{
          background:
            "radial-gradient(100% 120% at 50% 0%, rgba(255,255,255,0.14), transparent 55%), rgba(12,12,14,0.35)",
          boxShadow: "inset 0 1px 1px rgba(255,255,255,0.35), 0 8px 24px -12px rgba(0,0,0,0.5)",
        }}
      >
        <span className="text-point">{n}</span>
        {children}
      </span>
    </figcaption>
  );
}

function MetaItem({ k, children }) {
  return (
    <div className="flex flex-col gap-3 border-b border-white/10 py-7 pr-6">
      <dt className="site-caption">{k}</dt>
      <dd className="m-0 flex flex-col gap-3.5">{children}</dd>
    </div>
  );
}
const META_VALUE = "type-title text-[clamp(20px,1.6vw,26px)] leading-[1.25]";

function ProjectDetail() {
  const [index, setIndex] = useState(indexFromHash);
  const lenis = useLenis();
  const prog = useRef(null);
  const heroTxt = useRef(null);
  const canvasHost = useRef(null);
  const clover = useRef(null);
  // 클로버가 머무를 빈자리들. 순서대로 히어로 → Screens → Overview → Next
  const slotHero = useRef(null);
  const slotScreens = useRef(null);
  const slotOverview = useRef(null);
  const slotNext = useRef(null);

  const p = WORK[index];
  const next = WORK[(index + 1) % WORK.length];
  const hasOverview = !!(p.overview || p.process.length);

  // "다음 프로젝트" 로 해시가 바뀌면 같은 페이지에서 내용만 바꾸고 맨 위로, 클로버는 한 바퀴
  useEffect(() => {
    const onHash = () => {
      setIndex(indexFromHash());
      if (lenis.current) lenis.current.scrollTo(0, { immediate: true });
      else window.scrollTo(0, 0);
      clover.current?.spin();
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [lenis]);

  useEffect(() => {
    document.title = `${p.name} — 신미래 포트폴리오`;
  }, [p]);

  useEffect(() => {
    let dead = false;
    import("../three/followClover").then(({ createFollowClover }) => {
      if (dead) return;
      clover.current = createFollowClover(canvasHost.current);
    });
    return () => {
      dead = true;
      clover.current?.dispose();
      clover.current = null;
    };
  }, []);

  useFrame(() => {
    const y = window.scrollY;
    const vh = window.innerHeight;
    const max = document.documentElement.scrollHeight - vh;
    if (prog.current) prog.current.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;

    // 히어로 글자는 위로 살짝 빠지며 흐려진다
    if (!prefersReducedMotion() && heroTxt.current && y <= vh * 1.2) {
      const k = clamp(y / vh);
      heroTxt.current.style.transform = `translate3d(0,${-y * 0.12}px,0)`;
      heroTxt.current.style.opacity = 1 - k * 0.7;
    }

    if (!clover.current) return;
    // 섹션마다 비워 둔 자리(slot)로 클로버가 옮겨 다닌다. 슬롯이 화면 가운데 올 때 그 자리에 도착
    const slots = [slotHero, slotScreens, slotOverview, slotNext]
      .map((r) => r.current)
      .filter(Boolean)
      .map((el) => {
        const b = el.getBoundingClientRect();
        return { cx: b.left + b.width / 2, cy: b.top + b.height / 2, w: b.width, doc: b.top + y + b.height / 2 };
      });
    if (!slots.length) return;
    const anchors = slots.map((s, i) => (i === 0 ? 0 : Math.min(max, Math.max(0, s.doc - vh / 2))));
    for (let i = 1; i < anchors.length; i++) anchors[i] = Math.max(anchors[i], anchors[i - 1] + 1);
    let i = 0;
    while (i < anchors.length - 1 && y >= anchors[i + 1]) i++;
    const A = slots[i];
    const B = slots[Math.min(i + 1, slots.length - 1)];
    const seg = i >= anchors.length - 1 ? 0 : ease(clamp((y - anchors[i]) / (anchors[i + 1] - anchors[i])));
    clover.current.setTarget(
      A.cx + (B.cx - A.cx) * seg,
      A.cy + (B.cy - A.cy) * seg,
      (A.w + (B.w - A.w) * seg) * CLOVER_SCALE
    );
  });

  return (
    <div className="relative min-h-screen overflow-x-clip bg-night text-cream">
      <div ref={prog} className="fixed left-0 top-0 z-[60] h-0.5 w-0 bg-point" />
      <div ref={canvasHost} aria-hidden="true" className="pointer-events-none fixed inset-0 z-40" />

      <header className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
        <nav
          aria-label="프로젝트 메뉴"
          className="glass-bar pointer-events-auto flex items-center gap-[clamp(12px,2vw,32px)] rounded-full px-6 py-3.5"
        >
          <a href="/" className="font-display text-lg font-extrabold tracking-[-0.02em]">
            RAE<span className="text-point">.</span>
          </a>
          <div className="flex items-center gap-[clamp(12px,1.6vw,24px)] text-[13px] font-medium text-sub">
            <a href="/#work" className="text-point">
              ← Work
            </a>
            <span className="whitespace-nowrap font-mono text-xs text-dim">
              {p.no} / N°{String(WORK.length).padStart(2, "0")}
            </span>
          </div>
        </nav>
      </header>

      {/* 히어로: 위 줄은 프로젝트명 + 클로버 자리, 아래 줄은 설명 ↔ 사이트 바로가기, 그 아래 배너 */}
      <section className="site-x pt-[clamp(96px,11vh,130px)]">
        <div ref={heroTxt}>
          <div className="grid items-end gap-[clamp(24px,4vw,80px)] min-[700px]:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <div className="flex min-w-0 flex-col gap-[clamp(20px,2.4vw,36px)]">
              <div className="flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-[0.04em]">
                <span className="text-point">{p.no}</span>
                <span className="text-sub">{p.client}</span>
              </div>
              <h1 className="site-display m-0 text-[clamp(56px,9vw,176px)] leading-[0.9]">
                {p.name}
                <span className="text-point">.</span>
              </h1>
            </div>
            <div
              ref={slotHero}
              className="aspect-square w-full max-w-[320px] justify-self-center max-[699px]:max-w-[200px]"
            />
          </div>
          <div className="mt-[clamp(24px,3vw,48px)] flex flex-wrap items-center justify-between gap-6 border-t border-white/[0.14] pt-6">
            <p className="type-body m-0 max-w-[480px] leading-[1.7] [text-wrap:pretty]">
              {p.client} {p.name} — {p.role}. {p.desc}.
            </p>
            <a
              href={p.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex shrink-0 items-center gap-3.5 text-[15px] font-medium transition-colors duration-300"
            >
              사이트 바로가기
              <span
                aria-hidden="true"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-point text-base text-night"
              >
                ↗
              </span>
            </a>
          </div>
        </div>
        <div
          className={`mt-[clamp(32px,4vw,64px)] aspect-[1920/500] min-h-[180px] w-full overflow-hidden bg-[#151517] ${MEDIA_RADIUS}`}
        >
          <img
            src={p.thumb}
            alt={`${p.name} 대표 이미지`}
            className="block h-full w-full object-cover object-top"
          />
        </div>
      </section>

      <main className="site-x">
        <dl className="m-0 mt-[clamp(24px,3vw,48px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] border-t border-white/10">
          <MetaItem k="Role">
            <span className={META_VALUE}>{p.role}</span>
          </MetaItem>
          {p.period && (
            <MetaItem k="Period">
              <span className={META_VALUE}>{p.period}</span>
            </MetaItem>
          )}
          <MetaItem k="Platform">
            <span className={META_VALUE}>{p.platform}</span>
          </MetaItem>
          <MetaItem k="Contribution">
            <span className={META_VALUE}>
              {p.contrib}
              <span className="text-point">%</span>
            </span>
            <span className="block h-0.5 overflow-hidden rounded-sm bg-dim/25">
              <span className="block h-full rounded-sm bg-point" style={{ width: `${p.contrib}%` }} />
            </span>
          </MetaItem>
        </dl>

        {/* Screens: 모바일 화면 + 대표 화면 */}
        <section className="pt-[clamp(96px,10vw,180px)]">
          <div className="mb-[clamp(24px,3vw,48px)] flex items-end justify-between gap-6">
            <div className="flex flex-col gap-4">
              <span className={LABEL}>(Screens)</span>
              <h2 className={SECTION_TITLE}>
                Screens<span className="text-point">.</span>
              </h2>
            </div>
            <div ref={slotScreens} className="aspect-square w-[clamp(96px,10vw,180px)] shrink-0" />
          </div>
          <div className="flex flex-wrap gap-[clamp(12px,1.2vw,20px)]">
            <figure
              className={`group relative m-0 aspect-[4/5] min-w-0 flex-[4_1_300px] overflow-hidden bg-[#151517] ${MEDIA_RADIUS}`}
            >
              <img
                src={p.thumbMobile}
                alt={`${p.name} 모바일 화면`}
                loading="lazy"
                className="block h-full w-full object-cover transition-transform duration-[1200ms] ease-smooth group-hover:scale-[1.04]"
              />
              <ShotCaption n="01">Mobile</ShotCaption>
            </figure>
            <figure
              className={`group relative m-0 aspect-square min-w-0 flex-[5_1_375px] overflow-hidden bg-[#151517] ${MEDIA_RADIUS}`}
            >
              <img
                src={p.thumbClover}
                alt={`${p.name} 대표 화면`}
                loading="lazy"
                className="block h-full w-full object-cover transition-transform duration-[1200ms] ease-smooth group-hover:scale-[1.04]"
              />
              <ShotCaption n="02">Key visual</ShotCaption>
            </figure>
          </div>
        </section>

        {/* Overview: 개요 + 키워드 + 맡은 일 */}
        {hasOverview && (
          <section className="flex flex-wrap gap-[clamp(24px,4vw,80px)] pt-[clamp(96px,10vw,180px)]">
            <div className="flex flex-[1_1_240px] flex-col gap-4">
              <span className={LABEL}>(Stack &amp; Keywords)</span>
              <h2 className={SECTION_TITLE}>
                Overview<span className="text-point">.</span>
              </h2>
              <div ref={slotOverview} className="mt-[clamp(16px,3vw,48px)] aspect-square w-[min(100%,280px)]" />
            </div>
            <div className="flex min-w-0 flex-[2_1_520px] flex-col gap-8">
              <p className="m-0 text-[clamp(22px,2.4vw,40px)] font-semibold leading-[1.35] tracking-[-0.03em] [text-wrap:pretty]">
                {p.overview}
              </p>
              <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                {p.features.map((f) => (
                  <li key={f} className="rounded-full border border-white/[0.14] px-4 py-2.5 text-sm text-sub">
                    {f}
                  </li>
                ))}
              </ul>
              <ol className="m-0 mt-4 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-x-[clamp(24px,3vw,56px)] p-0">
                {p.process.map((s) => (
                  <li key={s.n} className="flex flex-col gap-3 border-t border-white/10 py-7">
                    <span className="font-mono text-xs text-point">{s.n}</span>
                    <span className="type-title text-[clamp(22px,2vw,32px)] leading-[1.15]">{s.t}</span>
                    <span className="type-body leading-[1.7] [text-wrap:pretty]">{s.d}</span>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

        {/* 다음 프로젝트: 썸네일 왼쪽 위 모서리에 클로버가 걸터앉는다 */}
        <section className="mt-[clamp(120px,12vw,220px)] border-t border-white/10">
          <a
            href={`#${next.id}`}
            onPointerEnter={() => clover.current?.setHover(true)}
            onPointerLeave={() => clover.current?.setHover(false)}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-[clamp(20px,3vw,56px)] py-[clamp(40px,5vw,88px)] transition-colors duration-300"
          >
            <div className="flex min-w-0 flex-col gap-5">
              <span className="site-caption">Next Project — {next.no}</span>
              <span className="site-display text-[clamp(44px,8vw,160px)] leading-[0.9]">
                {next.name}
                <span className="text-point">.</span>
              </span>
              <span className="text-sm text-sub">
                {next.client} · {next.desc}
              </span>
            </div>
            <div className="relative w-[clamp(140px,20vw,320px)] shrink-0">
              <div className={`aspect-square overflow-hidden bg-[#151517] ${MEDIA_RADIUS}`}>
                <img
                  src={next.thumbClover}
                  alt={`${next.name} 썸네일`}
                  loading="lazy"
                  className="block h-full w-full object-cover"
                />
              </div>
              <div
                ref={slotNext}
                className="pointer-events-none absolute left-[-22%] top-[-22%] aspect-square w-[52%]"
              />
            </div>
          </a>
        </section>
      </main>

      <footer className="site-x pb-8 pt-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] pt-6 font-mono text-xs text-dim">
          <span>© 2026 RAE APRIL. All rights reserved.</span>
          <span>Web Publisher · Seoul, KR</span>
          <a href="/#work">All Work ↗</a>
        </div>
      </footer>
    </div>
  );
}

export default ProjectDetail;
