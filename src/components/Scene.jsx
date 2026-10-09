import { useEffect, useRef } from "react";
import { clamp, ease } from "../lib/math";
import { WORK } from "../data/work";
import { workPreview } from "../lib/workPreview";

// 클로버가 키프레임을 바꾸는 기준 섹션 (순서 = cloverScene 의 KEYFRAMES 순서)
const ANCHOR_IDS = ["top", "work", "about", "contact"];

function getAnchors() {
  const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  return ANCHOR_IDS.map((id) => {
    const el = document.getElementById(id);
    if (!el) return 0;
    const top = el.getBoundingClientRect().top + window.scrollY;
    return Math.min(max, top - (id === "top" ? 0 : window.innerHeight * 0.35));
  });
}

/** Contact 섹션 가운데가 화면 가운데에 오는 스크롤 위치 (배경 타이포 "LET'S WORK TOGETHER" 기준점) */
function getContactY() {
  const el = document.getElementById("contact");
  if (!el) return Infinity;
  const r = el.getBoundingClientRect();
  return r.top + window.scrollY + (r.height - window.innerHeight) / 2;
}

/**
 * 화면 전체에 고정되는 WebGL 배경. three.js 는 별도 청크로 늦게 불러오고,
 * 첫 프레임을 그리면 onReady 로 알려 HTML 대체 헤드라인을 숨기게 한다.
 * introStart: 인트로 로더가 끝난 시각(performance.now 기준). 그 전까지 클로버는 작게 회전만 한다.
 */
function Scene({ onReady, introStart = null, autoRotate = true }) {
  const hostRef = useRef(null);
  const onReadyRef = useRef(onReady);
  const introRef = useRef(introStart);
  useEffect(() => {
    onReadyRef.current = onReady;
    introRef.current = introStart;
  });

  useEffect(() => {
    let disposed = false;
    let raf = 0;
    let scene = null;
    let ready = false;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const t0 = performance.now();

    const onMove = (e) => {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onResize = () => scene?.resize();
    window.addEventListener("pointermove", onMove);
    window.addEventListener("resize", onResize);

    const loop = (t) => {
      raf = requestAnimationFrame(loop);
      if (!scene) return;
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      const start = introRef.current;
      const intro = start == null ? 0 : ease(clamp((t - start) / 1500));
      scene.render((t - t0) / 1000, window.scrollY, mouse, getAnchors(), intro, workPreview.index, getContactY());
      if (!ready) {
        ready = true;
        onReadyRef.current?.();
      }
    };

    (async () => {
      let mod;
      try {
        mod = await import("../three/cloverScene");
      } catch (e) {
        console.warn("three.js failed to load", e);
        return;
      }
      if (disposed || !hostRef.current) return;
      // 클로버 안 썸네일: 1:1 전용 이미지
      const thumbs = WORK.map((w) => w.thumbClover);
      const s = mod.createCloverScene(hostRef.current, { autoRotate, thumbs });
      // 캔버스에 그리는 타이포가 대체 폰트로 찍히지 않도록 웹폰트 로드를 기다린다
      try {
        await Promise.all([
          document.fonts.load('800 200px "Bricolage Grotesque"'),
          document.fonts.load('400 40px "JetBrains Mono"'),
        ]);
      } catch {
        // 폰트 로드 실패 시 대체 폰트로 진행
      }
      if (disposed) {
        s.dispose();
        return;
      }
      s.resize();
      scene = s;
    })();

    raf = requestAnimationFrame(loop);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      scene?.dispose();
    };
  }, [autoRotate]);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}

export default Scene;
