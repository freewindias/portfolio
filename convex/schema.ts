import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";


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
    description: v.optional(v.string()), // Short description
  }).index("by_slug", ["slug"]),

  budgetPeriods: defineTable({
    month: v.string(),
    year: v.number(),
    userId: v.optional(v.string()), // For future multi-user support
  }).index("by_month_year", ["month", "year"]),

  budgetCategories: defineTable({
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
    actualAmount: v.optional(v.number()), // For manual entry
    isPaid: v.optional(v.boolean()), // Specific to bills and debt
  }).index("by_period", ["periodId"]),

  transactions: defineTable({
    periodId: v.id("budgetPeriods"),
    date: v.string(), // YYYY-MM-DD
    categoryId: v.id("budgetCategories"),
    amount: v.number(),
    notes: v.optional(v.string()),
  }).index("by_period", ["periodId"]),
});
