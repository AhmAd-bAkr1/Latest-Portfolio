"use client";

import { useRef } from "react";
import Marquee from "../components/Marquee";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ContactSummary = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const items = [
    "Innovation",
    "Precision",
    "Trust",
    "Collaboration",
    "Excellence",
  ];
  const items2 = ["contact us", "contact us", "contact us", "contact us", "contact us"];

  useGSAP(() => {
    // 🔹 تنظيف أي ScrollTriggers قديمة قبل الإنشاء
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

    if (containerRef.current) {
      gsap.to(containerRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "center center",
          end: "+=800 center",
          scrub: 1.2, // smoother scroll motion
          pin: true,
          pinSpacing: true,
          markers: false,
          invalidateOnRefresh: true, // re-calculate on resize or tab switch
        },
      });
    }

    // 🔹 تنظيف عند الخروج لتجنب أي memory leaks
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="flex flex-col items-center justify-between min-h-screen gap-12 mt-16"
    >
      {/* 🔸 Top Marquee line */}
      <Marquee items={items} />

      {/* 🔸 Center Text */}
      <div className="overflow-hidden font-light text-center contact-text-responsive">
        <p>
          “ Let’s build a <br />
          <span className="font-normal">memorable</span> &{" "}
          <span className="italic">inspiring</span> <br />
          web application <span className="text-gold">together</span> “
        </p>
      </div>

      {/* 🔸 Bottom Marquee line */}
      <Marquee
        items={items2}
        reverse={true}
        className="text-black bg-transparent border-y-2"
        iconClassName="stroke-gold stroke-2 text-primary"
        icon="material-symbols-light:square"
      />
    </section>
  );
};

export default ContactSummary;
