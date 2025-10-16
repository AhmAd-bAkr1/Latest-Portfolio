"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, Float, Lightformer } from "@react-three/drei";
import { useMediaQuery } from "react-responsive";
import dynamic from "next/dynamic";
import { useEffect, useRef, FC } from "react";
import gsap from "gsap";
import AnimatedHeaderSection from "../components/AnimatedHeaderSection";


// // -----------------------------
// Lazy-load Planet with correct typing
// -----------------------------
const Planet = dynamic(
  () => import("../components/Planet").then((mod) => mod.Planet),
  {
    ssr: false,
    loading: () => (
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="gray" />
      </mesh>
    ),
  }
);

// -----------------------------
// Lightformer type and config
// -----------------------------
type LightformerConfig = {
  form: "circle" | "rect" | "ring";
  intensity: number;
  position: [number, number, number];
  scale: number;
};

const LIGHTFORMERS: LightformerConfig[] = [
  { form: "circle", intensity: 2, position: [0, 5, -9], scale: 10 },
  { form: "circle", intensity: 2, position: [0, 3, 1], scale: 10 },
  { form: "circle", intensity: 2, position: [-5, -1, -1], scale: 10 },
  { form: "circle", intensity: 2, position: [10, 1, 0], scale: 16 },
];

// -----------------------------
// Hero Component
// -----------------------------
const Hero: FC = () => {
  const isMobile = useMediaQuery({ maxWidth: 853 });
  const prefersReducedMotion = useMediaQuery({ query: "(prefers-reduced-motion: reduce)" });
  const heroRef = useRef<HTMLDivElement>(null);

  const heroText = `I help growing brands and startups gain an 
  unfair advantage through premium, 
  results-driven websites and apps.`;

  // GSAP Entry Animations
  useEffect(() => {
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from(".hero-subtitle", { y: 20, opacity: 0, duration: 1, ease: "power3.out", stagger: 0.2 });
      gsap.from(".hero-title", { y: 40, opacity: 0, duration: 1.2, ease: "power3.out" });
      gsap.from(".hero-text", { y: 20, opacity: 0, duration: 1, delay: 0.5, ease: "power3.out" });
    }, heroRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      id="home"
      ref={heroRef}
      className="flex flex-col justify-end min-h-screen relative"
      aria-label="Hero Section"
    >
      {/* Animated Header */}
      <AnimatedHeaderSection
        subTitle="404 — No Bugs Found"
        title="Ahmed Bakr"
        text={heroText}
        textColor="text-black"
        // Added className props for GSAP animations
        subtitleClassName="hero-subtitle"
        titleClassName="hero-title"
        textClassName="hero-text"
        borderColor="border-black"
      />

      {/* 3D Background */}
      <figure
        className="absolute inset-0 -z-50 w-screen h-screen"
        aria-hidden="true"
      >
         <Canvas
          shadows
          camera={{ position: [0, 0, -10], fov: 17.5, near: 1, far: 20 }}
        >
          <ambientLight intensity={0.5} />

          <Float speed={prefersReducedMotion ? 0 : 0.5}>
            <Planet scale={isMobile ? 0.7 : 1} />
          </Float>

          <Environment resolution={256}>
            <group rotation={[-Math.PI / 3, 4, 1]}>
              {LIGHTFORMERS.map((light, index) => (
                <Lightformer key={index} {...light} />
              ))}
            </group>
          </Environment>
        </Canvas>
      </figure>
    </section>
  );
};

export default Hero;
