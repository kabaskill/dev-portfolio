import ContactPage from "@components/ContactPage";
import Footer from "@components/Footer";
import Navbar from "@components/Navbar";

export const metadata = {
  title: "Contact",
};

export default function Contact() {
  return (
    <>
      <Navbar />
      <ContactPage />
      <Footer />
    </>
  );
}
