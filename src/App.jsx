import { Routes, Route } from "react-router-dom";

import Nav from "./components/Nav";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Intro from "./components/Intro";
import Home from "./Home";
import WorkDetail from "./WorkDetail";
import { useSmoothScroll } from "./hooks/useSmoothScroll";

function App() {
  useSmoothScroll();

  return (
    <>
      <Intro />
      <ScrollToTop />
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/work/:slug" element={<WorkDetail />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
