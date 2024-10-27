"use client";

import { usePathname, useRouter } from "next/navigation";
import { cn } from "@lib/cn";

export function ThreeToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const isThreeD = pathname === "/threescene";

  return (
    <button
      onClick={() => router.push(isThreeD ? "/" : "/threescene")}
      className={cn(
        "fixed top-2 left-1/2 z-50 transform -translate-x-1/2",
        "px-4 py-1 rounded-md",
        "bg-gray-800 dark:bg-gray-200 text-gray-200 dark:text-gray-800",
        "hover:bg-gray-700 dark:hover:bg-gray-300",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      )}
      aria-label={isThreeD ? "Switch to Classic View" : "Switch to 3D View"}
    >
      {isThreeD ? "Switch to Classic View" : "Switch to 3D Version"}
    </button>
  );
}
