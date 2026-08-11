import Hero from "./components/Hero";
import About from "./components/About";
import Work from "./components/Work";
import SectionHeading from "./components/SectionHeading";

function Home() {
  return (
    <main>
      {/* ---------------- HERO ---------------- */}
      <Hero />

      {/* ---------------- ABOUT ---------------- */}
      <About />

      {/* ---------------- SKILLS ---------------- */}
      <section id="skills" className="container-x scroll-mt-24 pb-24 md:pb-36">
        <div className="grid gap-12 md:grid-cols-[1fr_2fr] md:gap-20">
          <div>
            <SectionHeading eyebrow="SKILLS">
              다룰 수 있는 <br />
              기술<span className="text-accent">.</span>
            </SectionHeading>
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
