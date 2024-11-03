import { cn } from "@lib/cn";

export default function ThreeControlsOverlay({ isFPSControlsActive, handleControlsToggle }) {
  return (
    <div
      className={cn(
        "absolute top-4 right-4 z-50 transform",
        "bg-black/50 text-white",
        "px-6 py-4 rounded-lg",
        "flex flex-col items-center gap-4"
      )}
    >
      {isFPSControlsActive ? (
        <p className="opacity-75">
          WASD - Move <br /> SHIFT - Sprint <br /> Mouse - Look <br /> ESC - Exit
        </p>
      ) : (
        <p className="opacity-75">
          Left Click - Rotate <br /> Right Click - Pan <br /> Scroll - Zoom
        </p>
      )}

      <button
        className={cn(
          "z-20 px-4 py-1 rounded-md",
          "bg-gray-800 dark:bg-gray-200 text-gray-200 dark:text-gray-800",
          "hover:bg-gray-700 dark:hover:bg-gray-300"
        )}
        onClick={handleControlsToggle}
      >
        {isFPSControlsActive ? "Switch to Orbit Controls" : "Switch to FPS Controls"}
      </button>
    </div>
  );
}
