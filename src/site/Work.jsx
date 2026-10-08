import { WORK } from "./data";
import SectionHead from "./SectionHead";

const TILT = 8; // 카드 최대 기울기(°)

// 포인터 위치에 따라 카드를 3D 로 기울이고, 같은 지점에 빛 반사(glare)를 띄운다.
function onCardMove(e) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width;
  const y = (e.clientY - r.top) / r.height;
  el.style.transform = `perspective(1200px) rotateX(${(0.5 - y) * TILT}deg) rotateY(${(x - 0.5) * TILT * 1.2}deg)`;
  const g = el.querySelector("[data-glare]");
  if (g) {
    g.style.opacity = 1;
    g.style.background = `radial-gradient(600px circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.12), transparent 45%)`;
  }
}

function onCardLeave(e) {
  const el = e.currentTarget;
  el.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg)";
  const g = el.querySelector("[data-glare]");
  if (g) g.style.opacity = 0;
}

function WorkCard({ proj }) {
  return (
    <a
      href={proj.link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${proj.title} 사이트 새 탭으로 열기`}
      onPointerMove={onCardMove}
      onPointerLeave={onCardLeave}
      className={`glass relative col-span-12 flex flex-col gap-5 rounded-3xl bg-[rgba(26,26,30,0.66)] px-2.5 pb-6 pt-2.5 text-cream transition-[transform,border-color] duration-500 ease-smooth [transform-style:preserve-3d] hover:border-point/40 hover:text-cream ${proj.span}`}
    >
      <div className="overflow-hidden rounded-2xl [transform:translateZ(36px)]">
        <img
          src={proj.thumb}
          alt={proj.title}
          loading="lazy"
          className="block aspect-[16/10] w-full object-cover"
        />
      </div>
      <div className="flex items-start justify-between gap-4 px-3 [transform:translateZ(20px)]">
        <div className="flex min-w-0 flex-col gap-2">
          <span className="font-mono text-xs text-point">{proj.no}</span>
          <h3 className="m-0 text-[clamp(20px,1.5vw,28px)] font-bold leading-tight tracking-[-0.02em] [text-wrap:pretty]">
            {proj.title}
          </h3>
          <p className="m-0 text-sm text-sub">{proj.desc}</p>
        </div>
        <span
          aria-hidden="true"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/[0.16] text-base"
        >
          ↗
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5 px-3 [transform:translateZ(12px)]">
        {proj.chips.map((chip) => (
          <span
            key={chip}
            className="rounded-full bg-white/[0.06] px-3 py-1.5 font-mono text-[11px] text-sub"
          >
            {chip}
          </span>
        ))}
      </div>
      <span
        data-glare
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-[400ms]"
      />
    </a>
  );
}

function Work() {
  return (
    <section id="work" className="site-x pt-[clamp(120px,12vw,220px)]">
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
      <div className="grid grid-cols-12 items-start gap-[clamp(12px,1.4vw,24px)]">
        {WORK.map((proj) => (
          <WorkCard key={proj.no} proj={proj} />
        ))}
      </div>
    </section>
  );
}

export default Work;
