import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ease-smooth ${
        scrolled ? "bg-paper/80 backdrop-blur-md border-b border-line" : ""
      }`}
    >
      <nav className="container-x flex h-16 items-center justify-between md:h-20">
        <Link to="/" className="display text-lg tracking-tightest">
          RAE<span className="text-accent">.</span>
        </Link>

        <div className="flex items-center gap-6 text-sm font-medium md:gap-8">
          <a href="/#work" className="hidden transition-colors hover:text-accent sm:inline">
            Work
          </a>
          <a href="/#about" className="hidden transition-colors hover:text-accent sm:inline">
            About
          </a>
          <Link
            to="/contact"
            className="rounded-full border border-ink px-4 py-1.5 transition-all duration-300 ease-smooth hover:bg-ink hover:text-paper"
          >
            Contact
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default Nav;
