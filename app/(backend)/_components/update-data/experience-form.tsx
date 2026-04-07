"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { experienceSchema, type ExperienceValues } from "@/lib/validations/experience";
import { saveExperience, deleteExperience } from "@/server/experiences";
import { toast } from "sonner";
import { Loader2, Upload, Trash2, PlusCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ExperienceFormProps {
  initialData?: any;
}

export function ExperienceForm({ initialData }: ExperienceFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [iconPreview, setIconPreview] = useState<string | null>(initialData?.iconUrl || null);
  const [bulletPoints, setBulletPoints] = useState<string[]>(initialData?.bulletPoints || [""]);

  const iconInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ExperienceValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      id: initialData?.id,
      role: initialData?.role || "",
      location: initialData?.location || "",
      startYear: initialData?.startYear || "",
      endYear: initialData?.endYear || "",
    },
  });

  const handleAddBulletPoint = () => {
    setBulletPoints([...bulletPoints, ""]);
  };

  const handleRemoveBulletPoint = (index: number) => {
    const newBullets = [...bulletPoints];
    newBullets.splice(index, 1);
    // Ensure we always have at least one empty string if array is empty
    setBulletPoints(newBullets.length ? newBullets : [""]);
  };

  const handleBulletPointChange = (index: number, value: string) => {
    const newBullets = [...bulletPoints];
    newBullets[index] = value;
    setBulletPoints(newBullets);
  };

  const onSubmit = async (values: ExperienceValues) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      if (values.id) formData.append("id", values.id);
      formData.append("role", values.role);
      formData.append("location", values.location);
      formData.append("startYear", values.startYear);
      formData.append("endYear", values.endYear);
      formData.append("existingIconUrl", initialData?.iconUrl || "");
      
      // Filter out empty bullet points
      const cleanBullets = bulletPoints.filter(b => b.trim() !== "");
      formData.append("bulletPoints", JSON.stringify(cleanBullets));

      if (values.icon) {
        formData.append("icon", values.icon);
      }

      const result = await saveExperience(formData);

      if (result.success) {
        toast.success(result.message);
        router.push("/dashboard/update/experience");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!initialData?.id) return;
    if (!confirm("Are you sure you want to delete this experience? This action cannot be undone.")) return;

    setIsDeleting(true);
    try {
      const result = await deleteExperience(initialData.id);
      if (result.success) {
        toast.success(result.message);
        router.push("/dashboard/update/experience");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Error deleting experience");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("icon", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setIconPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field className="md:col-span-2">
          <FieldLabel htmlFor="role">Role & Company</FieldLabel>
          <Input id="role" placeholder="E.g., Product Designer, Tailwind" {...register("role")} />
          <FieldError errors={[errors.role]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="location">Location</FieldLabel>
          <Input id="location" placeholder="E.g., Remote or Mumbai, IN" {...register("location")} />
          <FieldError errors={[errors.location]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="startYear">Start Year</FieldLabel>
          <Input id="startYear" placeholder="E.g., 2022" {...register("startYear")} />
          <FieldError errors={[errors.startYear]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="endYear">End Year</FieldLabel>
          <Input id="endYear" placeholder="E.g., Present or 2024" {...register("endYear")} />
          <FieldError errors={[errors.endYear]} />
        </Field>
      </div>

      <div className="space-y-4">
        <FieldLabel>Company/Tool Icon</FieldLabel>
        <div 
          className="relative w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
          onClick={() => iconInputRef.current?.click()}
        >
          {iconPreview ? (
            <Image 
              src={iconPreview} 
              alt="Icon preview" 
              fill 
              className="object-contain p-2" 
              unoptimized
            />
          ) : (
            <div className="flex flex-col items-center gap-1 text-gray-500">
              <Upload size={20} />
            </div>
          )}
        </div>
        <input 
          type="file" 
          ref={iconInputRef} 
          onChange={handleIconChange} 
          accept="image/*" 
          className="hidden" 
        />
        <FieldDescription>A small logo for this experience entry.</FieldDescription>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <FieldLabel>Bullet Points</FieldLabel>
          <Button type="button" variant="outline" size="sm" onClick={handleAddBulletPoint}>
            <PlusCircle className="w-4 h-4 mr-2" /> Add Point
          </Button>
        </div>
        
        <div className="space-y-3">
          {bulletPoints.map((point, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={point}
                onChange={(e) => handleBulletPointChange(index, e.target.value)}
                placeholder="E.g., Led end-to-end redesign of dashboard UI..."
                className="flex-1"
              />
              <Button 
                type="button" 
                variant="ghost" 
                size="icon"
                onClick={() => handleRemoveBulletPoint(index)}
              >
                <Trash2 className="w-4 h-4 text-muted-foreground hover:text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-8 border-t">
        {initialData?.id ? (
          <Button 
            type="button" 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting || isLoading}
          >
            {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
            Delete Experience
          </Button>
        ) : (
          <div /> // Placeholder to align submit right
        )}
        
        <div className="flex items-center gap-4">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => router.push("/dashboard/update/experience")}
            disabled={isLoading || isDeleting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading || isDeleting} 
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Save Changes" : "Create Experience"}
          </Button>
        </div>
      </div>
    </form>
  );
}
