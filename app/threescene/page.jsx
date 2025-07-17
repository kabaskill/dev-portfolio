import dynamic from "next/dynamic";

export const metadata = {
  title: "3D Portfolio",
};

const ThreeScenePage = dynamic(
  () => import("@components/Three/ThreeScenePage").then((mod) => mod.ThreeScenePage),
  {
    loading: () => (
      <p
        className="absolute inset-0 w-full h-full flex items-center justify-center text-4xl"
        role="status"
      >
        Loading 3D Scene...
      </p>
    ),
    ssr: false,
  }
);

export default function ThreeScene() {
  return (
    <section className="absolute inset-0 z-10 w-full h-full ">
      <ThreeScenePage />
    </section>
  );
}
