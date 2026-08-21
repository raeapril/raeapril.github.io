import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROJECTS } from "../data/projects";
import SectionHeading from "./SectionHeading";
import { useHeadingReveal } from "../hooks/useHeadingReveal";

gsap.registerPlugin(ScrollTrigger);

/**
 * WORK — 프로젝트 카드(썸네일 + 타이틀) 가로 스크롤 리스트.
 * 컨테이너를 pin 하고, 세로 스크롤 진행도를 트랙의 가로 이동(x)에 매핑한다.
 * 각 카드 클릭 시 해당 서비스(link)로 새 탭 이동. 데이터는 data/projects.js.
 */
function Work() {
  const rootRef = useRef(null);
  const pinRef = useRef(null);
  const trackRef = useRef(null);
  const headingRef = useRef(null);
  const cardsRef = useRef([]);

  // eyebrow(WORK) 도로록 → 도로록 끝난 뒤 title + 카드가 동시에 페이드 인.
  useHeadingReveal(headingRef, () => cardsRef.current, {
    triggerRef: rootRef,
    start: "top 75%",
  });

  // 트랙 pin + 세로 스크롤 진행도를 가로 이동(x)에 매핑.
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const pin = pinRef.current;
      if (!track || !pin) return;

      const dist = () => {
        const pr = parseFloat(getComputedStyle(track).paddingRight) || 0;
        return Math.max(0, track.scrollWidth - pin.offsetWidth + pr);
      };
      ScrollTrigger.create({
        trigger: pin,
        start: "top top",
        end: () => "+=" + dist(),
        pin: true,
        // Lenis 스무스 스크롤에서 pin 이 뒤늦게 걸려 화면이 '툭' 튀는 것을 방지
        anticipatePin: 1,
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: (self) => gsap.set(track, { x: -dist() * self.progress }),
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="work" ref={rootRef}>
      {/* 핀 컨테이너 — 타이틀은 위 고정, 아래 카드 트랙이 세로 스크롤 동안 왼쪽으로 이동 */}
      <div
        ref={pinRef}
        className="relative flex h-screen flex-col justify-center overflow-hidden"
      >
        <SectionHeading
          eyebrow="WORK"
          className="px-6 md:px-16"
          exposeRef={headingRef}
        >
          참여한
          <br className="hidden md:block" />
          작업<span className="text-accent">.</span>
        </SectionHeading>

        <div
          ref={trackRef}
          className="mt-8 flex items-start gap-6 px-6 will-change-transform md:mt-12 md:gap-10 md:px-16"
        >
          {PROJECTS.map((proj, i) => (
            <a
              key={proj.no}
              href={proj.link}
              target="_blank"
              rel="noopener noreferrer"
              ref={(el) => (cardsRef.current[i] = el)}
              aria-label={`${proj.title} 사이트 새 탭으로 열기`}
              className="block w-[300px] shrink-0 text-left sm:w-[360px] md:w-[440px]"
            >
              <div className="overflow-hidden">
                <img
                  src={proj.thumb}
                  alt={proj.title}
                  className="aspect-[5/6] w-full object-cover md:aspect-[2/1]"
                />
              </div>
              <div className="mt-4 flex items-baseline justify-between gap-3">
                <h3 className="display text-2xl tracking-tight md:text-3xl">
                  {proj.title}
                </h3>
                <span className="eyebrow shrink-0 text-accent">{proj.no}</span>
              </div>
              <p className="eyebrow mt-1 text-muted">{proj.tag}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink/60">
                {proj.desc}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Work;
