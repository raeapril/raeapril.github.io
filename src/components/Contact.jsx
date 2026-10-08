import { EMAIL } from "../data/content";

function Contact() {
  const [user, domain] = EMAIL.split("@");
  const [host, tld] = domain.split(".");

  return (
    <section
      id="contact"
      className="site-x flex min-h-screen flex-col justify-between gap-16 site-y pb-8"
    >
      <div className="my-auto flex flex-col items-center gap-6 text-center">
        <span className="site-caption">Contact</span>
        <a
          href={`mailto:${EMAIL}`}
          className="site-display break-all text-[clamp(36px,7.4vw,156px)] leading-[0.95] transition-colors duration-300"
        >
          {user.split(".").map((part, i) => (
            <span key={i}>
              {i > 0 && <span className="text-point">.</span>}
              {part}
            </span>
          ))}
          @{host}
          <span className="text-point">.</span>
          {tld}
        </a>
      </div>
      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] pt-6 font-mono text-xs text-dim">
        <span>© {new Date().getFullYear()} RAE APRIL. All rights reserved.</span>
        <span>Web Publisher · Seoul, KR</span>
        <a href="#top">Back to top ↑</a>
      </footer>
    </section>
  );
}

export default Contact;
