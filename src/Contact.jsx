import { Link } from "react-router-dom";
import Reveal from "./components/Reveal";

// TODO: 본인 정보로 교체하세요.
const EMAIL = "your.email@example.com";
const CHANNELS = [
  { label: "Email", value: EMAIL, href: `mailto:${EMAIL}` },
  { label: "GitHub", value: "github.com/raeapril", href: "https://github.com/raeapril" },
  { label: "Instagram", value: "@your_id", href: "#" },
];

function Contact() {
  return (
    <main className="container-x min-h-screen pb-32 pt-36 md:pt-48">
      <Reveal>
        <p className="eyebrow mb-6">Contact</p>
        <h1 className="display max-w-4xl text-5xl md:text-8xl">
          같이 일해요<span className="text-accent">.</span>
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted">
          새 프로젝트, 협업, 혹은 그냥 인사도 환영해요.
          <br />
          편한 채널로 연락 주세요. 보통 하루 안에 답장합니다.
        </p>
      </Reveal>

      <Reveal delay={150}>
        <ul className="mt-16 border-t border-line">
          {CHANNELS.map((c) => (
            <li key={c.label}>
              <a
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="group flex items-center justify-between border-b border-line py-6 transition-colors"
              >
                <span className="text-sm font-semibold uppercase tracking-wide text-muted">
                  {c.label}
                </span>
                <span className="display text-xl transition-colors group-hover:text-accent md:text-3xl">
                  {c.value}
                  <span className="ml-3 inline-block transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal delay={250}>
        <div className="mt-16">
          <Link to="/" className="btn btn-ghost">
            ← 홈으로
          </Link>
        </div>
      </Reveal>
    </main>
  );
}

export default Contact;
