import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Generate upload URL for images
export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

// Query to get all projects
export const list = query({
  args: {
    featured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let projects = await ctx.db.query("projects").collect();
    
    if (args.featured !== undefined) {
      projects = projects.filter((p) => p.featured === args.featured);
    }
    
    // Sort by order field, then by title
    return projects.sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      if (a.order !== undefined) return -1;
      if (b.order !== undefined) return 1;
      return a.title.localeCompare(b.title);
    });
  },
});

// Query to get a single project by slug
export const getBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const project = await ctx.db
      .query("projects")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    
    return project;
  },
});

// Mutation to create a new project (requires authentication)
export const create = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    year: v.string(),
    category: v.string(),
    client: v.string(),
    overview: v.string(),
    heroImage: v.string(),
    heroImageCaption: v.optional(v.string()),
    galleryImages: v.optional(v.array(v.string())),
    featured: v.optional(v.boolean()),
    order: v.optional(v.number()),
    websiteUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }

    const projectId = await ctx.db.insert("projects", args);
    return projectId;
  },
});

// Mutation to update a project (requires authentication)
export const update = mutation({
  args: {
    id: v.id("projects"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    year: v.optional(v.string()),
    category: v.optional(v.string()),
    client: v.optional(v.string()),
    overview: v.optional(v.string()),
    heroImage: v.optional(v.string()),
    heroImageCaption: v.optional(v.string()),
    galleryImages: v.optional(v.array(v.string())),
    featured: v.optional(v.boolean()),
    order: v.optional(v.number()),
    websiteUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }

    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

// Mutation to delete a project (requires authentication)
export const remove = mutation({
  args: {
    id: v.id("projects"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }

    await ctx.db.delete(args.id);
  },
});
