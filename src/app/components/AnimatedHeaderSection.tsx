"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {AnimatedTextLines} from "./AnimatedTextLines";

gsap.registerPlugin(ScrollTrigger);

type AnimatedHeaderSectionProps = {
  title: string;
  subTitle: string;
  text: string;
  textColor?: string; // Optional, allows dynamic color
  withScrollTrigger?: boolean;
  subtitleClassName?: string;
  titleClassName?: string;
  textClassName?: string;
  borderColor?: string;
};

const AnimatedHeaderSection: React.FC<AnimatedHeaderSectionProps> = ({
  title,
  subTitle,
  text,
  textColor = "text-black",
  withScrollTrigger = true,
  subtitleClassName = "",
  titleClassName = "",
  textClassName = "",
  borderColor = "",
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const titleParts = title.split(" ");

  useEffect(() => {
    if (!sectionRef.current || !headerRef.current) return;

    // const timeline = gsap.timeline({
    //   scrollTrigger: withScrollTrigger
    //     ? { trigger: sectionRef.current }
    //     : undefined,
    // });
    const timeline = gsap.timeline({
  scrollTrigger: withScrollTrigger
    ? { 
        trigger: sectionRef.current,
        toggleActions: "play none none reset", // المهم هنا
      }
    : undefined,
});


    timeline.from(sectionRef.current, {
      y: "50vh",
      duration: 1,
      ease: "circ.out",
    });

    timeline.from(
      headerRef.current,
      {
        opacity: 0,
        y: 200,
        duration: 1,
        ease: "circ.out",
      },
      "<+0.2"
    );

    return () => {
      timeline.kill();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [withScrollTrigger]);

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden"
      aria-label="Animated header section"
    >
      {/* Header */}
      <div style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}>
        <div
          ref={headerRef}
          className={`flex flex-col justify-center gap-12 pt-16 sm:gap-16 ${titleClassName}`}
        >
          <p
            className={`text-sm font-light tracking-[0.5rem] uppercase px-10 ${textColor} ${subtitleClassName}`}
          >
            {subTitle}
          </p>
          <div className="px-10">
            <h1
              className={`flex flex-col gap-12 uppercase banner-text-responsive sm:gap-16 md:block ${textColor}`}
            >
              {titleParts.map((part, index) => (
                <span key={index}>{part} </span>
              ))}
            </h1>
          </div>
        </div>
      </div>

      {/* Animated Text */}
      <div className={`relative px-10 ${textColor}`}>
        <div className={`absolute inset-x-0 border-t-2 ${borderColor}`} />
        <div className="py-12 sm:py-16 text-end">
          <AnimatedTextLines
            text={text}
            className={`font-light uppercase value-text-responsive ${textColor} ${textClassName}`}
          />
        </div>
      </div>
    </section>
  );
};

export default AnimatedHeaderSection;
