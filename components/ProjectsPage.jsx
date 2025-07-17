"use client";
import userData from "@constants/data";
import { RoughNotationGroup } from "react-rough-notation";
import { RainbowHighlight } from "./RainbowHighlight";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function ProjectsPage() {
  const projects = userData.projects;
  const colors = ["#F59E0B", "#84CC16", "#10B981", "#3B82F6"];

  const [projectList, setProjectList] = useState(projects.dev);

  const handleClick = (listName) => {
    setProjectList(projects[listName]);
  };

  return (
    <section className="bg-white dark:bg-gray-800">
      <div className="max-w-6xl mx-auto h-48 bg-white dark:bg-gray-800">
        <h3 className=" text-5xl md:text-9xl font-bold py-20 text-center md:text-left">Projects</h3>
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
                  <h4 className="text-2xl md:text-4xl font-bold text-gray-700 dark:text-gray-200 my-2">
                    Developer
                  </h4>
                </RainbowHighlight>
              </button>

              <button
                onClick={() => handleClick("sound")}
                className="flex justify-center transform hover:scale-110 transition duration-300 ease-out"
              >
                <RainbowHighlight color={colors[2]}>
                  <h4 className="text-2xl md:text-4xl font-bold text-gray-700 dark:text-gray-200 my-2">
                    Sound
                  </h4>
                </RainbowHighlight>
              </button>

              <button
                onClick={() => handleClick("music")}
                className="flex justify-center transform hover:scale-110 transition duration-300 ease-out"
              >
                <RainbowHighlight color={colors[3]}>
                  <h4 className="text-2xl md:text-4xl font-bold text-gray-700 dark:text-gray-200 my-2">
                    Music
                  </h4>
                </RainbowHighlight>
              </button>
            </RoughNotationGroup>
          </div>
        </div>

        {/* Grid starts here */}
        <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 py-6 pb-40">
          {projectList.map((proj, idx) => (
            <ProjectCard
              key={`${proj.link}-${idx}`}
              title={proj.title}
              link={proj.link}
              imgUrl={proj.imgUrl}
              number={`${idx + 1}`}
            />
          ))}
        </section>
      </div>
    </section>
  );
}

const ProjectCard = ({ title, link, imgUrl, number }) => {
  return (
    <Link href={link} target="_blank" className="w-full block shadow-2xl fade-in">
      <div className="relative overflow-hidden">
        <div className="h-72 object-cover">
          <Image
            src={imgUrl}
            alt={"portfolio" + number}
            className="transform hover:scale-125 transition duration-1000 ease-out object-cover h-full w-full"
            width={500}
            height={500}
          />
        </div>
        <h3 className="absolute top-6 left-6 text-gray-50 font-bold text-xl bg-red-500 rounded-md px-2">
          {title}
        </h3>
        <h3 className="absolute bottom-6 left-6 bg-red-500 rounded-md px-2 text-gray-50 font-bold text-xl">
          {number.length === 1 ? "0" + number : number}
        </h3>
      </div>
    </Link>
  );
};
