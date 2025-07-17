import Footer from "@components/Footer";
import Navbar from "@components/Navbar";
import ProjectsPage from "@components/ProjectsPage";

export const metadata = {
  title: "Projects",
};

export default function Projects() {
  return (
    <>
      <Navbar />
      <ProjectsPage />
      <Footer />
    </>
  );
}
