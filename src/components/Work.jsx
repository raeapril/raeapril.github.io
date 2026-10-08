import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { WORK } from "../data/work";
import SectionHeading from "./SectionHeading";
import { useHeadingReveal } from "../hooks/useHeadingReveal";

gsap.registerPlugin(ScrollTrigger);

function Work() {
  const rootRef = useRef(null);
  const pinRef = useRef(null);
  const trackRef = useRef(null);
  const headingRef = useRef(null);
  const cardsRef = useRef([]);

  useHeadingReveal(headingRef, () => cardsRef.current, {
    triggerRef: rootRef,
    start: "top 75%",
  });

  // 트랙 pin
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
      {/* 핀 컨테이너 */}
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
          {WORK.map((proj, i) => (
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
                <picture>
                  {/* 데스크톱(≥768px)은 와이드 썸네일, 모바일은 세로형 전용 썸네일 */}
                  <source media="(min-width: 768px)" srcSet={proj.thumb} />
                  <img
                    src={proj.thumbMobile || proj.thumb}
                    alt={proj.title}
                    className="aspect-[5/6] w-full object-cover md:aspect-[2/1]"
                  />
                </picture>
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
