"use client";

import VerticalCutReveal from "@/components/fancy/vertical-cut-reveal";
import { audiowide } from "@/font";
import { educationItemType, Workeducation } from "../_components/education-compo";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function Education() {
  const educationData = useQuery(api.education.get);

  // Map backend data to frontend component format
  const educations: educationItemType[] = educationData
    ? educationData.map((edu) => ({
        id: edu.id,
        companyName: edu.institutionName,
        companyLogo: edu.institutionLogo,
        positions: edu.degrees.map((degree) => ({
          id: degree.id,
          title: degree.degree,
          employmentPeriod: degree.period,
          description: degree.description,
          skills: degree.skills,
          isExpanded: degree.isExpanded,
          // Default icon for education if not provided in backend (though backend schema doesn't have icon for degrees yet, keeping it safe)
          icon: "education", 
        })),
        isCurrentEmployer: false, // Education usually isn't "current employer" in the same sense, or we can add this field to backend later if needed
      }))
    : [];

  if (!educationData) {
      return <div className="h-20" />; // Or a skeleton loader
  }

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
          {`Education`}
        </VerticalCutReveal>
        <div>
          <Workeducation className="w-full" educations={educations} />
        </div>
    </section>
  )
}
