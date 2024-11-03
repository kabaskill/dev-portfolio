import { useRef, useState } from "react";
import ThreeFrame from "./ThreeFrame";
import { extend, useFrame } from "@react-three/fiber";
import ThreeText from "./ThreeText";
import { categories } from "@constants/frames";
import { ThreeSubFrames } from "./ThreeSubFrames";

extend({ ThreeSubFrames });

export default function MainScene({ setIsHoveringFrame, router }) {
  const frames = useRef([]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />

      <ThreeText />

      {categories.map((item) => (
        <ThreeFrame
          key={item.id}
          {...item}
          bg="#ccc"
          frames={frames}
          setIsHoveringFrame={setIsHoveringFrame}
          router={router}
        >
          {/* Each portal's content */}
          <group position={[0, 0, -3]}>
            {/* Portal-specific lighting */}
            <ambientLight intensity={1} />
            <pointLight position={[2, 2, -3]} intensity={1} />
            <spotLight position={[0, 5, 2]} angle={0.4} penumbra={1} intensity={1} castShadow />

            <Box position={item.position} />
          </group>
        </ThreeFrame>
      ))}
    </>
  );
}

export function Box({ position }) {
  const ref = useRef();
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);

  // useFrame((state, delta) => (ref.current.rotation.x += delta));

  return (
    <mesh
      ref={ref}
      position={position}
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
