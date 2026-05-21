import { z } from "zod";
import { generateContent } from "./client";
import { buildToxicityPrompt } from "./prompts";
import { parseAiJson } from "./parser";
import type { AiToxicityResult } from "./types";

const toxicitySchema = z.object({
  toxicityScore: z.number(),
  indicators: z.array(z.string()),
  severity: z.enum(["low", "medium", "high"]),
  examples: z.array(z.string()),
  summary: z.string(),
});

export async function analyzeToxicity(
  companyName: string,
  discussions: string[]
): Promise<AiToxicityResult> {
  const discussionText = discussions.slice(0, 30).join("\n---\n");
  const prompt = buildToxicityPrompt(companyName, discussionText);
  const response = await generateContent(prompt);
  return parseAiJson(response, toxicitySchema);
}
