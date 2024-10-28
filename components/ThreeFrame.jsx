import { MeshPortalMaterial, Text, useCursor } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { easing } from "maath";

const GOLDEN_RATIO = 1.61803398875;

export default function ThreeFrame({
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
  const [hovered, hover] = useState(false);
  const collisionBox = useMemo(() => new THREE.Box3(), []);
  const { camera } = useThree();

  useCursor(hovered);

  // Handle portal transition
  useFrame((state, dt) => {
    // Get current view from URL
    const view = new URLSearchParams(window.location.search).get("view");

    // Smoothly transition portal blend
    easing.damp(portal.current, "blend", view === id ? 1 : 0, 0.25, dt);

    // Handle camera movement when entering/exiting portal
    if (view === id) {
      // Calculate target position just in front of the portal
      const targetPosition = new THREE.Vector3(0, 0, 0.5);
      frameRef.current.localToWorld(targetPosition);

      // Slower, smoother camera movement
      easing.damp3(
        camera.position,
        targetPosition,
        0.75, // Increased damping factor for slower movement
        dt
      );

      // Calculate look-at position inside the portal
      const lookAtPosition = new THREE.Vector3(0, 0, -1);
      frameRef.current.localToWorld(lookAtPosition);

      // Smoothly rotate camera to look at target
      const currentLookAt = new THREE.Vector3();
      camera.getWorldDirection(currentLookAt);
      const targetLookAt = lookAtPosition.clone().sub(camera.position).normalize();

      easing.damp3(currentLookAt, targetLookAt, 0.75, dt);

      camera.lookAt(camera.position.clone().add(currentLookAt));
    }

    if (frameRef.current) {
      collisionBox.setFromObject(frameRef.current);
      collisionBox.min.subScalar(0.5);
      collisionBox.max.addScalar(0.5);
    }
  });

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    const searchParams = new URLSearchParams(window.location.search);

    if (searchParams.get("view") === id) {
      searchParams.delete("view");
    } else {
      searchParams.set("view", id);
    }

    router.push(`${window.location.pathname}?${searchParams.toString()}`, { scroll: false });
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

  useEffect(() => {
    if (frameRef.current) {
      frameRef.current.userData.isFrame = true;
    }
  }, []);

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
        onPointerOver={() => {
          hover(true);
          setIsHoveringFrame(true);
        }}
        onPointerOut={() => {
          hover(false);
          setIsHoveringFrame(false);
        }}
      >
        <roundedPlaneGeometry args={[width, height, 0.1]} />
        <MeshPortalMaterial ref={portal} blend={0}>
          <color attach="background" args={[bg]} />
          {children}
        </MeshPortalMaterial>
      </mesh>
    </group>
  );
}
