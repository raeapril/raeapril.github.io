import Hero from "./components/Hero";
import Work from "./components/Work";

function Home() {
  return (
    <main>
      {/* ---------------- HERO ---------------- */}
      <Hero />

      {/* ---------------- ABOUT ---------------- */}
      <section id="about" className="container-x scroll-mt-24 pb-24 md:pb-36">
        <div className="grid gap-12 md:grid-cols-[1fr_2fr] md:gap-20">
          <div>
            <p className="eyebrow mb-3">ABOUT</p>
            <h2 className="display text-3xl/[1.2] md:text-4xl/[1.2]">
              하는 일,
              <br />
              잘하는 일<span className="text-accent">.</span>
            </h2>
            about  <br />
            about  <br />
            about  <br />
            about  <br />
            about  <br />
            about  <br />
            about  <br />
            about  <br />
            about  <br />
            about  <br />
            about  <br />
            about  <br />
            about  <br />
            about  <br />
            about  <br />
            about  <br />
            about  <br />
          </div>
        </div>
      </section>

      {/* ---------------- SKILLS ---------------- */}
      <section id="skills" className="container-x scroll-mt-24 pb-24 md:pb-36">
        <div className="grid gap-12 md:grid-cols-[1fr_2fr] md:gap-20">
          <div>
            <p className="eyebrow mb-3">SKILLS</p>
            <h2 className="display text-3xl/[1.2] md:text-4xl/[1.2]">
              다룰 수 있는 <br />
              기술<span className="text-accent">.</span>
            </h2>
            about  <br />
            about  <br />
            about  <br />
            about  <br />
            about  <br />
            about  <br />
            about  <br />
            about  <br />
            about  <br />
            about  <br />
            about  <br />
            about  <br />
            about  <br />
            about  <br />
            about  <br />
            about  <br />
            about  <br />
          </div>
        </div>
      </section>

      {/* ---------------- WORK ---------------- */}
      <Work />
    </main>
  );
}

export default Home;
