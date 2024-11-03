"use client";
import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useCursor, MeshReflectorMaterial, Image, Text, Environment, OrbitControls, KeyboardControls, Html } from "@react-three/drei"; /* prettier-ignore */
import { easing } from "maath";
import getUuid from "uuid-by-string";
import { RigControls } from "./ThreeControls";
import ThreeText from "./ThreeText";
import { Physics, RigidBody } from "@react-three/rapier";
import Controller from "ecctrl";
import { Box } from "./MainScene";
import Link from "next/link";
import { cn } from "@lib/cn";

const GOLDENRATIO = 1.61803398875;
const MAP = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
  { name: "rightward", keys: ["ArrowRight", "KeyD"] },
  { name: "jump", keys: ["Space"] },
  { name: "run", keys: ["Shift"] },
];
export function ThreeSubFrames({ images }) {
  const ref = useRef();

  const [selectedId, setSelectedId] = useState(null);

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ fov: 70, position: [0, 2, 15] }}
      key={JSON.stringify(images)} // FOR RESETTING - REMOVE IN FUTURE
      // onPointerDown={(e) => {
      //   e.target.requestPointerLock();
      // }}
    >
      <color attach="background" args={["#191920"]} />
      <fog attach="fog" args={["#191920", 0, 15]} />
      <group position={[0, -0.5, 0]}>
        <Frames images={images} selectedId={selectedId} setSelectedId={setSelectedId} />
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[50, 50]} />
          <MeshReflectorMaterial
            blur={[300, 100]}
            resolution={2048}
            mixBlur={1}
            mixStrength={80}
            roughness={1}
            depthScale={1.2}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#050505"
            metalness={0.5}
          />
        </mesh>
      </group>
      <Environment preset="city" />
      {/* <Physics timeStep="vary">
        <KeyboardControls map={MAP}>
          <Controller
            camCollision={false} // disable camera collision detect (useless in FP mode)
            camInitDis={-0.01} // camera intial position
            camMinDis={-0.01} // camera zoom in closest position
            camFollowMult={1000} // give a big number here, so the camera follows the target (character) instantly
            camLerpMult={1000} // give a big number here, so the camera lerp to the followCam position instantly
            turnVelMultiplier={1} // Turning speed same as moving speed
            turnSpeed={100} // give it big turning speed to prevent turning wait time
            mode="CameraBasedMovement" // character's rotation will follow camera's rotation in this mode
          />
        </KeyboardControls>

        <RigidBody type="fixed" colliders="trimesh">
          <mesh ref={ref} position={[0, -1, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[100, 100]} />
            <meshBasicMaterial color="white" opacity={1} transparent />
          </mesh>
        </RigidBody>
      </Physics> */}
    </Canvas>
  );
}

function Frames({
  images,
  selectedId,
  setSelectedId,
  q = new THREE.Quaternion(),
  p = new THREE.Vector3(),
}) {
  const ref = useRef();
  const clicked = useRef();

  useEffect(() => {
    clicked.current = ref.current.getObjectByName(selectedId);
    if (clicked.current) {
      clicked.current.parent.updateWorldMatrix(true, true);
      clicked.current.parent.localToWorld(p.set(0, GOLDENRATIO / 2, 1.25));
      clicked.current.parent.getWorldQuaternion(q);
    } else {
      p.set(0, 0, 5.5);
      q.identity();
    }
  }, [selectedId]);

  useFrame((state, dt) => {
    easing.damp3(state.camera.position, p, 0.4, dt);
    easing.dampQ(state.camera.quaternion, q, 0.4, dt);
  });

  return (
    <group
      ref={ref}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedId(clicked.current === e.object ? null : e.object.name);
      }}
      onPointerMissed={() => setSelectedId(null)}
    >
      {images.map((props) => (
        <Frame key={props.name} selectedId={selectedId} {...props} url={props.url} />
      ))}
    </group>
  );
}

function Frame({ url, selectedId, c = new THREE.Color(), ...props }) {
  const image = useRef();
  const frame = useRef();
  const [hovered, hover] = useState(false);
  const [rnd] = useState(() => Math.random());
  const name = getUuid(props.name);
  const isActive = selectedId === name;

  useCursor(hovered);

  useFrame((state, dt) => {
    image.current.material.zoom = 1 + Math.sin(rnd * 10000 + state.clock.elapsedTime / 3) / 4;
    easing.damp3(
      image.current.scale,
      [0.85 * (!isActive && hovered ? 0.85 : 1), 0.9 * (!isActive && hovered ? 0.905 : 1), 1],
      0.1,
      dt
    );
    easing.dampC(frame.current.material.color, hovered ? "orange" : "white", 0.1, dt);
  });

  return (
    <group {...props}>
      <mesh
        name={name}
        onPointerOver={(e) => (e.stopPropagation(), hover(true))}
        onPointerOut={() => hover(false)}
        scale={[GOLDENRATIO, 1, 0.05]}
        position={[0, GOLDENRATIO / 2, 0]}
      >
        <boxGeometry />
        <meshStandardMaterial color="#151515" metalness={0.5} roughness={0.5} envMapIntensity={2} />
        <mesh ref={frame} raycast={() => null} scale={[0.9, 0.93, 0.9]} position={[0, 0, 0.2]}>
          <boxGeometry />
          <meshBasicMaterial toneMapped={false} fog={false} />
        </mesh>
        <Image raycast={() => null} ref={image} position={[0, 0, 0.7]} url={url} />
      </mesh>
      <Text
        maxWidth={0.1}
        anchorX="left"
        anchorY="top"
        position={[0.55, GOLDENRATIO, 0]}
        fontSize={0.025}
      >
        {name.split("-").join(" ")}
      </Text>
      {hovered && (
        <ThreeText position={[-0.55, GOLDENRATIO - 0.2, 0]} scale={0.05} text={props.name} />
      )}
      {isActive && (
        <Html
          position={[-1, GOLDENRATIO / 2, 0]}
          center
          style={{
            pointerEvents: "auto",
          }}
        >
          <Link
            href={props.link}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "bg-slate-700 min-w-[150px] text-white px-3 py-2 rounded text-sm",
              "block transition-all hover:bg-slate-900 hover:scale-105",
              "hover:border-2 border-slate-600"
            )}
          >
            go to content ↗ <br />
            (opens a new tab)
          </Link>
        </Html>
      )}
    </group>
  );
}
