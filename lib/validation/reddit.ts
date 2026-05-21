import { z } from "zod";

export const redditSearchSchema = z.object({
  q: z.string().min(1).max(200),
  subreddit: z.string().max(100).optional(),
  sort: z.enum(["relevance", "hot", "top", "new", "comments"]).optional(),
  time: z.enum(["hour", "day", "week", "month", "year", "all"]).optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  after: z.string().optional(),
  companySlug: z.string().optional(),
  persist: z.coerce.boolean().optional(),
});

export const redditAggregateSchema = z.object({
  companySlug: z.string().min(1).max(200),
  query: z.string().min(1).max(200).optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});

export const redditNormalizeSchema = z.object({
  posts: z.array(z.record(z.unknown())).min(1).max(100),
});

export type RedditSearchInput = z.infer<typeof redditSearchSchema>;
export type RedditAggregateInput = z.infer<typeof redditAggregateSchema>;
