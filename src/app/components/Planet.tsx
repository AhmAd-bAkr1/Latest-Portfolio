"use client";

import React, { JSX, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import * as THREE from "three";

interface PlanetGLTF {
  nodes: {
    Sphere: THREE.Mesh;
    Sphere2: THREE.Mesh;
    Ring: THREE.Mesh;
  };
  materials: {
    [key: string]: THREE.Material;
  };
}

/**
 * Planet Component
 * Renders a 3D planet with animated spheres and rings using GSAP
 */
export function Planet(props: JSX.IntrinsicElements["group"]) {
  // References for animation
  const shapeRef = useRef<THREE.Group>(null);
  const spheresRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Group>(null);

  // Load GLTF model
  const { nodes, materials } = useGLTF("/models/Planet.glb") as unknown as PlanetGLTF;

  /**
   * Initialize GSAP animations
   */
  useGSAP(() => {
    if (!shapeRef.current || !spheresRef.current || !ringRef.current) return;

    const timeline = gsap.timeline();

    // Animate planet rising
    timeline.from(shapeRef.current.position, {
      y: 5,
      duration: 3,
      ease: "circ.out",
    });

    // Animate spheres rotation
    timeline.from(
      spheresRef.current.rotation,
      {
        x: 0,
        y: Math.PI,
        z: -Math.PI,
        duration: 10,
        ease: "power1.inOut",
      },
      "-=25%"
    );

    // Animate ring rotation
    timeline.from(
      ringRef.current.rotation,
      {
        x: 0.8,
        y: 0,
        z: 0,
        duration: 10,
        ease: "power1.inOut",
      },
      "<"
    );
  }, []);

  /**
   * Planet structure:
   * - shapeRef: main group for planet position animation
   * - spheresRef: group for planet spheres
   * - ringRef: individual ring mesh
   */
  return (
    <group ref={shapeRef} {...props} dispose={null}>
      <group ref={spheresRef}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Sphere.geometry}
          material={materials["Material.002"]}
          rotation={[0, 0, 0.741]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Sphere2.geometry}
          material={materials["Material.001"]}
          position={[0.647, 1.03, -0.724]}
          rotation={[0, 0, 0.741]}
          scale={0.223}
        />
      </group>
      <mesh
        ref={ringRef}
        castShadow
        receiveShadow
        geometry={nodes.Ring.geometry}
        material={materials["Material.001"]}
        rotation={[-0.124, 0.123, -0.778]}
        scale={2}
      />
    </group>
  );
}

// Preload model for faster rendering
useGLTF.preload("/models/Planet.glb");
