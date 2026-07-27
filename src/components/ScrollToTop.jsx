import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// 라우트 변경 + 새로고침 시 항상 페이지 맨 위로 이동
function ScrollToTop() {
  const { pathname } = useLocation();

  // 새로고침 때 브라우저가 이전 스크롤 위치를 복원하지 않도록(항상 최상단)
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default ScrollToTop;
