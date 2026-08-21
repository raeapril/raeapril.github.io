import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading from "./SectionHeading";

gsap.registerPlugin(ScrollTrigger);

// item.title 앞에 붙는 네잎 클로버 도형 (겹쳐진 원형 잎 4개)
function Shape({ className }) {
  const leaves = [
    { cx: 12, cy: 7 },
    { cx: 12, cy: 17 },
    { cx: 7, cy: 12 },
    { cx: 17, cy: 12 },
  ];
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden={true}>
      {leaves.map((l) => (
        <circle
          key={`${l.cx}-${l.cy}`}
          cx={l.cx}
          cy={l.cy}
          r="5"
          fill="currentColor"
          fillOpacity={0.5}
        />
      ))}
    </svg>
  );
}

const ABOUT_ITEMS = [
  {
    no: "01",
    title: "Pixel-Perfect",
    lead: "디자인을 생동감 있는 웹으로 번역합니다.",
    desc: "Figma, Zeplin 등의 디자인 시안을 픽셀 단위로 꼼꼼하게 분석하고, 웹 브라우저 상에 오차 없이 정확하게 구현해 냅니다.",
  },
  {
    no: "02",
    title: "Responsive",
    lead: "모든 기기에서 유연한 화면을 만듭니다.",
    desc: "PC, 태블릿, 모바일 등 다양한 화면 크기에 자연스럽게 대응하는 '반응형 웹'을 구축하여 일관된 사용자 경험(UX)을 제공합니다.",
  },
  {
    no: "03",
    title: "Accessibility",
    lead: "모두를 포용하는 다정한 웹, 접근성과 표준을 지킵니다.",
    desc: "마우스를 쓸 수 없거나 화면을 볼 수 없는 사용자도 배려합니다. 웹 표준을 엄격히 지키고 뼈대가 튼튼한 시맨틱 문서를 작성하여, 시각적인 화려함 이면에 숨겨진 '진짜 완성도'를 높입니다.",
  },
  {
    no: "04",
    title: "Interaction",
    lead: "정적인 화면에 인터랙션으로 생기를 더합니다.",
    desc: "단순히 화면을 그리는 것을 넘어, JavaScript와 CSS 애니메이션을 활용해 사용자에게 직관적이고 즐거운 동적 경험을 불어넣습니다.",
  },
];

function About() {
  const headingRef = useRef(null); // SectionHeading 이 노출하는 { root, letters, title }
  const cardsRef = useRef([]);

  // 하나의 타임라인으로 About 등장 시퀀스를 구성한다.
  //  ① eyebrow(ABOUT) 도로록 → ② 도로록이 끝난 뒤 title 슬라이드 + 카드 페이드가 "동시" 시작.
  //  (카드는 위치 변화·시간차 없이 opacity 0→1)
  useLayoutEffect(() => {
    const h = headingRef.current;
    if (!h) return;
    const cards = cardsRef.current.filter(Boolean);

    const ctx = gsap.context(() => {
      gsap.set(h.letters, { yPercent: 100 });
      gsap.set(h.title, { y: 40, opacity: 0 });
      gsap.set(cards, { autoAlpha: 0 });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: h.root,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
          defaults: { ease: "power3.out" },
        })
        // ① 도로록
        .to(h.letters, { yPercent: 0, duration: 0.5, stagger: 0.06 })
        // ② 도로록 끝난 뒤(">") title 시작
        .to(h.title, { y: 0, opacity: 1, duration: 0.7 }, ">")
        // 같은 시점("<")에 카드 전체를 opacity 만 페이드 인
        .to(cards, { autoAlpha: 1, duration: 0.6 }, "<");
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" className="container-x pb-28 md:pb-38">
      <SectionHeading eyebrow="ABOUT" exposeRef={headingRef}>
        하는 일,
        <br className="hidden md:block" />
        잘하는 일<span className="text-accent">.</span>
      </SectionHeading>

      <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 md:mt-16">
        {ABOUT_ITEMS.map((item, i) => (
          <li
            key={item.no}
            ref={(el) => (cardsRef.current[i] = el)}
            className="relative flex flex-col"
          >
            {/* 카드 안 내용 */}
            <div className="relative">
              <div className="flex items-center gap-2">
                {/* 클로버 */}
                <div className="flex items-center gap-3">
                  <Shape className="block h-[27px] w-[27px] shrink-0 text-accent md:h-9 md:w-9" />
                </div>
                {/* 타이틀 */}
                <h3 className="display text-2xl tracking-tight md:text-3xl">
                  {item.title}
                </h3>
              </div>
              <p className="mt-1 text-base font-semibold md:mt-3">{item.lead}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink/60 md:mt-3">
                {item.desc}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default About;
