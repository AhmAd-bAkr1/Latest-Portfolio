/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useRef, useState, FC } from "react";
import dynamic from "next/dynamic";
import { Canvas } from "@react-three/fiber";
import { Environment, Float, Lightformer } from "@react-three/drei";
import { useMediaQuery } from "react-responsive";
import AnimatedHeaderSection from "../components/AnimatedHeaderSection";

/**
 * Clean, performance-minded Hero component
 * - GSAP is dynamically imported to reduce initial bundle size
 * - FPS-based auto quality reduction with smooth transitions
 * - Manual override buttons for performance mode
 * - Pause/resume animations when tab is hidden
 * - Proper cleanup to avoid memory leaks
 *
 * Comments are in English (clean & explanatory)
 */

/* Lazy-load Planet (3D) — keep ssr: false to avoid server bundling */
const Planet = dynamic(() => import("../components/Planet").then((mod) => mod.Planet), {
  ssr: false,
  loading: () => null,
});

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

const Hero: FC = () => {
  const isMobile = useMediaQuery({ maxWidth: 853 });
  const prefersReducedMotion = useMediaQuery({ query: "(prefers-reduced-motion: reduce)" });

  const heroRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null); // Canvas wrapper ref

  const heroText = `I help growing brands and startups gain an 
  unfair advantage through premium, 
  results-driven websites and apps.`;

  // Performance detection state
  const [autoPerfLevel, setAutoPerfLevel] = useState<"low" | "medium" | "high">("medium");
  const [manualLevel, setManualLevel] = useState<"low" | "medium" | "high" | null>(null);
  const [isCheckingPerf, setIsCheckingPerf] = useState(true);

  const currentLevel = manualLevel ?? autoPerfLevel;

  // Refs for external libs / latest values to avoid stale closures
  const gsapRef = useRef<any>(null); // will hold gsap instance after dynamic import
  const autoPerfLevelRef = useRef(autoPerfLevel);
  autoPerfLevelRef.current = autoPerfLevel;

  // -------------------------
  // GSAP text animations (dynamic import to keep initial bundle small)
  // -------------------------
  useEffect(() => {
    if (prefersReducedMotion) return;

    let ctxRevert: (() => void) | null = null;
    let mounted = true;

    (async () => {
      // Dynamically import GSAP only when needed (improves TBT / performance)
      const gsapModule = await import("gsap");
      if (!mounted) return;
      gsapRef.current = gsapModule.default;

      // Use gsap.context bound to heroRef for safe cleanup
      ctxRevert = gsapRef.current.context(() => {
        gsapRef.current.from(".hero-subtitle", {
          y: 20,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.2,
        });
        gsapRef.current.from(".hero-title", {
          y: 40,
          opacity: 0,
          duration: 1.2,
          ease: "power3.out",
        });
        gsapRef.current.from(".hero-text", {
          y: 20,
          opacity: 0,
          duration: 1,
          delay: 0.5,
          ease: "power3.out",
        });
      }, heroRef);
    })();

    return () => {
      mounted = false;
      try {
        if (ctxRevert) ctxRevert();
      } catch (e) {
        /* safe ignore */
      }
    };
    // preferReducedMotion is the only dependency — animations re-run if user changes preference
  }, [prefersReducedMotion]);

  // -------------------------
  // Measure performance (FPS) and auto-adjust quality
  // - runs initially and every 10s
  // - uses gsapRef for smooth transitions if available
  // -------------------------
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;
    let mounted = true;

    function measurePerformance() {
      let frames = 0;
      const startTime = performance.now();

      function countFrames(time: number) {
        frames++;
        if (time - startTime < 1000) {
          requestAnimationFrame(countFrames);
        } else {
          const fps = (frames * 1000) / (time - startTime);
          // console log left intentionally for debugging (remove in production if desired)
          // console.log("Detected FPS:", Math.round(fps));

          let newLevel: "low" | "medium" | "high" = autoPerfLevelRef.current;

          if (fps < 25) newLevel = "low";
          else if (fps < 50) newLevel = "medium";
          else newLevel = "high";

          const order = ["low", "medium", "high"];
          const currentIndex = order.indexOf(autoPerfLevelRef.current);
          const newIndex = order.indexOf(newLevel);

          // Only downgrade automatically (don't auto-upgrade to avoid jarring changes)
          if (newIndex < currentIndex && mounted) {
            // If GSAP is present, use it for smooth fade; otherwise instant switch
            if (gsapRef.current && canvasRef.current) {
              gsapRef.current.to(canvasRef.current, {
                opacity: 0,
                duration: 0.5,
                ease: "power2.out",
                onComplete: () => {
                  if (!mounted) return;
                  setAutoPerfLevel(newLevel);
                  gsapRef.current.to(canvasRef.current, { opacity: 1, duration: 0.7, ease: "power2.in" });
                },
              });
            } else {
              setAutoPerfLevel(newLevel);
            }
          }

          setIsCheckingPerf(false);
        }
      }

      requestAnimationFrame(countFrames);
    }

    // Initial measurement
    measurePerformance();

    // Re-measure every 10 seconds
    intervalId = setInterval(measurePerformance, 10000);

    return () => {
      mounted = false;
      if (intervalId) clearInterval(intervalId);
    };
    // we intentionally do NOT depend on autoPerfLevel here to avoid frequent re-creation
  }, []);

  // -------------------------
  // Pause/Resume animations when tab is hidden to save CPU/GPU
  // -------------------------
  useEffect(() => {
    const handleVisibility = () => {
      try {
        if (!gsapRef.current) return;
        if (document.hidden) {
          // Pause global timeline (if present)
          gsapRef.current.globalTimeline?.pause();
        } else {
          gsapRef.current.globalTimeline?.resume();
        }
      } catch (e) {
        // safe ignore if gsap not ready or doesn't have globalTimeline
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // -------------------------
  // Manual performance control buttons
  // -------------------------
  const renderButtons = () => {
    if (isCheckingPerf) return null;

    return (
      <div className="absolute top-4 right-4 z-50 flex gap-2 bg-black/50 p-2 rounded-lg" role="region" aria-label="Performance controls">
        {(["low", "medium", "high"] as const).map((level) => (
          <button
            key={level}
            onClick={() => setManualLevel(level)}
            className={`px-3 py-1 text-xs rounded-md capitalize transition ${
              currentLevel === level ? "bg-white text-black font-semibold" : "bg-black/40 text-white hover:bg-white/20"
            }`}
            aria-pressed={currentLevel === level}
            aria-label={`Set performance mode to ${level}`}
            title={`Performance: ${level}`}
          >
            {level}
          </button>
        ))}
        {/* Reset manual override button */}
        <button
          onClick={() => setManualLevel(null)}
          className="px-2 py-1 text-xs rounded-md bg-transparent text-white border border-white/20 hover:bg-white/10"
          aria-label="Reset performance mode to automatic"
          title="Auto"
        >
          Auto
        </button>
      </div>
    );
  };

  return (
    <section
      id="home"
      ref={heroRef}
      className="flex flex-col justify-end min-h-screen relative"
      aria-label="Hero Section"
      role="region"
    >
      {/* Manual Buttons */}
      {renderButtons()}

      {/* Performance Overlay */}
      <div
        className={`absolute top-4 left-4 z-50 px-3 py-1 rounded-md text-[10px] ${
          currentLevel === "low" ? "bg-black/40 text-white" : "bg-black/40 text-white"
        }`}
        aria-hidden="true"
      >
        Performance Mode: {currentLevel.toUpperCase()}
      </div>

      {/* Header Section */}
      <AnimatedHeaderSection
        subTitle="404 — No Bugs Found"
        title="Ahmed Bakr"
        text={heroText}
        textColor="text-black"
        subtitleClassName="hero-subtitle"
        titleClassName="hero-title"
        textClassName="hero-text"
        borderColor="border-black"
      />

      {/* 3D Canvas Wrapper */}
      <div
        ref={canvasRef}
        className="absolute inset-0 -z-50 w-screen h-screen"
        aria-hidden={currentLevel === "low" || isCheckingPerf}
      >
        {/* Render Canvas only when check finished and not low perf */}
        {!isCheckingPerf && currentLevel !== "low" && (
          <Canvas
            shadows={currentLevel === "high"}
            camera={{ position: [0, 0, -10], fov: 17.5, near: 1, far: 20 }}
            // Accessibility label for assistive tech
            aria-label="Interactive 3D Planet visualization"
            role="img"
          >
            <ambientLight intensity={currentLevel === "high" ? 0.5 : 0.3} />

            <Float speed={prefersReducedMotion ? 0 : 0.5}>
              {/* keep Planet lazy and client-only; scale adapts by device and perf */}
              <Planet scale={isMobile ? 0.7 : currentLevel === "medium" ? 0.85 : 1} />
            </Float>

            <Environment resolution={currentLevel === "high" ? 512 : 128}>
              <group rotation={[-Math.PI / 3, 4, 1]}>
                {LIGHTFORMERS.slice(0, currentLevel === "medium" ? 2 : LIGHTFORMERS.length).map((light, index) => (
                  <Lightformer key={index} {...light} />
                ))}
              </group>
            </Environment>
          </Canvas>
        )}
      </div>
    </section>
  );
};

// Memoize to avoid unnecessary re-renders (improves FPS & perf)
export default React.memo(Hero);
