"use client";

import { useEffect, useState } from "react";
import { getAllImages, deleteImage, type ImageItem } from "@/server/storage";
import { Trash2, Image as ImageIcon, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import Image from "next/image";

export default function StoragePage() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchImages = async () => {
    setLoading(true);
    const data = await getAllImages();
    setImages(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleDelete = async (item: ImageItem) => {
    if (!confirm(`Are you sure you want to delete this image? This will remove it from the ${item.section}.`)) {
      return;
    }

    setDeletingId(item.url); // Use URL as unique ID for gallery items
    const result = await deleteImage(item);
    
    if (result.success) {
      toast.success(result.message);
      setImages((prev) => prev.filter((img) => img.url !== item.url));
    } else {
      toast.error(result.message);
    }
    setDeletingId(null);
  };

  const groupedImages = images.reduce((acc, img) => {
    if (!acc[img.section]) {
      acc[img.section] = [];
    }
    acc[img.section].push(img);
    return acc;
  }, {} as Record<string, ImageItem[]>);

  const renderImageGrid = (items: ImageItem[]) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item, idx) => (
        <Card key={`${item.url}-${idx}`} className="group overflow-hidden border-muted hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md">
          <div className="relative aspect-square bg-muted">
            {item.url.toLowerCase().endsWith('.pdf') || item.url.toLowerCase().includes('resume') ? (
               <div className="absolute inset-0 flex flex-col items-center justify-center bg-blue-50/50 p-4">
                  <div className="p-3 bg-blue-100 rounded-xl text-blue-600 mb-2">
                    <ImageIcon className="h-8 w-8" />
                  </div>
                  <span className="text-xs font-medium text-blue-700 uppercase tracking-wider text-center px-2">Document File</span>
               </div>
            ) : (
              <Image
                src={item.url}
                alt={item.label}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            )}
            
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                variant="secondary"
                size="icon"
                className="h-9 w-9 rounded-full bg-white/90 hover:bg-white text-black border-none"
                render={<a href={item.url} target="_blank" rel="noopener noreferrer" />}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                disabled={deletingId === item.url}
                onClick={() => handleDelete(item)}
                className="h-9 w-9 rounded-full shadow-lg"
              >
                {deletingId === item.url ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <div className="p-3 bg-card border-t border-muted">
            <p className="text-sm font-medium truncate">{item.label}</p>
            <p className="text-[10px] text-muted-foreground font-mono mt-0.5 truncate opacity-70">
              {item.url.split('/').pop()}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Loading your storage...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Storage & Uploaded Images</h1>
        <p className="text-muted-foreground">
          Manage all images uploaded to your portfolio. Deleting an image here will remove it from the corresponding section.
        </p>
      </div>

      {Object.keys(groupedImages).length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="p-4 bg-muted rounded-full">
              <ImageIcon className="h-10 w-10 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">No images found</h3>
              <p className="text-muted-foreground max-w-xs">
                You haven't uploaded any images yet. Upload images in the section editors to see them here.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        Object.entries(groupedImages).map(([section, items]) => {
          if (section === "Projects Section") {
            const projectGroups = items.reduce((acc, img) => {
              const name = img.projectName || "Other";
              if (!acc[name]) acc[name] = [];
              acc[name].push(img);
              return acc;
            }, {} as Record<string, ImageItem[]>);

            return (
              <div key={section} className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-1 bg-primary rounded-full" />
                  <h2 className="text-xl font-semibold">{section}</h2>
                </div>
                
                {Object.entries(projectGroups).map(([projectName, projectImages]) => (
                  <div key={projectName} className="space-y-4 pl-4 border-l-2 border-muted/50">
                    <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary/40" />
                      {projectName}
                    </h3>
                    {renderImageGrid(projectImages.sort((a, b) => {
                      if (a.type === "project") return -1;
                      if (b.type === "project") return 1;
                      return 0;
                    }))}
                  </div>
                ))}
              </div>
            );
          }

          return (
            <div key={section} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-1 bg-primary rounded-full" />
                <h2 className="text-xl font-semibold">{section}</h2>
              </div>
              {renderImageGrid(items)}
            </div>
          );
        })
      )}
    </div>
  );
}
