import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { PointerLockControls } from "@react-three/drei";

const MOVEMENT_SPEED = 0.03;
const SPRINT_MULTIPLIER = 2;
const COLLISION_THRESHOLD = 1.5;

const MOVEMENT_KEYS = {
  FORWARD: "KeyW",
  BACKWARD: "KeyS",
  LEFT: "KeyA",
  RIGHT: "KeyD",
  SPRINT: "ShiftLeft",
};

export default function ThreeFPSControls({ setIsLocked }) {
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
