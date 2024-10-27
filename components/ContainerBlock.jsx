import Head from "next/head";
import { useRouter } from "next/router";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function ContainerBlock({ children, showNav = true, ...customMeta }) {
  const router = useRouter();

  const meta = {
    title: "Oguz Kabasakal - Developer | Designer | Composer",
    description: `Developing by day, slaying demos by night`,
    image: "/avatar.png",
    type: "website",
    ...customMeta,
  };

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="robots" content="follow, index" />
        <meta content={meta.description} name="description" />
        <meta property="og:url" content={`https://oguzkabasakal.com${router.asPath}`} />
        <link rel="canonical" href={`https://oguzkabasakal.com${router.asPath}`} />
        {meta.date && <meta property="article:published_time" content={meta.date} />}
      </Head>
      <main className="dark:bg-gray-800 w-full">
        {showNav && <Navbar />}
        {children}
        {showNav && <Footer />}
      </main>
    </>
  );
}
