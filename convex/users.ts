import { getAuthUserId, modifyAccountCredentials, retrieveAccount } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { action, mutation, query } from "./_generated/server";

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

// Helper query to get just the user ID
export const getUserId = query({
  args: {},
  handler: async (ctx) => {
    return await getAuthUserId(ctx);
  },
});

// Helper query to get raw user data by ID (without URL resolution)
export const getUserById = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

export const changePassword = action({
  args: {
    oldPassword: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    // Get the user ID first using a separate internal query
    const userId = await ctx.runQuery(api.users.getUserId);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Get the raw user record from the database to access the email
    const user = await ctx.runQuery(api.users.getUserById, { userId });
    if (!user || !user.email) {
      throw new Error("User not found or email missing");
    }

    // 1. Verify old password
    const retrieved = await retrieveAccount(ctx, {
      provider: "password",
      account: { id: user.email, secret: args.oldPassword },
    });

    if (retrieved === null) {
      throw new Error("Invalid old password");
    }

    // 2. Update to new password
    await modifyAccountCredentials(ctx, {
      provider: "password",
      account: { id: user.email, secret: args.newPassword },
    });
  },
});
