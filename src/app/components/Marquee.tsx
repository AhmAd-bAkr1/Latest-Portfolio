/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import gsap from "gsap";
import { Observer } from "gsap/all";
import { useEffect, useRef } from "react";

gsap.registerPlugin(Observer);

interface MarqueeProps {
  items: string[];
  className?: string;
  icon?: string;
  iconClassName?: string;
  reverse?: boolean;
}

interface MarqueeConfig {
  repeat?: number;
  paused?: boolean;
  snap?: boolean | number | ((v: number) => number);
  paddingRight?: number;
  reversed?: boolean;
  speed?: number;
}

// interface MarqueeTimeline extends gsap.core.Timeline {
//   next?: (vars?: gsap.TweenVars) => gsap.core.Tween;
//   previous?: (vars?: gsap.TweenVars) => gsap.core.Tween;
//   current?: () => number;
//   toIndex?: (index: number, vars?: gsap.TweenVars) => gsap.core.Tween;
//   times?: number[];
// }

type MarqueeTimeline = ReturnType<typeof gsap.timeline> & {
  next?: (vars?: Record<string, any>) => gsap.core.Tween;
  previous?: (vars?: Record<string, any>) => gsap.core.Tween;
  current?: () => number;
  toIndex?: (index: number, vars?: Record<string, any>) => gsap.core.Tween;
  times?: number[];
};


const Marquee: React.FC<MarqueeProps> = ({
  items,
  className = "text-white bg-black",
  icon = "mdi:star-four-points",
  iconClassName = "",
  reverse = false,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemsRef = useRef<HTMLSpanElement[]>([]);

  function horizontalLoop(
    items: HTMLSpanElement[],
    config: MarqueeConfig = {}
  ): MarqueeTimeline {
    const tl : MarqueeTimeline = gsap.timeline({
  repeat: config.repeat ?? -1,
  paused: config.paused ?? false,
  defaults: { ease: "none" },
}) as any;

// أضف الـ callback بعد إنشاء الـ timeline لتفادي الخطأ
tl.eventCallback("onReverseComplete", () => {
  tl.totalTime(tl.rawTime() + tl.duration() * 100);
});

    const length = items.length;
    const startX = items[0].offsetLeft;
    const times: number[] = [];
    const widths: number[] = [];
    const xPercents: number[] = [];
    let curIndex = 0;

    const pixelsPerSecond = (config.speed ?? 1) * 100;

    const snap =
  typeof config.snap === "function"
    ? config.snap
    : typeof config.snap === "number"
    ? gsap.utils.snap(config.snap)
    : gsap.utils.snap(1); // default value


    gsap.set(items, {
      xPercent: (i, el) => {
        const element = el as HTMLElement;
        const w = (widths[i] = parseFloat(gsap.getProperty(element, "width", "px") as string));
        xPercents[i] = snap(
          (parseFloat(gsap.getProperty(element, "x", "px") as string) / w) * 100 +
            (gsap.getProperty(element, "xPercent") as number)
        );
        return xPercents[i];
      },
    });

    gsap.set(items, { x: 0 });

    const totalWidth =
      items[length - 1].offsetLeft +
      (xPercents[length - 1] / 100) * widths[length - 1] -
      startX +
      items[length - 1].offsetWidth *
        (gsap.getProperty(items[length - 1], "scaleX") as number) +
      (config.paddingRight ?? 0);

    for (let i = 0; i < length; i++) {
      const item = items[i];
      const curX = (xPercents[i] / 100) * widths[i];
      const distanceToStart = item.offsetLeft + curX - startX;
      const distanceToLoop =
        distanceToStart + widths[i] * (gsap.getProperty(item, "scaleX") as number);

      tl.to(
        item,
        {
          xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100),
          duration: distanceToLoop / pixelsPerSecond,
        },
        0
      )
        .fromTo(
          item,
          {
            xPercent: snap(
              ((curX - distanceToLoop + totalWidth) / widths[i]) * 100
            ),
          },
          {
            xPercent: xPercents[i],
            duration:
              (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
            immediateRender: false,
          },
          distanceToLoop / pixelsPerSecond
        )
        .add("label" + i, distanceToStart / pixelsPerSecond);

      times[i] = distanceToStart / pixelsPerSecond;
    }

    function toIndex(index: number, vars?: gsap.TweenVars) {
      vars = vars || {};
      if (Math.abs(index - curIndex) > length / 2) {
        index += index > curIndex ? -length : length;
      }

      const newIndex = gsap.utils.wrap(0, length, index);
      let time = times[newIndex];

      if ((time > tl.time()) !== index > curIndex) {
        vars.modifiers = { time: gsap.utils.wrap(0, tl.duration()) };
        time += tl.duration() * (index > curIndex ? 1 : -1);
      }

      curIndex = newIndex;
      vars.overwrite = true;
      return tl.tweenTo(time, vars);
    }

    tl.next = (vars?: gsap.TweenVars) => toIndex(curIndex + 1, vars);
    tl.previous = (vars?: gsap.TweenVars) => toIndex(curIndex - 1, vars);
    tl.current = () => curIndex;
    tl.toIndex = (index: number, vars?: gsap.TweenVars) => toIndex(index, vars);
    tl.times = times;

    tl.progress(1, true).progress(0, true);

    if (config.reversed) {
      tl.vars.onReverseComplete?.();
      tl.reverse();
    }

    return tl;
  }

  useEffect(() => {
    if (!itemsRef.current.length) return;

    const tl = horizontalLoop(itemsRef.current, {
      repeat: -1,
      paddingRight: 30,
      reversed: reverse,
    });

    Observer.create({
      onChangeY(self) {
        let factor = 2.5;
        if ((!reverse && self.deltaY < 0) || (reverse && self.deltaY > 0)) {
          factor *= -1;
        }
        gsap
          .timeline({ defaults: { ease: "none" } })
          .to(tl, { timeScale: factor * 2.5, duration: 0.2, overwrite: true })
          .to(tl, { timeScale: factor / 2.5, duration: 1 }, "+=0.3");
      },
    });

    return () => { tl.kill(); };
  }, [items, reverse]);

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden w-full h-20 md:h-[100px] flex items-center marquee-text-responsive font-light uppercase whitespace-nowrap ${className}`}
    >
      <div className="flex">
        {items.map((text, index) => (
          <span
            key={index}
            ref={(el) => {
              if (el) itemsRef.current[index] = el;
            }}
            className="flex items-center px-16 gap-x-32"
          >
            {text} <Icon icon={icon} className={iconClassName} />
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
