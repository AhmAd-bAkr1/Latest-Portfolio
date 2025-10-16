"use client";

import React, { useEffect, useRef, useState } from "react";
import { socials } from "../constants";
import gsap from "gsap";
import { Link } from "react-scroll";

const Navbar: React.FC = () => {
  const navRef = useRef<HTMLElement | null>(null);
  const linksRef = useRef<HTMLDivElement[]>([]);
  const contactRef = useRef<HTMLDivElement | null>(null);
  const topLineRef = useRef<HTMLSpanElement | null>(null);
  const bottomLineRef = useRef<HTMLSpanElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const navTimeline = useRef<gsap.core.Timeline | null>(null);
  const iconTimeline = useRef<gsap.core.Timeline | null>(null);
  const overlayTimeline = useRef<gsap.core.Timeline | null>(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showBurger, setShowBurger] = useState(true);

  const sections = ["home", "services", "about", "work", "contact"];

  useEffect(() => {
    if (!navRef.current || !contactRef.current || !overlayRef.current) return;

    // Initial state
    gsap.set(navRef.current, { xPercent: 100, autoAlpha: 0 });
    gsap.set([...linksRef.current, contactRef.current], { autoAlpha: 0, y: 50, rotationX: -15, scale: 0.9 });
    gsap.set(overlayRef.current, { autoAlpha: 0 });

    // Overlay timeline
    overlayTimeline.current = gsap.timeline({ paused: true })
      .to(overlayRef.current, { autoAlpha: 1, duration: 0.5, ease: "power2.out" });

    // Nav + links + contact timeline with smooth motion
    navTimeline.current = gsap.timeline({ paused: true })
      .to(navRef.current, { xPercent: 0, autoAlpha: 1, duration: 1.2, ease: "power4.out" }, 0)
      .to(
        linksRef.current,
        {
          autoAlpha: 1,
          y: 0,
          rotationX: 0,
          scale: 1,
          stagger: { each: 0.15, ease: "elastic.out(1, 0.5)" },
          duration: 0.8,
        },
        0.2
      )
      .to(
        contactRef.current,
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.5)" },
        0.4
      );

    // Burger icon timeline
    iconTimeline.current = gsap.timeline({ paused: true })
      .to(topLineRef.current, { rotate: 45, y: 3.3, duration: 0.3, ease: "power2.inOut" })
      .to(bottomLineRef.current, { rotate: -45, y: -3.3, duration: 0.3, ease: "power2.inOut" }, "<");

    // Hover animations for links with subtle motion and color fade
    linksRef.current.forEach((link) => {
      link.addEventListener("mouseenter", () => {
        gsap.to(link, { scale: 1.05, color: "#fff", y: -2, duration: 0.3, ease: "power2.out" });
      });
      link.addEventListener("mouseleave", () => {
        gsap.to(link, { scale: 1, color: "#ffffff99", y: 0, duration: 0.3, ease: "power2.out" });
      });

      link.addEventListener("mousedown", () => {
        gsap.to(link, { scale: 0.95, duration: 0.1, ease: "power2.inOut" });
      });
      link.addEventListener("mouseup", () => {
        gsap.to(link, { scale: 1.05, duration: 0.1, ease: "power2.out" });
      });
    });

    // Social hover
    const socialEls = document.querySelectorAll(".social-hover");
    socialEls.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        gsap.to(el, { scale: 1.1, color: "#fff", y: -2, duration: 0.3, ease: "power2.out" });
      });
      el.addEventListener("mouseleave", () => {
        gsap.to(el, { scale: 1, color: "#ffffff99", y: 0, duration: 0.3, ease: "power2.out" });
      });
    });
  }, []);

  // Scroll behavior: hide burger on scroll down if menu is closed
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (isMenuOpen) return; // لو المينيو مفتوح، لا تخفي الـ X
      if (window.scrollY > lastScrollY) {
        setShowBurger(false);
      } else {
        setShowBurger(true);
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMenuOpen]);

  const toggleMenu = () => {
    if (isMenuOpen) {
      overlayTimeline.current?.reverse();
      navTimeline.current?.reverse();
      iconTimeline.current?.reverse();
    } else {
      overlayTimeline.current?.play();
      navTimeline.current?.play();
      iconTimeline.current?.play();
    }
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 pointer-events-none"
        aria-hidden="true"
      ></div>

      {/* Navbar */}
      <nav
        ref={navRef}
        className="fixed z-50 flex flex-col justify-between w-full h-full px-6 uppercase bg-black text-white/90 py-28 gap-y-10 md:w-1/2 md:left-1/2 overflow-hidden"
        aria-label="Main Navigation"
      >
        <div className="flex flex-col text-5xl gap-y-4 md:text-6xl lg:text-8xl">
          {sections.map((section, index) => (
            <div
              key={section}
              ref={(el) => { if (el) linksRef.current[index] = el; }}
              className="group"
            >
              <Link
                className="transition-all duration-300 cursor-pointer"
                to={section}
                smooth
                offset={-20}
                duration={2000}
                aria-label={`Go to ${section} section`}
              >
                {section}
              </Link>
            </div>
          ))}
        </div>

        {/* Contact info */}
        <div
          ref={contactRef}
          className="flex flex-col gap-6 md:flex-row md:justify-between md:items-center w-full max-w-full overflow-hidden"
        >
          <div className="font-light flex-shrink-0">
            <p className="tracking-wider text-white/50">E-mail</p>
            <p className="text-lg md:text-xl tracking-widest lowercase text-pretty break-all">
              JohnDoe@gmail.com
            </p>
          </div>

          <div className="font-light flex-shrink-0">
            <p className="tracking-wider text-white/50">Social Media</p>
            <div className="flex flex-wrap md:flex-row gap-2">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-hover text-sm md:text-base tracking-widest uppercase transition-all duration-300"
                  aria-label={`Visit ${social.name}`}
                >
                  {social.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Burger */}
      <button
        className="fixed z-50 flex flex-col items-center justify-center gap-1 transition-all duration-300 bg-black rounded-full w-14 h-14 md:w-20 md:h-20 top-4 right-6 hover:scale-110"
        onClick={toggleMenu}
        style={{
          opacity: isMenuOpen ? 1 : showBurger ? 1 : 0,
          pointerEvents: isMenuOpen ? "auto" : showBurger ? "auto" : "none",
          transform: isMenuOpen ? "scale(1)" : showBurger ? "scale(1)" : "scale(0.8)",
        }}
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
      >
        <span ref={topLineRef} className="block w-8 h-0.5 bg-white rounded-full origin-center"></span>
        <span ref={bottomLineRef} className="block w-8 h-0.5 bg-white rounded-full origin-center"></span>
      </button>
    </>
  );
};

export default Navbar;
