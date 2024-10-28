import { cn } from "@lib/cn";

export default function ThreeControlsOverlay() {
  return (
    <div
      className={cn(
        "absolute top-4 left-4 z-10 transform ",
        "bg-black/50 text-white",
        "px-4 pt-2 pb-4 rounded-md",
        "flex flex-col items-center gap-4"
      )}
    >
      <p className="text-lg">Click anywhere to start</p>
      <p className="opacity-75">
        WASD - Move <br /> SHIFT - Sprint <br /> Mouse - Look <br /> ESC - Exit
      </p>
    </div>
  );
}
