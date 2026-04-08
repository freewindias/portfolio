"use server";

import { db } from "@/db/drizzle";
import { budgetPeriod, budgetSubCategory, transaction } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

function generateId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export async function getOrCreateBudgetPeriod(month: number, year: number) {
  let period = await db.query.budgetPeriod.findFirst({
    where: and(eq(budgetPeriod.month, month), eq(budgetPeriod.year, year)),
  });

  if (!period) {
    const id = generateId();
    await db.insert(budgetPeriod).values({ id, month, year, creditCardLimit: 0 });
    period = await db.query.budgetPeriod.findFirst({
      where: eq(budgetPeriod.id, id),
    });
  }

  return period;
}

export async function getBudgetDashboardData(periodId: string) {
  const period = await db.query.budgetPeriod.findFirst({
    where: eq(budgetPeriod.id, periodId),
    with: { subCategories: true, transactions: true },
  });
  if (!period) throw new Error("Period not found");
  return period;
}

export async function createSubCategory(data: {
  periodId: string;
  primaryCategory: string;
  name: string;
  plannedAmount: number;
}) {
  const id = generateId();
  await db.insert(budgetSubCategory).values({
    id,
    periodId: data.periodId,
    primaryCategory: data.primaryCategory,
    name: data.name,
    plannedAmount: data.plannedAmount,
    paid: false,
  });
  revalidatePath("/dashboard/expense-tracker");
  return { success: true };
}

export async function updateSubCategory(id: string, plannedAmount: number, name: string) {
  await db.update(budgetSubCategory).set({ plannedAmount, name }).where(eq(budgetSubCategory.id, id));
  revalidatePath("/dashboard/expense-tracker");
  return { success: true };
}

export async function toggleSubCategoryPaid(id: string, paid: boolean) {
  await db.update(budgetSubCategory).set({ paid }).where(eq(budgetSubCategory.id, id));
  revalidatePath("/dashboard/expense-tracker");
  return { success: true };
}

export async function deleteSubCategory(id: string) {
  await db.delete(budgetSubCategory).where(eq(budgetSubCategory.id, id));
  revalidatePath("/dashboard/expense-tracker");
  return { success: true };
}

export async function updateCreditCardLimit(periodId: string, limitCents: number) {
  await db.update(budgetPeriod).set({ creditCardLimit: limitCents }).where(eq(budgetPeriod.id, periodId));
  revalidatePath("/dashboard/expense-tracker");
  return { success: true };
}

export async function createTransaction(data: {
  periodId: string;
  subCategoryId: string;
  amount: number;
  description: string;
  date: Date;
}) {
  const id = generateId();
  await db.insert(transaction).values({
    id,
    periodId: data.periodId,
    subCategoryId: data.subCategoryId,
    amount: data.amount,
    description: data.description,
    date: data.date,
  });
  revalidatePath("/dashboard/expense-tracker");
  return { success: true };
}

export async function deleteTransaction(id: string) {
  await db.delete(transaction).where(eq(transaction.id, id));
  revalidatePath("/dashboard/expense-tracker");
  return { success: true };
}
