import ContainerBlock from "../components/ContainerBlock";
import FavouriteProjects from "../components/FavouriteProjects";
import LatestCode from "../components/LatestCode";
import Hero from "../components/Hero";
import getLatestRepos from "@lib/getLatestRepos";
import userData from "@constants/data";
import { useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { cn } from "@lib/cn";

const ThreeScene = dynamic(
  () => import("../components/ThreeScene").then((mod) => ({ default: mod.ThreeScene })),
  {
    ssr: false,
  }
);

export default function Home({ repositories }) {
  const [show3D, setShow3D] = useState(false);

  function handle3D() {
    setShow3D(!show3D);
  }

  return (
    <>
      {show3D ? (
        <Suspense fallback={<p className={cn("", "text-4xl text-red-500")}>Loading 3D Scene...</p>}>
          <ContainerBlock
            showNav={false}
            title="Oguz Kabasakal - Developer | Designer | Composer"
            description="Developing by day, slaying demons by night"
          >
            <ThreeScene handle3D={handle3D} />
          </ContainerBlock>
        </Suspense>
      ) : (
        <ContainerBlock
          title="Oguz Kabasakal - Developer | Designer | Composer"
          description="Developing by day, slaying demons by night"
        >
          {/* Toggle button */}
          <button
            onClick={() => {
              setShow3D(true);
            }}
            className={cn(
              "absolute top-2 left-1/2 z-50 transform -translate-x-1/2",
              "px-4 py-1 rounded-md",
              "bg-gray-800 dark:bg-gray-200 text-gray-200 dark:text-gray-800",
              "hover:bg-gray-700 dark:hover:bg-gray-300"
            )}
          >
            {show3D ? "Switch to Classic" : "Switch to 3D Version"}
          </button>
          <Hero />
          <FavouriteProjects />
          <LatestCode repositories={repositories} />
        </ContainerBlock>
      )}
    </>
  );
}

export async function getServerSideProps() {
  let token = process.env.GITHUB_AUTH_TOKEN;

  const repositories = await getLatestRepos(userData, token);

  return {
    props: {
      repositories: repositories || null,
    },
  };
}
