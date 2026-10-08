import { useRef } from "react";
import SectionHeading from "./SectionHeading";
import { useHeadingReveal } from "../hooks/useHeadingReveal";
import flowerImg from "../assets/flower_4.jpg";

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

function Skills() {
  const rootRef = useRef(null);
  const headingRef = useRef(null);
  const imgRef = useRef(null);
  const itemsRef = useRef([]);

  useHeadingReveal(
    headingRef,
    () => [imgRef.current, ...itemsRef.current],
    { triggerRef: rootRef, start: "top 70%" }
  );

  return (
    <section id="skills" ref={rootRef} className="container-x">
      <div className="grid gap-10 md:grid-cols-2 md:gap-16 lg:gap-24">
        {/* 왼쪽 고정 타이틀 */}
        <div className="md:sticky md:top-24 md:self-start">
          <SectionHeading eyebrow="SKILLS" exposeRef={headingRef}>
            다룰 수 있는
            <br className="hidden md:block" />
            기술<span className="text-accent">.</span>
          </SectionHeading>
          <img
            ref={imgRef}
            src={flowerImg}
            alt=""
            className="mt-6 aspect-[3/1] w-full object-cover md:mt-8"
          />
        </div>

        {/* 오른쪽 스킬 이름 */}
        <ul className="flex flex-col border-b border-line">
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
