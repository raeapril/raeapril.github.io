import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * 섹션 공통 헤딩. 섹션이 뷰포트에 인입하면
 *  - eyebrow(영문): 글자마다 마스크 안에서 아래→위로 한 글자씩 순차로 올라옴('도로록')
 *  - title(h2): 아래에서 위로 슬라이드 + 페이드 인
 * 역스크롤로 섹션을 벗어나면 애니메이션이 역재생된다(toggleActions).
 * (clip-path/width 는 GSAP 에서 스냅되기 쉬워 transform 으로 구현)
 *
 * exposeRef: (선택) 넘기면 자체 애니를 만들지 않고 { root, letters, title } 타깃만
 *  ref 로 노출한다. 부모가 콘텐츠까지 묶어 하나의 타임라인으로 직접 구성하고 싶을 때 사용.
 *  (부모의 useLayoutEffect 는 자식보다 나중에 실행 → 형제 ref 까지 모두 준비된 뒤 동작)
 */
function SectionHeading({ eyebrow, children, className = "", exposeRef = null }) {
  const rootRef = useRef(null);
  const letterRefs = useRef([]);
  const titleRef = useRef(null);
  const letters = [...eyebrow];

  useLayoutEffect(() => {
    // 부모가 애니를 직접 구성하는 경우: 타깃만 노출하고 자체 애니는 건너뜀
    if (exposeRef) {
      exposeRef.current = {
        root: rootRef.current,
        letters: letterRefs.current,
        title: titleRef.current,
      };
      return;
    }

    const ctx = gsap.context(() => {
      // 각 글자를 제 마스크 아래(100%)에 숨겨두고 한 글자씩 위로 올린다.
      gsap.set(letterRefs.current, { yPercent: 100 });
      gsap.set(titleRef.current, { y: 40, opacity: 0 });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 80%",
            // 아래로 인입하면 play, 위로 역스크롤해 벗어나면 reverse
            toggleActions: "play none none reverse",
          },
          defaults: { ease: "power3.out" },
        })
        .to(letterRefs.current, {
          yPercent: 0,
          duration: 0.5,
          stagger: 0.06, // 글자 사이 간격 → 한 글자씩 도로록
        })
        .to(titleRef.current, { y: 0, opacity: 1, duration: 0.7 }, "-=0.25");
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className={className}>
      {/* eyebrow: 글자별 overflow-hidden 마스크 안에서 하나씩 올라온다 */}
      <p className="eyebrow mb-3">
        {letters.map((ch, i) => (
          <span
            key={i}
            className="inline-block overflow-hidden align-bottom"
          >
            <span
              ref={(el) => (letterRefs.current[i] = el)}
              className="inline-block whitespace-pre"
            >
              {ch === " " ? " " : ch}
            </span>
          </span>
        ))}
      </p>
      <h2
        ref={titleRef}
        className="display text-3xl/[1.2] tracking-normal md:text-4xl/[1.2]"
      >
        {children}
      </h2>
    </div>
  );
}

export default SectionHeading;
