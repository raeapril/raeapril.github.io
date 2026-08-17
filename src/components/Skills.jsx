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
  { name: "HTML", desc: "시맨틱 마크업 · 반응형" },
  { name: "CSS", desc: "시맨틱 마크업 · 반응형" },
  { name: "JavaScript", desc: "ES6+ · DOM · 인터랙션" },
  { name: "React", desc: "컴포넌트 · 훅 · SPA" },
  { name: "Tailwind CSS", desc: "유틸리티 · 디자인 토큰" },
  { name: "GSAP", desc: "스크롤 · 모션" },
  { name: "Figma", desc: "시안 분석 · 핸드오프" },
  { name: "GitHub", desc: "버전 관리 · 협업" },
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

  // 스크롤 인입 시: ① 타이틀 → ② 아래 이미지 서서히 등장 → ③ 오른쪽 키워드들.
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
        defaults: { ease: "power3.out" },
      });
      tl.from(headingRef.current, { autoAlpha: 0, y: 30, duration: 0.6 })
        .from(imgRef.current, { autoAlpha: 0, y: 24, duration: 0.8 }, "-=0.15")
        .from(
          itemsRef.current.filter(Boolean),
          { autoAlpha: 0, y: 40, duration: 0.5, stagger: 0.1 },
          "-=0.3"
        );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="skills" ref={rootRef} className="container-x pb-28 md:pb-38">
      <div className="grid gap-10 md:grid-cols-2 md:gap-16 lg:gap-24">
        {/* 왼쪽 — sticky 고정 타이틀 */}
        <div className="md:sticky md:top-24 md:flex md:h-[calc(100vh-12rem)] md:flex-col">
          <div ref={headingRef}>
            <SectionHeading eyebrow="SKILLS">
              다룰 수 있는
              <br className="hidden md:block" />
              기술<span className="text-accent">.</span>
            </SectionHeading>
          </div>
          {/* 이미지 — 타이틀 뒤 서서히 등장 */}
          <img
            ref={imgRef}
            src={flowerImg}
            alt=""
            className="mt-6 aspect-[3/1] w-full object-cover md:mt-8"
          />
        </div>

        {/* 오른쪽 — 스킬 이름 리스트 */}
        <ul className="flex flex-col">
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
