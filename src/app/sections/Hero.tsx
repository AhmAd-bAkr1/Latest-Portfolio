/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useRef, useState, FC } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Float, Lightformer } from "@react-three/drei";
import { useMediaQuery } from "react-responsive";
import AnimatedHeaderSection from "../components/AnimatedHeaderSection";
import Planet from '../components/Planet';

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

// تحديد مستوى الأداء الابتدائي بناءً على مواصفات الجهاز
function getInitialPerfLevel(): "low" | "medium" | "high" {
  const cores = navigator.hardwareConcurrency || 4;
  const ram = (navigator as any).deviceMemory || 4;

  if (cores <= 2 || ram <= 2) return "low";      // أجهزة ضعيفة جداً
  if (cores <= 4 || ram <= 4) return "medium";   // أجهزة متوسطة
  return "high";                                  // أجهزة قوية
}

const Hero: FC = () => {
  const isMobile = useMediaQuery({ maxWidth: 853 });
  const prefersReducedMotion = useMediaQuery({ query: "(prefers-reduced-motion: reduce)" });

  const heroRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);

  const heroText = `I help growing brands and startups gain an 
  unfair advantage through premium, 
  results-driven websites and apps.`;

  const [autoPerfLevel, setAutoPerfLevel] = useState<"low" | "medium" | "high">(getInitialPerfLevel());
  const [manualLevel, setManualLevel] = useState<"low" | "medium" | "high" | null>(null);
  const [isCheckingPerf, setIsCheckingPerf] = useState(true);

  const currentLevel = manualLevel ?? autoPerfLevel;

  const gsapRef = useRef<any>(null);
  const autoPerfLevelRef = useRef(autoPerfLevel);
  autoPerfLevelRef.current = autoPerfLevel;

  // -------------------------
  // GSAP text animations
  // -------------------------
  useEffect(() => {
    if (prefersReducedMotion) return;

    let ctxRevert: (() => void) | null = null;
    let mounted = true;

    (async () => {
      const gsapModule = await import("gsap");
      if (!mounted) return;
      gsapRef.current = gsapModule.default;

      ctxRevert = gsapRef.current.context(() => {
        gsapRef.current.from(".hero-subtitle", { y: 20, opacity: 0, duration: 1, ease: "power3.out", stagger: 0.2 });
        gsapRef.current.from(".hero-title", { y: 40, opacity: 0, duration: 1.2, ease: "power3.out" });
        gsapRef.current.from(".hero-text", { y: 20, opacity: 0, duration: 1, delay: 0.5, ease: "power3.out" });
      }, heroRef);
    })();

    return () => {
      mounted = false;
      try { if (ctxRevert) ctxRevert(); } catch (e) {}
    };
  }, [prefersReducedMotion]);

  // -------------------------
  // Auto performance measurement (فوري إذا الجهاز بدأ يهنج)
  // -------------------------
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;
    let mounted = true;

    function measurePerformance() {
      let frames = 0;
      const startTime = performance.now();

      function countFrames(time: number) {
        frames++;
        const elapsed = time - startTime;
        const fps = (frames * 1000) / (elapsed || 1);

        // فورًا إذا FPS أقل من 25، انزل الجودة
        if (fps < 25 && mounted) {
          // const newLevel: "low" = "low";
          const newLevel = "low" as const;
          if (newLevel !== autoPerfLevelRef.current) {
            if (gsapRef.current && canvasRef.current) {
              gsapRef.current.to(canvasRef.current, {
                opacity: 0,
                duration: 0.2,
                ease: "power2.out",
                onComplete: () => {
                  if (!mounted) return;
                  setAutoPerfLevel(newLevel);
                  gsapRef.current.to(canvasRef.current, { opacity: 1, duration: 0.3 });
                },
              });
            } else {
              setAutoPerfLevel(newLevel);
            }
          }
          setIsCheckingPerf(false);
          return;
        }

        if (elapsed < 1000) requestAnimationFrame(countFrames);
        else setIsCheckingPerf(false);
      }

      requestAnimationFrame(countFrames);
    }

    measurePerformance();
    intervalId = setInterval(measurePerformance, 10000);

    return () => { mounted = false; if (intervalId) clearInterval(intervalId); };
  }, []);

  // -------------------------
  // Pause/Resume animations on tab hidden
  // -------------------------
  useEffect(() => {
    const handleVisibility = () => {
      try {
        if (!gsapRef.current) return;
        if (document.hidden) gsapRef.current.globalTimeline?.pause();
        else gsapRef.current.globalTimeline?.resume();
      } catch (e) {}
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // -------------------------
  // Manual performance control
  // -------------------------
  const renderButtons = () => {
    if (isCheckingPerf) return null;

    return (
      <div className="absolute top-4 right-4 opacity-20 z-50 flex gap-2 bg-black/50 p-2 rounded-lg">
        {(["low", "medium", "high"] as const).map((level) => (
          <button
            key={level}
            onClick={() => setManualLevel(level)}
            className={`px-3 py-1 text-xs rounded-md capitalize transition ${
              currentLevel === level ? "bg-white text-black font-semibold" : "bg-black/40 text-white hover:bg-white/20"
            }`}
          >
            {level}
          </button>
        ))}
      </div>
    );
  };

  return (
    <section ref={heroRef} className="flex flex-col justify-end min-h-screen relative">
      {renderButtons()}

      <div className={`absolute top-4 left-4 z-50 px-3 py-1 opacity-20 rounded-md text-[10px] bg-black/40 text-white`}>
        Performance Mode: {currentLevel.toUpperCase()}
      </div>

      <AnimatedHeaderSection
        subTitle="404 — No Bugs Found"
        title="Ahmed Bakr"
        text={heroText}
        textColor="text-black"
      />

      <div ref={canvasRef} className="absolute inset-0 -z-50 w-screen h-screen" aria-hidden={currentLevel === "low" || isCheckingPerf}>
        {!isCheckingPerf && currentLevel !== "low" && (
          <Canvas
            shadows={currentLevel === "high"}
            camera={{ position: [0, 0, -10], fov: 17.5, near: 1, far: 20 }}
            aria-label="Interactive 3D Planet visualization"
            role="img"
          >
            <ambientLight intensity={currentLevel === "high" ? 0.5 : 0.3} />
            <Float speed={prefersReducedMotion ? 0 : 0.5}>
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

export default React.memo(Hero);
