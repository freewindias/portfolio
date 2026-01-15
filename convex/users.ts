import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    const user = await ctx.db.get(userId);
    if (!user) return null;

    let imageUrl = user.image;
    if (user.image && !user.image.startsWith("http")) {
      imageUrl = (await ctx.storage.getUrl(user.image)) || undefined;
    }

    return {
      ...user,
      image: imageUrl,
    };
  },
});

export const updateUser = mutation({
  args: {
    name: v.optional(v.string()),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }
    await ctx.db.patch(userId, {
      name: args.name,
      image: args.image,
    });
  },
});
