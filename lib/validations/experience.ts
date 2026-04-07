import * as z from "zod";

export const experienceSchema = z.object({
  id: z.string().optional(),
  role: z.string().min(1, { message: "Role is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  startYear: z.string().min(1, { message: "Start Year is required" }),
  endYear: z.string().min(1, { message: "End Year is required" }),
  icon: z.any().optional(), // File object
});

export type ExperienceValues = z.infer<typeof experienceSchema>;
