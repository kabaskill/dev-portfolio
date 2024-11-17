"use client";
import { Center, Text3D } from "@react-three/drei";
import { useRef, useState } from "react";
import { useSpring, animated } from "@react-spring/three";

// Separate the animated text into its own component
function AnimatedText({ text, position, scale }) {
  const textRef = useRef();

  const springs = useSpring({
    to: {
      scale: scale,
      opacity: 1,
      position: position,
      color: "#000",
    },
    from: {
      scale: 0,
      opacity: 0,
      position: [0, 0, 0],
      color: "#bbb",
    },
    config: {
      mass: 2,
      tension: 180,
      friction: 50,
    },
  });

  return (
    <animated.mesh scale={springs.scale} position={springs.position}>
      <Center>
        <Text3D
          ref={textRef}
          font={"./fonts/helvetiker_regular.typeface.json"}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02 * scale}
          bevelSize={0.02 * scale}
          bevelOffset={0}
          bevelSegments={5}
        >
          {text}
          <animated.meshNormalMaterial transparent opacity={springs.opacity} />
        </Text3D>
      </Center>
    </animated.mesh>
  );
}

export default function ThreeText({ text = "Hello there!", position = [0, 1.2, 0], scale = 1 }) {
  return (
    <group>
      <AnimatedText key={text} text={text} position={position} scale={scale} />
    </group>
  );
}
