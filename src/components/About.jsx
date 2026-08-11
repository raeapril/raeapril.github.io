import { useLayoutEffect, useRef, useState } from "react";
import SectionHeading from "./SectionHeading";

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
        <circle key={`${l.cx}-${l.cy}`} cx={l.cx} cy={l.cy} r="5" fill="currentColor" />
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
  // 현재 hover(또는 포커스)된 키워드 index. 기본은 첫 항목.
  const [active, setActive] = useState(0);
  const current = ABOUT_ITEMS[active];

  // 오른쪽 패널 내용을 활성 버튼과 같은 세로 위치에 맞추기 위한 offset
  const ulRef = useRef(null);
  const btnRefs = useRef([]);
  const [offset, setOffset] = useState(0);

  useLayoutEffect(() => {
    // md(768px) 미만(모바일)에서는 세로로 쌓이므로 정렬 offset 을 끈다.
    const mq = window.matchMedia("(min-width: 768px)");

    const update = () => {
      const btn = btnRefs.current[active];
      const ul = ulRef.current;
      if (mq.matches && btn && ul) {
        setOffset(
          btn.getBoundingClientRect().top - ul.getBoundingClientRect().top
        );
      } else {
        setOffset(0);
      }
    };

    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [active]);

  return (
    <section id="about" className="container-x scroll-mt-24 pb-24 md:pb-36">
      <SectionHeading eyebrow="ABOUT">
        하는 일,
        <br />
        잘하는 일<span className="text-accent">.</span>
      </SectionHeading>

      <div className="mt-12 grid gap-6 md:grid-cols-[4fr_6fr] md:gap-12">
        {/* 왼쪽: 키워드 목록 */}
        <ul ref={ulRef} className="flex flex-col">
          {ABOUT_ITEMS.map((item, i) => (
            <li key={item.no}>
              <button
                type="button"
                ref={(el) => (btnRefs.current[i] = el)}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                aria-pressed={active === i}
                className="flex w-full items-center gap-4 py-2 text-left transition-colors md:py-4"
              >
                <Shape
                  className={`h-5 w-5 shrink-0 transition-colors md:h-6 md:w-6 ${
                    active === i ? "text-accent" : "text-ink/40"
                  }`}
                />
                <span
                  className={`display text-2xl transition-colors md:text-4xl ${
                    active === i ? "text-ink" : "text-ink/40"
                  }`}
                >
                  {item.title}
                </span>
                {/* 타이틀과 넘버를 이어주는 선 (호버 시 우측으로 그어짐) */}
                <span
                  className={`ml-2 hidden h-px flex-1 origin-left bg-accent transition-transform duration-500 ease-out md:block ${
                    active === i ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </button>
            </li>
          ))}
        </ul>

        {/* 오른쪽: 선택된 키워드 설명 패널 (활성 버튼과 같은 세로 위치에 정렬) */}
        <div className="relative min-h-[16rem]">
          <div
            className="transition-transform duration-500 ease-out"
            style={{ transform: `translateY(${offset}px)` }}
          >
            <span className="display text-5xl text-accent/20 md:text-6xl">
              {current.no}
            </span>
            <p className="mt-4 text-lg font-semibold md:text-xl">
              {current.lead}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-ink/60 md:text-base">
              {current.desc}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
