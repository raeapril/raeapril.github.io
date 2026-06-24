import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// 라우트가 바뀔 때마다 페이지 맨 위로 이동
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default ScrollToTop;
