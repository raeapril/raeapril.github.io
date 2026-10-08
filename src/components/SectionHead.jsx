// 섹션 상단: 왼쪽 거대 영문 제목 + 오른쪽 짧은 설명
function SectionHead({ title, children }) {
  return (
    <div className="site-head-gap flex flex-wrap items-end justify-between gap-6">
      <h2 className="site-display m-0 text-[clamp(48px,8vw,168px)] leading-[0.88]">{title}</h2>
      <p className="type-body m-0 max-w-[340px] leading-relaxed">{children}</p>
    </div>
  );
}

export default SectionHead;
