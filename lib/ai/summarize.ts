import { z } from "zod";
import { generateContent } from "./client";
import { buildSummaryPrompt } from "./prompts";
import { parseAiJson } from "./parser";
import type { AiSummaryResult } from "./types";
import { cacheGetOrSet } from "@/lib/cache/cache-manager";
import { CacheKeys, CacheTTL } from "@/lib/cache/cache-keys";

const summarySchema = z.object({
  title: z.string(),
  summary: z.string(),
  pros: z.array(z.string()),
  cons: z.array(z.string()),
  highlights: z.array(z.string()),
  confidence: z.number(),
});

export async function summarizeCompanyDiscussions(
  companyName: string,
  discussions: string[],
  companySlug: string
): Promise<AiSummaryResult> {
  const cacheKey = CacheKeys.aiSummary(companySlug, "overview");
  const discussionText = discussions.slice(0, 30).join("\n---\n");

  return cacheGetOrSet(cacheKey, CacheTTL.LONG, async () => {
    const prompt = buildSummaryPrompt(companyName, discussionText);
    const response = await generateContent(prompt);
    return parseAiJson(response, summarySchema);
  });
}
