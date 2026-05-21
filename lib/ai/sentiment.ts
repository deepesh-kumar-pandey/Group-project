import { z } from "zod";
import { generateContent } from "./client";
import { buildSentimentPrompt } from "./prompts";
import { parseAiJson } from "./parser";
import { normalizeSentimentResult } from "./normalize-ai";
import type { AiSentimentResult } from "./types";
import { cacheGetOrSet } from "@/lib/cache/cache-manager";
import { CacheKeys, CacheTTL } from "@/lib/cache/cache-keys";

const sentimentSchema = z.object({
  overallScore: z.number(),
  label: z.string(),
  positiveRatio: z.number(),
  negativeRatio: z.number(),
  neutralRatio: z.number(),
  themes: z.array(z.string()),
  sampleSize: z.number(),
});

export async function analyzeSentiment(
  companyName: string,
  texts: string[],
  companySlug: string
): Promise<AiSentimentResult> {
  const cacheKey = CacheKeys.aiSentiment(companySlug);
  const combined = texts.slice(0, 40).join("\n");

  return cacheGetOrSet(cacheKey, CacheTTL.LONG, async () => {
    const prompt = buildSentimentPrompt(companyName, combined);
    const response = await generateContent(prompt);
    const parsed = parseAiJson(response, sentimentSchema);
    return normalizeSentimentResult(parsed);
  });
}
