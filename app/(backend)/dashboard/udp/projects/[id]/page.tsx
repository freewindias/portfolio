"use client";

import ProjectForm from "@/app/(backend)/_components/ufdp/project-form";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { use } from "react";

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const projects = useQuery(api.projects.list, {});
  const project = projects?.find((p) => p._id === id as Id<"projects">);

  if (!projects) {
    return <div className="p-8">Loading...</div>;
  }

  if (!project) {
    return <div className="p-8">Project not found</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Edit Project</h1>
      <ProjectForm mode="edit" initialData={project as any} />
    </div>
  );
}
