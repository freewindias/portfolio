"use server";

import { db } from "@/db/drizzle";
import { project } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";

async function saveFile(file: File, subDir: string) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const fileName = `${Date.now()}-${file.name.replace(/[^a-z0-9.]/gi, "_").toLowerCase()}`;
    const uploadDir = path.join(process.cwd(), "public/uploads", subDir);
    
    // Ensure directory exists
    await mkdir(uploadDir, { recursive: true });
    
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);
    
    return `/uploads/${subDir}/${fileName}`;
  } catch (error) {
    console.error("Error saving file:", error);
    throw new Error("Failed to save file");
  }
}

export async function getProjects() {
  try {
    const projects = await db.query.project.findMany({
      orderBy: [desc(project.createdAt)],
    });
    return projects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

export async function getProjectById(id: string) {
  try {
    const data = await db.query.project.findFirst({
      where: eq(project.id, id),
    });
    return data || null;
  } catch (error) {
    console.error("Error fetching project:", error);
    return null;
  }
}

export async function getProjectBySlug(slug: string) {
  try {
    const data = await db.query.project.findFirst({
      where: eq(project.slug, slug),
    });
    return data || null;
  } catch (error) {
    console.error("Error fetching project by slug:", error);
    return null;
  }
}

export async function deleteProject(id: string) {
  try {
    await db.delete(project).where(eq(project.id, id));
    revalidatePath("/(frontend)/works", "layout");
    revalidatePath("/dashboard/update/projects");
    return { success: true, message: "Project deleted successfully" };
  } catch (error) {
    console.error("Error deleting project:", error);
    return { success: false, message: "Failed to delete project" };
  }
}

export async function saveProject(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const slug = formData.get("slug") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const client = formData.get("client") as string;
    const year = formData.get("year") as string;
    const website = formData.get("website") as string;
    const featured = formData.get("featured") === "true";
    
    let imageUrl = formData.get("existingImage") as string || null;
    let additionalImages: string[] = [];
    const galleryOrderStr = formData.get("galleryOrder") as string;
    
    if (galleryOrderStr) {
      try {
        const galleryOrder = JSON.parse(galleryOrderStr);
        const newFiles: string[] = [];
        
        // First, upload all new files
        const additionalFilesCountString = formData.get("additionalImagesCount") as string;
        if (additionalFilesCountString) {
          const count = parseInt(additionalFilesCountString, 10);
          for (let i = 0; i < count; i++) {
            const file = formData.get(`additionalImage_${i}`) as File | null;
            if (file && file.size > 0) {
              const newUrl = await saveFile(file, "projects");
              newFiles.push(newUrl);
            }
          }
        }
        
        // Then, assemble in the correct order
        additionalImages = galleryOrder.map((item: any) => {
          if (item.type === 'existing') {
            return item.url;
          } else {
            return newFiles[item.index];
          }
        }).filter(Boolean);
      } catch (e) {
        console.error("Error processing gallery order:", e);
      }
    } else {
      // Fallback for older version or if galleryOrder is missing
      try {
        const existingImages = formData.get("existingAdditionalImages");
        if (existingImages) {
          additionalImages = JSON.parse(existingImages as string);
        }
      } catch(e) {}
      
      const additionalFilesCountString = formData.get("additionalImagesCount") as string;
      if (additionalFilesCountString) {
        const count = parseInt(additionalFilesCountString, 10);
        for (let i = 0; i < count; i++) {
          const file = formData.get(`additionalImage_${i}`) as File | null;
          if (file && file.size > 0) {
            const newUrl = await saveFile(file, "projects");
            additionalImages.push(newUrl);
          }
        }
      }
    }

    const imageFile = formData.get("image") as File | null;
    if (imageFile && imageFile.size > 0) {
      imageUrl = await saveFile(imageFile, "projects");
    }

    if (featured) {
      // Check for limit of 2 featured projects
      const allProjects = await getProjects();
      const currentFeatured = allProjects.filter(p => p.featured && p.id !== id);
      if (currentFeatured.length >= 2) {
        return { success: false, message: "A maximum of 2 projects can be featured at the same time." };
      }
    }

    if (id) {
      await db
        .update(project)
        .set({
          slug,
          title,
          description,
          category,
          client: client || null,
          year: year || null,
          website: website || null,
          image: imageUrl,
          additionalImages,
          featured,
          updatedAt: new Date(),
        })
        .where(eq(project.id, id));
    } else {
      await db.insert(project).values({
        id: crypto.randomUUID(),
        slug,
        title,
        description,
        category,
        client: client || null,
        year: year || null,
        website: website || null,
        image: imageUrl,
        additionalImages,
        featured,
      });
    }

    revalidatePath("/(frontend)", "layout");
    revalidatePath("/dashboard/update/projects");

    return { success: true, message: "Project saved successfully" };
  } catch (error: any) {
    console.error("Error saving project:", error);
    if (error.code === '23505') { // Postgres unique violation
      return { success: false, message: "Slug already exists. Please choose a different one." };
    }
    return { success: false, message: "Failed to save project." };
  }
}
