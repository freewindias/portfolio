"use client";

import EducationForm from "@/app/(backend)/_components/ufdp/education-form";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { use } from "react";

export default function EditEducationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const educations = useQuery(api.education.get);
  const education = educations?.find((e) => e._id === id as Id<"educations">);

  if (!educations) {
    return <div className="p-8">Loading...</div>;
  }

  if (!education) {
    return <div className="p-8">Education entry not found</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Edit Education</h1>
      <EducationForm mode="edit" initialData={education as any} />
    </div>
  );
}
