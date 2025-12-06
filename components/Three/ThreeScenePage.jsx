"use client";
import { useState, useEffect } from "react";
import { categories } from "@constants/frames";
import { ThreeEnvironment } from "./ThreeEnvironment";
import { cn } from "@lib/cn";
import WelcomeScreen from "./WelcomeScreen";

export function ThreeScenePage() {
  const [imagesArray, setImagesArray] = useState(categories[0].subFrames);
  const [isWelcome, setIsWelcome] = useState(true);
  const [shouldRenderCanvas, setShouldRenderCanvas] = useState(false);

  useEffect(() => {
    // Ensure Canvas renders after component mounts
    const timer = setTimeout(() => {
      setShouldRenderCanvas(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  function handleButtonClick(index) {
    setImagesArray(categories[index].subFrames);
  }

  return (
    <div className="absolute inset-0 z-10">
      <WelcomeScreen isWelcome={isWelcome} setIsWelcome={setIsWelcome} />

      {shouldRenderCanvas && <ThreeEnvironment images={imagesArray} />}

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
