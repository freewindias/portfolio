"use server";

import { db } from "@/db/drizzle";
import { experience } from "@/db/schema";
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

export async function getExperiences() {
  try {
    const experiences = await db.query.experience.findMany({
      orderBy: [desc(experience.startYear)], // Sorting by start year descending
    });
    return experiences;
  } catch (error) {
    console.error("Error fetching experiences:", error);
    return [];
  }
}

export async function getExperienceById(id: string) {
  try {
    const data = await db.query.experience.findFirst({
      where: eq(experience.id, id),
    });
    return data || null;
  } catch (error) {
    console.error("Error fetching experience:", error);
    return null;
  }
}

export async function deleteExperience(id: string) {
  try {
    await db.delete(experience).where(eq(experience.id, id));
    revalidatePath("/(frontend)", "layout");
    revalidatePath("/dashboard/update/experience");
    return { success: true, message: "Experience deleted successfully" };
  } catch (error) {
    console.error("Error deleting experience:", error);
    return { success: false, message: "Failed to delete experience" };
  }
}

export async function saveExperience(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const role = formData.get("role") as string;
    const location = formData.get("location") as string;
    const startYear = formData.get("startYear") as string;
    const endYear = formData.get("endYear") as string;
    
    // Parse bullet points
    let bulletPoints: string[] = [];
    try {
      const bulletsString = formData.get("bulletPoints");
      if (bulletsString) {
        bulletPoints = JSON.parse(bulletsString as string);
      }
    } catch(e) {
      // Ignore parsing error
      console.error("Failed to parse bullet points", e);
    }
    
    let iconUrl = formData.get("existingIconUrl") as string || null;

    const iconFile = formData.get("icon") as File | null;
    if (iconFile && iconFile.size > 0) {
      iconUrl = await saveFile(iconFile, "experiences");
    }

    if (id) {
      await db
        .update(experience)
        .set({
          iconUrl,
          role,
          location,
          startYear,
          endYear,
          bulletPoints,
          updatedAt: new Date(),
        })
        .where(eq(experience.id, id));
    } else {
      await db.insert(experience).values({
        id: crypto.randomUUID(),
        iconUrl,
        role,
        location,
        startYear,
        endYear,
        bulletPoints,
      });
    }

    revalidatePath("/(frontend)", "layout");
    revalidatePath("/dashboard/update/experience");

    return { success: true, message: "Experience saved successfully" };
  } catch (error: any) {
    console.error("Error saving experience:", error);
    return { success: false, message: "Failed to save experience." };
  }
}
