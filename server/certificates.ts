"use server";

import { db } from "@/db/drizzle";
import { certificate } from "@/db/schema";
import { eq, desc, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getCertificates() {
  try {
    const data = await db.query.certificate.findMany({
      orderBy: [asc(certificate.order)],
    });
    return data;
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return [];
  }
}

export async function getCertificateById(id: string) {
  try {
    const data = await db.query.certificate.findFirst({
      where: eq(certificate.id, id),
    });
    return data || null;
  } catch (error) {
    console.error("Error fetching certificate:", error);
    return null;
  }
}

export async function deleteCertificate(id: string) {
  try {
    await db.delete(certificate).where(eq(certificate.id, id));
    revalidatePath("/(frontend)", "layout");
    revalidatePath("/dashboard/update/certificates");
    return { success: true, message: "Certificate deleted successfully" };
  } catch (error) {
    console.error("Error deleting certificate:", error);
    return { success: false, message: "Failed to delete certificate" };
  }
}

export async function updateCertificatesOrder(certificateIds: string[]) {
  try {
    await db.transaction(async (tx) => {
      for (let i = 0; i < certificateIds.length; i++) {
        await tx
          .update(certificate)
          .set({ order: i })
          .where(eq(certificate.id, certificateIds[i]));
      }
    });

    revalidatePath("/(frontend)", "layout");
    revalidatePath("/dashboard/update/certificates");
    return { success: true, message: "Order updated successfully" };
  } catch (error) {
    console.error("Error updating order:", error);
    return { success: false, message: "Failed to update order" };
  }
}

export async function saveCertificate(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const subtitle = formData.get("subtitle") as string;
    const date = formData.get("date") as string;
    const link = formData.get("link") as string || null;

    if (id) {
      await db
        .update(certificate)
        .set({
          title,
          subtitle,
          date,
          link,
          updatedAt: new Date(),
        })
        .where(eq(certificate.id, id));
    } else {
      // For new certificates, put them at the end
      const existing = await getCertificates();
      const nextOrder = existing.length;

      await db.insert(certificate).values({
        id: crypto.randomUUID(),
        title,
        subtitle,
        date,
        link,
        order: nextOrder,
      });
    }

    revalidatePath("/(frontend)", "layout");
    revalidatePath("/dashboard/update/certificates");

    return { success: true, message: "Certificate saved successfully" };
  } catch (error: any) {
    console.error("Error saving certificate:", error);
    return { success: false, message: "Failed to save certificate." };
  }
}
