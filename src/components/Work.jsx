import SectionHeading from "./SectionHeading";

/**
 * WORK — 섹션 껍데기만 유지한다. (내용 비움 — 추후 새 콘텐츠로 채울 예정)
 */
function Work() {
  return (
    <section id="work" className="container-x scroll-mt-24 pb-24 md:pb-36">
      <SectionHeading eyebrow="WORK">
        참여한
        <br className="hidden md:block" />
        작업<span className="text-accent">.</span>
      </SectionHeading>
    </section>
  );
}

export default Work;
