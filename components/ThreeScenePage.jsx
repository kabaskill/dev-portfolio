"use client";

import { useEffect, useState } from "react";
import { Canvas, extend, useThree } from "@react-three/fiber";
import { CameraControls, Gltf, Preload } from "@react-three/drei";
import * as THREE from "three";
import { geometry } from "maath";
import { usePathname, useRouter } from "next/navigation";

import ThreeControlsOverlay from "./ThreeControlsOverlay";
import ThreeCrosshair from "./ThreeCrosshair";
import ThreeFPSControls from "./ThreeFpsControls";
import Scene from "./Scene";

extend(geometry);

export function ThreeScenePage() {
  const [isLocked, setIsLocked] = useState(false);
  const [isHoveringFrame, setIsHoveringFrame] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className=" absolute inset-0 z-10">
      <ThreeControlsOverlay />

      {isLocked && <ThreeCrosshair isHoveringFrame={isHoveringFrame} />}

      <Canvas flat camera={{ fov: 75, position: [0, 0, 3] }}>
        <color attach="background" args={["#6895b8"]} />
        <Scene setIsHoveringFrame={setIsHoveringFrame} router={router} />
        {/* <ThreeFPSControls setIsLocked={setIsLocked} /> */}
        <Rig />
        <Preload all />
      </Canvas>
    </div>
  );
}

function Rig({ position = new THREE.Vector3(0, 0, 2), focus = new THREE.Vector3(0, 0, 0) }) {
  const { controls, scene } = useThree();
  const params = usePathname();

  useEffect(() => {
    const active = scene.getObjectByName(params?.id);
    if (active) {
      active.parent.localToWorld(position.set(0, 0.5, 0.25));
      active.parent.localToWorld(focus.set(0, 0, -2));
    }
    controls?.setLookAt(...position.toArray(), ...focus.toArray(), true);
  });
  return <CameraControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2} />;
}
