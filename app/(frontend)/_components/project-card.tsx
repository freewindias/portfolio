"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion, useMotionValue, useSpring } from "motion/react";

interface ProjectCardProps {
  project: {
    title: string;
    category: string;
    image: string;
    slug: string;
    description?: string;
  };
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth out the mouse movement
  const mouseX = useSpring(x, { stiffness: 500, damping: 50 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 50 });

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - left);
    y.set(e.clientY - top);
  }

  return (
    <Link href={`/projects/${project.slug}`}>
      <motion.div
        ref={ref}
        onMouseMove={onMouseMove}
        initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
        whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative group cursor-none rounded-xl"
      >
        <Card className="overflow-hidden shadow-none bg-transparent p-0 border border-zinc-200">
          <CardContent className="p-0">
            <div className="relative aspect-4/3 w-full overflow-hidden rounded-t-xl group-hover:brightness-90 transition-all duration-500">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex items-center justify-between bg-white py-2 px-2 border-t border-zinc-200">
              <div>
                <h3 className="font-bold text-lg md:text-xl group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-muted-foreground text-sm">[{project.category}]</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hover Overlay Button */}
        <motion.div
          style={{
            x: mouseX,
            y: mouseY,
            translateX: "-50%",
            translateY: "-50%",
          }}
          className="absolute top-0 left-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50"
        >
          <div className="bg-zinc-200/90 backdrop-blur-sm px-6 py-3 rounded-full flex items-center gap-3 shadow-lg whitespace-nowrap">
            <span className="text-black font-medium text-lg">View Project</span>
            <div className="w-8 h-8 rounded-full border border-black flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-black" />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </Link>
  );
}
