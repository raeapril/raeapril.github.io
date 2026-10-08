import { ABOUT } from "./data";
import SectionHead from "./SectionHead";
import CloverIcon from "./CloverIcon";

function About() {
  return (
    <section id="about" className="site-x pt-[clamp(140px,14vw,260px)]">
      <SectionHead
        title={
          <>
            What
            <br />I do
          </>
        }
      >
        하는 일, 잘하는 일.
      </SectionHead>
      <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-[clamp(12px,1.4vw,24px)] p-0">
        {ABOUT.map((item) => (
          <li
            key={item.no}
            className="flex min-h-[clamp(320px,24vw,420px)] flex-col justify-between gap-12 rounded-3xl border border-white/[0.08] bg-[rgba(26,26,30,0.55)] p-[clamp(24px,2vw,36px)] backdrop-blur-[24px]"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-dim">
                {item.no} / {String(ABOUT.length).padStart(2, "0")}
              </span>
              <CloverIcon className="h-7 w-7 text-point" opacity={0.6} />
            </div>
            <div className="flex flex-col gap-3.5">
              <h3 className="m-0 font-display text-[clamp(30px,2.4vw,44px)] font-semibold leading-none tracking-[-0.03em]">
                {item.title}
              </h3>
              <p className="m-0 text-base font-semibold leading-[1.45] [text-wrap:pretty]">{item.lead}</p>
              <p className="m-0 text-sm leading-[1.65] text-[#a19e98] [text-wrap:pretty]">{item.desc}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default About;
