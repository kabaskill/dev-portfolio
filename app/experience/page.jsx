import ExperiencePage from "@components/ExperiencePage";
import Footer from "@components/Footer";
import Navbar from "@components/Navbar";

export const metadata = {
  title: "Experience",
};

export default function Experience() {
  return (
    <>
      <Navbar />
      <ExperiencePage />
      <Footer />
    </>
  );
}
