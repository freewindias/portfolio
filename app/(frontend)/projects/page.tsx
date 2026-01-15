import React from 'react'

import VerticalCutReveal from '@/components/fancy/vertical-cut-reveal'
import { audiowide } from '@/font'
import ProjectCard from '../_components/project-card'
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function page() {
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
    <section className="min-h-screen px-4 pb-20">
      <div className='mt-36 md:mt-20 mb-2'>
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
          {`Projects`}
        </VerticalCutReveal>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))}
      </div>

      <div className="flex justify-center mt-10">
        <Button asChild variant="outline" size="lg" className="rounded-full px-8">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    </section>
  )
}
