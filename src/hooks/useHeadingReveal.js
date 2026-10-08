import { useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * 섹션 공통 등장 시퀀스 — About/Work/Skills 가 공유한다.
 * SectionHeading(exposeRef)이 노출한 { root, letters, title } 와 콘텐츠 노드를
 * 하나의 스크롤 인입 타임라인으로 묶는다.
 *
 * @param {React.RefObject} headingRef  SectionHeading 이 노출한 { root, letters, title }
 * @param {() => Element[]} getContent   콘텐츠 DOM 노드 배열을 반환 (effect 시점에 호출 → ref 준비 보장)
 * @param {object} [options]
 * @param {React.RefObject} [options.triggerRef]  트리거 엘리먼트 ref (없으면 heading.root)
 * @param {string} [options.start="top 80%"]      ScrollTrigger start
 */
export function useHeadingReveal(headingRef, getContent, { triggerRef, start = "top 80%" } = {}) {
  useLayoutEffect(() => {
    const h = headingRef.current;
    if (!h) return;
    const content = getContent().filter(Boolean);

    const ctx = gsap.context(() => {
      gsap.set(h.letters, { yPercent: 100 });
      gsap.set(h.title, { y: 40, opacity: 0 });
      gsap.set(content, { autoAlpha: 0 });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: triggerRef?.current ?? h.root,
            start,
            toggleActions: "play none none reverse",
          },
          defaults: { ease: "power3.out" },
        })
        .to(h.letters, { yPercent: 0, duration: 0.5, stagger: 0.06 })
        .to(h.title, { y: 0, opacity: 1, duration: 0.7 }, "<0.35")
        .to(content, { autoAlpha: 1, duration: 0.6 }, "<");
    });

    return () => ctx.revert();
  }, []);
}
