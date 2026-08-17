import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Work from "./components/Work";

function Home() {
  return (
    <main>
      {/* ---------------- HERO ---------------- */}
      <Hero />

      {/* ---------------- ABOUT ---------------- */}
      <About />

      {/* ---------------- SKILLS ---------------- */}
      <Skills />

      {/* ---------------- WORK ---------------- */}
      <Work />
    </main>
  );
}

export default Home;
