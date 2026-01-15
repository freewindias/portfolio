import React from 'react'

import VerticalCutReveal from '@/components/fancy/vertical-cut-reveal'
import { audiowide } from '@/font'
import ProjectCard from '../_components/project-card'
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { api } from '@/convex/_generated/api';
import { fetchQuery } from 'convex/nextjs';

export default async function ProjectsPage() {
  const projects = await fetchQuery(api.projects.list, {});

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
        {projects.map((project) => (
          <ProjectCard 
            key={project._id} 
            project={{
              title: project.title,
              category: project.category,
              image: project.heroImage,
              slug: project.slug,
            }} 
          />
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
