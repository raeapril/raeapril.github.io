import flowerImg from "../assets/flower.jpg";

/**
 * 프로젝트 목록 — Work 리스트(components/Work.jsx)와 상세 페이지(WorkDetail.jsx)가 공유한다.
 * slug 로 상세 경로 `/work/:slug` 를 만든다.
 * 실제 프로젝트로 교체 시 title/tag/desc/thumb/slug 만 바꾸면 됨.
 */
export const PROJECTS = [
  {
    no: "N°01",
    slug: "totally-async",
    title: "Totally async",
    tag: "WEB / PUBLISHING",
    desc: "반응형 마크업과 시맨틱 구조로 구현한 웹 퍼블리싱. 디자인 의도를 픽셀 단위로 옮겼습니다.",
    thumb: flowerImg,
  },
  {
    no: "N°02",
    slug: "fixed-monthly-rate",
    title: "Fixed monthly rate",
    tag: "LANDING / INTERACTION",
    desc: "스크롤 인터랙션과 모션을 얹은 랜딩 페이지. 가볍고 매끄러운 사용자 경험에 집중했습니다.",
    thumb: flowerImg,
  },
  {
    no: "N°03",
    slug: "lightning-fast-delivery",
    title: "Lightning fast delivery",
    tag: "COMPONENT / SYSTEM",
    desc: "재사용 가능한 컴포넌트 시스템 설계. 유지보수와 확장성을 고려한 구조를 만들었습니다.",
    thumb: flowerImg,
  },
  {
    no: "N°04",
    slug: "workspace",
    title: "Workspace",
    tag: "APP / DASHBOARD",
    desc: "데이터 밀도가 높은 대시보드 UI 퍼블리싱. 정보 위계를 또렷하게 정리했습니다.",
    thumb: flowerImg,
  },
];

export const findProject = (slug) => PROJECTS.find((p) => p.slug === slug);
