import { Link } from "react-router-dom";
import Reveal from "./components/Reveal";
import Hero from "./components/Hero";

/* ------------------------------------------------------------------ */
/*  데이터: 본인 내용으로 자유롭게 교체하세요.                          */
/* ------------------------------------------------------------------ */
const EMAIL = "meerae.shin@gmail.com";

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

/* ------------------------------------------------------------------ */

function Home() {
  return (
    <main>
      {/* ---------------- HERO (스크롤 고정 + 방사형 사진) ---------------- */}
      <Hero />

      {/* ---------------- ABOUT ---------------- */}
      <section id="about" className="container-x scroll-mt-24 py-24 md:py-36">
        <div className="grid gap-12 md:grid-cols-[1fr_2fr] md:gap-20">
          <Reveal>
            <p className="eyebrow mb-4">ABOUT</p>
            <h2 className="display text-4xl leading-[1.2] md:text-5xl md:leading-[1.2]">
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

      {/* ---------------- WORK ---------------- */}
      <section id="work" className="container-x scroll-mt-24 py-24 md:py-36">
        <div className="grid gap-12 md:grid-cols-[1fr_2fr] md:gap-20">
          <Reveal>
            <p className="eyebrow mb-4">WORK</p>
            <h2 className="display text-4xl leading-[1.2] md:text-5xl md:leading-[1.2]">
              참여한 작업
            </h2>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

export default Home;
