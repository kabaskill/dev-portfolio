

import { cn } from "@lib/cn";

export default function ThreeBackButton({ router }) {
  return (
    <button
      onClick={() => {
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.delete("view");
        router.push(`${window.location.pathname}?${searchParams.toString()}`, { scroll: false });
      }}
      className={cn(
        "absolute top-4 left-4 z-10",
        "px-4 py-2 rounded-md",
        "bg-slate-600 text-white",
        "hover:bg-black/70",
        "transition-colors duration-200"
      )}
    >
      Back to Gallery
    </button>
  );
}