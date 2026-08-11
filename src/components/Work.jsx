import { useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROJECTS } from "../data/projects";
import SectionHeading from "./SectionHeading";

gsap.registerPlugin(ScrollTrigger);

/**
 * WORK — pxpush.com .benefits 스타일 "타이틀 스택" 섹션.
 * Lenis 스무스 스크롤 + GSAP ScrollTrigger(pin + scrub)로 구현한다.
 *
 * 스택 컨테이너를 화면에 pin 하고, 스크롤에 스크럽으로 묶인 타임라인이 각 카드를
 * '화면 아래 → 이전 타이틀 바 바로 아래'로 밀어 올려 차곡차곡 걸리게 한다.
 * 카드는 [텍스트 | 단일 이미지] 2열이라 접히면 한 장짜리 이미지의 윗부분 슬라이스만 보인다.
 * 타임라인이 끝나면 pin 이 풀리며 스택 전체가 통째로 스크롤되어 다음 섹션으로 이어진다.
 *
 * 각 카드는 hover 시 타이틀에 포인트색 선이 그어지고 'go to detail' 라벨이 뜨며, 클릭하면 상세(/work/:slug)로 이동.
 * 프로젝트 데이터는 data/projects.js 에서 공유한다.
 */

// 바 높이(=접힌 타이틀 바)와 핀 시작 오프셋(고정 네비 높이). CSS 클래스와 값을 맞춘다.
const TOP_MD = 80;
const TOP_SM = 64;
// 접힘 시 보이는 영역(BAR) = grid 위패딩(py-4 16px) + 타이틀 바 높이 + 타이틀 아래 여백(~10px).
// BAR = 16(py-4) + 바높이(sm 40 / md 44) + 10(여백).
const BAR_MD = 70;
const BAR_SM = 66;

function Work() {
  const rootRef = useRef(null);
  const pinRef = useRef(null);
  const cardsRef = useRef([]);
  const [activeIndex, setActiveIndex] = useState(null); // 현재 hover 중인 카드 index
  const navigate = useNavigate();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const build = (TOP, BAR) => {
        const cards = cardsRef.current.filter(Boolean);
        const N = cards.length;
        const SPEED = 0.85; // pin 길이 배율 (작을수록 짧게 = 빠르게 쌓임)

        // 카드 본문 높이 H(=compact 간격)를 실측하고, 전부 걸릴 때까지의 이동량
        // span(= 이동량 + hold)을 함께 반환. 이미지 로드/리사이즈에도 정확하도록 프레임당 1회 호출.
        const metrics = () => {
          const H = cards[0].offsetHeight;
          const span = (N - 1) * (H - BAR) + window.innerHeight * 0.35; // 이동량 + 완성 후 hold
          return { H, span };
        };
        // 카드 i: compact 흐름 → restY(TOP + i*BAR)에 걸려 멈춘다(=sticky)
        const place = (offset, H) => {
          cards.forEach((card, i) => {
            gsap.set(card, { y: Math.max(TOP + i * BAR, TOP + i * H - offset) });
          });
        };
        place(0, metrics().H);

        ScrollTrigger.create({
          trigger: pinRef.current,
          start: "top top",
          end: () => "+=" + metrics().span * SPEED, // 스크롤 거리 = span 을 SPEED 로 스케일
          pin: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const { H, span } = metrics();
            place(self.progress * span, H);
          },
        });
      };

      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => build(TOP_MD, BAR_MD));
      mm.add("(max-width: 767.98px)", () => build(TOP_SM, BAR_SM));
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const goDetail = (slug) => navigate(`/work/${slug}`);

  return (
    <section id="work" ref={rootRef} className="scroll-mt-24 pb-20 md:pb-0">
      {/* 섹션 인트로 */}
      <SectionHeading eyebrow="WORK" className="container-x">
        참여한
        <br />
        작업<span className="text-accent">.</span>
      </SectionHeading>

      {/* 핀 컨테이너 — 스크럽 동안 화면에 고정되고, 카드가 아래에서 올라와 쌓인다 */}
      <div ref={pinRef} className="relative h-screen overflow-hidden">
        {PROJECTS.map((proj, i) => (
          <article
            key={proj.no}
            ref={(el) => (cardsRef.current[i] = el)}
            style={{ zIndex: i + 1 }}
            className="group absolute inset-x-0 top-0 cursor-pointer border-t border-line bg-paper will-change-transform"
            role="link"
            tabIndex={0}
            aria-label={`${proj.title} 상세 보기`}
            onMouseEnter={() => setActiveIndex(i)}
            onMouseLeave={() => setActiveIndex(null)}
            onClick={() => goDetail(proj.slug)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                goDetail(proj.slug);
              }
            }}
          >
            {/* grid 의 py-4 가 타이틀·이미지를 함께 내린다(위 정렬). 이 위패딩은 BAR 에 포함됨. */}
            <div className="container-x">
              {/* hover 시: 다른 카드는 흐려지고(dim), 이 카드만 또렷하게 강조 */}
              <div
                className={`grid grid-cols-1 py-4 transition-opacity duration-500 ease-smooth md:grid-cols-[minmax(0,1fr)_340px] md:gap-10 ${
                  activeIndex !== null && activeIndex !== i
                    ? "opacity-40"
                    : "opacity-100"
                }`}
              >
                {/* 텍스트 열 — 타이틀 바(위, 높이=BAR) + 설명(아래) */}
                <div className="flex flex-col">
                  <div className="flex h-[40px] items-center gap-4 md:h-[44px] md:gap-8">
                    <span className="eyebrow hidden shrink-0 transition-colors duration-500 group-hover:text-accent sm:block">
                      {proj.no}
                    </span>
                    {/* 타이틀 + hover 시 텍스트 가운데를 가로지르는 포인트색 선(왼→오른쪽) */}
                    <span className="relative inline-flex">
                      <h3 className="display whitespace-nowrap text-2xl/[1.2] tracking-tight md:text-3xl/[1.2] lg:text-4xl/[1.2]">
                        {proj.title}
                      </h3>
                      <span
                        aria-hidden
                        className="pointer-events-none absolute left-0 top-1/2 h-[2px] w-full origin-left -translate-y-1/2 scale-x-0 bg-accent transition-transform duration-500 ease-smooth group-hover:scale-x-100 md:h-[3px]"
                      />
                    </span>
                    {/* 선이 다 그어진 뒤(delay-500) 타이틀 옆에 'go to detail' 이 슬라이드 인 */}
                    <span className="hidden shrink-0 translate-x-2 whitespace-nowrap text-xs font-semibold uppercase tracking-[0.15em] text-accent opacity-0 transition-[opacity,transform] duration-300 ease-smooth group-hover:translate-x-0 group-hover:opacity-100 group-hover:delay-500 md:block">
                      go to detail
                    </span>
                  </div>
                  {/* 설명 — 다음 카드가 올라와 쌓이면 가려짐. pt 는 BAR 의 '타이틀 아래 여백'보다
                     크게 두어 접힘 시 태그가 라인 위로 삐져나오지 않게 한다. */}
                  <div className="pb-12 pt-3 md:pb-16">
                    <p className="eyebrow text-accent">{proj.tag}</p>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
                      {proj.desc}
                    </p>
                  </div>
                </div>

                {/* 단일 이미지 — 텍스트 열 높이만큼 늘어난다. 접히면 윗부분 슬라이스만 보임 */}
                <div className="mb-10 h-[220px] overflow-hidden md:mb-0 md:h-auto md:self-stretch">
                  <img
                    src={proj.thumb}
                    alt={proj.title}
                    className="h-full w-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-[1.04]"
                  />
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Work;
