import { z } from "zod";

export const heroSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be at most 50 characters").optional().or(z.literal("")),
  role: z.string().max(100, "Role must be at most 100 characters").optional().or(z.literal("")),
  location: z.string().max(100, "Location must be at most 100 characters").optional().or(z.literal("")),
  githubUrl: z.string().url("Invalid GitHub URL").optional().or(z.literal("")),
  linkedinUrl: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
  mailEmail: z.string().email("Invalid Email address").optional().or(z.literal("")),
  banner: z.any().optional(),
  profile: z.any().optional(),
  resume: z.any().optional(),
  existingBannerUrl: z.string().optional(),
  existingProfileUrl: z.string().optional(),
  existingResumeUrl: z.string().optional(),
});

export type HeroValues = z.infer<typeof heroSchema>;
