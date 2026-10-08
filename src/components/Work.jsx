import { useEffect, useRef, useState } from "react";
import { WORK } from "../data/work";
import SectionHead from "./SectionHead";
import { useFrame } from "../hooks/useFrame";
import { useNarrow } from "../hooks/useNarrow";
import { clamp } from "../lib/math";

const SMOOTH = "cubic-bezier(0.22,1,0.36,1)";

/**
 * 커서를 따라다니는 썸네일 미리보기. 이동 속도만큼 3D 로 기울어 관성감을 준다.
 * 위치는 매 프레임 DOM 에 직접 쓴다(React 리렌더 없이).
 */
function Preview({ active }) {
  const ref = useRef(null);
  const p = useRef({ x: 0, y: 0, tx: 0, ty: 0, init: false });

  useEffect(() => {
    const onMove = (e) => {
      const P = p.current;
      P.tx = e.clientX;
      P.ty = e.clientY;
      if (!P.init) {
        P.x = P.tx;
        P.y = P.ty;
        P.init = true;
      }
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame(() => {
    const el = ref.current;
    if (!el) return;
    const P = p.current;
    const px = P.x;
    const py = P.y;
    P.x += (P.tx - P.x) * 0.14;
    P.y += (P.ty - P.y) * 0.14;
    const vx = P.x - px;
    const vy = P.y - py;
    const show = active >= 0;
    el.style.opacity = show ? 1 : 0;
    el.style.transform = `translate(${P.x}px,${P.y}px) translate(-50%,-50%) perspective(900px) rotateY(${clamp(vx * 0.6, -18, 18)}deg) rotateX(${clamp(-vy * 0.6, -14, 14)}deg) scale(${show ? 1 : 0.85})`;
  });

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-40 aspect-[16/10] w-[clamp(280px,24vw,480px)] overflow-hidden rounded-[18px] opacity-0 shadow-[0_40px_80px_rgba(0,0,0,0.5)] transition-opacity duration-300"
    >
      {WORK.map((proj, i) => (
        <img
          key={proj.no}
          src={proj.thumb}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            opacity: active === i ? 1 : 0,
            transform: `scale(${active === i ? 1 : 1.15})`,
            transition: `opacity 0.45s, transform 0.8s ${SMOOTH}`,
          }}
        />
      ))}
    </div>
  );
}

function Work() {
  const narrow = useNarrow();
  const [hover, setHover] = useState(-1);

  return (
    <section id="work" className="site-x site-y">
      <SectionHead
        title={
          <>
            Selected
            <br />
            Work
            <sup className="ml-3 align-top font-mono text-[0.14em] font-normal tracking-normal text-point">
              ({String(WORK.length).padStart(2, "0")})
            </sup>
          </>
        }
      >
        참여한 작업. 접근성 인증부터 디자인 어워드 수상까지, 퍼블리싱을 맡았던 프로젝트입니다.
      </SectionHead>

      <ul
        onPointerLeave={() => setHover(-1)}
        className="m-0 list-none border-b border-white/10 p-0"
      >
        {WORK.map((proj, i) => {
          const on = hover === i;
          return (
            <li key={proj.no} onPointerEnter={() => setHover(i)} className="border-t border-white/10">
              <a
                href={proj.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${proj.title} 사이트 새 탭으로 열기`}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(-1)}
                // 모바일: 번호 | 제목 | 화살표 한 줄 + 아래로 썸네일·설명 (2~3열 걸침)
                // 900px 이상: 번호 | 제목 | 설명 | 화살표 한 줄
                className="grid grid-cols-[28px_minmax(0,1fr)_40px] items-center gap-x-3 gap-y-4 py-[clamp(20px,2.2vw,40px)] min-[900px]:grid-cols-[80px_minmax(0,1.6fr)_minmax(0,1fr)_60px] min-[900px]:gap-[clamp(12px,2vw,40px)]"
                style={{
                  // 다른 행에 올라가 있으면 나머지는 어둡게
                  color: hover < 0 || on ? "#f2efe9" : "#5d5b57",
                  paddingLeft: on && !narrow ? 24 : 0,
                  transition: `color 0.35s, padding 0.5s ${SMOOTH}`,
                }}
              >
                <span className="font-mono text-xs text-point">{proj.no}</span>
                <span className="min-w-0 font-display text-[clamp(26px,3.4vw,68px)] font-semibold leading-[1.02] tracking-[-0.035em] [text-wrap:pretty]">
                  {proj.title}
                </span>
                <img
                  src={proj.thumb}
                  alt=""
                  loading="lazy"
                  className="col-span-2 col-start-2 row-start-2 block aspect-[16/10] w-full rounded-[14px] object-cover min-[900px]:hidden"
                />
                <span className="col-span-2 col-start-2 row-start-3 flex flex-col gap-2.5 text-sm text-sub min-[900px]:col-span-1 min-[900px]:col-start-3 min-[900px]:row-start-1">
                  <span>{proj.desc}</span>
                  <span className="flex flex-wrap gap-1.5">
                    {proj.chips.map((chip) => (
                      <span
                        key={chip}
                        className="rounded-full border border-white/[0.14] px-2.5 py-[5px] font-mono text-[11px]"
                      >
                        {chip}
                      </span>
                    ))}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="col-start-3 row-start-1 flex h-10 w-10 items-center justify-center justify-self-end rounded-full border border-white/[0.16] text-base transition-all duration-[350ms] min-[900px]:col-start-4 min-[900px]:h-12 min-[900px]:w-12"
                  style={{
                    background: on ? "#E8B4BC" : "transparent",
                    color: on ? "#0c0c0e" : "#f2efe9",
                  }}
                >
                  ↗
                </span>
              </a>
            </li>
          );
        })}
      </ul>

      {!narrow && <Preview active={hover} />}
    </section>
  );
}

export default Work;
