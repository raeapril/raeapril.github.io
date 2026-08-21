import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROJECTS } from "../data/projects";
import SectionHeading from "./SectionHeading";

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

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const pin = pinRef.current;
      if (!track || !pin) return;

      // 진입 시 ani — About 과 동일한 시퀀스(하나의 타임라인).
      //  ① eyebrow(WORK) 도로록 → ② 도로록 끝난 뒤 title 슬라이드 + 카드 페이드가 "동시" 시작.
      //  (카드는 위치 변화·시간차 없이 opacity 0→1)
      const h = headingRef.current;
      const cards = cardsRef.current.filter(Boolean);
      if (h) {
        gsap.set(h.letters, { yPercent: 100 });
        gsap.set(h.title, { y: 40, opacity: 0 });
        gsap.set(cards, { autoAlpha: 0 });

        gsap
          .timeline({
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
            defaults: { ease: "power3.out" },
          })
          .to(h.letters, { yPercent: 0, duration: 0.5, stagger: 0.06 })
          .to(h.title, { y: 0, opacity: 1, duration: 0.7 }, ">")
          .to(cards, { autoAlpha: 1, duration: 0.6 }, "<");
      }

      const dist = () => {
        const pr = parseFloat(getComputedStyle(track).paddingRight) || 0;
        return Math.max(0, track.scrollWidth - pin.offsetWidth + pr);
      };
      ScrollTrigger.create({
        trigger: pin,
        start: "top top",
        end: () => "+=" + dist(),
        pin: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: (self) => gsap.set(track, { x: -dist() * self.progress }),
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="work" ref={rootRef} className="scroll-mt-24">
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
