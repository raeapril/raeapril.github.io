import { useLayoutEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROJECTS } from "../data/projects";
import SectionHeading from "./SectionHeading";

gsap.registerPlugin(ScrollTrigger);

/**
 * WORK — 프로젝트 카드(썸네일 + 타이틀) 가로 스크롤 리스트.
 * 컨테이너를 pin 하고, 세로 스크롤 진행도를 트랙의 가로 이동(x)에 매핑한다.
 * 각 카드 클릭 시 상세(/work/:slug)로 이동. 데이터는 data/projects.js 공유.
 */
function Work() {
  const rootRef = useRef(null);
  const pinRef = useRef(null);
  const trackRef = useRef(null);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const pin = pinRef.current;
      if (!track || !pin) return;

      // scrollWidth 는 트랙의 오른쪽 padding 을 포함하지 않으므로 그만큼 더해
      // 마지막 카드 오른쪽에도 여백이 생기게 한다.
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

  const goDetail = (slug) => navigate(`/work/${slug}`);

  return (
    <section id="work" ref={rootRef} className="scroll-mt-24">
      {/* 핀 컨테이너 — 타이틀은 위 고정, 아래 카드 트랙이 세로 스크롤 동안 왼쪽으로 이동 */}
      <div
        ref={pinRef}
        className="relative flex h-screen flex-col justify-center overflow-hidden"
      >
        <SectionHeading eyebrow="WORK" className="px-6 md:px-16">
          참여한
          <br className="hidden md:block" />
          작업<span className="text-accent">.</span>
        </SectionHeading>

        <div
          ref={trackRef}
          className="mt-8 flex items-start gap-6 px-6 will-change-transform md:mt-12 md:gap-10 md:px-16"
        >
          {PROJECTS.map((proj) => (
            <button
              key={proj.no}
              type="button"
              onClick={() => goDetail(proj.slug)}
              aria-label={`${proj.title} 상세 보기`}
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
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Work;
