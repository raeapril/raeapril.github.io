import { WORK as WORK_BASE } from "../data/work";

// 12컬럼 그리드에서 카드별 폭 (900px 이상). Tailwind JIT 가 읽도록 클래스 문자열을 그대로 둔다.
const SPAN_CLASS = [
  "min-[900px]:col-span-7",
  "min-[900px]:col-span-5",
  "min-[900px]:col-span-5",
  "min-[900px]:col-span-7",
  "min-[900px]:col-span-4",
  "min-[900px]:col-span-4",
  "min-[900px]:col-span-4",
];

export const WORK = WORK_BASE.map((w, i) => ({
  ...w,
  span: SPAN_CLASS[i] ?? "min-[900px]:col-span-4",
  chips: w.tag.split(" / "),
}));

export const ABOUT = [
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

export const SKILLS = [
  { name: "HTML", desc: "시맨틱 마크업" },
  { name: "CSS", desc: "반응형" },
  { name: "JavaScript", desc: "ES6+" },
  { name: "React", desc: "컴포넌트" },
  { name: "Tailwind CSS", desc: "유틸리티" },
  { name: "GSAP", desc: "모션" },
  { name: "Figma", desc: "시안 분석" },
  { name: "GitHub", desc: "버전 관리" },
];

export const EMAIL = "meerae.shin@gmail.com";
