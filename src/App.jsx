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
  useLenis(!revealed);

  // WebGL 첫 프레임이 그려지면 HTML 대체 헤드라인을 페이드아웃
  const [sceneReady, setSceneReady] = useState(false);
  // 배경 타이포 "PUBLISHER" 의 화면 위치 (모바일에서 소개 문구를 바로 아래에 붙이는 데 사용)
  const [textLayout, setTextLayout] = useState(null);

  return (
    <div className="relative min-h-screen overflow-x-clip bg-night text-cream">
      <Scene
        introStart={introStart}
        onReady={() => setSceneReady(true)}
        onTextLayout={setTextLayout}
      />
      {!prefersReducedMotion() && <Intro onDone={() => setIntroStart(performance.now())} />}
      <Nav revealed={revealed} />
      <main className="relative z-[1]">
        <Hero sceneReady={sceneReady} revealed={revealed} textLayout={textLayout} />
        <Work />
        <About />
        <Skills />
        <Contact />
      </main>
    </div>
  );
}

export default App;
