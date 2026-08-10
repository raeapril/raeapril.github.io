import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
];

function Nav() {
  // 현재 화면 중앙에 들어온 섹션 id (스크롤·클릭 이동 모두 반영)
  const [active, setActive] = useState("");
  const { pathname } = useLocation();

  // 라우트가 바뀌면(상세 → 홈 등) 섹션 DOM 이 새로 마운트되므로 옵저버를 재부착해야
  // active 하이라이트가 정상 동작한다. → pathname 을 deps 에 둔다.
  useEffect(() => {
    const sections = NAV_ITEMS.map((item) =>
      document.getElementById(item.id)
    ).filter(Boolean);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          } else if (
            entry.target.id === NAV_ITEMS[0].id &&
            entry.boundingClientRect.top > 0
          ) {
            // 첫 섹션이 밴드 아래(=히어로 구간)로 내려가면 활성 해제
            setActive("");
          }
        });
      },
      // 뷰포트 중앙의 얇은 밴드에 들어온 섹션만 활성
      { rootMargin: "-45% 0px -45% 0px" }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 text-ink">
      <nav className="container-x flex h-16 items-center justify-between md:h-20">
        <Link to="/" data-logo className="display text-lg tracking-[0.05em] md:text-xl">
          RAE<span className="text-accent text-[1.6em] leading-none">.</span>
        </Link>

        <div className="flex items-center gap-6 text-sm font-medium md:gap-8">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`/#${item.id}`}
              aria-current={active === item.id ? "true" : undefined}
              className={`transition-colors hover:text-accent ${
                active === item.id ? "text-accent" : ""
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}

export default Nav;
