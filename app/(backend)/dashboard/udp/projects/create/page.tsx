import ProjectForm from "@/app/(backend)/_components/ufdp/project-form";

export default function CreateProjectPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Add New Project</h1>
      <ProjectForm mode="create" />
    </div>
  );
}
