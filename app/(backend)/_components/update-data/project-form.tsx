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
import { Loader2, Upload, Trash2, GripVertical, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type GalleryItem = {
  id: string;
  type: 'existing' | 'new';
  url: string;
  file?: File;
};

interface ProjectFormProps {
  initialData?: any;
}

import { upload } from "@vercel/blob/client";

export function ProjectForm({ initialData }: ProjectFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(
    (initialData?.additionalImages || []).map((url: string) => ({
      id: crypto.randomUUID(),
      type: 'existing',
      url
    }))
  );

  const imageInputRef = useRef<HTMLInputElement>(null);
  const additionalImagesInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
      
      if (values.image instanceof File) {
        const blob = await upload(values.image.name, values.image, {
          access: 'public',
          handleUploadUrl: '/api/upload',
        });
        formData.append("image", blob.url);
      } else if (values.image && typeof values.image === 'string') {
        formData.append("image", values.image);
      }
      
      const finalGalleryUrls: string[] = [];
      for (const item of galleryItems) {
        if (item.type === 'existing') {
          finalGalleryUrls.push(item.url);
        } else if (item.type === 'new' && item.file) {
          const blob = await upload(item.file.name, item.file, {
            access: 'public',
            handleUploadUrl: '/api/upload',
          });
          finalGalleryUrls.push(blob.url);
        }
      }
      
      formData.append("additionalImages", JSON.stringify(finalGalleryUrls));

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
      const newItems: GalleryItem[] = files.map(file => ({
        id: crypto.randomUUID(),
        type: 'new',
        url: URL.createObjectURL(file), // This is the preview URL
        file
      }));
      setGalleryItems(prev => [...prev, ...newItems]);
      if (additionalImagesInputRef.current) {
        additionalImagesInputRef.current.value = "";
      }
    }
  };

  const removeGalleryItem = (id: string) => {
    setGalleryItems(prev => {
      const item = prev.find(i => i.id === id);
      if (item?.type === 'new') {
        URL.revokeObjectURL(item.url);
      }
      return prev.filter(i => i.id !== id);
    });
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setGalleryItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
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
              sizes="(max-width: 768px) 100vw, 800px"
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
        
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
            <SortableContext
              items={galleryItems.map(item => item.id)}
              strategy={rectSortingStrategy}
            >
              {galleryItems.map((item, index) => (
                <SortableGalleryItem 
                  key={item.id} 
                  item={item} 
                  onRemove={() => removeGalleryItem(item.id)} 
                />
              ))}
            </SortableContext>

            {galleryItems.length === 0 && (
              <div className="col-span-full py-8 text-center text-muted-foreground border-2 border-dashed rounded-md bg-muted/20">
                No gallery images uploaded yet.
              </div>
            )}
          </div>
        </DndContext>
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

function SortableGalleryItem({ item, onRemove }: { item: GalleryItem; onRemove: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group aspect-square rounded-md overflow-hidden border ${
        item.type === "new" ? "border-primary/50" : ""
      } ${isDragging ? "opacity-50" : ""}`}
    >
      <Image
        src={item.url}
        alt="Gallery"
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className="object-cover"
        unoptimized={item.type === "existing"}
      />

      {item.type === "new" && (
        <div className="absolute top-2 left-2 bg-primary/80 text-white p-1 rounded pointer-events-none">
          <span className="text-[10px] uppercase font-bold px-1">New</span>
        </div>
      )}

      {/* Drag Overlay */}
      <div 
        {...attributes} 
        {...listeners}
        className="absolute inset-0 cursor-grab active:cursor-grabbing flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20"
      >
        <GripVertical className="text-white drop-shadow-md" />
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
