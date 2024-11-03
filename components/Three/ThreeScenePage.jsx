"use client";
import { useEffect, useState } from "react";
import { Canvas, extend } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import { geometry } from "maath";
import { useRouter } from "next/navigation";

import ThreeControlsOverlay from "./ThreeControlsOverlay";
import ThreeCrosshair from "./ThreeCrosshair";
import { FPSControls, RigControls } from "./ThreeControls";
import MainScene from "./MainScene";
import ThreeBackButton from "./ThreeBackButton";
import { categories } from "@constants/frames";
import { ThreeSubFrames } from "./ThreeSubFrames";
import { cn } from "@lib/cn";

const BG_COLOR = "#75ade6";

extend(geometry);

export function ThreeScenePage() {
  // const router = useRouter();
  // const [isLocked, setIsLocked] = useState(false);
  // const [isHoveringFrame, setIsHoveringFrame] = useState(false);
  // const [isFPSControlsActive, setIsFPSControlsActive] = useState(false);
  const [activeControls, setActiveControls] = useState("orbit");

  const [imagesIndex, setImagesIndex] = useState(categories[0].subFrames);

  function handleControlsToggle(event) {
    event.stopPropagation();

    if (activeControls === "orbit") {
      setActiveControls("fps");
      setIsFPSControlsActive(true);
    } else {
      setActiveControls("orbit");
      setIsFPSControlsActive(false);

      if (document.pointerLockElement) {
        document.exitPointerLock();
      }
      setIsLocked(false);
    }
  }

  // useEffect(() => {
  //   return () => {
  //     if (document.pointerLockElement) {
  //       document.exitPointerLock();
  //     }
  //   };
  // }, []);

  function handleButtonClick(index) {
    setImagesIndex(categories[index].subFrames);
  }

  return (
    <div className="absolute inset-0 z-10">
      <ThreeSubFrames images={imagesIndex} />

      <div className="absolute bottom-4 left-1/2 translate-x-[-50%] flex gap-4">
        <button
          className={cn("bg-slate-400 py-2 w-[200px]", "hover:bg-slate-600", "focus:bg-red-500 ")}
          onClick={() => handleButtonClick(0)}
        >
          Developer
        </button>
        <button
          className={cn("bg-slate-400 py-2 w-[200px]", "hover:bg-slate-600", "focus:bg-red-500 ")}
          onClick={() => handleButtonClick(1)}
        >
          Sound
        </button>
        <button
          className={cn("bg-slate-400 py-2 w-[200px]", "hover:bg-slate-600", "focus:bg-red-500 ")}
          onClick={() => handleButtonClick(2)}
        >
          Music
        </button>
      </div>

      {/* <ThreeControlsOverlay
        isFPSControlsActive={isFPSControlsActive}
        handleControlsToggle={handleControlsToggle}
      />

      {new URLSearchParams(window.location.search).get("view") && (
        <ThreeBackButton router={router} />
      )}

      {isLocked && <ThreeCrosshair isHoveringFrame={isHoveringFrame} />}

      <Canvas flat camera={{ fov: 85, position: [0, 0, 3] }}>
        <color attach="background" args={[BG_COLOR]} />
        <MainScene setIsHoveringFrame={setIsHoveringFrame} router={router} />

        {activeControls === "fps" ? (
          <FPSControls
            setIsLocked={setIsLocked}
            setActiveControls={setActiveControls}
            setIsFPSControlsActive={setIsFPSControlsActive}
          />
        ) : (
          <RigControls />
        )}
      <Preload all />
      </Canvas> */}
    </div>
  );
}
