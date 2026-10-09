import rzImg from "../assets/rz.jpg";
import bankitImg from "../assets/bankit.jpg";
import jigutImg from "../assets/jigu.jpg";
import msaferImg from "../assets/msafer.jpg";
import clabImg from "../assets/clab.jpg";
import mojImg from "../assets/moj.jpg";
import etechhiveImg from "../assets/etechhive.jpg";

import rzImgMo from "../assets/rz_mo.jpg";
import bankitImgMo from "../assets/bankit_mo.jpg";
import jigutImgMo from "../assets/jigu_mo.jpg";
import msaferImgMo from "../assets/msafer_mo.jpg";
import clabImgMo from "../assets/clab_mo.jpg";
import mojImgMo from "../assets/moj_mo.jpg";
import etechhiveImgMo from "../assets/etechhive_mo.jpg";

// 데스크톱 호버 시 3D 유리 클로버 안에 들어가는 1:1 썸네일 (없으면 thumbMobile 을 가운데 정사각형으로 잘라 씀)
import rzImgSq from "../assets/rz_sq.jpg";
import bankitImgSq from "../assets/bankit_sq.jpg";
import jigutImgSq from "../assets/jigu_sq.jpg";
import msaferImgSq from "../assets/msafer_sq.jpg";
import clabImgSq from "../assets/clab_sq.jpg";
import mojImgSq from "../assets/moj_sq.jpg";
import etechhiveImgSq from "../assets/etechhive_sq.jpg";

