import { useMemo, useRef, useState } from "react";
import ThreeFrame from "./ThreeFrame";
import { useFrame } from "@react-three/fiber";

export default function Scene({ setIsHoveringFrame, router }) {
  const frames = useRef([]);

  const frameProps = useMemo(
    () => [
      {
        id: "01",
        name: "Developer",
        author: "Next.js",
        position: [-1.15, 0, 0],
        rotation: [0, 0.5, 0],
      },
      {
        id: "02",
        name: "Designer",
        author: "Three.js",
        position: [0, 0, 0],
        rotation: [0, 0, 0],
      },
      {
        id: "03",
        name: "Composer",
        author: "React",
        position: [1.15, 0, 0],
        rotation: [0, -0.5, 0],
      },
    ],
    []
  );

  return (
    <>
      {/* Main scene lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />

      {frameProps.map((props) => (
        <ThreeFrame
          key={props.id}
          {...props}
          bg="#1a1a1a"
          frames={frames}
          setIsHoveringFrame={setIsHoveringFrame}
          router={router}
        >
          {/* Each portal's content */}
          <group position={[0, 0, -5]}>
            {/* Portal-specific lighting */}
            <ambientLight intensity={0.8} />
            <pointLight position={[2, 2, 2]} intensity={1} />
            <spotLight position={[0, 5, 2]} angle={0.4} penumbra={1} intensity={1} castShadow />

            <Box />
          </group>
        </ThreeFrame>
      ))}
    </>
  );
}

function Box() {
  const ref = useRef();
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);

  useFrame((state, delta) => (ref.current.rotation.x += delta));

  return (
    <mesh
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => (event.stopPropagation(), hover(true))}
      onPointerOut={(event) => hover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
}
