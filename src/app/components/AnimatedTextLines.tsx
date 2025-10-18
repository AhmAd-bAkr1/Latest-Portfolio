"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useRef } from "react";
gsap.registerPlugin(ScrollTrigger);
interface AnimatedTextLinesProps {
  // subTitle: string;
  // title: string;
  text: string;
  className?: string;
  // textColor?: string;
  // withScrollTrigger?: boolean;
}
export const AnimatedTextLines: React.FC<AnimatedTextLinesProps> = ({ text, className }) => {
  const containerRef = useRef(null);
  // const lineRefs = useRef([]);
  const lineRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const lines = text.split("\n").filter((line) => line.trim() !== "");
  useGSAP(() => {
    if (lineRefs.current.length > 0) {
      gsap.from(lineRefs.current, {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.3,
        ease: "back.out",
        scrollTrigger: {
          trigger: containerRef.current,
        },
      });
    }
  });

  return (
    <div ref={containerRef} className={className}>
      {lines.map((line, index) => (
        <span
          key={index}
          ref={(el) => {lineRefs.current[index] = el}}
          className="block leading-relaxed tracking-wide text-pretty"
        >
          {line}
        </span>
      ))}
    </div>
  );
};
