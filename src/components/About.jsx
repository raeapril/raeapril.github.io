import { useRef } from "react";
import { ABOUT } from "../data/content";
import SectionHead from "./SectionHead";
import { useFrame } from "../hooks/useFrame";
import { ease, lerp, clamp } from "../lib/math";

// 포인트 색 반투명 (#E8B4BC)
const point = (a) => `rgba(232,180,188,${a})`;

const STAGE =
  "relative h-[clamp(290px,22vw,400px)] overflow-hidden rounded-[18px] border border-white/[0.06] bg-[#101013]";

/* ---------------- 01 Pixel-Perfect: 24px 그리드 위를 움직이는 측정 커서 ---------------- */
function PixelDemo() {
  const stage = useRef(null);
  const cell = useRef(null);
  const h = useRef(null);
  const v = useRef(null);
  const read = useRef(null);
  const s = useRef({ x: 0, y: 0, lx: -1, ly: -1 });

  useFrame((time) => {
    const el = stage.current;
    if (!el) return;
    const w = el.clientWidth;
    const hh = el.clientHeight;
    const P = s.current;
    // 포인터가 없으면 리사주 곡선으로 저절로 떠돈다
    const tx = P.lx >= 0 ? P.lx : w * (0.5 + 0.4 * Math.sin(time * 0.7));
    const ty = P.ly >= 0 ? P.ly : hh * (0.5 + 0.38 * Math.sin(time * 1.13));
    P.x += (tx - P.x) * 0.18;
    P.y += (ty - P.y) * 0.18;
    const sx = Math.floor(P.x / 24) * 24;
    const sy = Math.floor(P.y / 24) * 24;
    cell.current.style.transform = `translate(${sx}px,${sy}px)`;
    h.current.style.transform = `translateY(${sy + 12}px)`;
    v.current.style.transform = `translateX(${sx + 12}px)`;
    read.current.textContent = `x ${sx} · y ${sy}`;
    const rx = sx + 30 + 96 > w ? sx - 100 : sx + 30;
    read.current.style.transform = `translate(${rx}px,${Math.max(4, sy - 26)}px)`;
  });

  return (
    <div
      ref={stage}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        s.current.lx = e.clientX - r.left;
        s.current.ly = e.clientY - r.top;
      }}
      onPointerLeave={() => {
        s.current.lx = s.current.ly = -1;
      }}
      className={`${STAGE} cursor-crosshair`}
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.05) 1px,transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      <div className="absolute left-1/2 top-1/2 flex w-[min(280px,62%)] -translate-x-1/2 -translate-y-1/2 flex-col gap-2.5">
        <div className="flex items-center gap-2 font-mono text-[11px] text-point">
          <span className="h-2.5 w-px bg-point" />
          <span className="h-px flex-1 bg-point" />
          <span>280</span>
          <span className="h-px flex-1 bg-point" />
          <span className="h-2.5 w-px bg-point" />
        </div>
        <div
          className="relative flex h-16 items-center justify-center rounded-full bg-cream text-base font-bold text-night"
          style={{ outline: `1px dashed ${point(0.7)}`, outlineOffset: 6 }}
        >
          문의하기
          <span className="absolute -right-11 inset-y-0 flex items-center font-mono text-[11px] font-normal text-point">
            64
          </span>
        </div>
      </div>
      <span ref={h} className="absolute inset-x-0 top-0 h-px" style={{ background: point(0.55) }} />
      <span ref={v} className="absolute inset-y-0 left-0 w-px" style={{ background: point(0.55) }} />
      <span
        ref={cell}
        className="absolute left-0 top-0 h-6 w-6 border border-point"
        style={{ background: point(0.22) }}
      />
      <span
        ref={read}
        className="absolute left-0 top-0 whitespace-nowrap rounded-md bg-point px-2 py-1 font-mono text-[11px] text-night"
      >
        x 0 · y 0
      </span>
    </div>
  );
}

