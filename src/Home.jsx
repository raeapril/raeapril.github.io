import { Link } from "react-router-dom";
import Reveal from "./components/Reveal";
import ScrollScale from "./components/ScrollScale";
import Hero from "./components/Hero";

/* ------------------------------------------------------------------ */
/*  데이터: 본인 내용으로 자유롭게 교체하세요.                          */
/* ------------------------------------------------------------------ */

const SKILLS = [
  "HTML",
  "CSS / SCSS",
  "JavaScript",
  "React",
  "Tailwind",
  "Accessibility",
  "Responsive",
  "Web Animation",
  "Design System",
  "Git",
];

const SERVICES = [
  {
    no: "01",
    title: "Markup & Semantics",
    desc: "시맨틱하고 검색에 강한 구조. 유지보수하기 좋은 마크업을 짭니다.",
  },
  {
    no: "02",
    title: "Responsive Layout",
    desc: "모바일부터 와이드까지, 어떤 화면에서도 깨지지 않는 반응형 레이아웃.",
  },
  {
    no: "03",
    title: "Interaction & Motion",
    desc: "과하지 않게, 의미 있게. 사용 흐름을 돕는 인터랙션과 모션.",
  },
  {
    no: "04",
    title: "Accessibility",
    desc: "모두가 쓸 수 있게. 키보드·스크린리더·대비를 고려한 접근성.",
  },
  {
    no: "05",
    title: "Design System",
    desc: "재사용 가능한 컴포넌트와 토큰으로 일관된 UI를 설계합니다.",
  },
  {
    no: "06",
    title: "Performance",
    desc: "가볍고 빠르게. 이미지·폰트·렌더링을 최적화합니다.",
  },
];

// TODO: 이미지(image)를 본인 작업물 스크린샷으로 교체하세요.
// 지금은 picsum.photos placeholder 라 스크롤 줌 효과를 바로 볼 수 있습니다.
const WORKS = [
  {
    title: "Brand Landing",
    tags: ["Publishing", "Animation"],
    year: "2026",
    href: "#",
    image: "https://picsum.photos/seed/raework-brand/900/680",
  },
  {
    title: "Commerce UI",
    tags: ["React", "Design System"],
    year: "2025",
    href: "#",
    image: "https://picsum.photos/seed/raework-commerce/900/680",
  },
  {
    title: "Editorial Site",
    tags: ["Responsive", "Accessibility"],
    year: "2025",
    href: "#",
    image: "https://picsum.photos/seed/raework-editorial/900/680",
  },
  {
    title: "Interactive Promo",
    tags: ["Motion", "JavaScript"],
    year: "2024",
    href: "#",
    image: "https://picsum.photos/seed/raework-promo/900/680",
  },
];

/* ------------------------------------------------------------------ */

function Home() {
  return (
    <main>
      {/* ---------------- HERO (스크롤 고정 + 방사형 사진) ---------------- */}
      <Hero />

      {/* ---------------- INTRO 카피 ---------------- */}
      <section className="container-x py-20 md:py-28">
        <Reveal>
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <p className="max-w-xl text-lg leading-relaxed text-muted md:text-2xl">
              픽셀 하나까지 신경 쓰는 퍼블리셔.
              <br />
              접근성과 인터랙션을 함께 고민하며,
              <br />
              디자인을 깔끔한 코드로 옮깁니다.
            </p>

            <div className="flex flex-wrap gap-3">
              <a href="#work" className="btn btn-solid">
                작업 보기
              </a>
              <Link to="/contact" className="btn btn-ghost">
                연락하기
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ---------------- SKILL MARQUEE ---------------- */}
      <section data-nav="dark" className="border-y border-line bg-ink py-5 text-paper">
        <div className="flex select-none overflow-hidden">
          <div className="animate-marquee flex shrink-0 items-center gap-8 pr-8 text-2xl font-bold tracking-tightest md:text-3xl">
            {[...SKILLS, ...SKILLS].map((skill, i) => (
              <span key={i} className="flex items-center gap-8">
                {skill}
                <span className="text-accent">✦</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- WHAT I DO ---------------- */}
      <section id="about" className="container-x scroll-mt-24 py-24 md:py-36">
        <div className="grid gap-12 md:grid-cols-[1fr_2fr] md:gap-20">
          <Reveal>
            <p className="eyebrow mb-4">What I do</p>
            <h2 className="display text-4xl leading-[1.4] md:text-5xl md:leading-[1.4]">
              하는 일,
              <br />
              잘하는 일.
            </h2>
          </Reveal>

          <div className="grid gap-x-12 gap-y-12 sm:grid-cols-2">
            {SERVICES.map((s, i) => (
              <Reveal key={s.no} delay={i * 80}>
                <div className="group border-t border-line pt-5">
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-xl font-bold transition-colors group-hover:text-accent">
                      {s.title}
                    </h3>
                    <span className="text-sm font-semibold text-muted">{s.no}</span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- SELECTED WORK ---------------- */}
      <section id="work" data-nav="dark" className="bg-ink scroll-mt-24 py-24 text-paper md:py-36">
        <div className="container-x">
          <Reveal>
            <div className="mb-14 flex items-end justify-between">
              <div>
                <p className="eyebrow mb-4 text-muted">Selected work</p>
                <h2 className="display text-4xl leading-[1.4] md:text-5xl md:leading-[1.4]">최근 작업</h2>
              </div>
              <span className="hidden text-sm text-muted sm:block">
                ({String(WORKS.length).padStart(2, "0")})
              </span>
            </div>
          </Reveal>

          <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2">
            {WORKS.map((w, i) => (
              <Reveal key={w.title} delay={(i % 2) * 120}>
                <a href={w.href} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-paper/5">
                    <ScrollScale className="h-full w-full" from={1.05} to={1.3}>
                      <img
                        src={w.image}
                        alt={w.title}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </ScrollScale>
                    {/* 호버 시 살짝 어두워지는 오버레이 */}
                    <div className="pointer-events-none absolute inset-0 bg-ink/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <span className="pointer-events-none absolute left-5 top-4 display text-5xl text-paper/30 mix-blend-overlay md:text-6xl">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="mt-5 flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-bold transition-colors group-hover:text-accent">
                        {w.title}
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {w.tags.map((t) => (
                          <span
                            key={t}
                            className="rounded-full border border-paper/20 px-3 py-1 text-xs text-paper/70"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-muted">{w.year}</span>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
