"use client";

import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedHeaderSection from "../components/AnimatedHeaderSection";
import Marquee from "../components/Marquee";
import { socials } from "../constants";
import gsap from "gsap";
import { useEffect } from "react";

// ✅ Register ScrollTrigger once for performance
gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const text = `Got a question, how or project Idea?
    WE’D love to hear from you and discus further!`;

  const items = Array(5).fill("just imagin, I code"); // ✅ cleaner repetition

  useGSAP(() => {
    // ✅ Animate social links only when they enter the viewport
    gsap.from(".social-link", {
      y: 100,
      opacity: 0,
      duration: 1,
      ease: "back.out(1.7)",
      stagger: 0.25,
      scrollTrigger: {
        trigger: ".social-link",
        start: "top 90%", // ✅ start later for smoother scroll
        toggleActions: "play none none reverse",
      },
    });
  }, []);

  // ✅ UseEffect to remove potential scroll triggers on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section
      id="contact"
      className="flex flex-col justify-between min-h-screen bg-black"
    >
      {/* ===== Header Section ===== */}
      <AnimatedHeaderSection
        subTitle="You Dream It, I Code it"
        title="Contact"
        text={text}
        textColor="text-white"
        withScrollTrigger
      />

      {/* ===== Contact Details Section ===== */}
      <div className="flex px-10 font-light text-white uppercase lg:text-[32px] text-[26px] leading-none mb-10">
        <div className="flex flex-col w-full gap-10">
          {/* === Email === */}
          <div className="social-link">
            <h2 className="text-white">E-mail</h2>
            <div className="w-full h-px my-2 bg-white/30" />
            <p className="text-xl tracking-wider lowercase md:text-2xl lg:text-3xl select-text">
              ahmd.m.bakr@gmail.com
            </p>
          </div>

          {/* === Phone === */}
          <div className="social-link">
            <h2 className="text-white">Phone</h2>
            <div className="w-full h-px my-2 bg-white/30" />
            <p className="text-xl lowercase md:text-2xl lg:text-3xl select-text">
              +20 10 90 35 81 91
            </p>
          </div>

          {/* === Social Media === */}
          <div className="social-link">
            <h2 className="text-white">Social Media</h2>
            <div className="w-full h-px my-2 bg-white/30" />
            <div className="flex flex-wrap gap-2">
              {socials.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name} // ✅ accessibility improvement
                  className="text-xs leading-loose tracking-wides uppercase md:text-sm hover:text-white/80 transition-colors duration-200"
                >
                  {"{ "}
                  {social.name}
                  {" }"}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===== Marquee Footer ===== */}
      <Marquee items={items} className="text-white bg-transparent" />
    </section>
  );
};

export default Contact;
