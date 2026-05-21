import { z } from "zod";

export const companySearchSchema = z.object({
  q: z.string().min(1).max(200),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  enrich: z.coerce.boolean().optional(),
});

export const companySlugSchema = z.object({
  slug: z.string().min(1).max(200),
});

export const companyReviewsSchema = z.object({
  slug: z.string().min(1).max(200),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  source: z.enum(["reddit", "interview", "all"]).optional(),
});

export const trendingCompaniesSchema = z.object({
  limit: z.coerce.number().int().positive().max(50).optional(),
});

export type CompanySearchInput = z.infer<typeof companySearchSchema>;
export type CompanyReviewsInput = z.infer<typeof companyReviewsSchema>;
