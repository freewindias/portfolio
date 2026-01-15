import React from 'react';
import { api } from '@/convex/_generated/api';
import { fetchQuery } from 'convex/nextjs';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { audiowide } from '@/font';
import { notFound } from 'next/navigation';

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  
  const project = await fetchQuery(api.projects.getBySlug, { slug });

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen px-4 pb-20">
      {/* Back Button */}
      <div className="mt-20 mb-8">
        <Button asChild variant="ghost" size="sm" className="rounded-full">
          <Link href="/projects">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Link>
        </Button>
      </div>

      {/* Project Header */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <p className="text-sm text-muted-foreground uppercase tracking-wider mb-4">
            — PROJECT
          </p>
          <h1 className={`${audiowide.className} text-4xl md:text-6xl lg:text-7xl tracking-tight mb-8`}>
            {project.title}
          </h1>
          
          {/* Project Metadata */}
          <div className="flex flex-col md:flex-row gap-8 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Year</p>
              <p className="font-medium">[{project.year}]</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Category</p>
              <p className="font-medium">[{project.category}]</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Client</p>
              <p className="font-medium">[{project.client}]</p>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="mb-16">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg">
            <Image
              src={project.heroImage}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          {project.heroImageCaption && (
            <div className="mt-4 bg-pink-50 p-4 rounded-lg max-w-xs ml-auto">
              <p className="text-sm text-muted-foreground">
                {project.heroImageCaption}
              </p>
            </div>
          )}
        </div>

        {/* Project Overview */}
        <div className="max-w-4xl mb-16">
          <h2 className="text-sm text-muted-foreground uppercase tracking-wider mb-6">
            PROJECT OVERVIEW
          </h2>
          <div className="space-y-6">
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed">
              {project.description}
            </h3>
            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {project.overview}
              </p>
            </div>
          </div>
        </div>

        {/* Gallery Images */}
        {project.galleryImages && project.galleryImages.length > 0 && (
          <div className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-6">
            {project.galleryImages.map((image, index) => (
              <div key={index} className="relative aspect-[4/3] overflow-hidden rounded-lg">
                <Image
                  src={image}
                  alt={`${project.title} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Contact CTA */}
        <div className="flex justify-center mt-20">
          <Button asChild size="lg" className="rounded-full px-8">
            <Link href="/#contact">
              Contact Us →
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
