"use client";

import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusIcon, TrashIcon } from "lucide-react";
import RichTextEditor from "@/components/ui/rich-text-editor";
import { Id } from "@/convex/_generated/dataModel";

// Helper for generating IDs
const generateId = () => crypto.randomUUID();

type Degree = {
  id: string;
  degree: string;
  period: string;
  description: string;
  skills: string[];
  isExpanded: boolean;
};

type EducationData = {
  id: string;
  institutionName: string;
  institutionLogo: string;
  isCurrentEmployer: boolean;
  degrees: Degree[];
};

interface EducationFormProps {
  initialData?: EducationData & { _id?: Id<"educations"> };
  mode: "create" | "edit";
}

export default function EducationForm({ initialData, mode }: EducationFormProps) {
  const router = useRouter();
  const createMutation = useMutation(api.education.create);
  const updateMutation = useMutation(api.education.update);
  const generateUploadUrl = useMutation(api.education.generateUploadUrl);
  const [logoUploading, setLogoUploading] = useState(false);

  const [formData, setFormData] = useState<EducationData>({
    id: initialData?.id || generateId(),
    institutionName: initialData?.institutionName || "",
    institutionLogo: initialData?.institutionLogo || "",
    isCurrentEmployer: initialData?.isCurrentEmployer || false,
    degrees: initialData?.degrees.map(d => ({
        ...d,
        skills: d.skills || [],
    })) || [
      {
        id: generateId(),
        degree: "",
        period: "",
        description: "",
        skills: [],
        isExpanded: true,
      },
    ],
  });

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoUploading(true);
    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();
      setFormData({ ...formData, institutionLogo: storageId });
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setLogoUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === "create") {
         await createMutation({
            ...formData,
            degrees: formData.degrees.map(d => ({
                ...d,
                 skills: d.skills || [],
            }))
         });
      } else if (mode === "edit" && initialData?._id) {
        await updateMutation({
          id: initialData._id,
          institutionName: formData.institutionName,
          institutionLogo: formData.institutionLogo,
          isCurrentEmployer: formData.isCurrentEmployer,
          degrees: formData.degrees.map(d => ({
            ...d,
            skills: d.skills || [],
          })),
        });
      }
      router.push("/dashboard/udp/education");
    } catch (error) {
      console.error("Failed to save education:", error);
      alert("Failed to save. Check console for details.");
    }
  };

  const addDegree = () => {
    setFormData({
      ...formData,
      degrees: [
        ...formData.degrees,
        {
          id: generateId(),
          degree: "",
          period: "",
          description: "",
          skills: [],
          isExpanded: true,
        },
      ],
    });
  };

  const removeDegree = (index: number) => {
    const newDegrees = [...formData.degrees];
    newDegrees.splice(index, 1);
    setFormData({ ...formData, degrees: newDegrees });
  };

  const updateDegree = (index: number, field: keyof Degree, value: any) => {
    const newDegrees = [...formData.degrees];
    newDegrees[index] = { ...newDegrees[index], [field]: value };
    setFormData({ ...formData, degrees: newDegrees });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      <div className="space-y-4 border p-4 rounded-lg">
        <h2 className="text-xl font-semibold">Institution Details</h2>
        <div className="grid gap-2">
          <Label htmlFor="institutionName">Institution Name</Label>
          <Input
            id="institutionName"
            value={formData.institutionName}
            onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
            required
            placeholder="e.g. University of Examples"
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="institutionLogo">Logo</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            disabled={logoUploading}
            className="cursor-pointer"
          />
          <div className="text-xs text-muted-foreground">
             {logoUploading ? "Uploading..." : "Upload a logo image"}
          </div>
          <Label htmlFor="institutionLogoUrl" className="mt-2 text-xs">Or use URL</Label>
          <Input
            id="institutionLogoUrl"
            value={formData.institutionLogo}
            onChange={(e) => setFormData({ ...formData, institutionLogo: e.target.value })}
            placeholder="https://..."
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isCurrentEmployer"
            checked={formData.isCurrentEmployer}
            onCheckedChange={(checked) => 
              setFormData({ ...formData, isCurrentEmployer: checked as boolean })
            }
          />
          <Label htmlFor="isCurrentEmployer">Current Institution</Label>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Degrees / Certifications</h2>
            <Button type="button" variant="outline" size="sm" onClick={addDegree}>
                <PlusIcon className="mr-2 h-4 w-4" /> Add Degree
            </Button>
        </div>
        
        {formData.degrees.map((degree, index) => (
          <div key={degree.id} className="border p-4 rounded-lg space-y-4 relative bg-muted/20">
            <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2 text-destructive hover:text-destructive/90"
                onClick={() => removeDegree(index)}
            >
                <TrashIcon className="h-4 w-4" />
            </Button>

            <div className="grid gap-2">
              <Label>Degree / Title</Label>
              <Input
                value={degree.degree}
                onChange={(e) => updateDegree(index, "degree", e.target.value)}
                required
                placeholder="e.g. Bachelor of Computer Science"
              />
            </div>

            <div className="grid gap-2">
                <Label>Time Period</Label>
                <Input
                    value={degree.period}
                    onChange={(e) => updateDegree(index, "period", e.target.value)}
                    required
                    placeholder="Sep 2020 - May 2024"
                />
            </div>

              <Label>Description (Rich Text)</Label>
              <RichTextEditor
                value={degree.description}
                onChange={(value) => updateDegree(index, "description", value)}
                className="min-h-[150px]"
                placeholder="Describe your achievements..."
              />

            <div className="grid gap-2">
              <Label>Skills (comma separated)</Label>
              <Input
                value={degree.skills.join(", ")}
                onChange={(e) => updateDegree(index, "skills", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                placeholder="Math, Physics, Programming"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        <Button type="submit">Save Education</Button>
      </div>
    </form>
  );
}
