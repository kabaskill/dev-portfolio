

"use client";
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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const collisionBox = useMemo(() => new THREE.Box3(), []);
  const { camera } = useThree();

  useCursor(hovered);

  useFrame((state, dt) => {
    const view = new URLSearchParams(window.location.search).get("view");
    const isCurrentView = view === id;

    easing.damp(portal.current, "blend", isCurrentView ? 1 : 0, 0.25, dt);

    if (isCurrentView) {
      frameRef.current.visible = true;

      const targetPosition = new THREE.Vector3(0, 0, 0.5);
      frameRef.current.localToWorld(targetPosition);

      const lookAtPosition = new THREE.Vector3(0, 0, -1);
      frameRef.current.localToWorld(lookAtPosition);

      const currentLookAt = new THREE.Vector3();
      camera.getWorldDirection(currentLookAt);
      const targetLookAt = lookAtPosition.clone().sub(camera.position).normalize();

      easing.damp3(currentLookAt, targetLookAt, 0.75, dt);
      camera.lookAt(camera.position.clone().add(currentLookAt));
    } else {
      frameRef.current.visible = !view;
    }

    if (frameRef.current) {
      collisionBox.setFromObject(frameRef.current);
      collisionBox.min.subScalar(0.5);
      collisionBox.max.addScalar(0.5);
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    if (isTransitioning) return;

    setIsTransitioning(true);
    const searchParams = new URLSearchParams(window.location.search);

    if (searchParams.get("view")) {
      return;
    } else {
      searchParams.set("view", id);
    }

    router.push(`${window.location.pathname}?${searchParams.toString()}`, { scroll: false });

    setTimeout(() => setIsTransitioning(false), 750);
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
    <group onClick={handleClick} {...props} ref={frameRef}>
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