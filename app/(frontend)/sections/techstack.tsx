"use client";

import VerticalCutReveal from "@/components/fancy/vertical-cut-reveal";
import { audiowide } from "@/font";
import ClipPathLinks from "../_components/ClipPathLinks";

export default function TechStack() {
  return (
    <section className="h-full mt-20">
      <VerticalCutReveal
          splitBy="characters"
          staggerDuration={0.01}
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
        <div>
          <VerticalCutReveal
          splitBy="characters"
          staggerDuration={0.01}
          staggerDelay={0.1}
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