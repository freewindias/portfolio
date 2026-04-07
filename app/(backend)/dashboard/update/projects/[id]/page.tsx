import { ProjectForm } from "@/app/(backend)/_components/update-data/project-form";
import { getProjectById } from "@/server/projects";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface EditProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProjectPage({
  params,
}: EditProjectPageProps) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 px-4 py-8 max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/update/projects">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Project</h1>
          <p className="text-muted-foreground">
            Update your portfolio work details.
          </p>
        </div>
      </div>

      <div className="mt-4 border rounded-lg bg-background p-6">
        <ProjectForm initialData={project} />
      </div>
    </div>
  );
}
