"use client";

import VerticalCutReveal from "@/components/fancy/vertical-cut-reveal";
import { audiowide } from "@/font";
import ClipPathLinks from "../_components/ClipPathLinks";

export default function TechStack() {
  return (
    <section className="h-full mt-20">
      <VerticalCutReveal
          splitBy="characters"
          staggerDuration={0.025}
          staggerDelay={0}
          staggerFrom="first"
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 21,
          }}
          wordLevelClassName={`${audiowide.className} text-[35px] md:text-7xl lg:text-[110px] tracking-tighter`}
        >
          {`TechStack`}
        </VerticalCutReveal>
        <div className="mt-5">
          <VerticalCutReveal
          splitBy="characters"
          staggerDuration={0.015}
          staggerDelay={0.3}
          staggerFrom="first"
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 21,
          }}
          wordLevelClassName={`text-xl`}
        >
          {`What I use for my projects`}
        </VerticalCutReveal>
          <ClipPathLinks />
        </div>
    </section>
  )
}