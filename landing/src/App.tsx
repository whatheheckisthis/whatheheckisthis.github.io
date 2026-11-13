import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import BlogIndex from "./pages/BlogIndex";
import PostPage from "./pages/PostPage";
import CaseStudies from "./pages/CaseStudies";
import CaseStudyP2P from "./pages/CaseStudyP2P";
import CaseStudyArmv9 from "./pages/CaseStudyArmv9";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/case-studies/" element={<CaseStudies />} />
      <Route path="/case-studies/fpga-gpu-p2p/" element={<CaseStudyP2P />} />
      <Route path="/case-studies/armv9-weak-memory-sve2/" element={<CaseStudyArmv9 />} />
      <Route path="/blog/" element={<BlogIndex />} />
      <Route path="/blog/:slug/" element={<PostPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
