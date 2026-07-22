import { Link } from "react-router-dom";

const EMAIL = "meerae.shin@gmail.com";

function Footer() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="container-x py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
            <a
              href={`mailto:${EMAIL}`}
              className="display block text-3xl transition-colors hover:text-accent md:text-4xl"
            >
              {EMAIL}
            </a>
        </div>

        <div className="flex flex-col gap-2 mt-4 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} RAE APRIL. All rights reserved.</p>
          <p>Web Publisher · Seoul, KR</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
