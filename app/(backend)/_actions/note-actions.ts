"use server";

import { db } from "@/db/drizzle";
import { note } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

function generateId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export async function getNotes() {
  return db.query.note.findMany({
    orderBy: [desc(note.createdAt)],
  });
}

export async function createNote(data: { title: string; subtitle: string; content: string }) {
  const id = generateId();
  await db.insert(note).values({
    id,
    title: data.title,
    subtitle: data.subtitle,
    content: data.content,
  });
  revalidatePath("/dashboard/notes");
  return { success: true, id };
}

export async function updateNote(id: string, data: { title: string; subtitle: string; content: string }) {
  await db.update(note).set(data).where(eq(note.id, id));
  revalidatePath("/dashboard/notes");
  return { success: true };
}

export async function deleteNote(id: string) {
  await db.delete(note).where(eq(note.id, id));
  revalidatePath("/dashboard/notes");
  return { success: true };
}
