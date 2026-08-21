import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading from "./SectionHeading";
import flowerImg from "../assets/flower_4.jpg";

gsap.registerPlugin(ScrollTrigger);

// 키워드마다 번갈아 쓰는 3개 폰트: Playfair Display · Montserrat · Inter
const FONTS = [
  "font-['Playfair_Display']",
  "font-['Montserrat']",
  "font-['Inter']",
];

const SKILLS = [
  { name: "HTML", desc: "시맨틱 마크업" },
  { name: "CSS", desc: "반응형" },
  { name: "JavaScript", desc: "ES6+" },
  { name: "React", desc: "컴포넌트" },
  { name: "Tailwind CSS", desc: "유틸리티" },
  { name: "GSAP", desc: "모션" },
  { name: "Figma", desc: "시안 분석" },
  { name: "GitHub", desc: "버전 관리" },
];

/**
 * SKILLS — 좌측 타이틀(sticky 고정) + 우측 스킬 이름 리스트.
 * 좌측 헤딩이 화면에 고정된 채, 우측 스킬 목록이 세로로 스크롤되며 지나간다.
 * 각 항목은 진입 시 페이드 업.
 */
function Skills() {
  const rootRef = useRef(null);
  const headingRef = useRef(null);
  const imgRef = useRef(null);
  const itemsRef = useRef([]);

  // 스크롤 인입 시 — About 과 동일한 시퀀스(하나의 타임라인).
  //  ① eyebrow(SKILLS) 도로록 → ② 도로록 끝난 뒤 title 슬라이드 + 콘텐츠(이미지·키워드) 페이드가 "동시" 시작.
  //  (콘텐츠는 위치 변화·시간차 없이 opacity 0→1)
  useLayoutEffect(() => {
    const h = headingRef.current;
    if (!h) return;
    const content = [imgRef.current, ...itemsRef.current.filter(Boolean)];

    const ctx = gsap.context(() => {
      gsap.set(h.letters, { yPercent: 100 });
      gsap.set(h.title, { y: 40, opacity: 0 });
      gsap.set(content, { autoAlpha: 0 });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
          defaults: { ease: "power3.out" },
        })
        .to(h.letters, { yPercent: 0, duration: 0.5, stagger: 0.06 })
        .to(h.title, { y: 0, opacity: 1, duration: 0.7 }, ">")
        .to(content, { autoAlpha: 1, duration: 0.6 }, "<");
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="skills" ref={rootRef} className="container-x">
      <div className="grid gap-10 md:grid-cols-2 md:gap-16 lg:gap-24">
        {/* 왼쪽 — sticky 고정 타이틀 */}
        <div className="md:sticky md:top-24 md:flex md:h-[calc(100vh-12rem)] md:flex-col">
          <SectionHeading eyebrow="SKILLS" exposeRef={headingRef}>
            다룰 수 있는
            <br className="hidden md:block" />
            기술<span className="text-accent">.</span>
          </SectionHeading>
          {/* 이미지 — 타이틀 뒤 서서히 등장 */}
          <img
            ref={imgRef}
            src={flowerImg}
            alt=""
            className="mt-6 aspect-[3/1] w-full object-cover md:mt-8"
          />
        </div>

        {/* 오른쪽 — 스킬 이름 리스트 */}
        <ul className="flex flex-col  border-b border-line">
          {SKILLS.map((skill, i) => (
            <li
              key={skill.name}
              ref={(el) => (itemsRef.current[i] = el)}
              className="flex items-baseline justify-between gap-4 border-t border-line py-6 md:py-8"
            >
              <h3
                className={`${FONTS[i % FONTS.length]} text-3xl font-bold uppercase tracking-tight md:text-5xl`}
              >
                {skill.name}
              </h3>
              <span className="shrink-0 text-right text-xs text-muted md:text-sm">
                {skill.desc}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Skills;
