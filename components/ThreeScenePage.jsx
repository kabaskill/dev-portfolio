"use client";
import * as THREE from "three";
import { useEffect, useRef, useState, useMemo } from "react";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import { MeshPortalMaterial, Gltf, Text, Preload, PointerLockControls } from "@react-three/drei";
import { geometry } from "maath";
import { cn } from "@lib/cn";
import { useRouter } from "next/navigation";

extend(geometry);

const MOVEMENT_SPEED = 0.02;
const SPRINT_MULTIPLIER = 2;
const COLLISION_THRESHOLD = 1.5;
const GOLDEN_RATIO = 1.61803398875;

const MOVEMENT_KEYS = {
  FORWARD: "KeyW",
  BACKWARD: "KeyS",
  LEFT: "KeyA",
  RIGHT: "KeyD",
  SPRINT: "ShiftLeft",
};

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
      <ControlsOverlay />

      {isLocked && <Crosshair isHoveringFrame={isHoveringFrame} />}

      <Canvas flat camera={{ fov: 75, position: [0, 0, 3] }}>
        <color attach="background" args={["#6895b8"]} />
        <Scene setIsHoveringFrame={setIsHoveringFrame} router={router} />
        <FPSControls setIsLocked={setIsLocked} />
        <Preload all />
      </Canvas>
    </div>
  );
}

function ControlsOverlay() {
  return (
    <div
      className={cn(
        "absolute top-4 left-4 z-10 transform ",
        "bg-black/50 text-white",
        "px-4 pt-2 pb-4 rounded-md",
        "flex flex-col items-center gap-4"
      )}
    >
      <p className="text-lg">Click anywhere to start</p>
      <p className="opacity-75">
        WASD - Move <br /> SHIFT - Sprint <br /> Mouse - Look <br /> ESC - Exit
      </p>
    </div>
  );
}

function Crosshair({ isHoveringFrame }) {
  return (
    <div
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      style={{ transition: "all 0.3s ease", zIndex: 9999 }}
    >
      <svg
        width={isHoveringFrame ? "40" : "20"}
        height={isHoveringFrame ? "40" : "20"}
        viewBox="0 0 40 40"
        style={{ transition: "all 0.2s ease" }}
      >
        <circle
          cx="20"
          cy="20"
          r={isHoveringFrame ? "12" : "8"}
          fill="#e5e5e5"
          opacity={isHoveringFrame ? "0.8" : "0.5"}
        />
      </svg>
    </div>
  );
}

function Scene({ setIsHoveringFrame, router }) {
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
      {frameProps.map((props) => (
        <Frame
          key={props.id}
          {...props}
          bg="#1a1a1a"
          frames={frames}
          setIsHoveringFrame={setIsHoveringFrame}
          router={router}
        />
      ))}
    </>
  );
}

function Frame({
  id,
  name,
  author,
  bg,
  width = 1,
  height = GOLDEN_RATIO,
  children,
  frames,
  setIsHoveringFrame,
  router,
  ...props
}) {
  const frameRef = useRef();
  const portal = useRef();
  const collisionBox = useMemo(() => new THREE.Box3(), []);

  const handleDoubleClick = () => {
    router.push(`?view=${id}`);
  };

  useEffect(() => {
    if (frameRef.current && frames) {
      frames.current.push({
        id,
        ref: frameRef,
        collisionBox,
      });

      return () => {
        const index = frames.current.findIndex((frame) => frame.id === id);
        if (index !== -1) {
          frames.current.splice(index, 1);
        }
      };
    }
  }, [id, frames, collisionBox]);

  useFrame(() => {
    if (frameRef.current) {
      collisionBox.setFromObject(frameRef.current);
      collisionBox.min.subScalar(0.5);
      collisionBox.max.addScalar(0.5);
    }
  });

  useEffect(() => {
    if (frameRef.current) {
      frameRef.current.userData.isFrame = true;
    }
  }, []);

  const currentView =
    typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("view") : null;

  return (
    <group onDoubleClick={handleDoubleClick} {...props} ref={frameRef}>
      <Text
        fontSize={0.15}
        anchorY="top"
        anchorX="left"
        lineHeight={0.8}
        position={[-0.375, 0.715, 0.01]}
        material-toneMapped={false}
      >
        {name}
      </Text>
      <Text
        fontSize={0.1}
        anchorX="right"
        position={[0.4, -0.659, 0.01]}
        material-toneMapped={false}
      >
        /{id}
      </Text>
      <Text
        fontSize={0.04}
        anchorX="right"
        position={[0.0, -0.677, 0.01]}
        material-toneMapped={false}
      >
        {author}
      </Text>
      <mesh
        onPointerOver={() => setIsHoveringFrame(true)}
        onPointerOut={() => setIsHoveringFrame(false)}
      >
        <roundedPlaneGeometry args={[width, height, 0.1]} />
        <MeshPortalMaterial ref={portal} events={currentView === id} side={THREE.DoubleSide}>
          <color attach="background" args={[bg]} />
          {children}
        </MeshPortalMaterial>
      </mesh>
    </group>
  );
}

