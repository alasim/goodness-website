import { BrowserRouter, Routes, Route } from "react-router";
import { Nav } from "./components/layout/Nav";
import { Footer } from "./components/layout/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Programs from "./pages/Programs";
import ProgramDetail from "./pages/ProgramDetail";
import Transparency from "./pages/Transparency";
import Partner from "./pages/Partner";
import Volunteer from "./pages/Volunteer";
import Printables from "./pages/Printables";
import VolunteerListing from "./pages/VolunteerListing";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-white" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
        <Nav />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/programs/:slug" element={<ProgramDetail />} />
            <Route path="/transparency" element={<Transparency />} />
            <Route path="/partner" element={<Partner />} />
            <Route path="/volunteer" element={<Volunteer />} />
            <Route path="/volunteers" element={<VolunteerListing />} />
            <Route path="/printables" element={<Printables />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