/* ---------------- 02 Responsive: 375 ↔ 1440 으로 늘었다 줄었다 하는 브라우저 프레임 ---------------- */
function ResponsiveDemo() {
  const stage = useRef(null);
  const frame = useRef(null);
  const label = useRef(null);

  useFrame((time) => {
    const W = stage.current?.clientWidth;
    if (!W) return;
    const f = ease((Math.sin(time * 0.75 - Math.PI / 2) + 1) / 2);
    frame.current.style.width = `${lerp(Math.min(150, W * 0.3), W - 32, f)}px`;
    const px = Math.round(lerp(375, 1440, f));
    label.current.textContent = `${px}px · ${px < 768 ? "Mobile" : px < 1200 ? "Tablet" : "Desktop"}`;
  });

  return (
    <div ref={stage} className={STAGE}>
      <div
        ref={frame}
        className="absolute bottom-[52px] left-1/2 top-4 flex w-3/5 -translate-x-1/2 flex-col gap-2 overflow-hidden rounded-xl border border-white/[0.16] bg-[#17171b] p-2.5"
      >
        <div className="flex items-center gap-[5px]">
          <span className="h-[7px] w-[7px] rounded-full bg-[#5d5b57]" />
          <span className="h-[7px] w-[7px] rounded-full bg-[#5d5b57]" />
          <span className="ml-1.5 h-3 flex-1 rounded-md bg-white/[0.06]" />
        </div>
        <div className="grid content-start gap-1.5 [grid-template-columns:repeat(auto-fill,minmax(68px,1fr))]">
          <span className="col-span-full h-12 rounded-md" style={{ background: point(0.4) }} />
          {Array.from({ length: 8 }, (_, i) => (
            <span key={i} className="h-[52px] rounded-md bg-white/[0.08]" />
          ))}
        </div>
        <span className="absolute right-[3px] top-1/2 -mt-3.5 h-7 w-1 rounded bg-point" />
      </div>
      <div className="absolute inset-x-0 bottom-3.5 flex justify-center">
        <span ref={label} className="rounded-full bg-white/[0.06] px-3 py-[5px] font-mono text-[11px] text-cream">
          375px · Mobile
        </span>
      </div>
    </div>
  );
}

/* ---------------- 03 Accessibility: Tab 으로 이동하는 포커스 링 + 스크린리더 낭독 ---------------- */
const A11Y_ITEMS = [
  "편집 가능 텍스트, 이메일",
  "체크박스, 개인정보 수집 동의, 선택 안 됨",
  "버튼, 문의하기",
  "링크, 개인정보처리방침",
];

function A11yDemo() {
  const stage = useRef(null);
  const items = useRef([]);
  const ring = useRef(null);
  const sr = useRef(null);
  const key = useRef(null);
  const last = useRef({ i: -1, w: 0 });

  useFrame((time) => {
    const st = stage.current;
    if (!st) return;
    const i = Math.floor(time / 1.4) % A11Y_ITEMS.length;
    const L = last.current;
    if (i === L.i && L.w === st.clientWidth) return;
    const changed = i !== L.i;
    L.i = i;
    L.w = st.clientWidth;
    const sRect = st.getBoundingClientRect();
    const r = items.current[i].getBoundingClientRect();
    Object.assign(ring.current.style, {
      left: `${r.left - sRect.left - 5}px`,
      top: `${r.top - sRect.top - 5}px`,
      width: `${r.width + 10}px`,
      height: `${r.height + 10}px`,
    });
    sr.current.textContent = A11Y_ITEMS[i];
    if (changed) {
      key.current.style.transform = "translateY(2px) scale(0.94)";
      setTimeout(() => key.current && (key.current.style.transform = "none"), 140);
    }
  });

  const at = (i) => (el) => {
    items.current[i] = el;
  };

  return (
    <div ref={stage} className={STAGE}>
      <span
        ref={key}
        className="absolute left-3.5 top-3.5 rounded-lg border border-b-[3px] border-white/20 px-2.5 py-1.5 font-mono text-[11px] text-cream transition-transform duration-[120ms]"
      >
        Tab ⇥
      </span>
      <div className="absolute left-1/2 top-1/2 flex w-[min(300px,72%)] -translate-x-1/2 -translate-y-[56%] flex-col gap-[9px]">
        <div ref={at(0)} className="flex h-[38px] items-center rounded-[10px] border border-white/[0.16] px-3.5">
          <span className="text-[13px] text-dim">이메일</span>
        </div>
        <div ref={at(1)} className="flex items-center gap-2 self-start p-1">
          <span className="h-4 w-4 rounded border border-white/30" />
          <span className="text-[13px] text-sub">개인정보 수집 동의</span>
        </div>
        <div ref={at(2)} className="flex h-10 items-center justify-center rounded-full bg-cream text-sm font-bold text-night">
          문의하기
        </div>
        <div ref={at(3)} className="self-center px-1 py-0.5 text-xs text-sub underline">
          개인정보처리방침
        </div>
      </div>
      <span
        ref={ring}
        className="pointer-events-none absolute left-0 top-0 h-0 w-0 rounded-xl border-2 border-point"
        style={{
          boxShadow: `0 0 0 4px ${point(0.22)}`,
          transition: "all 0.45s cubic-bezier(0.22,1,0.36,1)",
        }}
      />
      <div className="absolute inset-x-3.5 bottom-3.5 flex items-center gap-2.5 rounded-[10px] bg-white/[0.05] px-3 py-2 font-mono text-[11px]">
        <span className="text-point">SR ›</span>
        <span ref={sr} className="text-cream">
          {A11Y_ITEMS[0]}
        </span>
      </div>
    </div>
  );
}

