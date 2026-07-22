import { Link } from "react-router-dom";

/**
 * 헤더 — 배경 없이 투명.
 * mix-blend-mode: difference 로 뒤 배경색에 따라 글자색이 자동 반전된다.
 * (밝은 배경 위에선 어둡게, 어두운 배경 위에선 밝게)
 */
function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 text-white mix-blend-difference">
      <nav className="container-x flex h-16 items-center justify-between md:h-20">
        <Link to="/" className="display text-lg tracking-[0.05em] md:text-xl">
          RAE<span className="text-accent">.</span>
        </Link>

        <div className="flex items-center gap-6 text-sm font-medium md:gap-8">
          <a href="/#work" className="hidden transition-opacity hover:opacity-60 sm:inline">
            Work
          </a>
          <a href="/#about" className="hidden transition-opacity hover:opacity-60 sm:inline">
            About
          </a>
          <Link
            to="/contact"
            className="rounded-full border border-white px-4 py-1.5 transition-opacity duration-300 ease-smooth hover:opacity-60"
          >
            Contact
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default Nav;
