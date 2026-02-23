"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import RichTextEditor from "@/components/ui/rich-text-editor";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
    closestCenter, DndContext, DragEndEvent, KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMutation, useQuery } from "convex/react";
import { EyeIcon, GripVerticalIcon, TrashIcon } from "lucide-react";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

type ProjectData = {
  title: string;
  slug: string;
  year: string;
  category: string;
  client: string;
  overview: string;
  heroImage: string;
  heroImageCaption?: string;
  galleryImages?: string[];
  featured?: boolean;
  order?: number;
  websiteUrl?: string;
  description?: string;
};

interface ProjectFormProps {
  initialData?: ProjectData & { _id?: Id<"projects"> };
  mode: "create" | "edit";
}

export default function ProjectForm({ initialData, mode }: ProjectFormProps) {
  const router = useRouter();
  const createMutation = useMutation(api.projects.create);
  const updateMutation = useMutation(api.projects.update);
  const generateUploadUrl = useMutation(api.projects.generateUploadUrl);
  
  const [heroUploading, setHeroUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);

  const [formData, setFormData] = useState<ProjectData>({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    year: initialData?.year || new Date().getFullYear().toString(),
    category: initialData?.category || "",
    client: initialData?.client || "",
    overview: initialData?.overview || "",
    heroImage: initialData?.heroImage || "",
    heroImageCaption: initialData?.heroImageCaption || "",
    galleryImages: initialData?.galleryImages || [],
    featured: initialData?.featured || false,
    order: initialData?.order || 0,
    websiteUrl: initialData?.websiteUrl || "",
    description: initialData?.description || "",
  });

  // Auto-generate slug from title
  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: mode === "create" ? title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") : formData.slug,
    });
  };

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setHeroUploading(true);
    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();
      setFormData({ ...formData, heroImage: storageId });
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setHeroUploading(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setGalleryUploading(true);
    try {
      const uploadedIds: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const postUrl = await generateUploadUrl();
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        const { storageId } = await result.json();
        uploadedIds.push(storageId);
      }
      setFormData({
        ...formData,
        galleryImages: [...(formData.galleryImages || []), ...uploadedIds],
      });
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setGalleryUploading(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    const newGallery = [...(formData.galleryImages || [])];
    newGallery.splice(index, 1);
    setFormData({ ...formData, galleryImages: newGallery });
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setFormData((prev) => {
        const oldIndex = prev.galleryImages?.indexOf(active.id as string) ?? -1;
        const newIndex = prev.galleryImages?.indexOf(over.id as string) ?? -1;

        if (oldIndex !== -1 && newIndex !== -1) {
          return {
            ...prev,
            galleryImages: arrayMove(prev.galleryImages!, oldIndex, newIndex),
          };
        }
        return prev;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === "create") {
        await createMutation(formData);
      } else if (mode === "edit" && initialData?._id) {
        await updateMutation({
          id: initialData._id,
          ...formData,
        });
      }
      router.push("/dashboard/udp/projects");
    } catch (error) {
      console.error("Failed to save project:", error);
      alert("Failed to save. Check console for details.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      {/* Basic Information */}
      <div className="space-y-4 border p-4 rounded-lg">
        <h2 className="text-xl font-semibold">Basic Information</h2>
        
        <div className="grid gap-2">
          <Label htmlFor="title">Project Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
            placeholder="e.g. Digital Artisans"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="slug">URL Slug *</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            required
            placeholder="e.g. digital-artisans"
          />
          <p className="text-xs text-muted-foreground">
            Will be used in URL: /projects/{formData.slug || "slug"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="year">Year *</Label>
            <Input
              id="year"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              required
              placeholder="2024"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="order">Display Order</Label>
            <Input
              id="order"
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              placeholder="0"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="category">Category *</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
            placeholder="e.g. [BRAND IDENTITY]"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="client">Client *</Label>
          <Input
            id="client"
            value={formData.client}
            onChange={(e) => setFormData({ ...formData, client: e.target.value })}
            required
            placeholder="e.g. [CREATIVE STUDIO]"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="featured"
            checked={formData.featured}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, featured: checked as boolean })
            }
          />
          <Label htmlFor="featured">Featured Project (show on homepage)</Label>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="websiteUrl">Website URL</Label>
          <Input
            id="websiteUrl"
            value={formData.websiteUrl}
            onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
            placeholder="https://example.com"
          />
          <p className="text-xs text-muted-foreground">
            Link to the live project website
          </p>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">Short Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="A brief summary of the project"
            rows={2}
          />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4 border p-4 rounded-lg">
        <h2 className="text-xl font-semibold">Content</h2>

        <div className="grid gap-2">
          <Label htmlFor="overview">Project Overview *</Label>
          <RichTextEditor
            value={formData.overview}
            onChange={(value) => setFormData({ ...formData, overview: value })}
            className="min-h-[200px]"
            placeholder="Detailed project overview..."
          />
        </div>
      </div>

      {/* Images */}
      <div className="space-y-4 border p-4 rounded-lg">
        <h2 className="text-xl font-semibold">Images</h2>

        <div className="grid gap-2">
          <Label htmlFor="heroImage">Hero Image *</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleHeroImageUpload}
            disabled={heroUploading}
            className="cursor-pointer"
          />
          <div className="text-xs text-muted-foreground">
            {heroUploading ? "Uploading..." : "Upload main project image"}
          </div>
          <Label htmlFor="heroImageUrl" className="mt-2 text-xs">Or use URL</Label>
          <Input
            id="heroImageUrl"
            value={formData.heroImage}
            onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
            placeholder="https://... or storage ID"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="heroImageCaption">Hero Image Caption</Label>
          <Input
            id="heroImageCaption"
            value={formData.heroImageCaption}
            onChange={(e) => setFormData({ ...formData, heroImageCaption: e.target.value })}
            placeholder="Optional caption for hero image"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="galleryImages">Gallery Images</Label>
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={handleGalleryUpload}
            disabled={galleryUploading}
            className="cursor-pointer"
          />
          <div className="text-xs text-muted-foreground">
            {galleryUploading ? "Uploading..." : "Upload multiple images for gallery"}
          </div>
          
          {formData.galleryImages && formData.galleryImages.length > 0 && (
            <div className="mt-4 space-y-3">
              <Label className="text-sm font-medium">Gallery Images ({formData.galleryImages.length})</Label>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={formData.galleryImages}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {formData.galleryImages.map((img, index) => (
                      <SortableImage
                        key={img}
                        id={img}
                        index={index}
                        onRemove={removeGalleryImage}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit">Save Project</Button>
      </div>
    </form>
  );
}

interface SortableImageProps {
  id: string;
  index: number;
  onRemove: (index: number) => void;
}

function SortableImage({ id, index, onRemove }: SortableImageProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
    opacity: isDragging ? 0.5 : 1,
  };

  const resolvedUrl = useQuery(api.projects.getStorageUrl, 
    (id.startsWith("http") || id.startsWith("/")) ? "skip" : { storageId: id }
  );
  
  const displayUrl = (id.startsWith("http") || id.startsWith("/")) ? id : resolvedUrl;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 border rounded-lg bg-card shadow-sm group"
    >
      <div 
        {...attributes} 
        {...listeners} 
        className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded transition-colors"
      >
        <GripVerticalIcon className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="relative h-12 w-12 rounded border bg-muted overflow-hidden shrink-0">
        {displayUrl ? (
          <NextImage
            src={displayUrl}
            alt={`Image ${index + 1}`}
            fill
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-[10px] text-muted-foreground">
            ...
          </div>
        )}
      </div>

      <span className="flex-1 text-sm font-medium truncate max-w-[200px]">
        {id.split("/").pop() || id}
      </span>

      <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
        {displayUrl && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => window.open(displayUrl, "_blank")}
            title="View image"
            className="h-8 w-8"
          >
            <EyeIcon className="h-4 w-4" />
          </Button>
        )}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onRemove(index)}
          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <TrashIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
