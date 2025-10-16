/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef } from "react";
import AnimatedHeaderSection from "../components/AnimatedHeaderSection";
// import { AnimatedTextLines } from "../components/AnimatedTextLines";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const About = () => {
  const text = `Passionate about clean architecture. 
  I build scalable, high-performance solutions—from 
  prototype to production.`;
const aboutText = {
  intro:
    "I craft fast, intuitive, and scalable front-end experiences where design precision meets clean, modern code.",
  hook:
    "Obsessed with building seamless React apps — from pixel-perfect UIs to optimized, maintainable architectures.",
  description:
    "I focus on performance, accessibility, and UX consistency — writing clean, reusable code and integrating APIs efficiently.",
  workflowTitle: "What I do best:",
  workflowItems: [
    "Clean, scalable React development",
    "Responsive UI & smooth animations",
    "API integration & state management",
    "Accessibility & SEO optimization",
    "Testing & performance tuning",
  ],
  outroTitle: "Beyond the screen:",
  outro: [
    "Contributing to open-source projects",
    "Sharing knowledge through tutorials",
    "Exploring creativity outside of code",
  ],
};

  const imgRef = useRef(null);
  useGSAP(() => {
    gsap.to("#about", {
      scale: 0.95,
      scrollTrigger: {
        trigger: "#about",
        start: "bottom 80%",
        end: "bottom 20%",
        scrub: true,
        markers: false,
      },
      ease: "power1.inOut",
    });

    gsap.set(imgRef.current, {
      clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)",
    });
    gsap.to(imgRef.current, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      duration: 2,
      ease: "power4.out",
      scrollTrigger: { trigger: imgRef.current },
    });
  });
  return (
    <section id="about" className="min-h-screen bg-black rounded-b-4xl">
      <AnimatedHeaderSection
        subTitle={"Code with Purpose, Built to Scale."}
        title={"About"}
        text={text}
        textColor={"text-white"}
        withScrollTrigger={true}
      />
      <div className="flex flex-col items-center justify-between gap-16 px-10 pb-16 text-xl font-light tracking-wide lg:flex-row md:text-2xl lg:text-3xl text-white/60">
        <img
          ref={imgRef}
          src="images/Ahmed-Bakr.png"
          alt="man"
          className="w-lg rounded-3xl"
        />
        {/* <AnimatedTextLines text={aboutText} className={"w-full"} /> */}
      <section className="max-w-2xl mx-auto px-6 py-14 text-white/70 leading-relaxed">
      <h2 className="text-3xl font-bold mb-5">{aboutText.intro}</h2>

      <p className="text-lg mb-4">
        <strong>{aboutText.hook}</strong>
      </p>

      <p className="text-lg mb-8">{aboutText.description}</p>

      <h3 className="text-xl font-semibold mb-3">{aboutText.workflowTitle}</h3>
      <ul className="list-disc list-inside space-y-1 text-base mb-8">
        {aboutText.workflowItems.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      <h3 className="text-xl font-semibold mb-3">{aboutText.outroTitle}</h3>
      <ul className="space-y-1 text-base">
        {aboutText.outro.map((line, index) => (
          <li key={index}>{line}</li>
        ))}
      </ul>
    </section>
      </div>
    </section>
  );
};

export default About;
