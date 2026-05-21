import { z } from "zod";
import { generateContent } from "./client";
import { buildReputationPrompt } from "./prompts";
import { parseAiJson } from "./parser";
import { normalizeReputationScores } from "./normalize-ai";
import type { AiReputationResult } from "./types";
import { cacheGetOrSet } from "@/lib/cache/cache-manager";
import { CacheKeys, CacheTTL } from "@/lib/cache/cache-keys";

const reputationSchema = z.object({
  reputationScore: z.number(),
  cultureScore: z.number(),
  hiringScore: z.number(),
  compensationScore: z.number(),
  workLifeScore: z.number(),
  leadershipScore: z.number(),
  toxicityScore: z.number(),
  engineeringScore: z.number(),
  growthScore: z.number(),
  confidence: z.number(),
  factors: z.array(z.string()),
  summary: z.string(),
});

export async function analyzeReputation(
  companyName: string,
  discussions: string[],
  companySlug: string
): Promise<AiReputationResult> {
  const cacheKey = CacheKeys.aiReputation(companySlug);
  const discussionText = discussions.slice(0, 30).join("\n---\n");

  return cacheGetOrSet(cacheKey, CacheTTL.LONG, async () => {
    const prompt = buildReputationPrompt(companyName, discussionText);
    const response = await generateContent(prompt);
    const parsed = parseAiJson(response, reputationSchema);
    return normalizeReputationScores(parsed);
  });
}
