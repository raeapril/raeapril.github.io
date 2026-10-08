import { revealStyle } from "../lib/motion";

const LINKS = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
];

function Nav({ revealed = true }) {
  return (
    <header
      className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
      style={revealStyle(revealed)}
    >
      <nav
        aria-label="주요 메뉴"
        className="flex items-center gap-[clamp(12px,2vw,32px)] rounded-full border border-white/[0.08] bg-[rgba(22,22,26,0.6)] py-2 pl-5 pr-2 backdrop-blur-[16px]"
      >
        <a href="#top" className="font-display text-lg font-extrabold tracking-[-0.02em]">
          RAE<span className="text-point">.</span>
        </a>
        <div className="flex items-center gap-[clamp(12px,1.6vw,24px)] text-[13px] font-medium text-sub">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </div>
        <a
          href="#contact"
          className="rounded-full bg-cream px-[18px] py-2.5 text-[13px] font-semibold text-night transition-colors duration-300 hover:bg-point hover:text-night"
        >
          Contact
        </a>
      </nav>
    </header>
  );
}

export default Nav;
