import { getProjects } from "@/server/projects";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { ProjectReorderList } from "@/app/(backend)/_components/update-data/project-reorder-list";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="flex flex-col gap-6 px-4 py-8 max-w-6xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Manage your portfolio projects. Maximum of 2 featured projects. Drag to reorder.
          </p>
        </div>
        <Link href="/dashboard/update/projects/create">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Project
          </Button>
        </Link>
      </div>

      <ProjectReorderList initialProjects={projects} />
    </div>
  );
}
