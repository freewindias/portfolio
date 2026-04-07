import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ExperienceForm } from "@/app/(backend)/_components/update-data/experience-form";
import { getExperienceById } from "@/server/experiences";
import { notFound } from "next/navigation";

export default async function EditExperiencePage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const resolvedParams = await params;
  const experience = await getExperienceById(resolvedParams.id);

  if (!experience) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 px-4 w-full">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/update/experience">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Experience</h1>
          <p className="text-muted-foreground">
            Update the details of your work experience.
          </p>
        </div>
      </div>
      <ExperienceForm initialData={experience} />
    </div>
  );
}
