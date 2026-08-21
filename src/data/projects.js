import flowerImg from "../assets/flower.jpg";

/**
 * 프로젝트 목록 — Work 리스트(components/Work.jsx)에서 사용한다.
 * 카드 클릭 시 link(실제 서비스 URL)로 새 탭 이동한다. ← "#" 는 임시값이니 실제 주소로 교체할 것.
 * 실제 프로젝트로 교체 시 title/tag/desc/thumb/link 만 바꾸면 됨.
 */
export const PROJECTS = [
  {
    no: "N°01",
    slug: "rz",
    title: "[LG화학] 알지?",
    tag: "APP / 기여도 90%",
    desc: "앱 접근성 인증 마크 획득",
    thumb: flowerImg,
    link: "#",
  },
  {
    no: "N°02",
    slug: "bankit",
    title: "[은행연합회] 뱅크잇",
    tag: "WEB,APP / 기여도 90%",
    desc: "웹/앱 접근성 인증 마크 획득",
    thumb: flowerImg,
    link: "#",
  },
  {
    no: "N°03",
    slug: "jigu",
    title: "[GS칼텍스] 지구톡톡",
    tag: "WEB / 기여도 100%",
    desc: "GDWEB 디자인 어워드 수상",
    thumb: flowerImg,
    link: "#",
  },
  {
    no: "N°04",
    slug: "msafer",
    title: "[과학기술정보통신부] Msafer",
    tag: "WEB / 기여도 100%",
    desc: "공공 서비스 구축",
    thumb: flowerImg,
    link: "#",
  },
  {
    no: "N°05",
    slug: "calb",
    title: "[기부플랫폼] CLAB",
    tag: "WEB / 기여도 80%",
    desc: "프론트엔드 UI 개발 기여",
    thumb: flowerImg,
    link: "#",
  },
  {
    no: "N°06",
    slug: "happy",
    title: "[네이버] 해피빈",
    tag: "WEB / 기여도 100%",
    desc: "다양한 동적 인터랙션 구현",
    thumb: flowerImg,
    link: "#",
  }
];

export const findProject = (slug) => PROJECTS.find((p) => p.slug === slug);
