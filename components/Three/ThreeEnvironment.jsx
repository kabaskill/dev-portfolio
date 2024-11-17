"use client";
import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useCursor, MeshReflectorMaterial, Image, Text, Environment, OrbitControls, KeyboardControls, Html } from "@react-three/drei"; /* prettier-ignore */
import { easing } from "maath";
import getUuid from "uuid-by-string";
import ThreeText from "./ThreeText";
import { Physics, RigidBody } from "@react-three/rapier";
import Controller from "ecctrl";

const GOLDENRATIO = 1.61803398875;
const TRANSITION_DURATION = 0.7;
const MAP = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
  { name: "rightward", keys: ["ArrowRight", "KeyD"] },
  { name: "jump", keys: ["Space"] },
  { name: "run", keys: ["Shift"] },
];
export function ThreeEnvironment({ images }) {
  const controlsRef = useRef();
  const [selectedId, setSelectedId] = useState(null);

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{
        position: [0, 2, 5],
        fov: 75,
      }}
    >
      <color attach="background" args={["#191920"]} />
      <fog attach="fog" args={["#191920", 0, 15]} />

      <group position={[0, -1, 0]}>
        <Frames
          images={images}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          controlsRef={controlsRef}
        />
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

      <OrbitControls
        ref={controlsRef}
        enabled={!selectedId}
        enableDamping
        dampingFactor={0.1}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.5}
        minDistance={1}
        maxDistance={8}
        zoomSpeed={0.6}
        screenSpacePanning={false}
        panSpeed={4}
        makeDefault
      />

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
          <mesh ref={controlsRef} position={[0, -1, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[100, 100]} />
            <meshBasicMaterial color="white" opacity={1} transparent />
          </mesh>
        </RigidBody>
      </Physics> */}
    </Canvas>
  );
}
function Frames({ images, selectedId, setSelectedId, controlsRef }) {
  const ref = useRef();
  const clicked = useRef();
  const { camera } = useThree();
  const transitionRef = useRef({
    active: false,
    startTime: 0,
    startPos: new THREE.Vector3(),
    startQuat: new THREE.Quaternion(),
    targetPos: new THREE.Vector3(),
    targetQuat: new THREE.Quaternion(),
    initialControlsTarget: new THREE.Vector3(),
    originalPos: new THREE.Vector3(),
    originalQuat: new THREE.Quaternion(),
    hasStoredOriginal: false,
  });

  useEffect(() => {
    clicked.current = ref.current.getObjectByName(selectedId);
    const transition = transitionRef.current;

    if (clicked.current) {
      if (!transition.hasStoredOriginal) {
        transition.originalPos.copy(camera.position);
        transition.originalQuat.copy(camera.quaternion);
        transition.hasStoredOriginal = true;
      }

      transition.startPos.copy(camera.position);
      transition.startQuat.copy(camera.quaternion);

      if (controlsRef.current) {
        transition.initialControlsTarget.copy(controlsRef.current.target);
        controlsRef.current.enabled = false;
      }

      clicked.current.parent.parent.updateWorldMatrix(true, true);
      transition.targetPos.set(0, GOLDENRATIO / 2, 1.25);
      clicked.current.parent.parent.localToWorld(transition.targetPos);
      clicked.current.parent.parent.getWorldQuaternion(transition.targetQuat);
    } else if (transition.hasStoredOriginal) {
      transition.startPos.copy(camera.position);
      transition.startQuat.copy(camera.quaternion);

      transition.targetPos.copy(transition.originalPos);
      transition.targetQuat.copy(transition.originalQuat);

      if (controlsRef.current) {
        controlsRef.current.target.copy(transition.initialControlsTarget);
      }
    }

    transition.active = true;
    transition.startTime = 0;
  }, [selectedId, camera]);

  useFrame((state, dt) => {
    const transition = transitionRef.current;

    if (transition.active) {
      transition.startTime += dt;
      const progress = Math.min(transition.startTime / TRANSITION_DURATION, 1);

      state.camera.position.lerpVectors(transition.startPos, transition.targetPos, progress);
      state.camera.quaternion.slerpQuaternions(
        transition.startQuat,
        transition.targetQuat,
        progress
      );

      if (progress === 1) {
        transition.active = false;
        if (!selectedId && controlsRef.current) {
          controlsRef.current.enabled = true;
          transition.hasStoredOriginal = false;
        }
      }
    }
  });

  return (
    <group
      ref={ref}
      onClick={(e) => {
        e.stopPropagation();
        if (!transitionRef.current.active) {
          if (selectedId === e.object.name) {
            window.open(e.object.parent.parent.link, "_blank"); // Updated to account for nested group
          } else {
            setSelectedId(clicked.current === e.object ? null : e.object.name);
          }
        }
      }}
      onPointerMissed={() => !transitionRef.current.active && setSelectedId(null)}
    >
      {images.map((props, index) => (
        <Frame key={props.name} selectedId={selectedId} {...props} url={props.url} index={index} />
      ))}
    </group>
  );
}

