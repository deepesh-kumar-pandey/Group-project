import { z } from "zod";

export const aiCompanySchema = z.object({
  companySlug: z.string().min(1).max(200),
  forceRefresh: z.coerce.boolean().optional(),
});

export const aiSummarizeSchema = aiCompanySchema.extend({
  type: z
    .enum([
      "COMPANY_OVERVIEW",
      "WORKPLACE_CULTURE",
      "HIRING_SENTIMENT",
      "INTERVIEW_EXPERIENCE",
      "ENGINEERING_CULTURE",
      "PROS_CONS",
    ])
    .optional(),
});

export const aiSentimentSchema = aiCompanySchema.extend({
  texts: z.array(z.string().min(1)).max(50).optional(),
});

export const aiReputationSchema = aiCompanySchema;

export const aiWorkplaceSchema = aiCompanySchema.extend({
  focus: z
    .enum(["culture", "engineering", "hiring", "management", "compensation"])
    .optional(),
});

export type AiCompanyInput = z.infer<typeof aiCompanySchema>;
export type AiSummarizeInput = z.infer<typeof aiSummarizeSchema>;
