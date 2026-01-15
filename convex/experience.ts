import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    const experiences = await ctx.db.query("experiences").collect();
    return await Promise.all(
      experiences.map(async (exp) => {
        let logoUrl = exp.companyLogo;
        if (exp.companyLogo && !exp.companyLogo.startsWith("http")) {
          logoUrl = (await ctx.storage.getUrl(exp.companyLogo)) || undefined;
        }
        return {
          ...exp,
          companyLogo: logoUrl,
        };
      })
    );
  },
});

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if data already exists to avoid duplicates
    const existing = await ctx.db.query("experiences").take(1);
    if (existing.length > 0) {
      return "Experiences already seeded";
    }

    const educationData = {
      id: "oln",
      companyName: "Our Lady of Nazareth High School & Jr. College",
      companyLogo: "https://assets.chanhdai.com/images/companies/quaric.svg",
      positions: [
        {
          id: "30d3a9fb-021d-452a-9d27-83655369b4b9",
          title: "IT Support",
          employmentPeriod: "September 2024 - October 2025 (1 year and 2 months)",
          employmentType: "Full-time",
          icon: "code",
          description: `⦿ Installed, configured, tested, and maintained operating systems, application software, and system management tools, identified potential issues, and implemented solutions in a timely manner.
 - ⦿ Performed troubleshooting to diagnose and resolve complex technical problems.
 - ⦿ Troubleshot hardware & software issues and worked with service providers to facilitate repairs for end users.
 - ⦿ Provided technical support to end-users on a variety of computer software and hardware issues.`,
          skills: [
            "Website Management",
            "Data Maintenance",
            "Backup Management",
            "System Management",
            "Software Upgradation",
            "Hardware Management",
            "Troubleshooting",
            "Support",  
          ],
          isExpanded: true,
        },
      ],
      isCurrentEmployer: false,
    };

    await ctx.db.insert("experiences", educationData);

    return "Experiences seeded successfully";
  },
});

export const create = mutation({
  args: {
    id: v.string(), // Custom ID
    companyName: v.string(),
    companyLogo: v.optional(v.string()),
    positions: v.array(
      v.object({
        id: v.string(),
        title: v.string(),
        employmentPeriod: v.string(),
        employmentType: v.optional(v.string()),
        description: v.optional(v.string()),
        icon: v.optional(v.string()),
        skills: v.optional(v.array(v.string())),
        isExpanded: v.optional(v.boolean()),
      })
    ),
    isCurrentEmployer: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // Check if ID already exists
    const existing = await ctx.db
      .query("experiences")
      .filter((q) => q.eq(q.field("id"), args.id))
      .first();

    if (existing) {
      throw new Error("Experience ID already exists");
    }

    const { ...data } = args;
    await ctx.db.insert("experiences", data);
  },
});

export const update = mutation({
  args: {
    id: v.id("experiences"),
    companyName: v.string(),
    companyLogo: v.optional(v.string()),
    positions: v.array(
      v.object({
        id: v.string(),
        title: v.string(),
        employmentPeriod: v.string(),
        employmentType: v.optional(v.string()),
        description: v.optional(v.string()),
        icon: v.optional(v.string()),
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
    id: v.id("experiences"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
