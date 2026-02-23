import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
  return await ctx.storage.generateUploadUrl();
}
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    const educations = await ctx.db.query("educations").collect();
    return await Promise.all(
      educations.map(async (edu) => {
        let logoUrl = edu.institutionLogo;
        if (edu.institutionLogo && !edu.institutionLogo.startsWith("http")) {
          logoUrl = (await ctx.storage.getUrl(edu.institutionLogo)) || undefined;
        }
        return {
          ...edu,
          institutionLogo: logoUrl,
        };
      })
    );
  },
});

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if data already exists to avoid duplicates
    const existing = await ctx.db.query("educations").take(1);
    if (existing.length > 0) {
      return "Educations already seeded";
    }

    const educationData = {
      id: "oln",
      institutionName: "University of Example",
      institutionLogo: "",
      degrees: [
        {
          id: "30d3a9fb-021d-452a-9d27-83655369b4b9",
          degree: "Bachelor of Science in Computer Science",
          period: "September 2020 - May 2024",
          description: "Graduated with Honors.",
          skills: [
            "Computer Science",
            "Mathematics", 
          ],
          isExpanded: true,
        },
      ],
      isCurrentEmployer: true,
    };

    await ctx.db.insert("educations", educationData);

    return "Educations seeded successfully";
  },
});

export const create = mutation({
  args: {
    id: v.string(), // Custom ID
    institutionName: v.string(),
    institutionLogo: v.optional(v.string()),
    degrees: v.array(
      v.object({
        id: v.string(),
        degree: v.string(),
        period: v.string(),
        description: v.optional(v.string()),
        skills: v.optional(v.array(v.string())),
        isExpanded: v.optional(v.boolean()),
      })
    ),
    isCurrentEmployer: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // Check if ID already exists
    const existing = await ctx.db
      .query("educations")
      .filter((q) => q.eq(q.field("id"), args.id))
      .first();

    if (existing) {
      throw new Error("Education ID already exists");
    }

    const { ...data } = args;
    await ctx.db.insert("educations", data);
  },
});

export const update = mutation({
  args: {
    id: v.id("educations"),
    institutionName: v.string(),
    institutionLogo: v.optional(v.string()),
    degrees: v.array(
      v.object({
        id: v.string(),
        degree: v.string(),
        period: v.string(),
        description: v.optional(v.string()),
        skills: v.optional(v.array(v.string())),
        isExpanded: v.optional(v.boolean()),
      })
    ),
    isCurrentEmployer: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});

export const remove = mutation({
  args: {
    id: v.id("educations"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
