import FavouriteProjects from "@components/FavouriteProjects";
import Hero from "@components/Hero";
import LatestCode from "@components/LatestCode";
import { ThreeToggle } from "@components/ThreeToggle";
import userData from "@constants/data";
import getLatestRepos from "@lib/getLatestRepos";

async function getGithubRepos() {
  const token = process.env.GITHUB_AUTH_TOKEN;
  return getLatestRepos(userData, token);
}

export const metadata = {
  title: "Home | Oguz Kabasakal",
};

export default async function HomePage() {
  const repositories = await getGithubRepos();

  return (
    <main id="main" className="min-h-screen">
      <Hero />
      <FavouriteProjects />
      <LatestCode repositories={repositories} />
    </main>
  );
}