import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getOrCreatePeriod = mutation({
  args: { month: v.string(), year: v.number() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("budgetPeriods")
      .withIndex("by_month_year", (q) =>
        q.eq("month", args.month).eq("year", args.year)
      )
      .unique();

    if (existing) return existing._id;

    const periodId = await ctx.db.insert("budgetPeriods", {
      month: args.month,
      year: args.year,
    });

    // Default categories could be added here if needed
    return periodId;
  },
});

export const getPeriodData = query({
  args: { month: v.string(), year: v.number() },
  handler: async (ctx, args) => {
    const period = await ctx.db
      .query("budgetPeriods")
      .withIndex("by_month_year", (q) =>
        q.eq("month", args.month).eq("year", args.year)
      )
      .unique();

    if (!period) return null;

    const categories = await ctx.db
      .query("budgetCategories")
      .withIndex("by_period", (q) => q.eq("periodId", period._id))
      .collect();

    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_period", (q) => q.eq("periodId", period._id))
      .collect();

    return {
      period,
      categories,
      transactions,
    };
  },
});

export const addCategory = mutation({
  args: {
    periodId: v.id("budgetPeriods"),
    type: v.union(
      v.literal("income"),
      v.literal("expense"),
      v.literal("bills"),
      v.literal("savings"),
      v.literal("debt")
    ),
    name: v.string(),
    plannedAmount: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("budgetCategories", {
      periodId: args.periodId,
      type: args.type,
      name: args.name,
      plannedAmount: args.plannedAmount,
      actualAmount: 0,
      isPaid: false,
    });
  },
});

export const updateCategory = mutation({
  args: {
    id: v.id("budgetCategories"),
    name: v.optional(v.string()),
    plannedAmount: v.optional(v.number()),
    actualAmount: v.optional(v.number()),
    isPaid: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

export const removeCategory = mutation({
  args: { id: v.id("budgetCategories") },
  handler: async (ctx, args) => {
    // Also remove transactions associated with this category?
    // For now, let's keep it simple.
    await ctx.db.delete(args.id);
  },
});
