import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { CameraControls, PointerLockControls } from "@react-three/drei";
import { usePathname } from "next/navigation";

const MOVEMENT_SPEED = 0.03;
const SPRINT_MULTIPLIER = 2;
const COLLISION_THRESHOLD = 0.3;

const MOVEMENT_KEYS = {
  FORWARD: "KeyW",
  BACKWARD: "KeyS",
  LEFT: "KeyA",
  RIGHT: "KeyD",
  SPRINT: "ShiftLeft",
};

export function FPSControls({ setIsLocked, setActiveControls, setIsFPSControlsActive }) {
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
  const raycaster = new THREE.Raycaster();

  // Initialize controls
  useEffect(() => {
    if (controlsRef.current) {
      // Center the camera
      camera.lookAt(0, 0, 0);
      // Request pointer lock
      controlsRef.current.lock();
    }

    return () => {
      // Cleanup when component unmounts
      if (document.pointerLockElement) {
        document.exitPointerLock();
      }
    };
  }, [camera]);

  // Handle key events
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

  // Movement and collision logic
  useFrame(() => {
    if (!controlsRef.current?.isLocked) return;

    const speedMultiplier = movementRef.current.sprint ? SPRINT_MULTIPLIER : 1;
    const speed = MOVEMENT_SPEED * speedMultiplier;

    const forward = Number(movementRef.current.forward) - Number(movementRef.current.backward);
    const right = Number(movementRef.current.right) - Number(movementRef.current.left);

    const matrix = new THREE.Matrix4();
    matrix.extractRotation(camera.matrix);

    const forwardVector = new THREE.Vector3(0, 0, -1);
    forwardVector.applyMatrix4(matrix);
    forwardVector.y = 0;
    forwardVector.normalize();

    const rightVector = new THREE.Vector3(1, 0, 0);
    rightVector.applyMatrix4(matrix);
    rightVector.y = 0;
    rightVector.normalize();

    velocityRef.current.set(0, 0, 0);
    if (forward !== 0) velocityRef.current.addScaledVector(forwardVector, forward * speed);
    if (right !== 0) velocityRef.current.addScaledVector(rightVector, right * speed);

    // Inside the useFrame loop
    let canMove = true;
    raycaster.set(camera.position, forwardVector);
    const intersects = raycaster.intersectObjects(scene.children, true);
    if (intersects.length > 0 && intersects[0].distance < COLLISION_THRESHOLD) {
      canMove = false;
    } else {
      camera.position.add(velocityRef.current);
    }
  });

  return (
    <PointerLockControls
      ref={controlsRef}
      onLock={() => setIsLocked(true)}
      onUnlock={() => {
        setIsLocked(false);
        setActiveControls("orbit");
        setIsFPSControlsActive(false);
      }}
    />
  );
}

export function RigControls({
  position = new THREE.Vector3(0, 0, 2),
  focus = new THREE.Vector3(0, 0, 0),
}) {
  const { controls, scene } = useThree();
  const params = usePathname();

  useEffect(() => {
    const active = scene.getObjectByName(params?.id);
    console.log("🚀  active:", active);
    if (active) {
      active.parent.localToWorld(position.set(0, 0.5, 0.25));
      active.parent.localToWorld(focus.set(0, 0, -2));
    }
  controls?.setLookAt(...position.toArray(), ...focus.toArray(), true);
  });
  return <CameraControls minPolarAngle={0} maxPolarAngle={Math.PI / 2} />;
}
