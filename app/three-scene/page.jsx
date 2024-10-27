"use client";
import dynamic from "next/dynamic";

const ThreeScene = dynamic(() => import("@components/Threescene").then((mod) => mod.ThreeScene), {
  loading: () => (
    <p className="text-4xl text-red-500" role="status">
      Loading 3D Scene...
    </p>
  ),
  ssr: false,
});

export default function ThreeScenePage() {
  return (
    <main id="main" className="min-h-screen">
      <ThreeScene />
    </main>
  );
}
