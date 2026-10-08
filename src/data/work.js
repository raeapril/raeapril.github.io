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
    no: "N°01",
    title: "[LG화학] 알지?",
    tag: "APP / 기여도 90%",
    desc: "앱 접근성 인증 마크 획득",
    thumb: rzImg,
    thumbMobile: rzImgMo,
    thumbClover: rzImgSq,
    link: "https://play.google.com/store/apps/details?id=com.lgchem.rz",
  },
  {
    no: "N°02",
    title: "[은행연합회] 뱅크잇",
    tag: "WEB,APP / 기여도 90%",
    desc: "웹/앱 접근성 인증 마크 획득",
    thumb: bankitImg,
    thumbMobile: bankitImgMo,
    thumbClover: bankitImgSq,
    link: "https://bankit.kr/",
  },
  {
    no: "N°03",
    title: "[GS칼텍스] 지구톡톡",
    tag: "WEB / 기여도 100%",
    desc: "GDWEB 디자인 어워드 수상",
    thumb: jigutImg,
    thumbMobile: jigutImgMo,
    thumbClover: jigutImgSq,
    link: "https://jigutoktok.causeworks.kr/",
  },
  {
    no: "N°04",
    title: "[과학기술정보통신부] Msafer",
    tag: "WEB / 기여도 100%",
    desc: "공공 서비스 구축",
    thumb: msaferImg,
    thumbMobile: msaferImgMo,
    thumbClover: msaferImgSq,
    link: "https://www.msafer.or.kr/index.do",
  },
  {
    no: "N°05",
    title: "[기부플랫폼] CLAB",
    tag: "WEB / 기여도 80%",
    desc: "프론트엔드 UI 개발 기여",
    thumb: clabImg,
    thumbMobile: clabImgMo,
    thumbClover: clabImgSq,
    link: "https://clab.iba.or.kr/",
  },
  {
    no: "N°06",
    title: "[네이버 해피빈] 법무부",
    tag: "WEB / 기여도 100%",
    desc: "다양한 동적 인터랙션 구현",
    thumb: mojImg,
    thumbMobile: mojImgMo,
    thumbClover: mojImgSq,
    link: "https://happybean.naver.com/campaign/legalsupport2025",
  },
  {
    no: "N°07",
    title: "[네이버 해피빈] 환경부",
    tag: "WEB / 기여도 100%",
    desc: "다양한 동적 인터랙션 구현",
    thumb: etechhiveImg,
    thumbMobile: etechhiveImgMo,
    thumbClover: etechhiveImgSq,
    link: "https://happybean.naver.com/campaign/greencluster",
  }
];

// 태그 문자열("WEB / 기여도 100%")을 칩 배열로
export const WORK = PROJECTS.map((w) => ({ ...w, chips: w.tag.split(" / ") }));
