import { z } from "zod";
import { generateContent } from "./client";
import { buildWorkplacePrompt } from "./prompts";
import { parseAiJson } from "./parser";
import type { AiWorkplaceResult } from "./types";
import { cacheGetOrSet } from "@/lib/cache/cache-manager";
import { CacheKeys, CacheTTL } from "@/lib/cache/cache-keys";

const workplaceSchema = z.object({
  cultureInsights: z.array(z.string()),
  engineeringCulture: z.array(z.string()),
  hiringSentiment: z.array(z.string()),
  managementStyle: z.array(z.string()),
  compensationNotes: z.array(z.string()),
  workLifeBalance: z.array(z.string()),
  diversityInclusion: z.array(z.string()),
  summary: z.string(),
});

export async function analyzeWorkplace(
  companyName: string,
  discussions: string[],
  companySlug: string,
  focus?: string
): Promise<AiWorkplaceResult> {
  const cacheKey = CacheKeys.aiWorkplace(companySlug);
  const discussionText = discussions.slice(0, 30).join("\n---\n");

  return cacheGetOrSet(cacheKey, CacheTTL.LONG, async () => {
    const prompt = buildWorkplacePrompt(companyName, discussionText, focus);
    const response = await generateContent(prompt);
    return parseAiJson(response, workplaceSchema);
  });
}
