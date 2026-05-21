import { GoogleGenerativeAI } from "@google/generative-ai";
import { withRetry } from "@/lib/utils/retry";
import { ApiError } from "@/lib/errors/api-error";

let genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
  if (!genAI) {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      throw ApiError.internal("GOOGLE_AI_API_KEY is not configured");
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

export const GEMINI_MODEL = "gemini-2.0-flash";

export function getGenerativeModel(model = GEMINI_MODEL) {
  return getGenAI().getGenerativeModel({
    model,
    generationConfig: {
      temperature: 0.3,
      topP: 0.9,
      maxOutputTokens: 4096,
    },
  });
}

export async function generateContent(prompt: string): Promise<string> {
  return withRetry(
    async () => {
      const model = getGenerativeModel();
      const result = await model.generateContent(prompt);
      const text = result.response.text();

      if (!text) {
        throw ApiError.aiError("Empty response from Gemini");
      }

      return text;
    },
    {
      maxAttempts: 3,
      shouldRetry: (error) => {
        if (error instanceof ApiError) return false;
        return true;
      },
    }
  );
}
