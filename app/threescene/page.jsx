import dynamic from "next/dynamic";

export const metadata = {
  title: "3D Portfolio",
};

const ThreeScenePage = dynamic(
  () => import("@components/ThreeScenePage").then((mod) => mod.ThreeScenePage),
  {
    loading: () => (
      <p
        className="absolute inset-0 flex items-center justify-center text-4xl text-red-500"
        role="status"
      >
        Loading 3D Scene...
      </p>
    ),
    ssr: false,
  }
);

export default function ThreeScene() {
  return <ThreeScenePage />;
}
