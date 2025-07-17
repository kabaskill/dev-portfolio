"use client";
import { useState } from "react";
import { categories } from "@constants/frames";
import { ThreeEnvironment } from "./ThreeEnvironment";
import { cn } from "@lib/cn";
import WelcomeScreen from "./WelcomeScreen";

export function ThreeScenePage() {
  const [imagesArray, setImagesArray] = useState(categories[0].subFrames);
  const [isWelcome, setIsWelcome] = useState(true);

  function handleButtonClick(index) {
    setImagesArray(categories[index].subFrames);
  }

  return (
    <div className="absolute inset-0 z-10">
      <WelcomeScreen isWelcome={isWelcome} setIsWelcome={setIsWelcome} />

      <ThreeEnvironment images={imagesArray} />

      <div className="absolute top-12 left-1/2 translate-x-[-50%] flex gap-4">
        <select
          className={cn(
            "rounded-md bg-slate-400 py-2 px-4 w-[200px]",
            "hover:bg-slate-600",
            "flex items-center justify-center",
            "font-sans text-gray-100"
          )}
          onChange={(e) => handleButtonClick(e.target.selectedIndex)}
        >
          <option>Developer</option>
          <option>Sound</option>
          <option>Music</option>
        </select>
      </div>
    </div>
  );
}
