"use client";

import { useState } from "react";
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
            <div className="mt-2 space-y-2">
              <Label>Gallery Images ({formData.galleryImages.length})</Label>
              {formData.galleryImages.map((img, index) => (
                <div key={index} className="flex items-center gap-2 p-2 border rounded">
                  <span className="flex-1 text-sm truncate">{img}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeGalleryImage(index)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              ))}
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
