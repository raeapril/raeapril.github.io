import { useLayoutEffect, useRef } from "react";

/**
 * 섹션 공통 헤딩(프레젠테이션 전용). eyebrow(영문) 마스크 + title(h2) 마크업만 담당하고,
 * 등장 애니메이션은 부모가 useHeadingReveal 훅으로 구성한다.
 * (clip-path/width 는 GSAP 에서 스냅되기 쉬워 transform 으로 구현)
 *
 * exposeRef: 애니 대상 { root, letters, title } 을 ref 로 노출한다.
 *  부모의 useLayoutEffect 는 자식보다 나중에 실행 → 형제(콘텐츠) ref 까지 모두 준비된 뒤
 *  하나의 타임라인으로 heading + 콘텐츠를 함께 다룰 수 있다.
 */
function SectionHeading({ eyebrow, children, className = "", exposeRef }) {
  const rootRef = useRef(null);
  const letterRefs = useRef([]);
  const titleRef = useRef(null);
  const letters = [...eyebrow];

  useLayoutEffect(() => {
    if (!exposeRef) return;
    exposeRef.current = {
      root: rootRef.current,
      letters: letterRefs.current,
      title: titleRef.current,
    };
  }, [exposeRef]);

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
