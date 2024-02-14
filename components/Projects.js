import userData from "@constants/data";

import { RoughNotationGroup } from "react-rough-notation";
import { RainbowHighlight } from "./RainbowHighlight";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Projects() {
  const projects = userData.projects;
  const colors = ["#F59E0B", "#84CC16", "#10B981", "#3B82F6"];

  const [projectList, setProjectList] = useState(projects.dev);

  const handleClick = (listName) => {
    setProjectList(projects[listName]);
  };

  return (
    <section className="bg-white dark:bg-gray-800">
      <div className="max-w-6xl mx-auto h-48 bg-white dark:bg-gray-800">
        <h1 className=" text-5xl md:text-9xl font-bold py-20 text-center md:text-left">Projects</h1>
      </div>
      <div className="bg-[#F1F1F1] dark:bg-gray-900">
        <div className="flex flex-row justify-center items-center overflow-hidden">
          <div className="w-full md:w-2/3 my-auto flex justify-around text-center md:text-left lg:p-10">
            <RoughNotationGroup show={true}>
              <button
                onClick={() => handleClick("dev")}
                className="flex justify-center transform hover:scale-110 transition duration-300 ease-out"
              >
                <RainbowHighlight color={colors[0]}>
                  <h2 className="text-2xl md:text-4xl font-bold text-gray-700 dark:text-gray-200 my-2">
                    Developer
                  </h2>
                </RainbowHighlight>
              </button>

              <button
                onClick={() => handleClick("sound")}
                className="flex justify-center transform hover:scale-110 transition duration-300 ease-out"
              >
                <RainbowHighlight color={colors[2]}>
                  <h2 className="text-2xl md:text-4xl font-bold text-gray-700 dark:text-gray-200 my-2">
                    Sound
                  </h2>
                </RainbowHighlight>
              </button>

              <button
                onClick={() => handleClick("music")}
                className="flex justify-center transform hover:scale-110 transition duration-300 ease-out"
              >
                <RainbowHighlight color={colors[3]}>
                  <h2 className="text-2xl md:text-4xl font-bold text-gray-700 dark:text-gray-200 my-2">
                    Music
                  </h2>
                </RainbowHighlight>
              </button>
            </RoughNotationGroup>
          </div>
        </div>

        {/* Grid starts here */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 py-6 pb-40">
          {projectList.map((proj, idx) => (
            <ProjectCard
              key={`${proj.title}-${idx}`}
              title={proj.title}
              link={proj.link}
              imgUrl={proj.imgUrl}
              number={`${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

const ProjectCard = ({ title, link, imgUrl, number }) => {
  const isYouTubeLink = link.includes("youtube.com");
  const isVimeoLink = link.includes("vimeo.com");

  let thumbnailUrl;

  if (isYouTubeLink) {
    thumbnailUrl = `https://img.youtube.com/vi/${link.split("v=")[1]}/maxresdefault.jpg`;
  } else if (isVimeoLink) {
    // Extract Vimeo video ID from the link
    const vimeoVideoId = link.split("/").pop();
    thumbnailUrl = `https://i.vimeocdn.com/video/${vimeoVideoId}_640.jpg`; // Use a valid size (e.g., 640) for Vimeo thumbnails
  } else {
    thumbnailUrl = imgUrl;
  }

  return (
    <Link href={link} target="_blank" className="w-full block shadow-2xl fade-in">
      <div className="relative overflow-hidden">
        <div className="h-72 object-cover">
          <Image
            src={thumbnailUrl}
            alt={
              isYouTubeLink ? "YouTube Thumbnail" : isVimeoLink ? "Vimeo Thumbnail" : "portfolio"
            }
            className="transform hover:scale-125 transition duration-1000 ease-out object-cover h-full w-full"
            width={500}
            height={500}
          />
        </div>
        <h3 className="absolute top-10 left-10 text-gray-50 font-bold text-xl bg-red-500 rounded-md px-2">
          {title}
        </h3>
        <h3 className="absolute bottom-10 left-10 text-gray-50 font-bold text-xl">
          {number.length === 1 ? "0" + number : number}
        </h3>
      </div>
    </Link>
  );
};
