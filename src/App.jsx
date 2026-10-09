import { useState } from "react";

import Intro from "./components/Intro";
import Scene from "./components/Scene";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Work from "./components/Work";
import About from "./components/About";
import Skills from "./components/Skills";
import Contact from "./components/Contact";
import { useLenis } from "./hooks/useLenis";
import { prefersReducedMotion } from "./lib/motion";

function App() {
  // 인트로 로더가 끝난 시각. 동작 줄이기 설정이면 로더 없이 바로 끝난 상태로 시작한다.
  const [introStart, setIntroStart] = useState(() =>
    prefersReducedMotion() ? performance.now() - 5000 : null
  );
  const revealed = introStart !== null;
  useLenis(!revealed, { scrollToHash: true });

  // WebGL 첫 프레임이 그려지면 HTML 대체 헤드라인을 페이드아웃
  const [sceneReady, setSceneReady] = useState(false);

  return (
    <div className="relative min-h-screen overflow-x-clip bg-night text-cream">
      <Scene introStart={introStart} onReady={() => setSceneReady(true)} />
      {!prefersReducedMotion() && <Intro onDone={() => setIntroStart(performance.now())} />}
      <Nav revealed={revealed} />
      <main className="relative z-[1]">
        <Hero sceneReady={sceneReady} revealed={revealed} />
        <Work />
        <About />
        <Skills />
        <Contact sceneReady={sceneReady} />
      </main>
    </div>
  );
}

export default App;
