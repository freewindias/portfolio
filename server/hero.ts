"use server";

import { db } from "@/db/drizzle";
import { hero } from "@/db/schema";
import { eq } from "drizzle-orm";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";

const HERO_ID = "main_hero";

export async function getHeroData() {
  try {
    const data = await db.query.hero.findFirst({
      where: eq(hero.id, HERO_ID),
    });
    return data || null;
  } catch (error) {
    console.error("Error fetching hero data:", error);
    return null;
  }
}

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

export async function updateHeroData(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const role = formData.get("role") as string;
    const location = formData.get("location") as string;
    const githubUrl = formData.get("githubUrl") as string;
    const linkedinUrl = formData.get("linkedinUrl") as string;
    const mailEmail = formData.get("mailEmail") as string;

    const bannerFile = formData.get("banner") as File | null;
    const profileFile = formData.get("profile") as File | null;
    const resumeFile = formData.get("resume") as File | null;

    let bannerUrl = formData.get("existingBannerUrl") as string || null;
    let profileUrl = formData.get("existingProfileUrl") as string || null;
    let resumeUrl = formData.get("existingResumeUrl") as string || null;

    if (bannerFile && bannerFile.size > 0) {
      bannerUrl = await saveFile(bannerFile, "hero");
    }

    if (profileFile && profileFile.size > 0) {
      profileUrl = await saveFile(profileFile, "hero");
    }

    if (resumeFile && resumeFile.size > 0) {
      resumeUrl = await saveFile(resumeFile, "hero");
    }

    const currentHero = await getHeroData();

    if (currentHero) {
      await db
        .update(hero)
        .set({
          name,
          role,
          location,
          githubUrl,
          linkedinUrl,
          mailEmail,
          bannerUrl,
          profileUrl,
          resumeUrl,
          updatedAt: new Date(),
        })
        .where(eq(hero.id, HERO_ID));
    } else {
      await db.insert(hero).values({
        id: HERO_ID,
        name,
        role,
        location,
        githubUrl,
        linkedinUrl,
        mailEmail,
        bannerUrl,
        profileUrl,
        resumeUrl,
      });
    }

    revalidatePath("/");
    revalidatePath("/dashboard/update/hero");

    return { success: true, message: "Hero section updated successfully" };
  } catch (error) {
    console.error("Error updating hero data:", error);
    return { success: false, message: "Failed to update hero section" };
  }
}
