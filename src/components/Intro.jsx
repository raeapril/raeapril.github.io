import { useEffect, useRef, useState } from "react";

const EXPO = "cubic-bezier(0.76,0,0.24,1)";

/**
 * 첫 진입 로더. 000 → 100 으로 카운트한 뒤 숫자가 위로 빠지며 사라지고,
 * 그 순간 onDone() 으로 알려 3D 장면·헤더가 등장하게 한다. 로딩 중에는 스크롤을 잠근다.
 */
function Intro({ onDone }) {
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState("count"); // count → exit → gone
  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = "hidden";
    const timers = [];
    let cur = 0;
    const step = () => {
      // 끝으로 갈수록 느려지는 카운트
      cur = Math.min(100, cur + Math.max(1, Math.ceil((100 - cur) / 9)));
      setCount(cur);
      if (cur < 100) {
        timers.push(setTimeout(step, 70));
        return;
      }
      timers.push(
        setTimeout(() => {
          setPhase("exit");
          document.body.style.overflow = "";
          onDoneRef.current?.();
        }, 380)
      );
      timers.push(setTimeout(() => setPhase("gone"), 1500));
    };
    timers.push(setTimeout(step, 300));
    return () => {
      timers.forEach(clearTimeout);
      document.body.style.overflow = "";
    };
  }, []);

  if (phase === "gone") return null;
  const exit = phase === "exit";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100] flex flex-col justify-between p-[clamp(20px,3vw,64px)] font-mono text-xs uppercase tracking-[0.04em] text-dim"
      style={{ opacity: exit ? 0 : 1, transition: "opacity 0.6s ease 0.35s" }}
    >
      <div
        className="flex justify-between gap-4"
        style={{
          transform: exit ? "translateY(-24px)" : "none",
          opacity: exit ? 0 : 1,
          transition: `transform 0.9s ${EXPO}, opacity 0.6s`,
        }}
      >
        <span className="text-cream">Meerae Shin — 신미래</span>
        <span>Portfolio © {new Date().getFullYear()}</span>
      </div>
      <div className="flex flex-col gap-5">
        <div className="overflow-hidden">
          <div
            className="font-display text-[clamp(96px,20vw,400px)] font-extrabold leading-[0.82] tracking-[-0.06em] text-cream"
            style={{
              transform: exit ? "translateY(-105%)" : "none",
              transition: `transform 0.9s ${EXPO}`,
            }}
          >
            {String(count).padStart(3, "0")}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span>Loading</span>
          <span className="relative h-px flex-1 bg-white/[0.12]">
            <span
              className="absolute left-0 top-0 h-px bg-point transition-[width] duration-[120ms] ease-linear"
              style={{ width: `${count}%` }}
            />
          </span>
          <span>Web Publisher</span>
        </div>
      </div>
    </div>
  );
}

export default Intro;
