
import VerticalCutReveal from '@/components/fancy/vertical-cut-reveal';
import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { audiowide } from '@/font';
import { fetchQuery } from 'convex/nextjs';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ProjectCard from '../_components/project-card';

export default async function ProjectsPage() {
  const projects = await fetchQuery(api.projects.list, {});

  return (
    <section className="min-h-screen px-4">
      <div className='mt-24 md:mt-20 mb-2'>
        <div className="flex justify-start">
          <Button asChild variant="outline" size="lg" className="rounded-full px-8">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
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
              description: project.description,
            }} 
          />
        ))}
      </div>
    </section>
  )
}
