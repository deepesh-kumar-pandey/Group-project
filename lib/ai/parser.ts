import { z } from "zod";
import { ApiError } from "@/lib/errors/api-error";

export function extractJsonFromText(text: string): string {
  const trimmed = text.trim();

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced?.[1]) {
    return fenced[1].trim();
  }

  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    return trimmed.slice(start, end + 1);
  }

  return trimmed;
}

export function parseAiJson<T>(text: string, schema: z.ZodSchema<T>): T {
  const jsonStr = extractJsonFromText(text);

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonStr);
  } catch {
    throw ApiError.aiError("Failed to parse AI response as JSON", {
      raw: text.slice(0, 500),
    });
  }

  const result = schema.safeParse(parsed);
  if (!result.success) {
    throw ApiError.aiError("AI response validation failed", {
      issues: result.error.flatten(),
    });
  }

  return result.data;
}
