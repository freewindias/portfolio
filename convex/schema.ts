import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,
  experiences: defineTable({
    id: v.string(), // Custom ID from the frontend
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
  }),
  educations: defineTable({
    id: v.string(), // Custom ID from the frontend
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
  }),
  projects: defineTable({
    title: v.string(),
    slug: v.string(), // URL-friendly identifier
    year: v.string(),
    category: v.string(),
    client: v.string(),
    overview: v.string(), // Detailed project overview
    heroImage: v.string(), // Main project image
    heroImageCaption: v.optional(v.string()),
    galleryImages: v.optional(v.array(v.string())),
    featured: v.optional(v.boolean()), // Show in featured work section
    order: v.optional(v.number()), // Display order
    websiteUrl: v.optional(v.string()), // Link to the live website
  }).index("by_slug", ["slug"]),
});
