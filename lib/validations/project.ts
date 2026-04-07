import * as z from "zod";

export const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric and hyphens only"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  client: z.string().optional(),
  year: z.string().optional(),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  featured: z.boolean(),
  
  image: z.any().optional(),
  additionalImages: z.any().optional(),
});

export type ProjectValues = z.infer<typeof projectSchema>;
