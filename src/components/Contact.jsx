import { useEffect, useRef, useState } from "react";
import { EMAIL } from "../data/content";
import { useFrame } from "../hooks/useFrame";
import { prefersReducedMotion } from "../lib/motion";

const SMOOTH = "cubic-bezier(0.22,1,0.36,1)";

/**
 * 이메일 CTA.
 * - 섹션에 들어오면 글자가 한 자씩 아래에서 올라온다
 * - 커서가 가까이 오면 자석처럼 살짝 끌려온다
 */
function Email() {
  const btn = useRef(null);
  const [shown, setShown] = useState(() => prefersReducedMotion());
  const pull = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  // 등장: 화면에 30% 이상 들어오면 한 번만
  useEffect(() => {
    if (shown) return;
    const el = btn.current;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shown]);

  // 자석: 버튼 둘레 160px 안에 커서가 들어오면 거리의 22% 만큼 끌려온다
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const onMove = (e) => {
      const r = btn.current.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const near =
        Math.abs(dx) < r.width / 2 + 160 && Math.abs(dy) < r.height / 2 + 160;
      pull.current.tx = near ? dx * 0.22 : 0;
      pull.current.ty = near ? dy * 0.22 : 0;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame(() => {
    const el = btn.current;
    const p = pull.current;
    if (!el) return;
    p.x += (p.tx - p.x) * 0.12;
    p.y += (p.ty - p.y) * 0.12;
    el.style.transform = `translate(${p.x.toFixed(2)}px,${p.y.toFixed(2)}px)`;
  });

  const chars = [...EMAIL];

  return (
    <div className="flex justify-center">
      <a
        ref={btn}
        href={`mailto:${EMAIL}`}
        aria-label={`${EMAIL} 로 메일 보내기`}
        className="site-display whitespace-nowrap text-[clamp(22px,4vw,72px)] leading-none text-cream transition-colors duration-300 hover:text-point"
      >
        {/* 글자가 아래에서 올라올 때 잘려 보이도록 한 줄을 가린다 (g 꼬리가 안 잘리게 아래 여백) */}
        <span aria-hidden="true" className="inline-flex overflow-hidden pb-[0.14em]">
          {chars.map((c, i) => (
            <span
              key={i}
              className={`inline-block ${c === "." ? "text-point" : ""}`}
              style={{
                transform: shown ? "translateY(0)" : "translateY(110%)",
                transition: `transform 0.9s ${SMOOTH} ${i * 0.028}s`,
              }}
            >
              {c}
            </span>
          ))}
        </span>
      </a>
    </div>
  );
}

function Contact({ sceneReady = true }) {
  return (
    <section
      id="contact"
      className="site-x relative flex min-h-screen flex-col pb-8 pt-[clamp(96px,12vh,160px)]"
    >
      {/* 실제 "LET'S WORK TOGETHER" 는 WebGL 배경에 그려지고 유리 클로버가 그 위에서 굴절시킨다.
          이 h2 는 3D 가 없을 때의 대체 헤드라인이자 스크린리더용 제목 */}
      <h2
        className={`site-display pointer-events-none absolute inset-x-[4vw] top-[42%] m-0 -translate-y-1/2 text-center text-[clamp(28px,7.2vw,144px)] uppercase leading-[0.86] transition-opacity duration-[600ms] ${
          sceneReady ? "opacity-0" : "opacity-100"
        }`}
      >
        Let’s work
        <br />
        together<span className="text-point">.</span>
      </h2>

      <div className="relative mt-auto pb-[clamp(32px,6vh,72px)]">
        <Email />
      </div>

      <footer className="relative flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] pt-6 font-mono text-xs text-dim">
        <span>© {new Date().getFullYear()} RAE APRIL. All rights reserved.</span>
        <span>Web Publisher · Seoul, KR</span>
        <a href="#top">Back to top ↑</a>
      </footer>
    </section>
  );
}

export default Contact;