function FPSControls({ setIsLocked }) {
  const { camera, scene } = useThree();
  const controlsRef = useRef();
  const movementRef = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    sprint: false,
  });
  const velocityRef = useRef(new THREE.Vector3());
  const nextPositionRef = useRef(new THREE.Vector3());

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.code) {
        case MOVEMENT_KEYS.FORWARD:
          movementRef.current.forward = true;
          break;
        case MOVEMENT_KEYS.BACKWARD:
          movementRef.current.backward = true;
          break;
        case MOVEMENT_KEYS.LEFT:
          movementRef.current.left = true;
          break;
        case MOVEMENT_KEYS.RIGHT:
          movementRef.current.right = true;
          break;
        case MOVEMENT_KEYS.SPRINT:
          movementRef.current.sprint = true;
          break;
      }
    };

    const handleKeyUp = (event) => {
      switch (event.code) {
        case MOVEMENT_KEYS.FORWARD:
          movementRef.current.forward = false;
          break;
        case MOVEMENT_KEYS.BACKWARD:
          movementRef.current.backward = false;
          break;
        case MOVEMENT_KEYS.LEFT:
          movementRef.current.left = false;
          break;
        case MOVEMENT_KEYS.RIGHT:
          movementRef.current.right = false;
          break;
        case MOVEMENT_KEYS.SPRINT:
          movementRef.current.sprint = false;
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useFrame(() => {
    if (!controlsRef.current?.isLocked) return;

    const speedMultiplier = movementRef.current.sprint ? SPRINT_MULTIPLIER : 1;
    const speed = MOVEMENT_SPEED * speedMultiplier;

    // Get movement input
    const forward = Number(movementRef.current.forward) - Number(movementRef.current.backward);
    const right = Number(movementRef.current.right) - Number(movementRef.current.left);

    // Get camera's forward and right directions
    const matrix = new THREE.Matrix4();
    matrix.extractRotation(camera.matrix);

    const forwardVector = new THREE.Vector3(0, 0, -1);
    forwardVector.applyMatrix4(matrix);
    forwardVector.y = 0; // Keep movement in xz plane
    forwardVector.normalize();

    const rightVector = new THREE.Vector3(1, 0, 0);
    rightVector.applyMatrix4(matrix);
    rightVector.y = 0; // Keep movement in xz plane
    rightVector.normalize();

    // Calculate movement
    velocityRef.current.set(0, 0, 0);
    if (forward !== 0) velocityRef.current.addScaledVector(forwardVector, forward * speed);
    if (right !== 0) velocityRef.current.addScaledVector(rightVector, right * speed);

    nextPositionRef.current.copy(camera.position).add(velocityRef.current);

    // Collision check
    let canMove = true;
    scene.traverse((object) => {
      if (object.userData.isFrame) {
        const distance = nextPositionRef.current.distanceTo(object.position);
        if (distance < COLLISION_THRESHOLD) {
          canMove = false;
        }
      }
    });

    if (canMove) {
      camera.position.add(velocityRef.current);
    }
  });

  return (
    <PointerLockControls
      ref={controlsRef}
      onLock={() => setIsLocked(true)}
      onUnlock={() => setIsLocked(false)}
    />
  );
}
