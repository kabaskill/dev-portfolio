"use client";

import dynamic from "next/dynamic";

const ThreeScenePage = dynamic(
  () => import("@components/Three/ThreeScenePage").then((mod) => ({
    default: mod.ThreeScenePage,
  })),
  {
    loading: () => (
      <div className="absolute inset-0 w-full h-full flex items-center justify-center text-4xl">
        Loading 3D Scene...
      </div>
    ),
    ssr: false,
  }
);

export default function ThreeScene() {
  return (
    <section className="absolute inset-0 z-10 w-full h-full">
      <ThreeScenePage />
    </section>
  );
}
