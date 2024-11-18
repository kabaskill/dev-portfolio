"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";

export default function AudioPlayer({
  url,
  position = [0, 0, 0],
  volume = 0.5,
  playOnMount = false,
}) {
  const { camera } = useThree();
  const sound = useRef();
  const listener = useRef();
  const analyser = useRef();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    try {
      listener.current = new THREE.AudioListener();
      camera.add(listener.current);

      const sound3D = new THREE.PositionalAudio(listener.current);
      sound.current = sound3D;

      const audioContext = listener.current.context;
      analyser.current = audioContext.createAnalyser();
      analyser.current.fftSize = 128;

      const audioLoader = new THREE.AudioLoader();
      audioLoader.load(
        url,
        (buffer) => {
          if (sound.current) {
            sound.current.setBuffer(buffer);
            sound.current.setVolume(volume);
            sound.current.setRefDistance(1);
            sound.current.setRolloffFactor(1);
            sound.current.setDistanceModel("linear");

            sound.current.onEnded = () => {
              setIsPlaying(false);
            };

            sound.current.setFilter(analyser.current);
            setIsLoaded(true);

            if (playOnMount) {
              sound.current.play();
              setIsPlaying(true);
            }
          }
        },
        undefined,
        (error) => {
          console.error("Error loading audio:", error);
        }
      );

      return () => {
        if (sound.current) {
          sound.current.stop();
          if (sound.current.source) {
            sound.current.disconnect();
          }
        }
        if (listener.current) {
          camera.remove(listener.current);
        }
      };
    } catch (error) {
      console.error("Audio initialization error:", error);
    }
  }, [camera, url, volume, playOnMount]);

  function togglePlay() {
    if (!sound.current || !isLoaded) return;

    if (isPlaying) {
      sound.current.stop();
    } else {
      sound.current.play();
    }
    setIsPlaying(!isPlaying);
  }

  return (
    <group position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh
        onClick={() => togglePlay()}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
      >
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshStandardMaterial
          color={isPlaying ? "#00ff00" : "#ff0000"}
          transparent
          opacity={isHovered ? 0.8 : 0.5}
          emissive={isHovered ? "#ffffff" : "#000000"}
          emissiveIntensity={isHovered ? 0.2 : 0}
        />
        {sound.current && <primitive object={sound.current} />}
      </mesh>
      {analyser.current && isLoaded && (
        <AudioVisualizer analyser={analyser.current} position={[0, 0, 0]} scale={1} />
      )}
      <Text position={[0, 0.5, 0]} fontSize={0.1} color="white" anchorX="center" anchorY="middle">
        {!isLoaded ? "Loading..." : isPlaying ? "Playing Startup" : "Stopped"}
      </Text>
    </group>
  );
}

function AudioVisualizer({ analyser, position = [0, 0, 0], scale = 1 }) {
  const NUM_LINES = 64;
  const LINE_WIDTH = 0.01;
  const BASE_RADIUS = 1;
  const meshes = useRef([]);
  const group = useRef();

  useEffect(() => {
    if (!group.current) return;

    const geometry = new THREE.PlaneGeometry(LINE_WIDTH, 1);
    geometry.translate(0, 0, 0);

    const material = new THREE.MeshStandardMaterial({
      color: "#00ff00",
      metalness: 0.8,
      roughness: 0.2,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide,
      emissive: "#00ff00",
      emissiveIntensity: 0.5,
    });

    // Create meshes
    for (let i = 0; i < NUM_LINES; i++) {
      const mesh = new THREE.Mesh(geometry, material.clone());
      const angle = (i / NUM_LINES) * Math.PI;

      mesh.position.x = Math.cos(angle) * BASE_RADIUS;
      mesh.position.y = Math.sin(angle) * BASE_RADIUS;
      mesh.rotation.z = angle - Math.PI / 2;

      group.current.add(mesh);
      meshes.current.push(mesh);
    }

    return () => {
      meshes.current.forEach((mesh) => {
        mesh.geometry.dispose();
        mesh.material.dispose();
      });
    };
  }, []);

  useFrame(() => {
    if (!analyser || !group.current) return;

    try {
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(dataArray);

      meshes.current.forEach((mesh, i) => {
        if (mesh) {
          // const frequencyScale = Math.pow(1 - i / NUM_LINES, 0.5);
          const value = (dataArray[i] / 255) * scale;

          mesh.scale.y = 0.1 + value;

          mesh.material.emissiveIntensity = 0.2 + value * 0.8;
          mesh.material.opacity = 0.5 + value * 0.5;
        }
      });
    } catch (error) {
      console.warn("Visualizer update error:", error);
    }
  });

  return <group ref={group} position={position} />;
}
