import { useState } from "react";

import Scene from "./site/Scene";
import Nav from "./site/Nav";
import Hero from "./site/Hero";
import Work from "./site/Work";
import About from "./site/About";
import Skills from "./site/Skills";
import Contact from "./site/Contact";
import { useLenis } from "./site/useLenis";

function App() {
  useLenis();
  // WebGL 첫 프레임이 그려지면 HTML 대체 헤드라인을 페이드아웃
  const [sceneReady, setSceneReady] = useState(false);

  return (
    <div className="relative min-h-screen overflow-x-clip bg-night text-cream">
      <Scene onReady={() => setSceneReady(true)} />
      <Nav />
      <main className="relative z-[1]">
        <Hero sceneReady={sceneReady} />
        <Work />
        <About />
        <Skills />
        <Contact />
      </main>
    </div>
  );
}

export default App;
