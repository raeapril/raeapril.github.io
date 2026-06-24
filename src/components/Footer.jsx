import { Link } from "react-router-dom";

// TODO: 본인 정보로 교체하세요.
const EMAIL = "your.email@example.com";
const SOCIALS = [
  { label: "GitHub", href: "https://github.com/raeapril" },
  { label: "Instagram", href: "#" },
  { label: "Velog", href: "#" },
];

function Footer() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="container-x py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <p className="eyebrow mb-4">Let&apos;s talk</p>
            <a
              href={`mailto:${EMAIL}`}
              className="display block text-3xl transition-colors hover:text-accent md:text-4xl"
            >
              {EMAIL}
            </a>
          </div>

          <div>
            <p className="eyebrow mb-4">Menu</p>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/#work" className="transition-colors hover:text-accent">
                  Work
                </a>
              </li>
              <li>
                <a href="/#about" className="transition-colors hover:text-accent">
                  About
                </a>
              </li>
              <li>
                <Link to="/contact" className="transition-colors hover:text-accent">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-4">Social</p>
            <ul className="space-y-2 text-sm">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="transition-colors hover:text-accent"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} RAE APRIL. All rights reserved.</p>
          <p>Frontend Publisher · Seoul, KR</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
