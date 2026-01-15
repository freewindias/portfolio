"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import VerticalCutReveal from "@/components/fancy/vertical-cut-reveal";
import { audiowide } from "@/font";
import ProjectCard from "../_components/project-card";

export default function Work() {
  const projects = [
    {
      title: "Freewin Portfolio",
      category: "Portfolio Website",
      image: "/logo.jpeg",
    },
    {
      title: "Rodias",
      category: "SAAS Website",
      image: "/1.jpeg",
    },
    {
      title: "I-fineart",
      category: "Art Portfolio Website",
      image: "/2.jpg",
    },
  ];

  return (
    <section className="h-full">
      <div className="">
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
          {`Featured Work`}
        </VerticalCutReveal>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))}
      </div>

      <div className="flex justify-center mt-10">
        <Button asChild variant="outline" size="lg" className="rounded-full px-8">
          <Link href="/projects">
            View all projects
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
