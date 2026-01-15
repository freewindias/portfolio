"use client";

import ExperienceForm from "@/app/(backend)/_components/ufdp/experience-form";

export default function CreateExperiencePage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Add New Experience</h1>
      <ExperienceForm mode="create" />
    </div>
  );
}
