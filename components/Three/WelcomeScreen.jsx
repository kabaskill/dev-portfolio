import { cn } from "@lib/cn";
import {
  PiMouseLeftClickFill,
  PiMouseRightClickFill,
  PiMouseMiddleClickFill,
} from "react-icons/pi";
import { FaArrowsRotate } from "react-icons/fa6";
import { RxGear } from "react-icons/rx";
import { MdOutlineTouchApp, MdOutlinePinch } from "react-icons/md";
import { useState } from "react";

export default function WelcomeScreen({ isWelcome, setIsWelcome }) {
  const [isIntro, setIsIntro] = useState(true);

  function closeOverlay() {
    if (isIntro) {
      setIsIntro(false);
    } else {
      setIsWelcome(false);
    }
  }

  return (
    <>
      {isWelcome ? (
        <div
          className={cn(
            "fade-in",
            "absolute z-50 inset-0",
            " cursor-pointer",
            "bg-gradient-to-b from-slate-800/90 to-slate-700/90 shadow-lg shadow-black/50",
            "py-6 px-4 sm:px-6 md:px-8 rounded-lg text-center text-white",
            "flex flex-col items-center justify-evenly gap-4 sm:gap-6"
          )}
          onClick={() => closeOverlay()}
        >
          {isIntro ? <Intro /> : <MainMessage />}
        </div>
      ) : (
        <div
          className={cn(
            "absolute z-20 bottom-4 right-4 w-12 h-12",
            "bg-slate-800/80 hover:bg-slate-600 text-white rounded-full",
            "flex items-center justify-center cursor-pointer shadow-lg shadow-black/40",
            "transition-colors duration-300"
          )}
        >
          <RxGear
            onClick={() => setIsWelcome(true)}
            className="text-3xl transition-transform duration-300 hover:rotate-90"
          />
        </div>
      )}
    </>
  );
}

function Intro() {
  return (
    <div className="fade-in flex flex-col items-center justify-evenly gap-4 sm:gap-6">
      <p className="text-3xl sm:text-4xl font-semibold tracking-wide">Welcome</p>
      <p className="text-base sm:text-lg font-light">
        If you are on a mobile device, rotate your device to get a better view
      </p>
      <FaArrowsRotate
        className="text-3xl sm:text-4xl animate-[spin_1.5s_ease_infinite_forwards]"
        style={{ transform: "rotate(180deg)" }}
      />
      <p className="text-base sm:text-lg font-light text-gray-300">Click/Tap to continue</p>
    </div>
  );
}

function MainMessage() {
  return (
    <div className="fade-in flex flex-col items-center justify-start gap-4 sm:gap-6 overflow-y-auto  p-4 sm:p-6">
      <p className="text-3xl sm:text-4xl font-semibold tracking-wide">Controls</p>
      <p className="text-base sm:text-lg font-light">
        You can use the mouse or gestures to navigate
      </p>
      <p className="text-sm sm:text-lg font-light text-gray-300">
        Select a category from the dropdown at the top <br />
        to see more work examples
      </p>
      <p className="text-sm sm:text-lg font-light text-gray-300">
        You can interact with the audio playback by clicking on the sphere
      </p>
      <div className="flex items-center justify-between w-full">
        <PiMouseLeftClickFill className="text-xl sm:text-2xl" />
        <p className="text-sm sm:text-base ">
          Click/Tap on a Frame to give it a closer look <br /> Click/Tap outside the frame to exit
        </p>
        <MdOutlineTouchApp className="text-xl sm:text-2xl" />
      </div>
      <div className="flex items-center justify-between w-full">
        <PiMouseLeftClickFill className="text-xl sm:text-2xl" />
        <p className="text-sm sm:text-base ">Hold Left click/Swipe to look around</p>
        <MdOutlineTouchApp className="text-xl sm:text-2xl" />
      </div>
      <div className="flex items-center justify-between w-full">
        <PiMouseRightClickFill className="text-xl sm:text-2xl" />
        <p className="text-sm sm:text-base ">
          Hold Right click/Swipe with two fingers to move around
        </p>
        <MdOutlineTouchApp className="text-xl sm:text-2xl" />
      </div>
      <div className="flex items-center justify-between w-full">
        <PiMouseMiddleClickFill className="text-xl sm:text-2xl" />
        <p className="text-sm sm:text-base ">Scroll/Pinch to Zoom</p>
        <MdOutlinePinch className="text-xl sm:text-2xl" />
      </div>
      <p className="text-sm sm:text-lg font-light text-gray-300">
        Click/Tap to continue.
        <br /> If you need to look at the controls, Click/Tap the gear icon on the bottom right.
      </p>
      <p className="text-base sm:text-lg font-semibold">Have fun!</p>
    </div>
  );
}
