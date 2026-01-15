import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,
  numbers: defineTable({
    value: v.number(),
  }),
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
});
