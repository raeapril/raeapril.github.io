import { Link } from "react-router-dom";

function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 text-ink">
      <nav className="container-x flex h-16 items-center justify-between md:h-20">
        <Link to="/" data-logo className="display text-lg tracking-[0.05em] md:text-xl">
          RAE<span className="text-accent text-[1.6em] leading-none">.</span>
        </Link>

        <div className="flex items-center gap-6 text-sm font-medium md:gap-8">
          <a href="/#about" className="transition-colors hover:text-accent">
            About
          </a>
          <a href="/#work" className="transition-colors hover:text-accent">
            Work
          </a>
        </div>
      </nav>
    </header>
  );
}

export default Nav;
