import Image from "next/image";
import Link from "next/link";
import { getProjectBySlug } from "@/server/projects";
import { Button } from "@/components/ui/button";
import Divider from "../../_components/divider";
import { ProjectGallery } from "@/app/(frontend)/_components/project/project-gallery";


interface ProjectDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const ProjectDetailPage = async ({ params }: ProjectDetailPageProps) => {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-bold">Project not found</h2>
        <Button variant={"outline"} className="mt-5" render={<Link href="/works">Back to all works!</Link>} />
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <Divider />
      <section>
        <div className="container">
          <div className="border-x border-border">
            {/* Header Section */}
            <div className="flex flex-col max-w-3xl mx-auto py-10 px-4 sm:px-7">
              <div className="flex flex-col xs:flex-row gap-5 items-center justify-between">
                <p className="text-sm tracking-[2px] text-primary uppercase font-medium">
                  Project Overview
                </p>
                <Button
                  variant={"outline"}
                  className="h-auto py-3 px-5 transition-all duration-300"
                  nativeButton={false}
                  render={<Link href={"/works"}>Back to all works!</Link>}
                />
              </div>
            </div>

            {/* Main Image */}
            <div className="border-t border-border overflow-hidden block relative h-[400px] sm:h-[600px]">
              <Image
                src={project.image || "/images/placeholder.png"}
                alt={project.title}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>

            {/* Title, Category & Description Section */}
            <div className="flex flex-col gap-10 p-6 md:p-14 border-t border-border">
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight">
                  {project.title}
                </h1>
              </div>
              
              <div className="flex flex-col gap-12">
                {/* Details Grid */}
                <div className="flex flex-col gap-8">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Category</p>
                    <p className="text-xl mt-2">{project.category}</p>
                  </div>

                  <div className="flex flex-col gap-8 border-t border-border/50 pt-8">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Client</p>
                      <p className="text-lg mt-2 font-medium">{project.client}</p>
                    </div>
                    
                    {/* Year & Website Grid */}
                    <div className="grid grid-cols-2 gap-8 border-t border-border/50 pt-8">
                      <div>
                        <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Year</p>
                        <p className="text-lg mt-2 font-medium">{project.year}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">View project</p>
                        <Link 
                          href={project.website || "#"} 
                          target="_blank" 
                          className="text-lg mt-2 font-medium hover:underline flex items-center gap-1 transition-all"
                        >
                          Visit Website
                          <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="border-t border-border/50 pt-8">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Description</p>
                  <div 
                    className="mt-4 text-lg md:text-xl leading-relaxed text-muted-foreground max-w-4xl tinymce-content"
                    dangerouslySetInnerHTML={{ __html: project.description }}
                  />
                </div>
              </div>
            </div>

            {/* Project Gallery (Additional Images) */}
            {project.additionalImages && project.additionalImages.length > 0 && (
              <ProjectGallery 
                images={project.additionalImages} 
                title={project.title} 
              />
            )}

          </div>
        </div>
      </section>
    </main>
  );
};

export default ProjectDetailPage;
