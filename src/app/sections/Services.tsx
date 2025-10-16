"use client";

import { useRef, useEffect, useState } from "react";
import AnimatedHeaderSection from "../components/AnimatedHeaderSection";
import { servicesData } from "../constants";
import { useMediaQuery } from "react-responsive";
import { useGSAP } from "@gsap/react";

const Services = () => {
  // === Section Intro Text ===
  const text = `I build secure, high-performance frontend apps with smooth UX that drive growth — not headaches.`;

  // === Refs and States ===

  const serviceRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [mounted, setMounted] = useState(false);

  // Ensure media query runs only after mounting

  useEffect(() => setMounted(true), []);
  // ✅ Optimized: useMemo to avoid unnecessary re-renders

  const desktopQuery = useMediaQuery({ minWidth: "48rem" });
  const isDesktop = desktopQuery && mounted;

  // const isDesktop =useMediaQuery({ minWidth: "48rem" }) && mounted  ; //768px
  useGSAP(() => {
    const initGSAP = async () => {
      const gsapModule = await import("gsap");
      const gsap = gsapModule.default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");

      gsap.registerPlugin(ScrollTrigger);

      // Animate each service card on scroll
      serviceRefs.current.forEach((el) => {
        if (!el) return;

        gsap.from(el, {
          y: 200,
          opacity: 0,
          duration: 1,
          ease: "circ.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
          },
        });
      });
    };

    initGSAP();

    // ✅ Cleanup to prevent memory leaks
    return () => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      });
    };
  }, []);
  // === Render Section ===

  return (
    <section id="services" className="min-h-screen bg-black rounded-t-4xl">
      {/* === Header === */}

      <AnimatedHeaderSection
        subTitle={"Behind the Scenes, Beyond the Screen"}
        title={"Service"}
        text={text}
        textColor={"text-white"}
        withScrollTrigger={true}
      />
      {/* === Services List === */}

      {servicesData.map((service, index) => (
        <div
          ref={(el) => {
            serviceRefs.current[index] = el;
          }}
          key={index}
          className="sticky px-10 pt-6 pb-12 text-white bg-black border-t-2 border-white/30"
          style={
            isDesktop
              ? {
                  top: `calc(10vh + ${index * 5}em)`,
                  marginBottom: `${(servicesData.length - index - 1) * 5}rem`,
                }
              : { top: 0 }
          }
        >
          {/* === Service Details === */}

          <div className="flex items-center justify-between gap-4 font-light">
            <div className="flex flex-col gap-6">
              <h2 className="text-4xl lg:text-5xl">{service.title}</h2>
              <p className="text-xl leading-relaxed tracking-widest lg:text-2xl text-white/60 text-pretty">
                {service.description}
              </p>
              {/* === Service Sub-Items === */}

              <div className="flex flex-col gap-2 text-2xl sm:gap-4 lg:text-3xl text-white/80">
                {service.items.map((item, itemIndex) => (
                  <div
                    key={`item-${index}-${itemIndex}`}
                    className="flex flex-col gap-2 py-2"
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-white/30 text-lg font-semibold tracking-widest">
                        {String(itemIndex + 1).padStart(2, "0")}
                      </span>

                      <div className="flex flex-col">
                        <h3 className=" text-4xl text-white/90 font-emibold">
                          {item.title}
                        </h3>
                        <p className="text-white/60 text-2xl leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    {/* Divider between sub-items */}

                    {itemIndex < service.items.length - 1 && (
                      <div className="w-full h-px bg-white/10 mt-3" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default Services;
