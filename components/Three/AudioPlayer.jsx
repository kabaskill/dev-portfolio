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
  const audioBuffer = useRef(null);

  useEffect(() => {
    try {
      listener.current = new THREE.AudioListener();
      camera.add(listener.current);

      const sound3D = new THREE.PositionalAudio(listener.current);
      sound.current = sound3D;

      const audioContext = listener.current.context;
      analyser.current = audioContext.createAnalyser();
      analyser.current.fftSize = 256;
      analyser.current.smoothingTimeConstant = 0.7;

      const audioLoader = new THREE.AudioLoader();
      audioLoader.load(
        url,
        (buffer) => {
          if (sound.current) {
            audioBuffer.current = buffer; // Store the buffer for reuse
            sound.current.setBuffer(buffer);
            sound.current.setVolume(volume);
            sound.current.setRefDistance(1);
            sound.current.setRolloffFactor(1);
            sound.current.setDistanceModel("linear");

            sound.current.onEnded = () => {
              setIsPlaying(false);
              // Reset the buffer when audio ends
              if (sound.current) {
                sound.current.stop();
                sound.current.setBuffer(audioBuffer.current);
              }
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
    if (!sound.current || !isLoaded || !audioBuffer.current) return;

    try {
      if (isPlaying) {
        sound.current.stop();
        setIsPlaying(false);
      } else {
        // Reset the buffer before playing if needed
        if (!sound.current.buffer) {
          sound.current.setBuffer(audioBuffer.current);
        }
        // Ensure we're at the start of the audio
        sound.current.offset = 0;
        sound.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error toggling play state:", error);
      // Reset state if there's an error
      setIsPlaying(false);
      if (sound.current) {
        sound.current.stop();
        sound.current.setBuffer(audioBuffer.current);
      }
    }
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
      <Text
        position={[0, 0, 0.2]}
        rotation={[Math.PI / 2, 0, 0]}
        fontSize={0.1}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {!isLoaded ? "Loading..." : isPlaying ? "Playing" : "Stopped"}
      </Text>
    </group>
  );
}

function AudioVisualizer({ analyser, position = [0, 0, 0], scale = 1 }) {
  const NUM_LINES = 64;
  const LINE_WIDTH = 0.01;
  const BASE_RADIUS = 1.5;
  const meshes = useRef([]);
  const group = useRef();

  // Create a frequency scaling function
  const scaleFrequency = (index, value) => {
    // Apply logarithmic scaling to better represent human hearing
    const frequencyScale = Math.log10(((index + 1) / NUM_LINES) * 20 + 1);
    // Boost higher frequencies more than lower ones
    const boost = index < NUM_LINES / 2 ? 1 : 1.5;
    // Apply minimum height to ensure visibility of quiet high frequencies
    const minHeight = 0.15;
    return Math.max(minHeight, value * frequencyScale * boost);
  };

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

    // Create meshes in a full circle
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

      // Calculate average frequency amplitude for normalization
      const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
      const normalizer = average > 0 ? 128 / average : 1;

      meshes.current.forEach((mesh, i) => {
        if (mesh) {
          // Get frequency data and normalize it
          const rawValue = dataArray[i] / 255;
          const normalizedValue = Math.min(rawValue * normalizer, 1);

          // Scale the frequency response
          const scaledValue = (scaleFrequency(i, normalizedValue) * scale) / 2;

          // Apply the scaled value to the mesh
          mesh.scale.y = scaledValue;

          // Dynamic color and opacity based on frequency intensity
          const intensity = scaledValue;
          mesh.material.emissiveIntensity = 0.2 + intensity * 0.8;
          mesh.material.opacity = 0.5 + intensity * 0.5;
        }
      });
    } catch (error) {
      console.warn("Visualizer update error:", error);
    }
  });

  return <group ref={group} position={position} />;
}
