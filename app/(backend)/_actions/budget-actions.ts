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
    await db.insert(budgetPeriod).values({ 
      id, 
      month, 
      year, 
      salaryDay: 1,
      creditCardLimit: 0,
      availableCreditLimit: 0
    });

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
  actualAmount?: number;
}) {
  const id = generateId();
  await db.insert(budgetSubCategory).values({
    id,
    periodId: data.periodId,
    primaryCategory: data.primaryCategory,
    name: data.name,
    plannedAmount: data.plannedAmount,
    actualAmount: data.actualAmount ?? 0,
    paid: false,
  });
  revalidatePath("/dashboard/expense-tracker");
  return { success: true, id };
}

export async function updateSubCategory(id: string, plannedAmount: number, name: string, actualAmount?: number) {
  const updateData: any = { plannedAmount, name };
  if (actualAmount !== undefined) updateData.actualAmount = actualAmount;
  
  await db.update(budgetSubCategory).set(updateData).where(eq(budgetSubCategory.id, id));
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

export async function updateBudgetPeriodSettings(
  periodId: string, 
  data: { 
    creditCardLimit?: number; 
    availableCreditLimit?: number;
    salaryDay?: number;
  }
) {
  await db.update(budgetPeriod).set(data).where(eq(budgetPeriod.id, periodId));
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

export async function deleteBudgetPeriod(id: string) {
  await db.delete(budgetPeriod).where(eq(budgetPeriod.id, id));
  revalidatePath("/dashboard/expense-tracker");
  return { success: true };
}

