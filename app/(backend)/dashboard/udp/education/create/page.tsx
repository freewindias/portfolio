"use client";

import EducationForm from "@/app/(backend)/_components/ufdp/education-form";

export default function CreateEducationPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Add New Education</h1>
      <EducationForm mode="create" />
    </div>
  );
}