const PROJECTS = [
  {
    id: "rz",
    client: "LG화학",
    name: "알지?",
    platform: "APP",
    contrib: 100,
    desc: "앱 접근성 인증 마크 획득",
    thumb: rzImg,
    thumbMobile: rzImgMo,
    thumbClover: rzImgSq,
    link: "https://play.google.com/store/apps/details?id=com.lgchem.rz",
    period: "2024.07 ~ 2024.10",
    role: "웹앱 퍼블리싱",
    overview: "LG화학 '알지(rz)' 앱 리뉴얼에서 앱 안에 들어가는 모바일 웹 뷰를 구현했습니다.",
    features: ["HTML5", "CSS3", "JavaScript", "Web View", "KWCAG"],
    process: [
      { t: "모바일 웹 뷰 구현", d: "HTML5, CSS3, JavaScript를 활용한 모바일 최적화 웹 뷰(Web View) UI 구현" },
      { t: "접근성 품질인증", d: "웹/앱 접근성 지침(KWCAG)을 엄격히 준수한 시맨틱 마크업 및 대체 텍스트 적용으로 웹/앱 접근성 품질인증 마크 획득 기여" },
    ],
  },
  {
    id: "bankit",
    client: "은행연합회",
    name: "뱅크잇",
    platform: "WEB, APP",
    contrib: 90,
    desc: "웹/앱 접근성 인증 마크 획득",
    thumb: bankitImg,
    thumbMobile: bankitImgMo,
    thumbClover: bankitImgSq,
    link: "https://bankit.kr/",
    period: "2025.03 ~ 2025.06",
    role: "웹 퍼블리싱",
    overview: "은행연합회 '뱅크잇' 리뉴얼에서 금융권 사이트에 맞는 안정적인 UI 마크업을 맡았습니다.",
    features: ["크로스 브라우징", "스크린 리더", "명도 대비", "웹 접근성(WA)"],
    process: [
      { t: "금융권 UI 마크업", d: "금융권 웹사이트 특성에 맞춘 크로스 브라우징 및 시각적 안정성을 보장하는 UI 마크업" },
      { t: "웹 접근성 인증", d: "스크린 리더 호환성 및 명도 대비 등을 고려한 마크업 최적화로 웹 접근성(WA) 인증 마크 획득" },
    ],
  },
  {
    id: "jigu",
    client: "GS칼텍스",
    name: "지구톡톡",
    platform: "WEB",
    contrib: 100,
    desc: "GDWEB 디자인 어워드 수상",
    thumb: jigutImg,
    thumbMobile: jigutImgMo,
    thumbClover: jigutImgSq,
    link: "https://jigutoktok.causeworks.kr/",
    period: "2023.10 ~ 2023.11",
    role: "반응형 웹 퍼블리싱",
    overview: "GS칼텍스 '지구톡톡'의 반응형 웹사이트를 구축했습니다.",
    features: ["HTML5", "CSS3", "JavaScript (ES6+)", "반응형 웹", "GDWEB"],
    process: [
      { t: "반응형 웹 구축", d: "HTML5, CSS3, JavaScript(ES6+)를 활용하여 다양한 디바이스 환경에 대응하는 반응형 웹사이트 구축" },
      { t: "UI · 인터랙션", d: "시각적 완성도 높은 UI와 부드러운 인터랙션 구현을 통해 지디웹(GDWEB) 디자인 어워드 수상 달성" },
    ],
  },
  {
    id: "msafer",
    client: "과학기술정보통신부",
    name: "Msafer",
    platform: "WEB",
    contrib: 100,
    desc: "공공 서비스 구축",
    thumb: msaferImg,
    thumbMobile: msaferImgMo,
    thumbClover: msaferImgSq,
    link: "https://www.msafer.or.kr/index.do",
    period: "2025.10 ~ 2025.12",
    role: "웹 퍼블리싱",
    overview: "엠세이퍼(M-Safer) 웹 리뉴얼에서 레거시 코드를 웹 표준에 맞게 개편했습니다.",
    features: ["HTML5", "CSS3", "jQuery", "리팩토링", "웹 표준"],
    process: [
      { t: "레거시 리팩토링", d: "HTML5, CSS3, jQuery를 활용한 기존 레거시 코드 리팩토링 및 웹 표준 준수 마크업 개편" },
      { t: "정보 구조 · 폼 개선", d: "복잡한 정보 구조와 폼(Form) 요소의 레이아웃을 개선하여 사용자 편의성 증대" },
    ],
  },
  {
    id: "clab",
    client: "기부플랫폼",
    name: "CLAB",
    platform: "WEB",
    contrib: 80,
    desc: "프론트엔드 UI 개발 기여",
    thumb: clabImg,
    thumbMobile: clabImgMo,
    thumbClover: clabImgSq,
    link: "https://clab.iba.or.kr/",
    period: "2026.01 ~ 2026.03",
    role: "웹 퍼블리싱 및 프론트엔드 개발",
    overview: "기부 플랫폼 CLAB에서 웹 UI 마크업부터 프론트엔드 로직까지 맡았습니다.",
    features: ["HTML", "CSS", "JavaScript", "Java", "MySQL", "View 템플릿"],
    process: [
      { t: "UI 마크업 · 스타일링", d: "전반적인 웹 UI 마크업 및 스타일링 수행" },
      { t: "프론트엔드 개발", d: "Java 및 MySQL 환경에 대한 이해를 바탕으로, 뷰(View) 템플릿 데이터 연동 및 클라이언트 사이드 스크립트(JavaScript) 로직 처리 등 프론트엔드 업무 수행" },
    ],
  },
  {
    id: "moj",
    client: "네이버 해피빈 · 법무부",
    name: "법무부",
    platform: "WEB",
    contrib: 100,
    desc: "다양한 동적 인터랙션 구현",
    thumb: mojImg,
    thumbMobile: mojImgMo,
    thumbClover: mojImgSq,
    link: "https://happybean.naver.com/campaign/legalsupport2025",
    role: "웹 퍼블리싱",
  },
  {
    id: "etechhive",
    client: "네이버 해피빈 · 환경부",
    name: "환경부",
    platform: "WEB",
    contrib: 100,
    desc: "다양한 동적 인터랙션 구현",
    thumb: etechhiveImg,
    thumbMobile: etechhiveImgMo,
    thumbClover: etechhiveImgSq,
    link: "https://happybean.naver.com/campaign/greencluster",
    role: "웹 퍼블리싱",
  },
];

const pad2 = (n) => String(n).padStart(2, "0");

// 목록(Work)·상세(project.html) 공통으로 쓰는 파생 필드를 붙인다
export const WORK = PROJECTS.map((w, i) => ({
  ...w,
  no: `N°${pad2(i + 1)}`,
  // "[네이버 해피빈] 법무부" — 클라이언트의 첫 토막만 대괄호로
  title: `[${w.client.split(" · ")[0]}] ${w.name}`,
  chips: [w.platform, `기여도 ${w.contrib}%`],
  href: `/project.html#${w.id}`,
  overview: w.overview ?? "",
  features: w.features ?? [],
  process: (w.process ?? []).map((s, j) => ({ ...s, n: pad2(j + 1) })),
}));
