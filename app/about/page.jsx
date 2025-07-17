import AboutMe from "@components/AboutMe";
import Footer from "@components/Footer";
import Navbar from "@components/Navbar";

export const metadata = {
  title: "About",
};

export default function About() {
  return (
    <>
      <Navbar />
      <AboutMe />
      <Footer />
    </>
  );
}
