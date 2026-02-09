import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const addTransaction = mutation({
  args: {
    periodId: v.id("budgetPeriods"),
    date: v.string(),
    categoryId: v.id("budgetCategories"),
    amount: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("transactions", args);
  },
});

export const updateTransaction = mutation({
  args: {
    id: v.id("transactions"),
    date: v.optional(v.string()),
    categoryId: v.optional(v.id("budgetCategories")),
    amount: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

export const removeTransaction = mutation({
  args: { id: v.id("transactions") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
