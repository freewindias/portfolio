import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProjectForm } from "@/app/(backend)/_components/update-data/project-form";

export default function CreateProjectPage() {
  return (
    <div className="flex flex-col gap-6 px-4 w-full">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/update/projects">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Project</h1>
          <p className="text-muted-foreground">
            Create a new piece of work for your portfolio.
          </p>
        </div>
      </div>
      <ProjectForm />
    </div>
  );
}
