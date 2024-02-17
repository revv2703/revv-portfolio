"use client"

import { useEffect, useRef } from "react";
import { Content, KeyTextField } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import gsap from "gsap";

/**
 * Props for `Hero`.
 */
export type HeroProps = SliceComponentProps<Content.HeroSlice>;

/**
 * Component for "Hero" Slices.
 */
const Hero = ({ slice }: HeroProps): JSX.Element => {

  const component = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {

      gsap.timeline().fromTo(".name-animation", {
        x: -100, opacity:0, rotate: 180
      }, {
        x: 0, opacity:1, rotate: 0, ease: "bounce.out", duration:1.75, transformOrigin: "left top", stagger: {each: 0.1, from: "random"}, delay: 0.25
      })
      .fromTo(".job-desc", {
        y: 20, opacity: 0, scale: 1.25
      }, {
        y: 0, opacity: 1, duration: 1.5, scale: 1, ease: "elastic.out(1.5,0.3)", delay: 0.75
      })
    }, component)
    return () => ctx.revert();
  }, [])

  const renderLetters = (name: KeyTextField, key: string) => {
    if(!name) return;
    return name.split("").map((letter, index) => (
        <span key={index} className={`name-animation name-animation-${key}-index inline-block opacity-0`}>
          {letter}
        </span>
      ));
    }

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      ref={component}
    >
      <div className="grid min-h-[70vh] grid-cols-1 md:grid-cols-2 items-center">
        <div className="col-start-1 md:row-start-1">
          <h1 className="mb-8 text-[clamp(3rem,20vmin,20rem)] font-extrabold leading-none tracking-tighter" aria-label={slice.primary.first_name + " " + slice.primary.last_name}>
            <span className="block text-slate-300">{renderLetters(slice.primary.first_name, "first")}</span>
            <span className="-mt-[.145em] block text-slate-500">{renderLetters(slice.primary.last_name, "last")}</span>
          </h1>
          <span className="job-desc block bg-gradient-to-tr from-red-500 via-yellow-200 to-yellow-700 bg-clip-text text-2xl font-bold uppercase tracking-[.2em] text-transparent opacity-0 md:text-4xl">
            {slice.primary.tag_line}
            </span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
