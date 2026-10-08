import { useEffect, useRef } from "react";
import { SKILLS } from "../data/content";
import CloverIcon from "./CloverIcon";
import { prefersReducedMotion } from "../lib/motion";

const SPEED = 60; // 마키 속도(px/s). 아랫줄은 0.7배로 반대 방향
const LOOP = [...SKILLS, ...SKILLS]; // 두 번 이어 붙여 절반 폭마다 이음매 없이 반복

function Skills() {
  const row1 = useRef(null);
  const row2 = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let raf = 0;
    let last = 0;
    let offset = 0;
    const loop = (t) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (t - (last || t)) / 1000);
      last = t;
      offset += dt * SPEED;
      const a = row1.current;
      const b = row2.current;
      if (a) {
        const half = a.scrollWidth / 2 || 1;
        a.style.transform = `translateX(${-(offset % half)}px)`;
      }
      if (b) {
        const half = b.scrollWidth / 2 || 1;
        b.style.transform = `translateX(${-half + ((offset * 0.7) % half)}px)`;
      }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section id="skills" className="site-y">
      <div className="site-x site-head-gap flex flex-wrap items-end justify-between gap-6">
        {/* 아래 마키가 큰 글자 역할을 하므로 제목은 작은 라벨로 둔다 */}
        <h2 className="type-title m-0 text-[clamp(24px,2.4vw,40px)] leading-none text-cream">
          Skills<span className="text-point">.</span>
        </h2>
        <p className="type-body m-0">다룰 수 있는 기술.</p>
      </div>

      {/* 스크린리더용 목록. 아래 마키는 장식이라 숨긴다 */}
      <ul className="sr-only">
        {SKILLS.map((s) => (
          <li key={s.name}>
            {s.name} — {s.desc}
          </li>
        ))}
      </ul>

      <div
        aria-hidden="true"
        className="flex flex-col gap-2 overflow-hidden border-y border-white/[0.08] py-[clamp(20px,2vw,36px)]"
      >
        <div ref={row1} className="flex w-max will-change-transform">
          {LOOP.map((s, i) => (
            <span
              key={i}
              className="flex items-center gap-[clamp(20px,2vw,40px)] whitespace-nowrap pr-[clamp(20px,2vw,40px)] font-display text-[clamp(48px,7vw,140px)] font-extrabold leading-none tracking-[-0.045em]"
            >
              {s.name}
              <CloverIcon className="h-[0.4em] w-[0.4em] text-point" />
            </span>
          ))}
        </div>
        <div ref={row2} className="flex w-max will-change-transform">
          {LOOP.map((s, i) => (
            <span key={i} className="flex items-baseline gap-3.5 whitespace-nowrap pr-[clamp(32px,3vw,64px)]">
              <span className="font-display text-[clamp(28px,3vw,56px)] font-normal tracking-[-0.035em] text-transparent [-webkit-text-stroke:1px_#8d8a85]">
                {s.name}
              </span>
              <span className="text-sm text-dim">{s.desc}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skills;
