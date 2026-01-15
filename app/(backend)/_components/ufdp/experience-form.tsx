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
import { DynamicIcon } from "@/components/dynamic-icon";


// Helper for generating IDs
const generateId = () => crypto.randomUUID();

type Position = {
  id: string;
  title: string;
  employmentPeriod: string;
  employmentType: string;
  description: string;
  icon: string;
  skills: string[];
  isExpanded: boolean;
};

type ExperienceData = {
  id: string;
  companyName: string;
  companyLogo: string;
  isCurrentEmployer: boolean;
  positions: Position[];
};

interface ExperienceFormProps {
  initialData?: ExperienceData & { _id?: Id<"experiences"> };
  mode: "create" | "edit";
}

export default function ExperienceForm({ initialData, mode }: ExperienceFormProps) {
  const router = useRouter();
  const createMutation = useMutation(api.experience.create);
  const updateMutation = useMutation(api.experience.update);
  const generateUploadUrl = useMutation(api.experience.generateUploadUrl);
  const [logoUploading, setLogoUploading] = useState(false);

  const [formData, setFormData] = useState<ExperienceData>({
    id: initialData?.id || generateId(), // Generate ID for new, keep for edit
    companyName: initialData?.companyName || "",
    companyLogo: initialData?.companyLogo || "",
    isCurrentEmployer: initialData?.isCurrentEmployer || false,
    positions: initialData?.positions.map(p => ({
        ...p,
        skills: p.skills || [], // Ensure skills is always an array
    })) || [
      {
        id: generateId(),
        title: "",
        employmentPeriod: "",
        employmentType: "Full-time",
        description: "",
        icon: "business",
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
      setFormData({ ...formData, companyLogo: storageId });
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
            positions: formData.positions.map(p => ({
                ...p,
                skills: p.skills || [], // Validate skills array 
                icon: p.icon || "business"
            }))
         });
      } else if (mode === "edit" && initialData?._id) {
        await updateMutation({
          id: initialData._id,
          companyName: formData.companyName,
          companyLogo: formData.companyLogo,
          isCurrentEmployer: formData.isCurrentEmployer,
          positions: formData.positions.map(p => ({
            ...p,
            skills: p.skills || [],
             icon: p.icon || "business"
          })),
        });
      }
      router.push("/dashboard/udp/experience");
    } catch (error) {
      console.error("Failed to save experience:", error);
      alert("Failed to save. Check console for details.");
    }
  };

  const addPosition = () => {
    setFormData({
      ...formData,
      positions: [
        ...formData.positions,
        {
          id: generateId(),
          title: "",
          employmentPeriod: "",
          employmentType: "Full-time",
          description: "",
          icon: "business",
          skills: [],
          isExpanded: true,
        },
      ],
    });
  };

  const removePosition = (index: number) => {
    const newPositions = [...formData.positions];
    newPositions.splice(index, 1);
    setFormData({ ...formData, positions: newPositions });
  };

  const updatePosition = (index: number, field: keyof Position, value: any) => {
    const newPositions = [...formData.positions];
    newPositions[index] = { ...newPositions[index], [field]: value };
    setFormData({ ...formData, positions: newPositions });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      <div className="space-y-4 border p-4 rounded-lg">
        <h2 className="text-xl font-semibold">Company Details</h2>
        <div className="grid gap-2">
          <Label htmlFor="companyName">Company Name</Label>
          <Input
            id="companyName"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            required
            placeholder="e.g. Google"
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="companyLogo">Logo</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            disabled={logoUploading}
          />
          <div className="text-xs text-muted-foreground">
             {logoUploading ? "Uploading..." : "Upload a logo image"}
          </div>
          <Label htmlFor="companyLogoUrl" className="mt-2 text-xs">Or use URL</Label>
          <Input
            id="companyLogoUrl"
            value={formData.companyLogo}
            onChange={(e) => setFormData({ ...formData, companyLogo: e.target.value })}
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
          <Label htmlFor="isCurrentEmployer">Current Employer</Label>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Positions</h2>
            <Button type="button" variant="outline" size="sm" onClick={addPosition}>
                <PlusIcon className="mr-2 h-4 w-4" /> Add Position
            </Button>
        </div>
        
        {formData.positions.map((position, index) => (
          <div key={position.id} className="border p-4 rounded-lg space-y-4 relative bg-muted/20">
            <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2 text-destructive hover:text-destructive/90"
                onClick={() => removePosition(index)}
            >
                <TrashIcon className="h-4 w-4" />
            </Button>

            <div className="grid gap-2">
              <Label>Title</Label>
              <Input
                value={position.title}
                onChange={(e) => updatePosition(index, "title", e.target.value)}
                required
                placeholder="e.g. Senior Engineer"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                <Label>Time Period</Label>
                <Input
                    value={position.employmentPeriod}
                    onChange={(e) => updatePosition(index, "employmentPeriod", e.target.value)}
                    required
                    placeholder="Jan 2020 - Present"
                />
                </div>
                <div className="grid gap-2">
                <Label>Type</Label>
                <Input
                    value={position.employmentType}
                    onChange={(e) => updatePosition(index, "employmentType", e.target.value)}
                    placeholder="Full-time"
                />
                </div>
            </div>

            <div className="grid gap-2">
              <Label>Icon (for Icons visit React Icons Website)</Label>
              <div className="flex items-center gap-2">
                <Input
                  value={position.icon}
                  onChange={(e) => updatePosition(index, "icon", e.target.value)}
                  placeholder="e.g. FaReact, SiTypescript, MdWork"
                  className="flex-1"
                />
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-muted">
                    <DynamicIcon name={position.icon || "MdBusinessCenter"} className="size-5" />
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Description (Rich Text)</Label>
              <RichTextEditor
                value={position.description}
                onChange={(value) => updatePosition(index, "description", value)}
                className="min-h-[150px]"
                placeholder="Describe your role..."
              />
            </div>

            <div className="grid gap-2">
              <Label>Skills (comma separated)</Label>
              <Input
                value={position.skills.join(", ")}
                onChange={(e) => updatePosition(index, "skills", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                placeholder="React, TypeScript, Node.js"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        <Button type="submit">Save Experience</Button>
      </div>
    </form>
  );
}
