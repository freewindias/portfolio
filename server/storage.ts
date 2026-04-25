"use server";

import { db } from "@/db/drizzle";
import { hero, project, experience } from "@/db/schema";
import { eq } from "drizzle-orm";
import { unlink } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";

export type ImageItem = {
  id: string;
  url: string;
  section: string;
  projectName?: string;
  label: string;
  type: "hero" | "project" | "project_gallery" | "experience";
  field: string;
};

export async function getAllImages() {
  try {
    const images: ImageItem[] = [];

    // Fetch Hero images
    const heroData = await db.query.hero.findFirst();
    if (heroData) {
      if (heroData.bannerUrl) {
        images.push({
          id: heroData.id,
          url: heroData.bannerUrl,
          section: "Hero Section",
          label: "Banner Image",
          type: "hero",
          field: "bannerUrl",
        });
      }
      if (heroData.profileUrl) {
        images.push({
          id: heroData.id,
          url: heroData.profileUrl,
          section: "Hero Section",
          label: "Profile Image",
          type: "hero",
          field: "profileUrl",
        });
      }
      if (heroData.resumeUrl) {
        images.push({
          id: heroData.id,
          url: heroData.resumeUrl,
          section: "Hero Section",
          label: "Resume File",
          type: "hero",
          field: "resumeUrl",
        });
      }
    }

    // Fetch Experience icons
    const experiences = await db.query.experience.findMany();
    experiences.forEach((exp) => {
      if (exp.iconUrl) {
        images.push({
          id: exp.id,
          url: exp.iconUrl,
          section: "Experience Section",
          label: `${exp.role} @ ${exp.location}`,
          type: "experience",
          field: "iconUrl",
        });
      }
    });

    // Fetch Project images
    const projects = await db.query.project.findMany();
    projects.forEach((proj) => {
      if (proj.image) {
        images.push({
          id: proj.id,
          url: proj.image,
          section: "Projects Section",
          projectName: proj.title,
          label: "Main Cover Image",
          type: "project",
          field: "image",
        });
      }
      if (proj.additionalImages && Array.isArray(proj.additionalImages)) {
        proj.additionalImages.forEach((imgUrl, index) => {
          images.push({
            id: proj.id,
            url: imgUrl,
            section: "Projects Section",
            projectName: proj.title,
            label: `Additional Image ${index + 1}`,
            type: "project_gallery",
            field: "additionalImages",
          });
        });
      }
    });

    return images;
  } catch (error) {
    console.error("Error fetching images:", error);
    return [];
  }
}

export async function deleteImage(item: ImageItem) {
  try {
    // 1. Delete file from filesystem
    const filePath = path.join(process.cwd(), "public", item.url);
    try {
      await unlink(filePath);
    } catch (err) {
      console.warn(`File not found or already deleted: ${filePath}`);
    }

    // 2. Update database
    if (item.type === "hero") {
      await db
        .update(hero)
        .set({ [item.field]: null })
        .where(eq(hero.id, item.id));
    } else if (item.type === "experience") {
      await db
        .update(experience)
        .set({ iconUrl: null })
        .where(eq(experience.id, item.id));
    } else if (item.type === "project") {
      await db
        .update(project)
        .set({ image: null })
        .where(eq(project.id, item.id));
    } else if (item.type === "project_gallery") {
      const proj = await db.query.project.findFirst({
        where: eq(project.id, item.id),
      });
      if (proj && proj.additionalImages) {
        const updatedGallery = proj.additionalImages.filter((url) => url !== item.url);
        await db
          .update(project)
          .set({ additionalImages: updatedGallery })
          .where(eq(project.id, item.id));
      }
    }

    revalidatePath("/", "layout");
    revalidatePath("/dashboard/storage");
    
    return { success: true, message: "Image deleted successfully" };
  } catch (error) {
    console.error("Error deleting image:", error);
    return { success: false, message: "Failed to delete image" };
  }
}