/* ---------------- 04 Interaction: 포인터를 따라 스프링으로 기우는 3겹 카드 ---------------- */
function InteractionDemo() {
  const stage = useRef(null);
  const rig = useRef(null);
  const layers = useRef([]);
  const s = useRef({ rx: 0, ry: 0, vx: 0, vy: 0, z: 0, hover: false, mx: 0, my: 0 });

  useFrame((time) => {
    const st = stage.current;
    if (!st) return;
    const r = st.getBoundingClientRect();
    const I = s.current;
    let tx;
    let ty;
    if (I.hover) {
      tx = ((I.my - (r.top + r.height / 2)) / r.height) * -36;
      ty = ((I.mx - (r.left + r.width / 2)) / r.width) * 44;
    } else {
      tx = 14 + Math.sin(time * 0.9) * 8;
      ty = -22 + Math.sin(time * 0.6) * 14;
    }
    // 감쇠 스프링
    I.vx += (tx - I.rx) * 0.06;
    I.vx *= 0.82;
    I.rx += I.vx;
    I.vy += (ty - I.ry) * 0.06;
    I.vy *= 0.82;
    I.ry += I.vy;
    I.z += ((I.hover ? 56 : 26) - I.z) * 0.08;
    const sc = clamp(Math.min(r.width / 640, r.height / 330), 0.5, 1.15);
    rig.current.style.transform = `scale(${sc}) rotateX(${I.rx}deg) rotateY(${I.ry}deg)`;
    layers.current.forEach((el, k) => {
      if (el) el.style.transform = `translate3d(${(k - 1) * -14}px,${(k - 1) * -14}px,${(k - 1) * I.z}px)`;
    });
  });

  const layer = (k) => (el) => {
    layers.current[k] = el;
  };
  const CARD = "absolute -left-[150px] -top-[95px] h-[190px] w-[300px] rounded-[20px]";

  return (
    <div
      ref={stage}
      onPointerEnter={() => (s.current.hover = true)}
      onPointerLeave={() => (s.current.hover = false)}
      onPointerMove={(e) => {
        s.current.mx = e.clientX;
        s.current.my = e.clientY;
      }}
      className={STAGE}
      style={{ perspective: 900 }}
    >
      <div ref={rig} className="absolute left-1/2 top-1/2 h-0 w-0 [transform-style:preserve-3d]">
        <div ref={layer(0)} className={`${CARD} bg-point`} />
        <div ref={layer(1)} className={`${CARD} border border-white/25 bg-cream/10`} />
        <div ref={layer(2)} className={`${CARD} flex flex-col justify-between bg-cream p-5`}>
          <div className="flex items-center gap-2.5">
            <span className="h-9 w-9 rounded-full bg-night" />
            <span className="flex flex-col gap-1.5">
              <span className="h-2 w-[110px] rounded bg-night" />
              <span className="h-2 w-[70px] rounded bg-sub" />
            </span>
          </div>
          <div className="flex items-end justify-between">
            <span className="h-2 w-[140px] rounded bg-[#d6d2cb]" />
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-night text-sm text-cream">↗</span>
          </div>
        </div>
      </div>
      <span className="absolute left-3.5 top-3.5 z-[2] rounded-full bg-[rgba(22,22,26,0.85)] px-2.5 py-[5px] font-mono text-[11px] text-sub">
        cubic-bezier(0.22, 1, 0.36, 1)
      </span>
    </div>
  );
}

// 카드 순서대로: 데모, 12컬럼 중 폭(900px 이상)
const BENTO = [
  { Demo: PixelDemo, span: "min-[900px]:col-span-7" },
  { Demo: ResponsiveDemo, span: "min-[900px]:col-span-5" },
  { Demo: A11yDemo, span: "min-[900px]:col-span-5" },
  { Demo: InteractionDemo, span: "min-[900px]:col-span-7" },
];

function About() {
  return (
    <section id="about" className="site-x site-y">
      <SectionHead
        title={
          <>
            What
            <br />I do
          </>
        }
      >
        하는 일, 잘하는 일.
      </SectionHead>
      <ul className="m-0 grid list-none grid-cols-12 gap-[clamp(12px,1.4vw,24px)] p-0">
        {ABOUT.map((item, i) => {
          const { Demo, span } = BENTO[i];
          return (
            <li
              key={item.no}
              className={`relative col-span-12 flex flex-col gap-[clamp(20px,2vw,32px)] rounded-[28px] border border-white/[0.08] bg-[rgba(22,22,26,0.7)] p-[clamp(12px,1vw,18px)] backdrop-blur-[24px] ${span}`}
            >
              <div aria-hidden="true">
                <Demo />
              </div>
              <div className="flex flex-col gap-3 px-[clamp(8px,1vw,16px)] pb-[clamp(8px,1vw,16px)]">
                <div className="flex items-baseline gap-3.5">
                  <span className="font-mono text-xs text-point">{item.no}</span>
                  <h3 className="type-title m-0 text-[clamp(30px,2.6vw,52px)] leading-none">
                    {item.title}
                  </h3>
                </div>
                <p className="m-0 text-[clamp(16px,1.1vw,19px)] font-semibold leading-[1.45] [text-wrap:pretty]">
                  {item.lead}
                </p>
                <p className="type-body m-0 leading-[1.7] [text-wrap:pretty]">
                  {item.desc}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default About;
