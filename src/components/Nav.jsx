import { useEffect, useState } from "react";
import { revealStyle } from "../lib/motion";

const LINKS = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

/**
 * 지금 보고 있는 섹션의 해시(#work 등). 히어로에 있으면 null.
 * 섹션 윗변이 화면 가운데를 넘으면 그 섹션으로 친다.
 * Contact 는 짧아서 가운데에 못 닿을 수 있으니, 페이지 끝에 닿으면 Contact 로 본다.
 */
function useActiveSection() {
  const [active, setActive] = useState(null);
  useEffect(() => {
    const sections = LINKS.map((l) => document.querySelector(l.href)).filter(Boolean);
    const update = () => {
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom) return setActive("#contact");
      const line = window.innerHeight / 2;
      let cur = null;
      for (const s of sections) if (s.getBoundingClientRect().top <= line) cur = `#${s.id}`;
      setActive(cur);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  return active;
}

function Nav({ revealed = true }) {
  const active = useActiveSection();

  return (
    <header
      className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
      style={revealStyle(revealed)}
    >
      <nav
        aria-label="주요 메뉴"
        className="flex items-center gap-[clamp(12px,2vw,32px)] glass-bar rounded-full px-6 py-3.5"
      >
        <a href="#top" className="font-display text-lg font-extrabold tracking-[-0.02em]">
          RAE<span className="text-point">.</span>
        </a>
        <div className="flex items-center gap-[clamp(12px,1.6vw,24px)] text-[13px] font-medium text-sub">
          {LINKS.map((l) => {
            const on = active === l.href;
            return (
              <a
                key={l.href}
                href={l.href}
                aria-current={on ? "location" : undefined}
                // 호버로는 색이 바뀌지 않고, 해당 섹션에 들어와 있을 때만 포인트 컬러
                className={`transition-colors duration-300 ${on ? "text-point hover:text-point" : "hover:text-sub"}`}
              >
                {l.label}
              </a>
            );
          })}
        </div>
      </nav>
    </header>
  );
}

export default Nav;
