"use client";
import { usePathname } from "next/navigation";
import { cn } from "@lib/cn";
import Link from "next/link";

export function ThreeToggle() {
  const pathname = usePathname();
  const isThreeD = pathname.startsWith("/threescene");

  return (
    <Link
      href={isThreeD ? "/" : "/threescene"}
      className={cn(
        "fixed top-0 left-1/2 z-50 transform -translate-x-1/2",
        "px-4 py-1  text-center",
        "w-full",
        "bg-gray-800 dark:bg-gray-200 text-gray-200 dark:text-gray-800",
        "hover:bg-gray-700 dark:hover:bg-gray-300"
      )}
      aria-label={isThreeD ? "Switch to Classic View" : "Switch to 3D View"}
    >
      {isThreeD ? "Switch to Classic View" : "Switch to 3D Version"}
    </Link>
  );
}
