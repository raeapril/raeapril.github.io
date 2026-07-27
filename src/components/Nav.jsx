import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

/**
 * 헤더 — 배경 없이 투명.
 * 헤더 밑에 어두운 섹션(data-nav="dark")이 오면 글자색을 밝게 전환.
 * (mix-blend 대신 색 토글 → 로고 점을 진짜 블루 포인트로 유지)
 */
function Nav() {
  const [onDark, setOnDark] = useState(false);

  useEffect(() => {
    const HEADER_LINE = 40; // 헤더 대략 중앙 y좌표(px)
    const check = () => {
      let dark = false;
      for (const el of document.querySelectorAll('[data-nav="dark"]')) {
        const r = el.getBoundingClientRect();
        if (r.top <= HEADER_LINE && r.bottom >= HEADER_LINE) {
          dark = true;
          break;
        }
      }
      setOnDark(dark);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ease-smooth ${
        onDark ? "text-paper" : "text-ink"
      }`}
    >
      <nav className="container-x flex h-16 items-center justify-between md:h-20">
        <Link to="/" data-logo className="display text-lg tracking-[0.05em] md:text-xl">
          RAE<span className="text-accent text-[1.6em] leading-none">.</span>
        </Link>

        <div className="flex items-center gap-6 text-sm font-medium md:gap-8">
          <a href="/#about" className="hidden transition-colors hover:text-accent sm:inline">
            About
          </a>
          <a href="/#work" className="hidden transition-colors hover:text-accent sm:inline">
            Work
          </a>
        </div>
      </nav>
    </header>
  );
}

export default Nav;
