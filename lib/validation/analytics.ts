import { z } from "zod";

export const analyticsTrendingSchema = z.object({
  limit: z.coerce.number().int().positive().max(50).optional(),
  period: z.enum(["day", "week", "month"]).optional(),
});

export const analyticsSentimentSchema = z.object({
  companySlug: z.string().min(1).max(200).optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});

export type AnalyticsTrendingInput = z.infer<typeof analyticsTrendingSchema>;
export type AnalyticsSentimentInput = z.infer<typeof analyticsSentimentSchema>;
