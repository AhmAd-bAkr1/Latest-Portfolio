"use client";
import React, { useEffect, useState } from "react";
import Navbar from "./sections/Navbar";
import Hero from "./sections/Hero";
import ServiceSummary from "./sections/ServiceSummary";
import Services from "./sections/Services";
import ReactLenis from "lenis/react";
import About from "./sections/About";
import Works from "./sections/Works";
import ContactSummary from "./sections/ContactSummary";
import Contact from "./sections/Contact";
import { useProgress } from "@react-three/drei";

const App = () => {
  const { progress } = useProgress();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (progress === 100) {
      setIsReady(true);
    }
  }, [progress]);

  return (
    <ReactLenis root className="relative w-screen min-h-screen overflow-x-auto">
      {/* عرض شاشة التحميل حتى اكتمال التحميل */}
      {!isReady && (
        <div
  className={`fixed inset-0 z-[999] flex flex-col items-center justify-center bg-black/90 text-white font-light 
  ${isReady ? "opacity-0 scale-95 translate-y-10" : "opacity-100 scale-100 translate-y-0"} 
  transition-all duration-700 ease-in-out`}
>
  <p className="my-4 text-xl tracking-widest animate-pulse">
    Loading {Math.floor(progress)}%
  </p>
  <div className="relative h-3 w-60 overflow-hidden rounded-full bg-white/20 shadow-inner">
    <div
      className="absolute top-0 left-0 h-full bg-white transition-all duration-300 rounded-full"
      style={{ width: `${progress}%` }}
    ></div>
  </div>
</div>

      )}

      {/* إخفاء المحتوى حتى ينتهي التحميل */}
      <div
        className={`${
          isReady ? "opacity-100" : "opacity-0"
        } transition-opacity duration-1000`}
      >
        <Navbar />
        <Hero />
        <ServiceSummary />
        <Services />
        <About />
        <Works />
        <ContactSummary />
        <Contact />
      </div>
    </ReactLenis>
  );
};

export default App;
