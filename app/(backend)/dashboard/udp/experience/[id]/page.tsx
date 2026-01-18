"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import ExperienceForm from "@/app/(backend)/_components/ufdp/experience-form";
import { use } from "react";

export default function EditExperiencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const experiences = useQuery(api.experience.get);
  const experience = experiences?.find((e) => e._id === id as Id<"experiences">);

  if (!experiences) {
    return <div className="p-8">Loading...</div>;
  }

  if (!experience) {
    return <div className="p-8">Experience not found</div>;
  }

  const initialData = {
    ...experience,
    companyLogo: experience.companyLogo || "",
    isCurrentEmployer: experience.isCurrentEmployer ?? false,
    positions: experience.positions.map(p => ({
      ...p,
      employmentType: p.employmentType || "Full-time",
      icon: p.icon || "",
      description: p.description || "",
      skills: p.skills || [],
      isExpanded: p.isExpanded ?? false,
    }))
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Edit Experience</h1>
      <ExperienceForm mode="edit" initialData={initialData} /> 
    </div>
  );
}
