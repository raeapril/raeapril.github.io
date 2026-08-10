import { Link, useParams } from "react-router-dom";
import { findProject } from "./data/projects";

/**
 * 프로젝트 상세 페이지 (/work/:slug).
 * Work 리스트에서 카드를 클릭하면 이동한다. 지금은 뼈대만 — 상세 내용은 여기서 채우면 됨.
 */
function WorkDetail() {
  const { slug } = useParams();
  const project = findProject(slug);

  if (!project) {
    return (
      <main className="container-x flex min-h-[70vh] flex-col items-start justify-center gap-6 pt-24">
        <p className="eyebrow">404</p>
        <h1 className="display text-3xl/[1.2] md:text-5xl/[1.2]">
          프로젝트를 찾을 수 없어요<span className="text-accent">.</span>
        </h1>
        <Link to="/" className="btn btn-ghost">
          ← 홈으로
        </Link>
      </main>
    );
  }

  return (
    <main className="container-x pb-24 pt-28 md:pb-36 md:pt-40">
      <Link
        to="/"
        state={{ scrollTo: "work" }}
        className="eyebrow transition-colors hover:text-accent"
      >
        ← BACK
      </Link>

      <p className="eyebrow mt-10 text-accent">{project.tag}</p>
      <h1 className="display mt-3 text-4xl/[1.1] md:text-6xl/[1.1]">
        {project.title}
      </h1>

      <div className="mt-10 aspect-[16/9] overflow-hidden md:mt-14">
        <img
          src={project.thumb}
          alt={project.title}
          className="h-full w-full object-cover"
        />
      </div>

      <p className="mt-10 max-w-2xl text-base leading-relaxed text-muted md:mt-14">
        {project.desc}
      </p>
    </main>
  );
}

export default WorkDetail;
