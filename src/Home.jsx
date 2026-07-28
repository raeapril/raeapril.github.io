import Hero from "./components/Hero";

function Home() {
  return (
    <main>
      {/* ---------------- HERO ---------------- */}
      <Hero />

      {/* ---------------- ABOUT ---------------- */}
      <section id="about" className="container-x scroll-mt-24 py-24 md:py-36">
        <div className="grid gap-12 md:grid-cols-[1fr_2fr] md:gap-20">
          <div>
            <p className="eyebrow mb-3">ABOUT</p>
            <h2 className="display text-3xl leading-[1.2] md:text-4xl md:leading-[1.2]">
              하는 일,
              <br />
              잘하는 일<span className="text-accent">.</span>
            </h2>
          </div>
        </div>
      </section>

      {/* ---------------- WORK ---------------- */}
      <section id="work" className="container-x scroll-mt-24 py-24 md:py-36">
        <div className="grid gap-12 md:grid-cols-[1fr_2fr] md:gap-20">
          <div>
            <p className="eyebrow mb-3">WORK</p>
            <h2 className="display text-3xl leading-[1.2] md:text-4xl md:leading-[1.2]">
              참여한
              <br />
              작업<span className="text-accent">.</span>
            </h2>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
