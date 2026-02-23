"use client";

import VerticalCutReveal from "@/components/fancy/vertical-cut-reveal";
import { api } from "@/convex/_generated/api";
import { audiowide } from "@/font";
import { useQuery } from "convex/react";
import { WorkExperience } from "../_components/work-experience";


export default function Experience() {
  const experiences = useQuery(api.experience.get);

  return (
    <section className="h-full mt-20 relative">
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
          {`Experience`}
        </VerticalCutReveal>
        
        <div>
          <WorkExperience 
            className="w-full" 
            experiences={(experiences as any) || []} 
          />
        </div>
    </section>
  )
}
