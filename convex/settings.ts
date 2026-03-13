import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getSettings = query({
  args: {},
  handler: async (ctx) => {
    // Return the first settings document found if any
    const settings = await ctx.db.query("settings").first();
    return settings;
  },
});

export const updateCreditSettings = mutation({
  args: { 
    limit: v.optional(v.number()),
    previousCreditSpent: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("settings").first();
    
    const patchData: any = {};
    if (args.limit !== undefined) patchData.creditLimit = args.limit;
    if (args.previousCreditSpent !== undefined) patchData.previousCreditSpent = args.previousCreditSpent;

    if (existing) {
      return await ctx.db.patch(existing._id, patchData);
    } else {
      const insertData = {
        creditLimit: args.limit ?? 0,
        previousCreditSpent: args.previousCreditSpent ?? 0,
      };
      return await ctx.db.insert("settings", insertData as any);
    }
  },
});
