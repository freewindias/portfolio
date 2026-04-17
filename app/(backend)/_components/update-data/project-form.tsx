"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { projectSchema, type ProjectValues } from "@/lib/validations/project";
import { saveProject, deleteProject } from "@/server/projects";
import { toast } from "sonner";
import { Loader2, Upload, Trash2, GripVertical, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";

interface ProjectFormProps {
  initialData?: any;
}

export function ProjectForm({ initialData }: ProjectFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null);
  const [additionalImages, setAdditionalImages] = useState<{file: File; preview: string}[]>([]);
  const [existingAdditionalImages, setExistingAdditionalImages] = useState<string[]>(initialData?.additionalImages || []);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const additionalImagesInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProjectValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      id: initialData?.id,
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      category: initialData?.category || "",
      client: initialData?.client || "",
      year: initialData?.year || "",
      website: initialData?.website || "",
      featured: initialData?.featured || false,
    },
  });

  const featuredWatch = watch("featured");
  const descriptionValue = watch("description");

  const onSubmit = async (values: ProjectValues) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      if (values.id) formData.append("id", values.id);
      formData.append("title", values.title);
      formData.append("slug", values.slug);
      formData.append("description", values.description);
      formData.append("category", values.category);
      if (values.client) formData.append("client", values.client);
      if (values.year) formData.append("year", values.year);
      if (values.website) formData.append("website", values.website);
      formData.append("featured", String(values.featured));
      formData.append("existingImage", initialData?.image || "");
      formData.append("existingAdditionalImages", JSON.stringify(existingAdditionalImages));

      if (values.image) {
        formData.append("image", values.image);
      }

      // Append new additional images
      formData.append("additionalImagesCount", additionalImages.length.toString());
      additionalImages.forEach((img, index) => {
        formData.append(`additionalImage_${index}`, img.file);
      });

      const result = await saveProject(formData);

      if (result.success) {
        toast.success(result.message);
        router.push("/dashboard/update/projects");
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
    if (!confirm("Are you sure you want to delete this project? This action cannot be undone.")) return;

    setIsDeleting(true);
    try {
      const result = await deleteProject(initialData.id);
      if (result.success) {
        toast.success(result.message);
        router.push("/dashboard/update/projects");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Error deleting project");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newImages = files.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      setAdditionalImages(prev => [...prev, ...newImages]);
      // Reset input value so same files can be selected again if needed
      if (additionalImagesInputRef.current) {
        additionalImagesInputRef.current.value = "";
      }
    }
  };

  const removeNewAdditionalImage = (index: number) => {
    setAdditionalImages(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const removeExistingAdditionalImage = (index: number) => {
    setExistingAdditionalImages(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      
      <div className="flex p-4 rounded-lg border bg-muted/30">
        <div className="flex flex-col gap-2 flex-1">
          <h3 className="font-semibold text-lg">Featured Project</h3>
          <p className="text-sm text-muted-foreground w-3/4">
            Highlight this project on your homepage. You can only have a maximum of 2 featured projects active at any given time.
          </p>
        </div>
        <div className="flex items-center pt-2">
          <Switch
            checked={featuredWatch}
            onCheckedChange={(val) => setValue("featured", val, { shouldDirty: true, shouldValidate: true })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field>
          <FieldLabel htmlFor="title">Project Title</FieldLabel>
          <Input id="title" placeholder="E.g., Brand Identity Logo" {...register("title")} />
          <FieldError errors={[errors.title]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="slug">Slug (URL Path)</FieldLabel>
          <Input id="slug" placeholder="e.g., brand-identity-logo" {...register("slug")} />
          <FieldDescription>Lowercase letters, numbers, and hyphens only.</FieldDescription>
          <FieldError errors={[errors.slug]} />
        </Field>

        <Field className="md:col-span-2">
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <RichTextEditor
            value={descriptionValue}
            onChange={(content) => setValue("description", content, { shouldValidate: true, shouldDirty: true })}
          />
          <FieldError errors={[errors.description]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="category">Category</FieldLabel>
          <Input id="category" placeholder="E.g., Branding & Web Design" {...register("category")} />
          <FieldError errors={[errors.category]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="client">Client (Optional)</FieldLabel>
          <Input id="client" placeholder="Client Name" {...register("client")} />
          <FieldError errors={[errors.client]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="year">Year</FieldLabel>
          <Input id="year" placeholder="2024" {...register("year")} />
          <FieldError errors={[errors.year]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="website">Website Link (Optional)</FieldLabel>
          <Input id="website" type="url" placeholder="https://example.com" {...register("website")} />
          <FieldError errors={[errors.website]} />
        </Field>
      </div>

      <div className="space-y-4">
        <FieldLabel>Main Cover Image</FieldLabel>
        <div 
          className="relative w-full h-80 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
          onClick={() => imageInputRef.current?.click()}
        >
          {imagePreview ? (
            <Image 
              src={imagePreview} 
              alt="Cover image preview" 
              fill 
              className="object-cover" 
              unoptimized
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-500">
              <Upload size={32} />
              <span>Upload Main Image</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
            <span className="text-white font-medium">Change Image</span>
          </div>
        </div>
        <input 
          type="file" 
          ref={imageInputRef} 
          onChange={handleImageChange} 
          accept="image/*" 
          className="hidden" 
        />
        <FieldDescription>This image forms the primary thumbnail and header entry for the project.</FieldDescription>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <FieldLabel>Additional Images (Gallery)</FieldLabel>
          <Button type="button" variant="outline" size="sm" onClick={() => additionalImagesInputRef.current?.click()}>
            <Upload className="w-4 h-4 mr-2" /> Add Images
          </Button>
        </div>
        <input 
          type="file" 
          ref={additionalImagesInputRef} 
          onChange={handleAdditionalImagesChange} 
          accept="image/*" 
          multiple
          className="hidden" 
        />
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
          {existingAdditionalImages.map((src, index) => (
            <div key={`existing-${index}`} className="relative group aspect-square rounded-md overflow-hidden border">
              <Image src={src} alt="Gallery" fill className="object-cover" unoptimized />
              <button
                type="button"
                onClick={() => removeExistingAdditionalImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          
          {additionalImages.map((img, index) => (
            <div key={`new-${index}`} className="relative group aspect-square rounded-md overflow-hidden border border-primary/50">
              <Image src={img.preview} alt="New Gallery Image" fill className="object-cover" />
              <div className="absolute top-2 left-2 bg-primary/80 text-white p-1 rounded">
                <span className="text-[10px] uppercase font-bold px-1">New</span>
              </div>
              <button
                type="button"
                onClick={() => removeNewAdditionalImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {existingAdditionalImages.length === 0 && additionalImages.length === 0 && (
            <div className="col-span-full py-8 text-center text-muted-foreground border-2 border-dashed rounded-md bg-muted/20">
              No gallery images uploaded yet.
            </div>
          )}
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
            Delete Project
          </Button>
        ) : (
          <div /> // Placeholder to align submit right
        )}
        
        <div className="flex items-center gap-4">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => router.push("/dashboard/update/projects")}
            disabled={isLoading || isDeleting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading || isDeleting} 
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Save Changes" : "Create Project"}
          </Button>
        </div>
      </div>
    </form>
  );
}
