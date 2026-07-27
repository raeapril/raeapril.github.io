import { Routes, Route } from "react-router-dom";

import Nav from "./components/Nav";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Intro from "./components/Intro";
import RouteTransition from "./components/RouteTransition";
import Home from "./Home";

function App() {
  return (
    <>
      <Intro />
      <ScrollToTop />
      <Nav />
      <RouteTransition>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </RouteTransition>
      <Footer />
    </>
  );
}

export default App;