function Frame({ url, selectedId, c = new THREE.Color(), ...props }) {
  const image = useRef();
  const frame = useRef();
  const group = useRef();
  const [hovered, hover] = useState(false);
  const [rnd] = useState(() => Math.random());
  const name = getUuid(props.name);
  const isActive = selectedId === name;

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), props.index * 100);
    return () => clearTimeout(timer);
  }, []);

  useCursor(hovered);

  useFrame((state, dt) => {
    if (!group.current) return;

    // Handle mounting animation
    const targetOpacity = mounted ? 1 : 0;
    const targetY = mounted ? 0 : GOLDENRATIO/2; 

    // Animate opacity
    if (frame.current.material.opacity !== targetOpacity) {
      frame.current.material.opacity = THREE.MathUtils.lerp(
        frame.current.material.opacity,
        targetOpacity,
        0.01
      );
      image.current.material.opacity = frame.current.material.opacity;
    }

    // Animate position
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, targetY, 0.01);

    // Existing animations
    image.current.material.zoom = 1 + Math.sin(rnd * 10000 + state.clock.elapsedTime / 3) / 4;
    easing.damp3(
      image.current.scale,
      [0.85 * (!isActive && hovered ? 0.85 : 1), 0.9 * (!isActive && hovered ? 0.905 : 1), 1],
      0.1,
      dt
    );
    easing.dampC(frame.current.material.color, hovered ? "skyblue" : "white", 0.1, dt);
  });

  return (
    <group {...props}>
      <group ref={group} position-y={-0.5}>
        <mesh
          name={name}
          onPointerOver={(e) => {
            e.stopPropagation();
            hover(true);
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            hover(false);
          }}
          scale={[1, GOLDENRATIO, 0.05]}
          position={[0, GOLDENRATIO / 2, 0]} // Keep the original position
        >
          <boxGeometry />
          <meshStandardMaterial
            color="#151515"
            metalness={0.5}
            roughness={0.5}
            envMapIntensity={2}
          />
          <mesh ref={frame} raycast={() => null} scale={[0.9, 0.93, 0.9]} position={[0, 0, 0.2]}>
            <boxGeometry />
            <meshBasicMaterial toneMapped={false} fog={false} transparent opacity={0} />
          </mesh>
          <Image
            raycast={() => null}
            ref={image}
            position={[0, 0, 0.7]}
            url={url}
            transparent
            opacity={0}
          />
        </mesh>
        <Text
          maxWidth={0.1}
          anchorX="left"
          anchorY="top"
          position={[0.55, GOLDENRATIO, 0]} // Adjusted position to align with frame
          fontSize={0.025}
        >
          {name.split("-").join(" ")}
        </Text>

        <ThreeText
          position={[0, 0.05, 0.1]}
          scale={0.05}
          text={`${isActive && hovered ? "Click to open" : props.name}`}
        />
      </group>
    </group>
  );
}
