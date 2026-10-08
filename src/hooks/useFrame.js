import { useEffect, useRef } from "react";

/** 매 프레임 cb(초) 를 호출한다. cb 는 항상 최신 렌더의 클로저를 쓴다. */
export function useFrame(cb) {
  const ref = useRef(cb);
  useEffect(() => {
    ref.current = cb;
  });
  useEffect(() => {
    let raf = 0;
    const loop = (t) => {
      raf = requestAnimationFrame(loop);
      ref.current(t / 1000);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
}
