import * as z from "zod";

export const certificateSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, { message: "Title is required" }),
  subtitle: z.string().min(1, { message: "Subtitle is required" }),
  date: z.string().min(1, { message: "Date is required" }),
  link: z.string().url({ message: "Invalid URL" }).optional().or(z.literal("")),
});

export type CertificateValues = z.infer<typeof certificateSchema>;
